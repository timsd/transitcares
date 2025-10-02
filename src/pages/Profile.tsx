import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SecuritySettings from "@/components/SecuritySettings";
import { ArrowLeft, Upload, Camera } from "lucide-react";

const Profile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [vehiclePhoto, setVehiclePhoto] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    vehicle_type: '',
    vehicle_id: '',
    vehicle_color: '',
    chassis_number: '',
    designated_route: '',
    plan_tier: 'bronze'
  });

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        vehicle_type: profile.vehicle_type || '',
        vehicle_id: profile.vehicle_id || '',
        vehicle_color: (profile as any).vehicle_color || '',
        chassis_number: (profile as any).chassis_number || '',
        designated_route: (profile as any).designated_route || '',
        plan_tier: profile.plan_tier || 'bronze'
      });
    }
  }, [user, profile, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVehiclePhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update(formData)
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success("Profile updated successfully", {
        description: "Your vehicle information has been saved.",
      });
    } catch (error: any) {
      toast.error("Error updating profile", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
              <p className="text-muted-foreground">Manage your account, vehicle information, and security</p>
            </div>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile & Vehicle</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Vehicle Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="vehicle_photo">Vehicle Photo</Label>
                      <div className="mt-2">
                        <input
                          type="file"
                          id="vehicle_photo"
                          accept="image/*"
                          onChange={(e) => setVehiclePhoto(e.target.files?.[0] || null)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('vehicle_photo')?.click()}
                          className="w-full"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          {vehiclePhoto ? vehiclePhoto.name : 'Upload Vehicle Photo'}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="vehicle_type">Vehicle Type</Label>
                      <Select 
                        value={formData.vehicle_type} 
                        onValueChange={(value) => handleInputChange('vehicle_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select vehicle type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tricycle">Tricycle</SelectItem>
                          <SelectItem value="minibus">Minibus</SelectItem>
                          <SelectItem value="bus">Bus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="vehicle_id">Vehicle Registration Number</Label>
                      <Input
                        id="vehicle_id"
                        value={formData.vehicle_id}
                        onChange={(e) => handleInputChange('vehicle_id', e.target.value)}
                        placeholder="e.g., LAG-123-XY"
                      />
                    </div>

                    <div>
                      <Label htmlFor="chassis_number">Chassis Number</Label>
                      <Input
                        id="chassis_number"
                        value={formData.chassis_number}
                        onChange={(e) => handleInputChange('chassis_number', e.target.value)}
                        placeholder="Enter chassis number"
                      />
                    </div>

                    <div>
                      <Label htmlFor="vehicle_color">Vehicle Color</Label>
                      <Input
                        id="vehicle_color"
                        value={formData.vehicle_color}
                        onChange={(e) => handleInputChange('vehicle_color', e.target.value)}
                        placeholder="e.g., Yellow, Blue, Green"
                      />
                    </div>

                    <div>
                      <Label htmlFor="designated_route">Designated Route</Label>
                      <Textarea
                        id="designated_route"
                        value={formData.designated_route}
                        onChange={(e) => handleInputChange('designated_route', e.target.value)}
                        placeholder="e.g., Ikeja to Victoria Island"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="plan_tier">Insurance Plan</Label>
                      <Select 
                        value={formData.plan_tier} 
                        onValueChange={(value) => handleInputChange('plan_tier', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bronze">Bronze Plan</SelectItem>
                          <SelectItem value="silver">Silver Plan</SelectItem>
                          <SelectItem value="gold">Gold Plan</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex gap-4">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate("/")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <SecuritySettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;