import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Wallet, CheckCircle, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <section className="py-16 bg-background border-b">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Get Started with AjoSafeRide
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of transport operators who trust us with their daily insurance needs. 
            Sign up today and protect your vehicle with our flexible, affordable plans.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Create Account
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
              <CardTitle className="flex items-center gap-2 text-foreground">
                <CreditCard className="h-5 w-5 text-primary" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Vehicle ID</p>
                <p className="font-semibold text-foreground">{profile?.vehicle_id || "Not Set"}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Current Tier</p>
                <Badge variant="secondary" className="text-transport-orange">
                  {profile?.plan_tier ? `${profile.plan_tier.charAt(0).toUpperCase() + profile.plan_tier.slice(1)} Plan` : "No Plan"}
                </Badge>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Registration Status</p>
                <p className="font-semibold text-foreground capitalize">{profile?.registration_status || "Pending"}</p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Track your premium payments and claim eligibility
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Premium Payments</span>
                  <span className="font-medium text-foreground">2/3 this week</span>
                </div>
                <Progress value={67} className="h-2" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="h-4 w-4 text-transport-green" />
                <span className="text-transport-green font-medium">Eligible for Claims</span>
              </div>
              <Button variant="transport" className="w-full">
                Pay Today's Premium
              </Button>
            </CardContent>
          </Card>

          {/* Wallet Balance Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">Available Balance</p>
                <p className="text-3xl font-bold text-transport-green">₦{profile?.wallet_balance?.toLocaleString() || "0"}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  Top Up
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Withdraw
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="w-full text-foreground">
                View History
              </Button>
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
                      {profile?.registration_status === 'completed' 
                        ? 'All required documents verified and approved'
                        : 'Please complete your vehicle registration to access all features'
                      }
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  {profile?.registration_status === 'completed' ? 'View Documents' : 'Complete Registration'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default UserDashboard;