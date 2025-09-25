import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Wallet, 
  Shield, 
  FileText, 
  Plus, 
  ArrowUpRight,
  Download,
  Calendar,
  CheckCircle
} from "lucide-react";

const UserDashboard = () => {
  // Mock user data
  const userData = {
    name: "Emeka Okafor",
    vehicleId: "ASR-BUS-2024-0156",
    tier: "Silver",
    lastPaid: "Today",
    walletBalance: 45500,
    weeklyProgress: 2, // 2 out of 3 payments
    registrationPaid: true,
    eligibleForClaims: true
  };

  return (
    <section id="dashboard" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userData.name}! 👋
          </h2>
          <p className="text-muted-foreground">
            Manage your vehicle insurance and track your coverage
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5 text-primary" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Vehicle ID</p>
                <p className="font-mono text-sm font-medium">{userData.vehicleId}</p>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <Badge variant="secondary" className="bg-silver-light text-silver border-silver/20">
                    {userData.tier} Plan
                  </Badge>
                </div>
                <Shield className="h-8 w-8 text-silver" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Payment</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-transport-green" />
                  {userData.lastPaid}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Weekly Progress Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-primary" />
                Weekly Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Premium Payments</span>
                  <span className="text-sm font-medium">{userData.weeklyProgress}/3</span>
                </div>
                <Progress value={(userData.weeklyProgress / 3) * 100} className="h-2" />
              </div>
              <div className="p-3 bg-transport-green/10 rounded-lg border border-transport-green/20">
                <p className="text-sm font-medium text-transport-green flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Eligible for Claims
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  You've met the minimum payment requirement
                </p>
              </div>
              <Button variant="transport" size="sm" className="w-full">
                Pay Today's Premium
              </Button>
            </CardContent>
          </Card>

          {/* Wallet Card */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wallet className="h-5 w-5 text-primary" />
                Wallet Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  ₦{userData.walletBalance.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Available Balance</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4" />
                  Top Up
                </Button>
                <Button variant="outline" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="w-full">
                View History
              </Button>
            </CardContent>
          </Card>

          {/* Registration Status Card */}
          <Card className="shadow-[var(--shadow-soft)] lg:col-span-3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
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
                    <p className="font-medium">One-time Registration Complete</p>
                    <p className="text-sm text-muted-foreground">
                      All required documents verified and approved
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                  View Documents
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