import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  vehicle_type: string | null;
  vehicle_id: string | null;
  plan_tier: string;
  wallet_balance: number;
  registration_status: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile and role
          setTimeout(async () => {
            try {
              const [profileResult, roleResult] = await Promise.all([
                supabase.from('profiles').select('*').eq('user_id', session.user.id).single(),
                supabase.from('user_roles').select('role').eq('user_id', session.user.id).single()
              ]);
              
              if (profileResult.data) {
                setProfile(profileResult.data);
              }
              
              if (roleResult.data) {
                setIsAdmin(roleResult.data.role === 'admin');
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
            }
          }, 0);
        } else {
          setProfile(null);
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
    }
    return { error };
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