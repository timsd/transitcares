import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle, XCircle, Clock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import PaystackPayment from "./PaystackPayment";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useConvex, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useMemo, useState } from "react";

const WeeklyCompliance = () => {
  const { user, profile } = useAuth();
  const convex = useConvex();
  const paymentsList = useQuery(api.functions.payments.list, { user_id: user?.id } as any) || [];
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [autoPay, setAutoPay] = useState<boolean>(false);
  const [payments, setPayments] = useState<any[]>([]);
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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

  useEffect(() => {
    setSelectedDays((profile as any)?.payment_days || []);
    setAutoPay(Boolean((profile as any)?.auto_payment_enabled));
  }, [profile]);

  useEffect(() => {
    setPayments(Array.isArray(paymentsList) ? paymentsList : []);
  }, [paymentsList]);

  const startOfWeek = useMemo(() => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const s = new Date(d.setDate(diff));
    s.setHours(0,0,0,0);
    return s;
  }, []);

  const weekDates = useMemo(() => {
    const list: { day: string; date: Date }[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(startOfWeek);
      dt.setDate(startOfWeek.getDate() + i);
      list.push({ day: daysOfWeek[i], date: dt });
    }
    return list;
  }, [startOfWeek]);

  const paidSelectedDays = useMemo(() => {
    const thisWeekPayments = payments.filter(p => p.payment_type === 'daily_premium');
    return weekDates.filter(({ day, date }) => {
      if (!selectedDays.includes(day)) return false;
      const isoDate = date.toISOString().slice(0,10);
      return thisWeekPayments.some(p => String(p.created_at).slice(0,10) === isoDate);
    }).length;
  }, [payments, weekDates, selectedDays]);

  const remainingDays = Math.max(0, Math.min(4, selectedDays.length) - paidSelectedDays);
  const totalSelectedAmount = dailyPremium * Math.min(4, selectedDays.length || 4);
  const paidAmount = paidSelectedDays * dailyPremium;
  const progressPercentage = selectedDays.length ? (paidSelectedDays / Math.min(4, selectedDays.length)) * 100 : 0;
  const eligible = paidSelectedDays >= 4;
  const hasRegistrationFee = profile?.registration_status !== 'completed';

  const toggleDay = (day: string) => {
    const exists = selectedDays.includes(day);
    if (exists) setSelectedDays(selectedDays.filter(d => d !== day));
    else if (selectedDays.length < 4) setSelectedDays([...selectedDays, day]);
  };

  const savePreferences = async () => {
    if (!user) return;
    const data: any = { payment_days: selectedDays, auto_payment_enabled: autoPay };
    try {
      if (convex) {
        await convex.mutation(api.functions.profiles.upsert, { user_id: user.id, data } as any);
      }
      const key = 'profile:' + user.id;
      const prof = JSON.parse(localStorage.getItem(key) || '{}');
      localStorage.setItem(key, JSON.stringify({ ...prof, ...data }));
    } catch {}
  };

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
            <Badge variant={eligible ? "default" : "outline"}>
              {eligible ? "Claim Eligible" : `${remainingDays} days to eligibility`}
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
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Select up to 4 payment days</p>
          <div className="flex flex-wrap gap-3">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center gap-2">
                <Checkbox checked={selectedDays.includes(day)} onCheckedChange={() => toggleDay(day)} />
                <span className="text-sm">{day}</span>
              </label>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch checked={autoPay} onCheckedChange={setAutoPay} />
              <span className="text-sm">Automate daily payments</span>
            </div>
            <Button size="sm" onClick={savePreferences}>Save Preferences</Button>
          </div>
        </div>
        {/* Progress Overview */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Weekly Progress</span>
            <span className="font-medium text-foreground">{paidSelectedDays} of {Math.min(4, selectedDays.length || 4)} days</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>₦{paidAmount.toLocaleString()} paid</span>
            <span>₦{totalSelectedAmount.toLocaleString()} total</span>
          </div>
        </div>

        {/* Daily Breakdown */}
          <div className="space-y-2">
            <h4 className="font-medium text-foreground text-sm">Daily Breakdown</h4>
            <div className="space-y-2">
              {weekDates.map(({ day, date }, index) => {
                const requires = selectedDays.includes(day);
                const isoDate = date.toISOString().slice(0,10);
                const paid = payments.some(p => p.payment_type === 'daily_premium' && String(p.created_at).slice(0,10) === isoDate);
                return (
                  <div 
                    key={day}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      paid 
                        ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900" 
                        : requires ? "bg-muted/50 border-border" : "bg-muted/30 border-border"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {paid ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : requires && index === new Date().getDay() - 1 ? (
                        <Clock className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <XCircle className="h-5 w-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-foreground text-sm">{day}</p>
                        <p className="text-xs text-muted-foreground">{date.toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${paid ? "text-green-600" : requires ? "text-muted-foreground" : "text-muted-foreground"}`}>
                        ₦{dailyPremium.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {paid ? "Paid" : requires ? (date.toDateString() === new Date().toDateString() ? "Due Today" : "Pending") : "Not Selected"}
                      </p>
                    </div>
                  </div>
                );
              })}
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
            <li>• Select any 4 days per week and complete payments to be eligible for claims</li>
            <li>• Daily premium varies by plan: Bronze (₦200), Silver (₦350), Gold (₦500)</li>
            <li>• Premium should be paid before 11:59 PM on selected days</li>
            <li>• Claim eligibility is reached when 4 selected-day payments are completed within the week</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyCompliance;
