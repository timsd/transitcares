import { Button } from "@/components/ui/button";
import { useNavigate } from "@/lib/navigation";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
        
        <div className="prose prose-slate max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using TransitCare's vehicle repair insurance services, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
            <p className="text-muted-foreground">
              TransitCare provides flexible, daily premium vehicle repair insurance for tricycles, minibuses, and buses operating in Nigeria. 
              Our coverage is specifically for mechanical repairs and breakdowns, not for accidents or collisions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Coverage Scope</h2>
            <p className="text-muted-foreground mb-2">
              <strong>What is Covered:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Engine repairs and mechanical breakdowns</li>
              <li>Transmission and gearbox issues</li>
              <li>Electrical system failures</li>
              <li>Brake system repairs</li>
              <li>Suspension and steering repairs</li>
            </ul>
            <p className="text-muted-foreground mb-2 mt-4">
              <strong>What is NOT Covered:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Accidents or collision damage</li>
              <li>Routine maintenance and servicing</li>
              <li>Wear and tear items (brake pads, tires, etc.)</li>
              <li>Damages from driver negligence</li>
              <li>Pre-existing conditions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Premium Payments</h2>
            <p className="text-muted-foreground">
              Premiums are paid daily and must be maintained for continued coverage. Failure to pay daily premiums will result in 
              suspension of coverage. Claims can only be filed after maintaining 5 consecutive days of premium payments.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Claims Process</h2>
            <p className="text-muted-foreground">
              To file a claim, you must submit a repair invoice from an approved mechanic, along with photographs of the damage 
              and relevant documentation. Claims are processed within 48 hours of submission with all required documents.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. User Responsibilities</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Provide accurate vehicle information during registration</li>
              <li>Maintain daily premium payments</li>
              <li>Use only approved mechanics for repairs</li>
              <li>Submit complete and truthful claim documentation</li>
              <li>Notify TransitCare within 24 hours of a breakdown</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">7. Account Termination</h2>
            <p className="text-muted-foreground">
              TransitCare reserves the right to terminate accounts for fraudulent claims, provision of false information, 
              or violation of these terms. Users may cancel their coverage at any time through their dashboard.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              TransitCare's liability is limited to the coverage amount specified in your chosen plan tier. We are not 
              responsible for consequential damages, loss of income, or business interruption.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. Users will be notified of significant changes 
              via email and continued use of the service constitutes acceptance of modified terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <p className="text-muted-foreground">
              For questions about these terms, please contact us at support@transitcare.com or call +234 801 234 5678.
            </p>
          </section>

          <p className="text-sm text-muted-foreground mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;
