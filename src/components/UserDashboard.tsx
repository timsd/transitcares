import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, FileText, CheckCircle, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceFingerprint } from "@/hooks/useDeviceFingerprint";
import { useNavigate } from "@/lib/navigation";
import WeeklyCompliance from "@/components/WeeklyCompliance";
import WalletHistory from "@/components/WalletHistory";
import PaystackPayment from "@/components/PaystackPayment";
import { WithdrawalDialog } from "./WithdrawalDialog";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import logoImage from "@/assets/transitcares-logo.jpg";

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [topUpAmount, setTopUpAmount] = useState(1000);
  const [showWithdrawal, setShowWithdrawal] = useState(false);
  const [dailyPremium, setDailyPremium] = useState<number | null>(null);
  
  // Initialize device fingerprinting
  useDeviceFingerprint(user?.id);

  useEffect(() => {
    const tier = profile?.plan_tier
    if (tier === 'gold') setDailyPremium(4000)
    else if (tier === 'silver') setDailyPremium(2500)
    else if (tier === 'bronze') setDailyPremium(1500)
    else setDailyPremium(null)
  }, [profile?.plan_tier])

  if (!user) {
    return (
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-montserrat font-bold mb-4">
            Get Started with <span className="text-brand-transit">Transit</span><span className="text-brand-cares">Cares</span>
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of transport operators who trust us with their daily repairs insurance needs. 
            Sign up today and protect your vehicle with our flexible, affordable repair coverage plans.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")} 
            className="bg-primary hover:bg-primary/90 text-base font-montserrat font-semibold text-primary-foreground"
          >
            Get covered in 5 minutes or less
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section id="dashboard" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Welcome Back, {profile?.full_name || user.email}!
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here's your personalized dashboard with all your vehicle insurance information and quick actions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground">Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Vehicle ID</p>
                <p className="font-medium text-foreground">{profile?.vehicle_id || 'Not set'}</p>
                <p className="text-sm text-muted-foreground mt-4">Plan Tier</p>
                <Badge variant="outline" className="mt-1 capitalize">
                  {profile?.plan_tier ? profile.plan_tier : 'Not set'}
                </Badge>
                <Button 
                  className="w-full mt-4" 
                  variant="outline"
                  onClick={() => navigate("/profile")}
                >
                  View Full Profile
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-3xl font-bold text-foreground">
                    ₦{Number(profile?.wallet_balance || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Available balance</p>
                </div>
                <div className="flex gap-2">
                  <PaystackPayment amount={topUpAmount} paymentType="topup" />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowWithdrawal(true)}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Withdraw
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Payment Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Daily Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-2xl font-bold text-foreground">₦{(dailyPremium ?? 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground mt-1">Daily premium</p>
                </div>
                <PaystackPayment amount={dailyPremium ?? 0} paymentType="daily_premium" />
              </div>
            </CardContent>
          </Card>

          {/* Registration Status Card */}
          <Card className="md:col-span-2 lg:col-span-3 shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="h-5 w-5 text-primary" />
                Registration Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-transport-green/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-transport-green" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {profile?.registration_status === 'completed' ? 'One-time Registration Complete' : 'Registration In Progress'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {profile?.registration_status === 'completed' ? 'All required documents verified and approved' : 'Please complete your vehicle registration to access all features'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => navigate(profile?.registration_status === 'completed' ? '/profile' : '/registration')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {profile?.registration_status === 'completed' ? 'View Documents' : 'Complete Registration'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Compliance */}
          <Card className="md:col-span-2 lg:col-span-3 shadow-[var(--shadow-soft)]">
            <WeeklyCompliance />
          </Card>

          {/* Wallet History */}
          <Card className="md:col-span-2 lg:col-span-3 shadow-[var(--shadow-soft)]">
            <WalletHistory />
          </Card>
        </div>
      </div>
      
      <WithdrawalDialog open={showWithdrawal} onOpenChange={setShowWithdrawal} />
    </section>
  );
};

export default UserDashboard;
