import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaystackPayment from "./PaystackPayment";

const WeeklyCompliance = () => {
  const { profile } = useAuth();
  
  // Get daily premium based on plan tier
  const getPlanAmount = (tier: string | null | undefined) => {
    switch(tier?.toLowerCase()) {
      case 'bronze': return 200;
      case 'silver': return 350;
      case 'gold': return 500;
      default: return 200;
    }
  };
  
  const dailyPremium = getPlanAmount(profile?.plan_tier);
  const registrationFee = 5000;
  const weekData = [
    { day: "Monday", paid: true, amount: dailyPremium, date: "Jan 27" },
    { day: "Tuesday", paid: true, amount: dailyPremium, date: "Jan 28" },
    { day: "Wednesday", paid: true, amount: dailyPremium, date: "Jan 29" },
    { day: "Thursday", paid: false, amount: dailyPremium, date: "Jan 30" },
    { day: "Friday", paid: false, amount: dailyPremium, date: "Jan 31" },
    { day: "Saturday", paid: false, amount: dailyPremium, date: "Feb 1" },
    { day: "Sunday", paid: false, amount: dailyPremium, date: "Feb 2" }
  ];

  const paidDays = weekData.filter(d => d.paid).length;
  const remainingDays = 7 - paidDays;
  const totalWeeklyAmount = dailyPremium * 7;
  const paidAmount = paidDays * dailyPremium;
  const progressPercentage = (paidDays / 7) * 100;
  const daysUntilEligible = Math.max(0, 4 - paidDays); // Changed to 4 consecutive days
  const hasRegistrationFee = profile?.registration_status !== 'completed';

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Compliance Tracker
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Track your daily premium payments
            </p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant={daysUntilEligible === 0 ? "default" : "outline"}>
              {daysUntilEligible === 0 ? "Claim Eligible" : `${daysUntilEligible} days to eligibility`}
            </Badge>
            {hasRegistrationFee && (
              <Badge variant="secondary" className="text-xs">
                Registration: ₦{registrationFee.toLocaleString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium text-foreground">{paidDays} of 7 days</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₦{paidAmount.toLocaleString()} paid</span>
            <span>₦{totalWeeklyAmount.toLocaleString()} total</span>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground text-sm">Daily Breakdown</h4>
          <div className="space-y-2">
            {weekData.map((day, index) => (
              <div 
                key={index}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  day.paid 
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" 
                    : "bg-muted/50 border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  {day.paid ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    index === paidDays ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )
                  )}
                  <div>
                    <p className="font-medium text-foreground text-sm">{day.day}</p>
                    <p className="text-xs text-muted-foreground">{day.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${day.paid ? "text-green-600" : "text-muted-foreground"}`}>
                    ₦{day.amount.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {day.paid ? "Paid" : index === paidDays ? "Due Today" : "Pending"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-border">
          {hasRegistrationFee && (
            <div className="mb-3 bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-800 dark:text-yellow-400 font-medium mb-2">
                ⚠️ One-time Registration Fee Required
              </p>
              <p className="text-xs text-muted-foreground mb-3">
                Complete your registration to activate daily premium payments
              </p>
              <PaystackPayment 
                amount={registrationFee} 
                paymentType="registration"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md transition-colors"
              >
                Pay Registration Fee (₦{registrationFee.toLocaleString()})
              </PaystackPayment>
            </div>
          )}
          
          {!hasRegistrationFee && remainingDays > 0 ? (
            <div className="space-y-3">
              <div className="bg-muted p-3 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Remaining this week:</strong> ₦{(remainingDays * dailyPremium).toLocaleString()} ({remainingDays} days)
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Plan: {profile?.plan_tier?.toUpperCase()} - ₦{dailyPremium}/day
                </p>
              </div>
              <PaystackPayment 
                amount={dailyPremium} 
                paymentType="daily_premium"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md transition-colors"
              >
                Pay Today's Premium (₦{dailyPremium.toLocaleString()})
              </PaystackPayment>
            </div>
          ) : !hasRegistrationFee ? (
            <div className="bg-green-50 dark:bg-green-950/20 p-3 rounded-lg text-center">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                ✓ All payments complete for this week!
              </p>
            </div>
          ) : null}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-900">
          <h4 className="font-medium text-foreground text-sm mb-2">Important Information</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• One-time registration fee: ₦{registrationFee.toLocaleString()} (required before daily payments)</li>
            <li>• Maintain 4 consecutive days of payment to be eligible for claims</li>
            <li>• You can choose which days to pay, but they must be consecutive</li>
            <li>• Daily premium varies by plan: Bronze (₦200), Silver (₦350), Gold (₦500)</li>
            <li>• Missing a payment resets your eligibility counter</li>
            <li>• Premium must be paid before 11:59 PM each day</li>
            <li>• Claims can be filed anytime after achieving 4 consecutive days eligibility</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCompliance;
