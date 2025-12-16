import { Card, CardContent } from "@/components/ui/card";

const EulaPage = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <Card variant="glass">
          <CardContent className="p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">End User License Agreement (EULA)</h1>
            <p className="text-muted-foreground mb-8">Last updated: December 7, 2024</p>

            <div className="prose prose-slate max-w-none space-y-6">
              <section>
                <h2 className="text-xl font-bold mb-3">1. License Grant</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CBSE GUY grants you a limited, non-exclusive, non-transferable license to use the purchased 
                  digital study materials for your personal, non-commercial educational purposes only.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">2. Scope of License</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  Under this license, you may:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Download and view the materials on up to 3 personal devices</li>
                  <li>Print one copy for personal study use</li>
                  <li>Make backup copies for personal archival purposes</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">3. Restrictions</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  You may NOT:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                  <li>Copy, modify, or distribute the materials to others</li>
                  <li>Sell, rent, lease, or sublicense the materials</li>
                  <li>Share your account or download links with others</li>
                  <li>Remove or alter any proprietary notices or watermarks</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Upload the materials to any file-sharing or cloud service for public access</li>
                  <li>Reverse engineer or attempt to extract source files</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">4. Ownership</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials are licensed, not sold. CBSE GUY retains all intellectual property rights, 
                  including copyrights, trademarks, and trade secrets. This license does not transfer any 
                  ownership rights to you.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">5. Digital Rights Management</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our digital materials may contain watermarks or other identification markers. These markers 
                  help protect against unauthorized distribution and must not be removed or altered.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">6. Download Limits</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Each digital purchase allows a maximum of 5 downloads per product. If you exceed this limit, 
                  please contact customer support. We reserve the right to restrict access if we detect 
                  unusual download patterns.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">7. Updates and Support</h2>
                <p className="text-muted-foreground leading-relaxed">
                  CBSE GUY may provide updates to purchased materials at our discretion. You will be notified 
                  of any significant updates via email. Technical support is available for download or 
                  access issues.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">8. Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This license is effective until terminated. CBSE GUY may terminate your license immediately 
                  if you fail to comply with any term of this agreement. Upon termination, you must destroy 
                  all copies of the materials in your possession.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">9. Disclaimer of Warranties</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The materials are provided "as is" without warranty of any kind. CBSE GUY does not guarantee 
                  that the materials will meet your specific requirements or that access will be uninterrupted.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">10. Limitation of Liability</h2>
                <p className="text-muted-foreground leading-relaxed">
                  In no event shall CBSE GUY be liable for any indirect, incidental, special, or consequential 
                  damages arising out of the use or inability to use the materials, even if we have been 
                  advised of the possibility of such damages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">11. Governing Law</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This agreement shall be governed by and construed in accordance with the laws of India. 
                  Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold mb-3">12. Contact</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about this EULA, contact us at{" "}
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

export default EulaPage;
