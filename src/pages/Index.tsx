import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import UserDashboard from "@/components/UserDashboard";
import InsurancePlans from "@/components/InsurancePlans";
import ClaimsCenter from "@/components/ClaimsCenter";
import AdminSnapshot from "@/components/AdminSnapshot";
import SupportSection from "@/components/SupportSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UserDashboard />
        <InsurancePlans />
        <ClaimsCenter showRecent={false} />
        <AdminSnapshot />
        <SupportSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
