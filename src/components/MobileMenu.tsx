import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthAction = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
    setIsOpen(false);
  };

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-left">Menu</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col space-y-4 mt-8">
          <Button 
            variant="ghost" 
            className="justify-start text-left"
            onClick={() => handleNavClick('#dashboard')}
          >
            Dashboard
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-left"
            onClick={() => handleNavClick('#plans')}
          >
            Plans
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-left"
            onClick={() => handleNavClick('#claims')}
          >
            Claims
          </Button>
          <Button 
            variant="ghost" 
            className="justify-start text-left"
            onClick={() => handleNavClick('#support')}
          >
            Support
          </Button>
          
          <div className="pt-4 border-t border-border">
            {user && (
              <Button 
                variant="outline" 
                className="w-full mb-2 justify-start"
                onClick={() => {
                  navigate("/profile");
                  setIsOpen(false);
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            )}
            <Button 
              variant="transport" 
              className="w-full justify-start"
              onClick={handleAuthAction}
            >
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;