import { Button } from "@/components/ui/button";
import { User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "@/lib/navigation";
import MobileMenu from "./MobileMenu";
import iconSmall from "@/assets/apple-touch-icon.png";
import iconMedium from "@/assets/android-chrome-192x192.png";
import iconLarge from "@/assets/android-chrome-512x512.png";

const Header = () => {
  const { user, signOut, isAdmin } = useAuth();
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
          <button className="flex items-center gap-3" onClick={() => navigate('/')}
            aria-label="Go to home">
            <picture>
              <source media="(min-width: 1024px)" srcSet={iconLarge} />
              <source media="(min-width: 768px)" srcSet={iconMedium} />
              <img
                src={iconSmall}
                alt="TransitCares Logo"
                className="h-9 w-auto object-contain"
                width={36}
                height={36}
                decoding="async"
                fetchpriority="high"
              />
            </picture>
            <div>
              <h1 className="font-montserrat font-bold text-xl">
                <span className="text-brand-transit">Transit</span>
                <span className="text-brand-cares">Cares</span>
              </h1>
              <p className="text-xs text-muted-foreground">Vehicle Repairs Insurance</p>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-foreground hover:text-primary transition-colors"
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
              Dashboard
            </button>
            <button className="text-foreground hover:text-primary transition-colors"
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
              Plans
            </button>
            <button className="text-foreground hover:text-primary transition-colors"
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('claims')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
              Claims
            </button>
            <button className="text-foreground hover:text-primary transition-colors"
              onClick={() => navigate('/mechanics')}>
              Mechanics
            </button>
            <button className="text-foreground hover:text-primary transition-colors"
              onClick={() => { navigate('/'); setTimeout(() => document.getElementById('support')?.scrollIntoView({ behavior: 'smooth' }), 100); }}>
              Support
            </button>
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
            {isAdmin && (
              <Button 
                variant="outline" 
                size="sm" 
                className="hidden md:flex"
                onClick={() => navigate("/admin")}
              >
                Admin
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
