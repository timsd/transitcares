import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminStats {
  totalUsers: number;
  monthlyRevenue: number;
  claimsProcessed: number;
  growthRate: number;
}

interface PlanDistribution {
  bronze: number;
  silver: number;
  gold: number;
}

interface RecentActivity {
  id: string;
  type: 'payment' | 'claim' | 'registration';
  vehicle_id: string;
  amount?: number;
  status: string;
  created_at: string;
}

const AdminSnapshot = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    monthlyRevenue: 0,
    claimsProcessed: 0,
    growthRate: 0
  });
  const [planDistribution, setPlanDistribution] = useState<PlanDistribution>({
    bronze: 0,
    silver: 0,
    gold: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch monthly revenue
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const { data: payments } = await supabase
        .from('payments')
        .select('amount')
        .gte('created_at', currentMonth.toISOString());

      const monthlyRevenue = payments?.reduce((sum, payment) => 
        sum + parseFloat(payment.amount.toString()), 0) || 0;

      // Fetch claims processed this month
      const { count: claimsProcessed } = await supabase
        .from('claims')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      // Fetch plan distribution
      const { data: planData } = await supabase
        .from('profiles')
        .select('plan_tier');

      const distribution = planData?.reduce((acc, profile) => {
        const plan = profile.plan_tier || 'bronze';
        acc[plan as keyof PlanDistribution] = (acc[plan as keyof PlanDistribution] || 0) + 1;
        return acc;
      }, { bronze: 0, silver: 0, gold: 0 }) || { bronze: 0, silver: 0, gold: 0 };

      // Fetch recent activity
      const { data: recentPayments } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: recentClaims } = await supabase
        .from('claims')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Combine and format recent activity
      const activity: RecentActivity[] = [
        ...(recentPayments?.map(p => ({
          id: p.id,
          type: 'payment' as const,
          vehicle_id: `Payment-${p.id.slice(0, 8)}`,
          amount: parseFloat(p.amount.toString()),
          status: p.payment_status,
          created_at: p.created_at
        })) || []),
        ...(recentClaims?.map(c => ({
          id: c.id,
          type: 'claim' as const,
          vehicle_id: `Claim-${c.id.slice(0, 8)}`,
          amount: parseFloat(c.claim_amount.toString()),
          status: c.claim_status,
          created_at: c.created_at
        })) || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

      setStats({
        totalUsers: totalUsers || 0,
        monthlyRevenue,
        claimsProcessed: claimsProcessed || 0,
        growthRate: 23 // This could be calculated based on previous month data
      });

      setPlanDistribution(distribution);
      setRecentActivity(activity);

    } catch (error: any) {
      toast({
        title: "Error fetching admin data",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return null;
  }

  const totalPlans = planDistribution.bronze + planDistribution.silver + planDistribution.gold;
  const bronzePercentage = totalPlans > 0 ? Math.round((planDistribution.bronze / totalPlans) * 100) : 0;
  const silverPercentage = totalPlans > 0 ? Math.round((planDistribution.silver / totalPlans) * 100) : 0;
  const goldPercentage = totalPlans > 0 ? Math.round((planDistribution.gold / totalPlans) * 100) : 0;

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      change: "+12%",
      icon: Users,
      description: "Active transport operators"
    },
    {
      title: "Monthly Revenue",
      value: `₦${stats.monthlyRevenue.toLocaleString()}`,
      change: "+8%",
      icon: DollarSign,
      description: "Premium collections"
    },
    {
      title: "Claims Processed",
      value: stats.claimsProcessed.toString(),
      change: "+15%",
      icon: FileText,
      description: "This month"
    },
    {
      title: "Growth Rate",
      value: `${stats.growthRate}%`,
      change: "+5%",
      icon: TrendingUp,
      description: "New registrations"
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAdminData}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time insights and analytics for RepairRide platform management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {statsData.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <Card key={stat.title} className="shadow-[var(--shadow-soft)]">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <IconComponent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-transport-green">
                        {stat.change}
                      </Badge>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Admin Insights */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground">Plan Distribution</CardTitle>
              <CardDescription className="text-muted-foreground">
                Active users by insurance tier ({totalPlans} total users)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bronze Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-bronze rounded-full" 
                      style={{ width: `${bronzePercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{bronzePercentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Silver Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-silver rounded-full" 
                      style={{ width: `${silverPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{silverPercentage}%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gold Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div 
                      className="h-2 bg-gold rounded-full" 
                      style={{ width: `${goldPercentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">{goldPercentage}%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activity</CardTitle>
              <CardDescription className="text-muted-foreground">
                Latest platform transactions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex justify-between items-center py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {activity.type === 'payment' ? 'Premium Payment' : 
                         activity.type === 'claim' ? 'Claim Processed' : 'New Registration'}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.vehicle_id}</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        activity.type === 'payment' ? 'text-transport-green' :
                        activity.type === 'claim' ? 'text-transport-orange' : 'text-primary'
                      }
                    >
                      {activity.amount ? `₦${activity.amount.toLocaleString()}` : activity.status}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminSnapshot;