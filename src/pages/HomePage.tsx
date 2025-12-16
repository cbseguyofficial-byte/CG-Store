import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, CheckCircle, Gift, Sparkles, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/shop/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  {
    icon: Star,
    title: "Curated by Toppers",
    description: "All content is created and verified by top scorers and experts.",
  },
  {
    icon: Zap,
    title: "Instant Digital Access",
    description: "Get PDFs delivered to your email within minutes of verification.",
  },
  {
    icon: CheckCircle,
    title: "Verified & Updated",
    description: "Latest syllabus coverage with regular updates and corrections.",
  },
  {
    icon: Gift,
    title: "Referral Rewards",
    description: "Earn discounts when your friends buy using your referral code.",
  },
];

// Generate categories from live products data
const classIcons: Record<string, string> = {
  "8": "📚",
  "9": "📖",
  "10": "📝",
  "11": "🎯",
  "12": "🏆",
  "11-12": "⚡",
};

export default function HomePage() {
  const { data: products, isLoading } = useProducts();
  const { isAuthenticated, signInWithGoogle } = useAuth();
  // Generate categories dynamically from products
  const categories = useMemo(() => {
    if (!products) return [];
    
    const classCounts = products.reduce((acc, product) => {
      const className = product.class;
      acc[className] = (acc[className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(classCounts)
      .map(([className, count]) => ({
        id: className,
        name: `Class ${className}`,
        icon: classIcons[className] || "📘",
        productCount: count,
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.id.replace("-", ""));
        const bNum = parseInt(b.id.replace("-", ""));
        return aNum - bNum;
      });
  }, [products]);

  const bestSellers = products?.filter((p) => p.badges?.includes("Best Seller")).slice(0, 4) || [];
  const newProducts = products?.filter((p) => p.badges?.includes("New")).slice(0, 4) || [];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center gradient-hero overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-turquoise-surf/20 blur-3xl animate-pulse-soft" />
          <div className="absolute -right-20 top-1/2 h-80 w-80 rounded-full bg-sky-aqua/20 blur-3xl animate-pulse-soft stagger-2" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-frosted-blue/20 blur-3xl animate-pulse-soft stagger-3" />
        </div>

        {/* Floating book cards */}
        <div className="absolute right-10 top-1/4 hidden lg:block animate-float">
          <div className="h-48 w-36 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl rotate-12" />
        </div>
        <div className="absolute right-32 top-1/2 hidden lg:block animate-float stagger-2">
          <div className="h-56 w-40 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl -rotate-6" />
        </div>

        <div className="container relative z-10 py-20 lg:py-32">
          <div className="max-w-3xl">
            <Badge variant="glass" className="mb-6 animate-fade-in">
              <Sparkles className="mr-1 h-3 w-3" />
              Trusted by 10,000+ Students
            </Badge>
            
            <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl animate-slide-up">
              Premium CBSE Books & Resources by{" "}
              <span className="text-sky-aqua">CBSE GUY</span>
            </h1>
            
            <p className="mb-8 text-lg text-light-cyan/90 md:text-xl animate-slide-up stagger-1">
              Get the best study materials for CBSE students. Digital PDFs and physical books curated by top scorers, with instant delivery and secure payment.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link to="/shop">
                <Button variant="hero" size="xl" className="group">
                  Explore Books
                  <ArrowRight className="transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              {!isAuthenticated && (
  <Button
    variant="hero-outline"
    size="xl"
    onClick={signInWithGoogle}
  >
    Sign In
  </Button>
)}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Browse by Class
            </h2>
            <p className="text-muted-foreground">
              Find study materials organized by class for easy navigation
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardContent className="p-6 text-center">
                    <Skeleton className="h-10 w-10 mx-auto mb-3" />
                    <Skeleton className="h-4 w-20 mx-auto" />
                  </CardContent>
                </Card>
              ))
            ) : categories.length > 0 ? (
              categories.map((category, index) => (
                <Link key={category.id} to={`/shop?class=${category.id}`}>
                  <Card
                    variant="interactive"
                    className={`group text-center animate-fade-in stagger-${Math.min(index + 1, 5)}`}
                  >
                    <CardContent className="p-6">
                      <div className="mb-3 text-4xl">{category.icon}</div>
                      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {category.productCount} books
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <p className="col-span-6 text-center text-muted-foreground">No categories available yet.</p>
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-16 bg-muted/30 lg:py-24">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
                Best Sellers
              </h2>
              <p className="text-muted-foreground">
                Most popular books loved by students
              </p>
            </div>
            <Link to="/shop">
              <Button variant="outline" className="hidden sm:flex">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[3/4]" />
                  <CardContent className="p-4 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardContent>
                </Card>
              ))
            ) : bestSellers.length > 0 ? (
              bestSellers.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))
            ) : (
              <p className="col-span-4 text-center text-muted-foreground">No best sellers yet.</p>
            )}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Link to="/shop">
              <Button variant="outline">
                View All Books
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why CBSE GUY */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Why CBSE GUY?
            </h2>
            <p className="text-muted-foreground">
              What makes us the preferred choice for CBSE students
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                variant="gradient"
                className={`animate-fade-in stagger-${Math.min(index + 1, 5)}`}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-turquoise-surf to-sky-aqua">
                    <feature.icon className="h-6 w-6 text-deep-twilight" />
                  </div>
                  <h3 className="mb-2 font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      {(isLoading || newProducts.length > 0) && (
        <section className="py-16 bg-muted/30 lg:py-24">
          <div className="container">
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground">
                  Latest 2025 edition books just added
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="aspect-[3/4]" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                  </Card>
                ))
              ) : (
                newProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Referral Section */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <Card variant="elevated" className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <CardContent className="p-8 lg:p-12">
                <Badge variant="accent" className="mb-4">
                  <Gift className="mr-1 h-3 w-3" />
                  Referral Program
                </Badge>
                <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
                  Earn Rewards with Referrals
                </h2>
                <p className="mb-6 text-muted-foreground">
                  Share your unique referral code with friends. When they make a purchase, you both earn discounts on your next order!
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/referrals">
                    <Button>
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/auth">
                    <Button variant="outline">Get Your Code</Button>
                  </Link>
                </div>
              </CardContent>
              <div className="relative hidden lg:block">
                <div className="absolute inset-0 gradient-hero opacity-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-9xl">🎁</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 gradient-hero lg:py-24">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
            Ready to Ace Your Exams?
          </h2>
          <p className="mb-8 text-lg text-light-cyan/90">
            Join thousands of students who trust CBSE GUY for their exam preparation.
          </p>
          <Link to="/shop">
            <Button variant="hero" size="xl" className="group">
              Start Shopping
              <ArrowRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
