import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageCircle, Clock, HeadphonesIcon, MessageSquare, Mail } from "lucide-react";
const SupportSection = () => {
  return <section id="support" className="py-16 bg-[var(--gradient-hero)]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            24/7 Support for Transport Professionals
          </h2>
          <p className="text-xl max-w-2xl mx-auto text-zinc-800">
            Whether it's vehicle damage, emergency assistance, or just questions about your plan, 
            our dedicated team is here to help you get back on the road.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Phone Support */}
          <Card className="bg-background/10 border-primary-foreground/20 text-primary-foreground">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-background/20 rounded-full w-fit mb-4">
                <Phone className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Call Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-zinc-800">
                Speak directly with our insurance experts for immediate assistance
              </p>
              <div className="space-y-2">
                <p className="font-bold text-lg">0800-AJO-SAFE</p>
                <p className="text-sm text-zinc-800">
                  Available 24/7 for emergencies
                </p>
              </div>
              <Button variant="accent" className="w-full">
                <Phone className="h-4 w-4" />
                Call Now
              </Button>
            </CardContent>
          </Card>

          {/* WhatsApp Support */}
          <Card className="bg-background/10 border-primary-foreground/20 text-primary-foreground">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-background/20 rounded-full w-fit mb-4">
                <MessageCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">WhatsApp Chat</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-zinc-800">
                Quick responses through WhatsApp for claims and general inquiries
              </p>
              <div className="space-y-2">
                <p className="font-bold text-lg">+234 701 234 5678</p>
                <p className="text-sm text-zinc-800">
                  Average response: 5 minutes
                </p>
              </div>
              <Button variant="success" className="w-full text-white">
                <MessageCircle className="h-4 w-4" />
                Chat on WhatsApp
              </Button>
            </CardContent>
          </Card>

          {/* Email Support */}
          <Card className="bg-background/10 border-primary-foreground/20 text-primary-foreground">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto p-3 bg-background/20 rounded-full w-fit mb-4">
                <Mail className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl">Email Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p className="text-zinc-800">
                Send detailed inquiries or document requests via email
              </p>
              <div className="space-y-2">
                <p className="font-bold text-lg">help@ajosaferide.com</p>
                <p className="text-sm text-zinc-800">
                  Response within 2 hours
                </p>
              </div>
              <Button variant="outline" className="w-full bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
                <Mail className="h-4 w-4" />
                Send Email
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Support Features */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background/10 border-primary-foreground/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <Clock className="h-5 w-5" />
                Emergency Response
              </CardTitle>
            </CardHeader>
            <CardContent className="text-primary-foreground/90">
              <p className="mb-4 text-zinc-800">
                In case of accidents or emergencies, our rapid response team is available 24/7 to:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="bg-zinc-500">• Coordinate with emergency services</li>
                <li className="bg-zinc-500">• Arrange immediate vehicle recovery</li>
                <li className="bg-zinc-500">• Provide on-scene assistance</li>
                <li className="bg-zinc-500">• Guide you through the claims process</li>
                <li className="bg-zinc-500">• Connect you with approved mechanics</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-background/10 border-primary-foreground/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary-foreground">
                <HeadphonesIcon className="h-5 w-5" />
                Dedicated Account Manager
              </CardTitle>
            </CardHeader>
            <CardContent className="text-primary-foreground/90">
              <p className="mb-4 text-zinc-800">
                Every transporter gets a personal account manager who understands your business:
              </p>
              <ul className="space-y-2 text-sm">
                <li className="bg-zinc-500">• Personalized service and advice</li>
                <li className="bg-zinc-500">• Regular check-ins and updates</li>
                <li className="bg-zinc-500">• Help optimize your coverage</li>
                <li className="bg-zinc-500">• Priority claim processing</li>
                <li className="bg-zinc-500">• Business growth consultation</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <p className="text-primary-foreground/90 mb-6">
            Need immediate assistance? We're here for you around the clock.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="accent" size="xl">
              <Phone className="h-5 w-5" />
              Emergency Hotline
            </Button>
            <Button variant="outline" size="xl" className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20">
              <MessageSquare className="h-5 w-5" />
              Live Chat
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default SupportSection;