import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Smartphone, MapPin, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const SecuritySettings = () => {
  const { profile } = useAuth();

  const handleEnableMFA = () => {
    toast.info("MFA Setup", {
      description: "Please enable Multi-Factor Authentication in your Supabase project settings. This feature requires configuration in the Supabase dashboard under Authentication > Settings."
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Overview
          </CardTitle>
          <CardDescription>
            Protect your account and financial information with advanced security measures
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* MFA Status */}
          <div className="flex items-start justify-between p-4 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-foreground">Multi-Factor Authentication (MFA)</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Add an extra layer of security to your account with time-based one-time passwords
                </p>
                <div className="mt-2">
                  {profile?.mfa_enabled ? (
                    <Badge variant="default" className="bg-green-500">Enabled</Badge>
                  ) : (
                    <Badge variant="destructive">Not Enabled</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button 
              variant={profile?.mfa_enabled ? "outline" : "default"}
              size="sm"
              onClick={handleEnableMFA}
            >
              {profile?.mfa_enabled ? "Manage" : "Enable MFA"}
            </Button>
          </div>

          {/* Device Tracking */}
          <div className="flex items-start justify-between p-4 border border-border rounded-lg">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-1" />
              <div>
                <h4 className="font-semibold text-foreground">Device & Location Tracking</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Monitor login attempts from new devices or unusual locations
                </p>
                {profile?.last_login_at && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last login: {new Date(profile.last_login_at).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>

          {/* Security Warnings */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-1" />
              <div>
                <h4 className="font-semibold text-amber-900 dark:text-amber-100">Security Best Practices</h4>
                <ul className="text-sm text-amber-800 dark:text-amber-200 mt-2 space-y-1 list-disc list-inside">
                  <li>Never share your password or OTP codes with anyone</li>
                  <li>TransitCares will never ask for sensitive information via SMS or email</li>
                  <li>Always verify you're on the official TransitCares website</li>
                  <li>Use a strong, unique password for your account</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Security */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Security</CardTitle>
          <CardDescription>
            All financial transactions are logged and monitored for suspicious activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Encryption at Rest</span>
              <Badge variant="secondary">AES-256</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Encryption in Transit</span>
              <Badge variant="secondary">TLS 1.3</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Audit Logging</span>
              <Badge variant="secondary">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecuritySettings;
