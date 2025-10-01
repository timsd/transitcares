import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cookies = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Cookie Policy</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Last Updated: January 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-muted-foreground">
              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">What Are Cookies</h2>
                <p>
                  Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                  They are widely used to make websites work more efficiently and provide information to website owners.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">How We Use Cookies</h2>
                <p className="mb-3">TransitCares uses cookies for the following purposes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function properly. They enable core functionality such as security, authentication, and session management.</li>
                  <li><strong>Performance Cookies:</strong> These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.</li>
                  <li><strong>Functionality Cookies:</strong> These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.</li>
                  <li><strong>Authentication Cookies:</strong> These cookies keep you logged in and maintain your session securely.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Session Cookies</h3>
                    <p>
                      Temporary cookies that expire when you close your browser. These are essential for authentication and secure access to your account.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Persistent Cookies</h3>
                    <p>
                      Cookies that remain on your device for a set period or until you delete them. These help us remember your preferences and improve your user experience.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Third-Party Cookies</h3>
                    <p>
                      We may use third-party services like Paystack for payment processing, which may set their own cookies. Please refer to their privacy policies for more information.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Managing Cookies</h2>
                <p className="mb-3">
                  You can control and manage cookies in various ways. Please note that removing or blocking cookies may impact your user experience and some features may no longer be fully functional.
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Browser Settings:</strong> Most browsers allow you to view, manage, and delete cookies through their settings.</li>
                  <li><strong>Opt-Out:</strong> You can opt out of certain cookies by adjusting your preferences in your account settings.</li>
                  <li><strong>Do Not Track:</strong> Some browsers include a "Do Not Track" feature. Our website respects these settings where technically feasible.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Cookies Used by TransitCares</h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-border">
                    <thead>
                      <tr className="bg-muted">
                        <th className="border border-border p-3 text-left">Cookie Name</th>
                        <th className="border border-border p-3 text-left">Purpose</th>
                        <th className="border border-border p-3 text-left">Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-border p-3">sb-access-token</td>
                        <td className="border border-border p-3">Authentication and session management</td>
                        <td className="border border-border p-3">Session</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">sb-refresh-token</td>
                        <td className="border border-border p-3">Session refresh and security</td>
                        <td className="border border-border p-3">Persistent</td>
                      </tr>
                      <tr>
                        <td className="border border-border p-3">user-preferences</td>
                        <td className="border border-border p-3">Store user preferences and settings</td>
                        <td className="border border-border p-3">1 year</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Your Consent</h2>
                <p>
                  By using our website, you consent to our use of cookies in accordance with this Cookie Policy. 
                  If you do not agree to our use of cookies, you should disable them by changing your browser settings 
                  or discontinue use of our website.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Updates to This Policy</h2>
                <p>
                  We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, 
                  operational, or regulatory reasons. We encourage you to review this page periodically for the latest 
                  information on our cookie practices.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">Contact Us</h2>
                <p className="mb-3">
                  If you have any questions about our use of cookies, please contact us at:
                </p>
                <ul className="space-y-1">
                  <li><strong>Email:</strong> support@transitcares.com</li>
                  <li><strong>Phone:</strong> +234 801 234 5678</li>
                  <li><strong>Address:</strong> Plot 123, Agege Motor Road, Ikeja, Lagos State, Nigeria</li>
                </ul>
              </section>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Cookies;
