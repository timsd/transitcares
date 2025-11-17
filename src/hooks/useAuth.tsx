import { useState, useEffect } from "react";
import { authClient } from "@/integrations/auth/client";
import { applyAuthFromLocal } from "@/integrations/convex/client";

interface Profile {
  user_id: string;
  full_name?: string | null;
  phone?: string | null;
  vehicle_type?: string | null;
  vehicle_id?: string | null;
  plan_tier?: string;
  wallet_balance?: number;
  registration_status?: string;
  last_login_ip?: string | null;
  last_login_at?: string | null;
  trusted_devices?: any;
  mfa_enabled?: boolean;
  mfa_secret?: string | null;
  bank_name?: string | null;
  account_number?: string | null;
  account_name?: string | null;
  vehicle_color?: string | null;
  chassis_number?: string | null;
  designated_route?: string | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = authClient.onAuthStateChange((s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        applyAuthFromLocal()
        const key = 'profile:' + s.user.id
        const prof = localStorage.getItem(key)
        setProfile(prof ? JSON.parse(prof) : null)
        const role = localStorage.getItem('role:' + s.user.id)
        setIsAdmin(role === 'admin')
      } else {
        setProfile(null)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    const s = authClient.getSession()
    setSession(s)
    setUser(s?.user ?? null)
    if (s?.user) {
      applyAuthFromLocal()
      const key = 'profile:' + s.user.id
      const prof = localStorage.getItem(key)
      setProfile(prof ? JSON.parse(prof) : null)
      const role = localStorage.getItem('role:' + s.user.id)
      setIsAdmin(role === 'admin')
    }
    setLoading(false)
    return () => unsubscribe()
  }, []);

  const signOut = async () => {
    await authClient.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setIsAdmin(false);
    return { error: null };
  };

  return {
    user,
    session,
    profile,
    isAdmin,
    loading,
    signOut,
  };
};
