import { PaystackButton } from 'react-paystack';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PaystackPaymentProps {
  amount: number;
  paymentType: 'topup' | 'daily_premium' | 'registration';
  onSuccess?: () => void;
  onClose?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const PaystackPayment = ({ 
  amount, 
  paymentType, 
  onSuccess, 
  onClose,
  children,
  className 
}: PaystackPaymentProps) => {
  const { user, profile } = useAuth();
  
  // Replace with your actual Paystack public key
  const publicKey = "pk_test_xxxxxxxxxxxxxxxxxxxxx"; // TODO: Replace with actual key or use from env
  
  const componentProps = {
    email: user?.email || '',
    amount: amount * 100, // Paystack expects amount in kobo (smallest currency unit)
    metadata: {
      name: profile?.full_name || user?.email || '',
      phone: profile?.phone || '',
      custom_fields: [
        {
          display_name: "Payment Type",
          variable_name: "payment_type",
          value: paymentType
        }
      ]
    },
    publicKey,
    text: children ? '' : "Pay Now",
    onSuccess: async (reference: any) => {
      try {
        // Record the payment in the database
        const { error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: user?.id,
            amount: amount,
            payment_type: paymentType,
            payment_status: 'completed',
            plan_tier: profile?.plan_tier
          });

        if (paymentError) throw paymentError;

        // Update wallet balance for top-ups
        if (paymentType === 'topup') {
          const newBalance = (profile?.wallet_balance || 0) + amount;
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ wallet_balance: newBalance })
            .eq('user_id', user?.id);

          if (updateError) throw updateError;
        }

        // Update registration status if it's a registration payment
        if (paymentType === 'registration') {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ registration_status: 'completed' })
            .eq('user_id', user?.id);

          if (updateError) throw updateError;
        }

        toast.success('Payment successful!', {
          description: `Your payment of ₦${amount.toLocaleString()} has been processed.`
        });
        
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('Payment recording error:', error);
        toast.error('Payment verification failed', {
          description: 'Please contact support if amount was deducted.'
        });
      }
    },
    onClose: () => {
      toast.info('Payment cancelled');
      if (onClose) onClose();
    },
  };

  return children ? (
    <PaystackButton {...componentProps} className={className}>
      {children}
    </PaystackButton>
  ) : (
    <PaystackButton {...componentProps} className={className || "bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"} />
  );
};

export default PaystackPayment;
