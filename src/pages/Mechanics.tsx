import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, Wrench } from "lucide-react";

const Mechanics = () => {
  const mechanics = [
    {
      id: 1,
      name: "Ola's Auto Repair",
      location: "Ikeja, Lagos",
      phone: "+234 803 456 7890",
      specialties: ["Engine", "Transmission", "Electrical"],
      rating: 4.8,
      verified: true
    },
    {
      id: 2,
      name: "Chief Mechanics Workshop",
      location: "Yaba, Lagos",
      phone: "+234 805 123 4567",
      specialties: ["Brakes", "Suspension", "Engine"],
      rating: 4.6,
      verified: true
    },
    {
      id: 3,
      name: "Express Auto Services",
      location: "Surulere, Lagos",
      phone: "+234 807 890 1234",
      specialties: ["Electrical", "AC Repair", "Engine"],
      rating: 4.9,
      verified: true
    },
    {
      id: 4,
      name: "Baba Musa Mechanic",
      location: "Mushin, Lagos",
      phone: "+234 806 234 5678",
      specialties: ["Transmission", "Clutch", "Gearbox"],
      rating: 4.7,
      verified: true
    },
    {
      id: 5,
      name: "Premium Auto Care",
      location: "Victoria Island, Lagos",
      phone: "+234 809 345 6789",
      specialties: ["All Repairs", "Diagnostics", "Maintenance"],
      rating: 4.9,
      verified: true
    },
    {
      id: 6,
      name: "Roadside Experts",
      location: "Ojota, Lagos",
      phone: "+234 804 567 8901",
      specialties: ["Engine", "Brakes", "Suspension"],
      rating: 4.5,
      verified: true
    }
  ];

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Approved Mechanics</h1>
          <p className="text-muted-foreground text-lg">
            Only repairs from these approved mechanics are eligible for claims. All mechanics are verified and meet our quality standards.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mechanics.map((mechanic) => (
            <Card key={mechanic.id} className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <CardTitle className="text-foreground">{mechanic.name}</CardTitle>
                  {mechanic.verified && (
                    <Badge variant="default" className="bg-green-500">
                      Verified
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-foreground">{mechanic.rating}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{mechanic.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{mechanic.phone}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wrench className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">Specialties:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {mechanic.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border rounded-lg p-6">
          <h2 className="text-2xl font-bold text-foreground mb-4">Important Notes</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Always use approved mechanics for repairs to ensure claim eligibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Request detailed invoices and keep all receipts for claim submission</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Take photos of the issue before and after repairs</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>Contact us within 24 hours of breakdown for faster claim processing</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Mechanics;
