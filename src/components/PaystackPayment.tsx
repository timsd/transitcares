import { PaystackButton } from 'react-paystack';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useConvex } from 'convex/react';

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
  const convex = useConvex();
  
  const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY as string || "";
  
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
        if (convex && user) {
          try {
            await convex.mutation('payments:record', { user_id: user.id, amount, payment_type: paymentType, plan_tier: profile?.plan_tier } as any)
          } catch {}
        } else {
          const payments = JSON.parse(localStorage.getItem('payments') || '[]')
          payments.unshift({
            id: crypto.randomUUID(),
            user_id: user?.id,
            amount,
            payment_type: paymentType,
            payment_status: 'completed',
            plan_tier: profile?.plan_tier,
            created_at: new Date().toISOString(),
          })
          localStorage.setItem('payments', JSON.stringify(payments))
        }

        
        if (paymentType === 'topup' && user) {
          const key = 'profile:' + user.id
          const prof = JSON.parse(localStorage.getItem(key) || '{}')
          const newBalance = Number(prof.wallet_balance || 0) + amount
          const updated = { ...prof, wallet_balance: newBalance }
          localStorage.setItem(key, JSON.stringify(updated))
        }

        
        if (paymentType === 'registration' && user) {
          const key = 'profile:' + user.id
          const prof = JSON.parse(localStorage.getItem(key) || '{}')
          const updated = { ...prof, registration_status: 'completed' }
          localStorage.setItem(key, JSON.stringify(updated))
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
