export interface ProfileModel {
  user_id: string;
  full_name?: string | null;
  phone?: string | null;
  vehicle_type?: string | null;
  vehicle_id?: string | null;
  plan_tier?: string | null;
  wallet_balance?: number | null;
  registration_status?: string | null;
  vehicle_color?: string | null;
  chassis_number?: string | null;
  designated_route?: string | null;
  vehicle_photo_key?: string | null;
  payment_days?: string[] | null;
  auto_payment_enabled?: boolean | null;
}

export interface PaymentModel {
  user_id: string;
  amount: number;
  payment_type: 'topup' | 'daily_premium' | 'registration';
  plan_tier?: string | null;
  payment_status?: string | null;
  reference?: string | null;
  created_at: string;
}

export interface ClaimModel {
  id?: string;
  user_id: string;
  claim_type: string;
  claim_amount: number;
  claim_status?: string | null;
  description?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface WithdrawalModel {
  user_id: string;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}
