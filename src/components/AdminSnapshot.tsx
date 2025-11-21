import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, FileText, TrendingUp, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "convex/react";
import { useToast } from "@/components/ui/use-toast";
import { api } from "../../convex/_generated/api";
import { Button as UIButton } from "@/components/ui/button";
import { crawlUrl } from "@/services/firecrawl";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

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
  const { isAdmin, user } = useAuth();
  const crawls = useQuery(api.crawls.list, { user_id: user?.id } as any) || []
  const recordCrawl = useMutation(api.crawls.record)
  const startCrawl = useAction(api.crawl.start)
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

  const profilesList = useQuery(api.profiles.list, {} as any) || []
  const paymentsList = useQuery(api.payments.list, {} as any) || []
  const claimsList = useQuery(api.claims.list, {} as any) || []

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const currentMonth = new Date();
      currentMonth.setDate(1);
      const totalUsers = (profilesList as any[]).length
      const monthlyRevenue = (paymentsList as any[]).filter((p) => new Date(p.created_at) >= currentMonth).reduce((sum, p: any) => sum + Number(p.amount || 0), 0)
      const claimsProcessed = (claimsList as any[]).filter((c) => new Date(c.created_at) >= currentMonth && c.claim_status === 'approved').length
      const distribution = (profilesList as any[]).reduce((acc: any, prof: any) => {
        const plan = prof.plan_tier || 'bronze'
        acc[plan] = (acc[plan] || 0) + 1
        return acc
      }, { bronze: 0, silver: 0, gold: 0 })
      const recentPayments = (paymentsList as any[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(5)
      const recentClaims = (claimsList as any[]).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(5)
      const activity: RecentActivity[] = [
        ...recentPayments.map((p: any) => ({ id: p._id || p.id, type: 'payment' as const, vehicle_id: `Payment-${(p._id || p.id).toString().slice(0, 8)}`, amount: Number(p.amount || 0), status: 'completed', created_at: p.created_at })),
        ...recentClaims.map((c: any) => ({ id: c._id || c.id, type: 'claim' as const, vehicle_id: `Claim-${(c._id || c.id).toString().slice(0, 8)}`, amount: Number(c.claim_amount || 0), status: c.claim_status, created_at: c.created_at }))
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 6);

      setStats({
        totalUsers: totalUsers || 0,
        monthlyRevenue,
        claimsProcessed: claimsProcessed || 0,
        growthRate: 23
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
          <div className="flex items-center justify-center mt-4 gap-3">
            <UIButton
              size="sm"
              onClick={async () => {
                try {
                  if (user) {
                    try {
                      await startCrawl({ user_id: user.id, url: 'https://jiji.ng/search?query=car%20parts' } as any)
                    } catch {}
                  } else {
                    await crawlUrl('https://jiji.ng/search?query=car%20parts')
                  }
                  toast({ title: 'Crawl started', description: 'Fetching market data for claims verification' })
                } catch (e: any) {
                  toast({ title: 'Crawl error', description: e?.message || 'Failed to start crawl', variant: 'destructive' })
                }
              }}
            >
              Run Price Crawl
            </UIButton>
          </div>
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
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Crawls</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {(crawls as any[]).slice(0, 5).map((c) => (
                  <div key={c._id || c.id} className="border rounded p-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{new Date(c.created_at).toLocaleString()}</span>
                      <Badge variant="outline">{c.status}</Badge>
                    </div>
                    <p className="text-xs mt-2 break-words">{c.url}</p>
                  </div>
                ))}
                {(crawls as any[]).length === 0 && (
                  <p className="text-sm text-muted-foreground">No crawl activity yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
