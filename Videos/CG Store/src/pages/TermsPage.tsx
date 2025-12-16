import { Card, CardContent } from "@/components/ui/card";

const TermsPage = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card variant="glass">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Terms & Conditions</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 7, 2024</p>

            <div className="prose prose-slate max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-3">1. Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using the CBSE GUY website and services, you accept and agree to be bound 
                  by these Terms and Conditions. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Products and Services</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  CBSE GUY provides educational study materials in digital (PDF) and physical formats. Our products include:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Digital PDF books for instant download</li>
                  <li>Physical printed books delivered to your address</li>
                  <li>Combo packs including both formats</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Ordering and Payment</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  All orders are subject to the following conditions:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Payment must be made via UPI as specified during checkout</li>
                  <li>Orders are confirmed only after manual payment verification</li>
                  <li>Verification typically takes 2-24 hours</li>
                  <li>Digital products are delivered via email after verification</li>
                  <li>Physical products are shipped within 2-3 business days</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Pricing</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All prices are listed in Indian Rupees (INR). We reserve the right to modify prices at any 
                  time without prior notice. Prices at the time of order placement will be honored.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Refund Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Our refund policy varies by product type:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li><strong>Digital Products:</strong> No refunds once downloaded, unless there's a technical issue with the file.</li>
                  <li><strong>Physical Products:</strong> Refunds available within 7 days of delivery if the product is defective or damaged. Return shipping costs are borne by the customer for non-defective returns.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on CBSE GUY, including but not limited to text, graphics, logos, and study materials, 
                  is the property of CBSE GUY and protected by copyright laws. You may not reproduce, distribute, 
                  or create derivative works without our express written permission.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. User Conduct</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Users agree not to:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Share, resell, or redistribute purchased materials</li>
                  <li>Use the materials for commercial purposes</li>
                  <li>Attempt to circumvent any security measures</li>
                  <li>Provide false information during registration or checkout</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CBSE GUY shall not be liable for any indirect, incidental, special, or consequential damages 
                  arising out of or in connection with your use of our products or services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Changes to Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to update these Terms and Conditions at any time. Changes will be 
                  effective immediately upon posting to the website. Continued use of our services constitutes 
                  acceptance of the modified terms.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">10. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms, contact us at{" "}
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

export default TermsPage;
