import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, DollarSign, FileText, TrendingUp } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const AdminSnapshot = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return null;
  }

  // Mock admin analytics data
  const stats = [
    {
      title: "Total Users",
      value: "2,847",
      change: "+12%",
      icon: Users,
      description: "Active transport operators"
    },
    {
      title: "Monthly Revenue",
      value: "₦4.2M",
      change: "+8%",
      icon: DollarSign,
      description: "Premium collections"
    },
    {
      title: "Claims Processed",
      value: "186",
      change: "+15%",
      icon: FileText,
      description: "This month"
    },
    {
      title: "Growth Rate",
      value: "23%",
      change: "+5%",
      icon: TrendingUp,
      description: "New registrations"
    }
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Admin Dashboard</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time insights and analytics for AjoSafeRide platform management.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
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
                Active users by insurance tier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bronze Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-8 h-2 bg-bronze rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">28%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Silver Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-14 h-2 bg-silver rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">55%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gold Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-6 h-2 bg-gold rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium text-foreground">17%</span>
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
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Premium Payment</p>
                  <p className="text-xs text-muted-foreground">TRI-ABC-123</p>
                </div>
                <Badge variant="secondary" className="text-transport-green">₦2,500</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">Claim Processed</p>
                  <p className="text-xs text-muted-foreground">BUS-XYZ-456</p>
                </div>
                <Badge variant="secondary" className="text-transport-orange">₦15,000</Badge>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <p className="text-sm font-medium text-foreground">New Registration</p>
                  <p className="text-xs text-muted-foreground">MIN-DEF-789</p>
                </div>
                <Badge variant="secondary" className="text-primary">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminSnapshot;