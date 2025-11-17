import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
  Shield,
  Clock,
  Users
} from "lucide-react";
import { useNavigate } from "@/lib/navigation";
import logoImage from "@/assets/transitcares-logo.jpg";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="TransitCares Logo" className="h-10 w-10 object-contain" />
              <h3 className="font-montserrat font-bold text-xl">
                <span className="text-brand-transit">Transit</span>
                <span className="text-brand-cares">Cares</span>
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Protecting transport businesses across Nigeria with flexible, 
              daily premium insurance solutions tailored for tricycles, 
              minibuses, and buses.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Quick Links</h4>
            <nav className="space-y-2">
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                Insurance Plans
              </button>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('claims')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                Claims Center
              </button>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                Dashboard
              </button>
              <button onClick={() => { navigate('/'); setTimeout(() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' }), 100); }} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                Support
              </button>
              <button onClick={() => navigate('/mechanics')} className="block text-sm text-muted-foreground hover:text-primary transition-colors text-left">
                Approved Mechanics
              </button>
            </nav>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Services</h4>
            <nav className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Tricycle Insurance</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Minibus Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-3 w-3" />
                <span>Bus Protection</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>Claims Processing</span>
              </div>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Plot 123, Agege Motor Road<br />
                  Ikeja, Lagos State, Nigeria
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">+234 801 234 5678</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <p className="text-sm text-muted-foreground">support@transitcares.com</p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <p className="text-sm text-muted-foreground text-center md:text-left font-montserrat">
              © {currentYear} <span className="text-brand-transit">Transit</span><span className="text-brand-cares">Cares</span>. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Powered by <a href="https://realinks-global.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Realinks Global Resources</a>
            </p>
            <p className="text-xs text-muted-foreground">
              Built with 💚 by <a href="https://tech.zavolah.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">ZavTech</a>
            </p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-6 text-sm">
            <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="/cookies" className="text-muted-foreground hover:text-primary transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
