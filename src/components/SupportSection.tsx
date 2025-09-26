import { Button } from "@/components/ui/button";
import { Phone, MessageCircle, Mail } from "lucide-react";
import tricycleImage from "@/assets/tricycle.jpeg";
import busImage from "@/assets/bus.jpeg";
import minibusImage from "@/assets/minibus.jpeg";

const SupportSection = () => {
  return (
    <section id="support" className="py-20 bg-slate-900 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              We speak your language
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-lg">
              We translate insurance terms into everyday words so you don't spend another minute struggling with confusing options.
            </p>
            
            {/* Contact Buttons */}
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 transition-colors"
              >
                <Phone className="h-5 w-5 mr-2" />
                Call Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Chat With Us
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Web Chat
              </Button>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative">
            {/* Main circular container */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Large circle - Bus */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={busImage} 
                  alt="Commercial bus for transport insurance"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Medium circle - Minibus */}
              <div className="absolute bottom-8 left-8 w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={minibusImage} 
                  alt="Minibus for transport insurance"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Small circle - Tricycle */}
              <div className="absolute bottom-0 right-8 w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={tricycleImage} 
                  alt="Tricycle for transport insurance"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportSection;