import { Button } from "@/components/ui/button";
import { Shield, Clock, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-transport-street.png";
const HeroSection = () => {
  return <section className="relative min-h-[600px] bg-[var(--gradient-hero)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-50">
        <img src={heroImage} alt="Transport vehicles" className="w-full h-full object-cover" />
      </div>
      
      {/* Content with dark overlay for better text visibility */}
      <div className="absolute inset-0 bg-background/60"></div>
      
      <div className="relative container mx-auto px-4 py-20 z-10">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight drop-shadow-sm">
            Flexible Vehicle Repairs Insurance for 
            <span className="text-transport-orange"> Transport Business</span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-8 leading-relaxed text-foreground/90 drop-shadow-sm">
            Daily premium repairs insurance made easy for tricycles, minibuses, and buses. 
            Protect your transport business with affordable, flexible vehicle repair coverage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="accent" size="xl" className="text-lg font-semibold">Get covered in 5 minutes or less</Button>
            <Button variant="outline" size="xl" className="bg-background/80 border-foreground/30 text-foreground hover:bg-background/90 font-semibold">
              View Our Plans
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-transport-blue rounded-lg">
                <Shield className="h-5 w-5 text-background" />
              </div>
              <span className="font-medium text-foreground drop-shadow-sm">Instant Protection</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-transport-green rounded-lg">
                <Clock className="h-5 w-5 text-background" />
              </div>
              <span className="font-medium text-foreground drop-shadow-sm">Daily Payments</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-transport-orange rounded-lg">
                <TrendingUp className="h-5 w-5 text-background" />
              </div>
              <span className="font-medium text-foreground drop-shadow-sm">Flexible Plans</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;