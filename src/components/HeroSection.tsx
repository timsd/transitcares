import { Button } from "@/components/ui/button";
import { Shield, Clock, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-transport-street.png";
const HeroSection = () => {
  return <section className="relative min-h-[600px] bg-[var(--gradient-hero)] overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 opacity-20">
        <img src={heroImage} alt="Transport vehicles" className="w-full h-full object-cover" />
      </div>
      
      {/* Content */}
      <div className="relative container mx-auto px-4 py-20 bg-[#0a0100]/0">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            Stress-Free Vehicle Insurance for 
            <span className="text-transport-yellow"> Transport Business</span>
          </h1>
          
          <p className="text-lg sm:text-xl mb-8 leading-relaxed text-zinc-800">
            Daily premium insurance made easy for tricycles, minibuses, and buses. 
            Protect your transport business with affordable, flexible coverage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button variant="accent" size="xl" className="text-lg">Get covered in 5 minutes or less</Button>
            <Button variant="outline" size="xl" className="bg-background/10 border-primary-foreground/30 text-primary-foreground hover:bg-background/20 rounded-none">
              View Our Plans
            </Button>
          </div>
          
          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 bg-background/20 rounded-lg">
                <Shield className="h-5 w-5 bg-blue-500" />
              </div>
              <span className="font-medium text-blue-600">Instant Protection</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90 bg-white/0">
              <div className="p-2 bg-background/20 rounded-lg">
                <Clock className="h-5 w-5 bg-blue-600" />
              </div>
              <span className="font-medium text-blue-700">Daily Payments</span>
            </div>
            <div className="flex items-center gap-3 text-primary-foreground/90">
              <div className="p-2 rounded-lg bg-blue-600">
                <TrendingUp className="h-5 w-5" />
              </div>
              <span className="font-medium text-blue-700">Flexible Plans</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;