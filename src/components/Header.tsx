import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import MobileMenu from "./MobileMenu";
import logoImage from "@/assets/transitcares-logo.jpg";

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="bg-background border-b border-border shadow-[var(--shadow-soft)] sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logoImage} alt="TransitCares Logo" className="h-12 w-12 object-contain" />
            <div>
              <h1 className="font-montserrat font-bold text-xl">
                <span className="text-brand-transit">Transit</span>
                <span className="text-brand-cares">Cares</span>
              </h1>
              <p className="text-xs text-muted-foreground">Vehicle Repairs Insurance</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#dashboard" className="text-foreground hover:text-primary transition-colors">
              Dashboard
            </a>
            <a href="#plans" className="text-foreground hover:text-primary transition-colors">
              Plans
            </a>
            <a href="#claims" className="text-foreground hover:text-primary transition-colors">
              Claims
            </a>
            <a href="/mechanics" className="text-foreground hover:text-primary transition-colors">
              Mechanics
            </a>
            <a href="#support" className="text-foreground hover:text-primary transition-colors">
              Support
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <MobileMenu />
            {user && (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            )}
            <Button variant="transport" size="sm" onClick={handleAuthAction} className="hidden md:flex">
              {user ? (
                <>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;