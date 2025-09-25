import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign,
  Truck,
  Activity
} from "lucide-react";

const AdminSnapshot = () => {
  // Mock admin data
  const stats = [
    {
      title: "Total Transporters",
      value: "2,847",
      change: "+12%",
      icon: Users,
      color: "text-transport-blue"
    },
    {
      title: "Weekly Revenue",
      value: "₦1.2M",
      change: "+8%", 
      icon: TrendingUp,
      color: "text-transport-green"
    },
    {
      title: "Reserve Fund",
      value: "₦45.6M",
      change: "+3%",
      icon: Shield,
      color: "text-transport-orange"
    },
    {
      title: "Active Vehicles",
      value: "3,125",
      change: "+15%",
      icon: Truck,
      color: "text-primary"
    },
    {
      title: "Claims Processed",
      value: "186",
      change: "-5%",
      icon: Activity,
      color: "text-muted-foreground"
    },
    {
      title: "Premium Collections",
      value: "₦892K",
      change: "+22%",
      icon: DollarSign,
      color: "text-transport-yellow"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Platform Overview
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real-time insights into our growing transport insurance community
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            const isNegative = stat.change.startsWith('-');
            
            return (
              <Card key={stat.title} className="shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-medium)] transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span className="text-muted-foreground font-medium">{stat.title}</span>
                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-foreground mb-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium ${
                        isNegative ? 'text-destructive' : 'text-transport-green'
                      }`}>
                        {stat.change} this week
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Insights */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-lg">Popular Vehicle Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Minibuses</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-16 h-2 bg-transport-blue rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">45%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tricycles</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-12 h-2 bg-transport-orange rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">35%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Buses</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-8 h-2 bg-transport-green rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="text-lg">Tier Distribution</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Silver Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-14 h-2 bg-silver rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">52%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bronze Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-10 h-2 bg-bronze rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">31%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Gold Plan</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary rounded-full">
                    <div className="w-6 h-2 bg-gold rounded-full"></div>
                  </div>
                  <span className="text-sm font-medium">17%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AdminSnapshot;