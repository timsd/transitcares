import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { useConvex } from "convex/react";

export const useDeviceFingerprint = (userId: string | undefined) => {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const convex = useConvex();

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
        const trustedDevices: any[] = []
        const deviceExists = Array.isArray(trustedDevices) && trustedDevices.some((d: any) => d.fingerprint === visitorId);

        if (!deviceExists) {
          const newDevice = {
            fingerprint: visitorId,
            addedAt: new Date().toISOString(),
            userAgent: navigator.userAgent,
            lastSeen: new Date().toISOString(),
          };

          try {
            const key = 'profile:' + userId
            const prof = JSON.parse(localStorage.getItem(key) || '{}')
            const updated = {
              ...prof,
              trusted_devices: Array.isArray(trustedDevices) ? [...trustedDevices, newDevice] : [newDevice],
              last_login_ip: ipData.ip,
              last_login_at: new Date().toISOString(),
            }
            localStorage.setItem(key, JSON.stringify(updated))
          } catch {}
        } else if (Array.isArray(trustedDevices)) {
          // Update last seen
          const updatedDevices = trustedDevices.map((d: any) =>
            d.fingerprint === visitorId
              ? { ...d, lastSeen: new Date().toISOString() }
              : d
          );

          try {
            const key = 'profile:' + userId
            const prof = JSON.parse(localStorage.getItem(key) || '{}')
            const updated = {
              ...prof,
              trusted_devices: updatedDevices,
              last_login_ip: ipData.ip,
              last_login_at: new Date().toISOString(),
            }
            localStorage.setItem(key, JSON.stringify(updated))
          } catch {}
        }
      } catch (error) {
        console.error("Error initializing fingerprint:", error);
      }
    };

    initFingerprint();
  }, [userId]);

  return { fingerprint };
};
