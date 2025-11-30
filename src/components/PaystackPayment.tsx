import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useMutation, useAction } from 'convex/react';
import * as Sentry from '@sentry/react';
import { api } from '../../convex/_generated/api';

interface PaystackPaymentProps {
  amount: number;
  paymentType: 'topup' | 'daily_premium' | 'weekly_premium' | 'registration';
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
  const [PaystackButtonComp, setPaystackButtonComp] = useState<any>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('react-paystack').then((mod) => {
        setPaystackButtonComp(() => mod.PaystackButton)
      }).catch(() => {
        setPaystackButtonComp(null)
      })
    }
  }, [])
  const recordPayment = useMutation(api.functions.payments.record);
  const verifyAndRecord = useAction((api as any).actions.paystack.verifyAndRecord);
  
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
      await Sentry.startSpan({ name: 'payment:onSuccess', op: 'payment', attributes: { paymentType } }, async () => {
      try {
        let ref = reference?.reference || reference?.trxref || ''
        if (user) {
          try {
            await verifyAndRecord({ user_id: user.id, amount, payment_type: paymentType, plan_tier: profile?.plan_tier, reference: ref } as any)
          } catch {}
        } else {
          const payments = JSON.parse(localStorage.getItem('payments') || '[]')
          payments.unshift({
            id: crypto.randomUUID(),
            user_id: user?.id,
            amount,
            payment_type: paymentType,
            payment_status: 'pending',
            reference: ref,
            plan_tier: profile?.plan_tier,
            created_at: new Date().toISOString(),
          })
          localStorage.setItem('payments', JSON.stringify(payments))
        }

        
        if (paymentType === 'topup' && user) {
          try {
            await verifyAndRecord({ user_id: user.id, amount, payment_type: 'topup', plan_tier: profile?.plan_tier, reference: ref } as any)
          } catch {}
        }

        
        if (paymentType === 'registration' && user) {
          try {
            await verifyAndRecord({ user_id: user.id, amount, payment_type: 'registration', plan_tier: profile?.plan_tier, reference: ref } as any)
          } catch {}
        }

        toast.success('Payment successful!', {
          description: `Your payment of ₦${amount.toLocaleString()} has been processed.`
        });
        
        if (onSuccess) onSuccess();
      } catch (error) {
        try {
          const base = (import.meta.env.VITE_R2_WORKER_URL as string || '').replace(/\/\/+$/, '')
          if (base) {
            await fetch(base + '/sentry/capture', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Payment verification failed', level: 'error', extra: { reference, paymentType } }) })
          }
        } catch {}
        Sentry.captureException(error);
        toast.error('Payment verification failed', {
          description: 'Please contact support if amount was deducted.'
        });
      } })
    },
    onClose: () => {
      toast.info('Payment cancelled');
      if (onClose) onClose();
    },
  };

  if (!PaystackButtonComp) {
    return children ? (
      <button className={className || "bg-primary text-primary-foreground px-4 py-2 rounded-md opacity-70 cursor-not-allowed"} disabled>
        {children}
      </button>
    ) : (
      <button className={className || "bg-primary text-primary-foreground px-4 py-2 rounded-md opacity-70 cursor-not-allowed"} disabled>
        Pay Now
      </button>
    )
  }

  const PaystackButton = PaystackButtonComp
  return children ? (
    <PaystackButton {...componentProps} className={className}>
      {children}
    </PaystackButton>
  ) : (
    <PaystackButton {...componentProps} className={className || "bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90"} />
  );
};

export default PaystackPayment;
