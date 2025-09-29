import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Clock, HeadphonesIcon, MessageSquare, Mail } from "lucide-react";
import tricycleImage from "@/assets/tricycle.jpeg";
import busImage from "@/assets/bus.jpeg";
import minibusImage from "@/assets/minibus.jpeg";

const SupportSection = () => {
  return (
    <section id="support" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            We translate insurance terms into everyday words so you don't spend your little profit on repairs
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We speak your language - clear, simple communication about your vehicle repair coverage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-card border-border text-foreground">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden">
                <img 
                  src={tricycleImage} 
                  alt="Tricycle insurance" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-foreground">Call Us</CardTitle>
              <p className="text-muted-foreground">
                Speak directly to our support team for immediate assistance with your policy.
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Available 24/7 • English & Local Languages
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border text-foreground">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden">
                <img 
                  src={busImage} 
                  alt="Bus insurance" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-foreground">Chat With Us</CardTitle>
              <p className="text-muted-foreground">
                Quick WhatsApp support for claims, renewals, and policy questions.
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Fast Response • Share Photos • Voice Messages
                </p>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-card border-border text-foreground">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden">
                <img 
                  src={minibusImage} 
                  alt="Minibus insurance" 
                  className="w-full h-full object-cover"
                />
              </div>
              <CardTitle className="text-foreground">Web Chat</CardTitle>
              <p className="text-muted-foreground">
                Live chat support through our website for detailed assistance.
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Screen Sharing • Document Upload • Expert Guidance
                </p>
              </div>
              <Button variant="outline" className="w-full mt-4 bg-card border-border text-foreground hover:bg-muted">
                Start Web Chat
              </Button>
            </CardHeader>
          </Card>
        </div>

        {/* Additional Support Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <MessageCircle className="h-5 w-5 text-transport-blue" />
                Emergency Claims Hotline
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">24/7 emergency support for urgent repair claims. Get immediate assistance when your vehicle breaks down.</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-transport-green" />
                <span className="font-medium text-foreground">0800-REPAIR-NOW</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Clock className="h-5 w-5 text-transport-orange" />
                Business Hours Support
              </CardTitle>
            </CardHeader>
            <CardContent className="text-muted-foreground">
              <p className="mb-4">General inquiries, policy changes, and non-urgent support during regular business hours.</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-transport-blue" />
                  <span className="text-sm text-foreground">Mon-Fri: 8AM - 6PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-transport-blue" />
                  <span className="text-sm text-foreground">Sat: 9AM - 2PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-card p-8 rounded-lg border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Need Help Getting Started?
          </h3>
          <p className="text-muted-foreground mb-6">
            Our team is ready to help you choose the right repair insurance plan for your transport business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="font-semibold">
              Call Now: 0800-REPAIR
            </Button>
            <Button variant="outline" size="lg" className="bg-card border-border text-foreground hover:bg-muted font-semibold">
              Schedule a Callback
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;