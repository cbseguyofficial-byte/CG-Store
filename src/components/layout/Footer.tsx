import { Link } from "react-router-dom";
import { BookOpen, Instagram, Send } from "lucide-react";

const footerLinks = {
  legal: [
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms & Conditions", href: "/terms-and-conditions" },
    { name: "EULA", href: "/eula" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Referrals", href: "/referrals" },
  ],
  shop: [
    { name: "All Books", href: "/shop" },
    { name: "Class 10", href: "/shop?class=10" },
    { name: "Class 12", href: "/shop?class=12" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border/40 gradient-footer">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-french-blue to-turquoise-surf shadow-button">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-deep-twilight">
                CBSE <span className="text-gradient">GUY</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium CBSE books and study resources for students. Curated by toppers, trusted by thousands.
            </p>
            <div className="flex gap-3">
              <a
                href="https://telegram.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <Send className="h-5 w-5 text-primary" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-card-hover"
              >
                <Instagram className="h-5 w-5 text-primary" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Shop</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="mb-4 font-semibold text-foreground">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border/40 pt-8">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} CBSE GUY. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
