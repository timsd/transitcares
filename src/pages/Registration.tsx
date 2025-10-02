import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, FileText, CreditCard } from "lucide-react";
import PaystackPayment from "@/components/PaystackPayment";
import { toast } from "sonner";

const Registration = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  if (!user) {
    navigate("/auth");
    return null;
  }

  if (profile?.registration_status === 'completed') {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <CardTitle className="text-2xl font-montserrat">Registration Complete!</CardTitle>
              <CardDescription>
                Your vehicle registration has been verified and approved
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <p className="text-sm font-semibold">Registration Details:</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-muted-foreground">Vehicle ID:</span>
                  <span className="font-medium">{profile.vehicle_id || 'N/A'}</span>
                  <span className="text-muted-foreground">Vehicle Type:</span>
                  <span className="font-medium capitalize">{profile.vehicle_type || 'N/A'}</span>
                  <span className="text-muted-foreground">Plan Tier:</span>
                  <span className="font-medium capitalize">{profile.plan_tier}</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button onClick={() => navigate("/")} className="flex-1">
                  Go to Dashboard
                </Button>
                <Button onClick={() => navigate("/profile")} variant="outline" className="flex-1">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-montserrat font-bold mb-2">
              <span className="text-brand-transit">Transit</span>
              <span className="text-brand-cares">Cares</span> Registration
            </h1>
            <p className="text-muted-foreground">Complete your one-time registration to get started</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  1
                </div>
                <span className="text-sm font-medium">Profile</span>
              </div>
              <div className="w-12 h-0.5 bg-muted" />
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Payment</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Please complete your profile information before proceeding with registration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {!profile?.full_name && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Full name is required</span>
                    </div>
                  )}
                  {!profile?.phone && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Phone number is required</span>
                    </div>
                  )}
                  {!profile?.vehicle_type && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Vehicle type is required</span>
                    </div>
                  )}
                  {!profile?.vehicle_id && (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm">Vehicle registration number is required</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => navigate("/profile")} 
                    className="flex-1"
                  >
                    Complete Profile
                  </Button>
                  {profile?.full_name && profile?.phone && profile?.vehicle_type && profile?.vehicle_id && (
                    <Button 
                      onClick={() => setStep(2)} 
                      variant="outline"
                      className="flex-1"
                    >
                      Continue to Payment
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Registration Fee Payment
                </CardTitle>
                <CardDescription>
                  One-time registration fee to activate your TransitCares account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">Registration Fee</span>
                    <span className="text-3xl font-bold text-foreground">₦5,000</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Lifetime account activation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Access to all insurance plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Priority customer support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Verified transporter status</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button 
                    onClick={() => setStep(1)} 
                    variant="outline"
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <PaystackPayment
                    amount={5000}
                    paymentType="registration"
                    onSuccess={() => {
                      toast.success("Registration Complete!", {
                        description: "Your account has been activated. Welcome to TransitCares!"
                      });
                      navigate("/");
                    }}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Pay ₦5,000 Registration Fee
                  </PaystackPayment>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Registration;
