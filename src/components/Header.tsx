import { Button } from "@/components/ui/button";
import { Truck, Menu, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

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
          <div className="flex items-center gap-2">
            <div className="p-2 bg-[var(--gradient-hero)] rounded-lg">
              <Truck className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-xl text-foreground">AjoSafeRide</h1>
              <p className="text-xs text-muted-foreground">Vehicle Insurance</p>
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
            <a href="#support" className="text-foreground hover:text-primary transition-colors">
              Support
            </a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            {user && (
              <Button variant="outline" size="sm" className="hidden md:flex">
                <User className="h-4 w-4" />
                Profile
              </Button>
            )}
            <Button variant="transport" size="sm" onClick={handleAuthAction}>
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