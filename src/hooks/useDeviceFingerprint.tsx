import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { supabase } from "@/integrations/supabase/client";

export const useDeviceFingerprint = (userId: string | undefined) => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  useEffect(() => {
    const initFingerprint = async () => {
      if (!userId) return;

      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        const visitorId = result.visitorId;
        
        setFingerprint(visitorId);

        // Get user's IP address
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const ipData = await ipResponse.json();
        
        // Update user's device info
        const { data: profile } = await supabase
          .from("profiles")
          .select("trusted_devices")
          .eq("user_id", userId)
          .single();

        const trustedDevices = (profile?.trusted_devices as any[]) || [];
        const deviceExists = Array.isArray(trustedDevices) && trustedDevices.some((d: any) => d.fingerprint === visitorId);

        if (!deviceExists) {
          const newDevice = {
            fingerprint: visitorId,
            addedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            lastSeen: new Date().toISOString(),
          };

          await supabase
            .from("profiles")
            .update({
              trusted_devices: Array.isArray(trustedDevices) ? [...trustedDevices, newDevice] : [newDevice],
              last_login_ip: ipData.ip,
              last_login_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        } else if (Array.isArray(trustedDevices)) {
          // Update last seen
          const updatedDevices = trustedDevices.map((d: any) =>
            d.fingerprint === visitorId
              ? { ...d, lastSeen: new Date().toISOString() }
              : d
          );

          await supabase
            .from("profiles")
            .update({
              trusted_devices: updatedDevices,
              last_login_ip: ipData.ip,
              last_login_at: new Date().toISOString(),
            })
            .eq("user_id", userId);
        }
      } catch (error) {
        console.error("Error initializing fingerprint:", error);
      }
    };

    initFingerprint();
  }, [userId]);

  return { fingerprint };
};
