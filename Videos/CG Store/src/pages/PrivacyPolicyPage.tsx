import { Card, CardContent } from "@/components/ui/card";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card variant="glass">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 7, 2024</p>

            <div className="prose prose-slate max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-3">1. Introduction</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CBSE GUY ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                  explains how we collect, use, disclose, and safeguard your information when you visit our 
                  website and purchase our products.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We may collect information about you in a variety of ways, including:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Personal Data:</strong> Name, email address, phone number, and shipping address when you create an account or place an order.</li>
                  <li><strong>Payment Information:</strong> UPI transaction IDs and payment screenshots for order verification.</li>
                  <li><strong>Usage Data:</strong> Information about how you interact with our website, including pages visited and time spent.</li>
                  <li><strong>Device Information:</strong> Browser type, IP address, and device identifiers for security purposes.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. How We Use Your Information</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Provide customer support</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our website and services</li>
                  <li>Prevent fraud and ensure security</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your 
                  personal information. However, no electronic transmission over the Internet can be 
                  guaranteed to be 100% secure.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Third-Party Sharing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We do not sell, trade, or rent your personal information to third parties. We may share 
                  your information with trusted service providers who assist us in operating our website 
                  and fulfilling orders, subject to confidentiality agreements.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Access and receive a copy of your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your personal data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use cookies to enhance your browsing experience. You can choose to disable cookies 
                  through your browser settings, though this may affect some website functionality.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have questions about this Privacy Policy, please contact us at{" "}
                  <a href="mailto:support@cbseguy.com" className="text-primary hover:underline">
                    support@cbseguy.com
                  </a>
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
