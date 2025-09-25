import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star, Zap, Crown } from "lucide-react";

const InsurancePlans = () => {
const plans = [
    {
      name: "Bronze",
      icon: Zap,
      dailyPremium: 1500,
      coverageRange: "₦2,000 - ₦20,000",
      description: "The Essential Plan - Basic affordable coverage for new or low-income drivers",
      features: [
        "Tire punctures and battery issues",
        "Minor mechanical problems",
        "Basic fluid leaks and servicing",
        "Loyalty bonus for responsible driving",
        "Limited to 2 claims per month"
      ],
      popular: false,
      variant: "bronze" as const
    },
    {
      name: "Silver", 
      icon: Star,
      dailyPremium: 2500,
      coverageRange: "₦21,000 - ₦39,000",
      description: "The Mid-Range Plan - Comprehensive protection for regular drivers",
      features: [
        "All Bronze plan benefits",
        "Brake system and electrical faults",
        "Minor engine servicing",
        "Suspension and minor bodywork",
        "No-claim bonus rewards",
        "Limited to 2 claims per month"
      ],
      popular: true,
      variant: "silver" as const
    },
    {
      name: "Gold",
      icon: Crown,
      dailyPremium: 4000,
      coverageRange: "₦40,000 - ₦60,000",
      description: "The Premium Plan - Maximum protection for professional drivers",
      features: [
        "All Silver plan benefits",
        "Major engine and transmission work",
        "Complex electrical system repairs",
        "Towing services included",
        "Priority claim processing",
        "Maximum loyalty and no-claim bonuses",
        "Limited to 2 claims per month"
      ],
      popular: false,
      variant: "gold" as const
    }
  ];

  return (
    <section id="plans" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Secure Your Ride
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the daily insurance plan that best fits your needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <Card 
                key={plan.name}
                className={`relative shadow-[var(--shadow-medium)] transition-all duration-300 hover:shadow-[var(--shadow-strong)] hover:-translate-y-1 ${
                  plan.popular ? 'ring-2 ring-primary/20 bg-[var(--gradient-card)]' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-transport-orange text-accent-foreground px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className={`mx-auto p-3 rounded-full bg-${plan.variant}-light w-fit`}>
                    <IconComponent className={`h-8 w-8 text-${plan.variant}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name} Plan</CardTitle>
                  <div className="space-y-1">
                    <p className="text-3xl font-bold text-foreground">
                      ₦{plan.dailyPremium.toLocaleString()}
                      <span className="text-sm font-normal text-muted-foreground">/day</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Coverage: {plan.coverageRange}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-transport-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    variant={plan.variant}
                    size="lg" 
                    className="w-full"
                  >
                    Select {plan.name} Plan
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need help choosing the right plan?
          </p>
          <Button variant="outline" size="lg">
            Talk to Our Experts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default InsurancePlans;