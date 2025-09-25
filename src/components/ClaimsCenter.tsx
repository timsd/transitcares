import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Eye
} from "lucide-react";

const ClaimsCenter = () => {
  // Mock claims data
  const recentClaims = [
    {
      id: "CLM-2024-0045",
      date: "2024-03-15",
      type: "Accident Damage",
      amount: 85000,
      status: "paid",
      description: "Front bumper damage from collision"
    },
    {
      id: "CLM-2024-0038",
      date: "2024-03-10", 
      type: "Theft",
      amount: 120000,
      status: "processing",
      description: "Side mirror and headlight theft"
    },
    {
      id: "CLM-2024-0031",
      date: "2024-03-05",
      type: "Fire Damage",
      amount: 75000,
      status: "pending",
      description: "Engine compartment fire damage"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-transport-green/10 text-transport-green border-transport-green/20';
      case 'processing': return 'bg-transport-orange/10 text-transport-orange border-transport-orange/20';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <section id="claims" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Claims Center
          </h2>
          <p className="text-muted-foreground">
            Submit new claims and track existing ones
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Submit New Claim */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Submit New Claim
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors cursor-pointer">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="font-medium text-foreground mb-2">
                  Upload Invoice from Approved Mechanic
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag and drop your invoice here, or click to browse
                </p>
                <Button variant="outline" size="sm">
                  Choose File
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    📋 Required Documents:
                  </p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Invoice from approved mechanic</li>
                    <li>• Photos of damage (if applicable)</li>
                    <li>• Police report (for theft/accident)</li>
                  </ul>
                </div>
              </div>

              <Button variant="transport" className="w-full">
                Submit Claim
              </Button>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card className="shadow-[var(--shadow-soft)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Claims
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentClaims.map((claim) => (
                  <div key={claim.id} className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{claim.type}</p>
                        <p className="text-sm text-muted-foreground">{claim.id}</p>
                      </div>
                      <Badge className={getStatusColor(claim.status)}>
                        {getStatusIcon(claim.status)}
                        {claim.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {claim.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-bold text-foreground">
                          ₦{claim.amount.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Filed on {new Date(claim.date).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-6">
                View All Claims
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ClaimsCenter;