import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useMutation } from 'convex/react';
import * as Sentry from '@sentry/react';
const startTransaction = (Sentry as any).startTransaction?.bind(Sentry) || (() => ({ finish() {} }))
import { api } from '../../convex/_generated/api';
import { api } from '../../convex/_generated/api';

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
  const recordPayment = useMutation(api.payments.record);
  
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
      const tx = startTransaction({ name: 'payment:onSuccess', op: 'payment', data: { paymentType } })
      try {
        let verified = false
        let ref = reference?.reference || reference?.trxref || ''
        try {
          const verifyBase = (import.meta.env.VITE_R2_WORKER_URL as string || '').replace(/\/+$/, '')
          if (verifyBase && ref) {
            const res = await fetch(`${verifyBase}/paystack/verify?reference=${encodeURIComponent(ref)}`)
            if (res.ok) {
              const data = await res.json()
              verified = data?.status === 'success'
            }
          }
        } catch {}

        if (user) {
          try {
            await recordPayment({ user_id: user.id, amount, payment_type: paymentType, plan_tier: profile?.plan_tier, reference: ref, payment_status: verified ? 'verified' : 'pending' } as any)
          } catch {}
        } else {
          const payments = JSON.parse(localStorage.getItem('payments') || '[]')
          payments.unshift({
            id: crypto.randomUUID(),
            user_id: user?.id,
            amount,
            payment_type: paymentType,
            payment_status: verified ? 'verified' : 'pending',
            reference: ref,
            plan_tier: profile?.plan_tier,
            created_at: new Date().toISOString(),
          })
          localStorage.setItem('payments', JSON.stringify(payments))
        }

        
        if (paymentType === 'topup' && user) {
          try {
            await recordPayment({ user_id: user.id, amount, payment_type: 'topup', plan_tier: profile?.plan_tier, reference: ref, payment_status: verified ? 'verified' : 'pending' } as any)
          } catch {}
        }

        
        if (paymentType === 'registration' && user) {
          try {
            await recordPayment({ user_id: user.id, amount, payment_type: 'registration', plan_tier: profile?.plan_tier, reference: ref, payment_status: verified ? 'verified' : 'pending' } as any)
          } catch {}
        }

        toast.success('Payment successful!', {
          description: `Your payment of ₦${amount.toLocaleString()} has been processed.`
        });
        
        if (onSuccess) onSuccess();
      } catch (error) {
        Sentry.captureException(error);
        toast.error('Payment verification failed', {
          description: 'Please contact support if amount was deducted.'
        });
      } finally { tx.finish() }
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
