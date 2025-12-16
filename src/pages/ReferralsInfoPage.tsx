import { Link } from "react-router-dom";
import { Users, Gift, Share2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const steps = [
  {
    icon: Share2,
    title: "Share Your Code",
    description: "Get your unique referral code from your dashboard and share it with friends, classmates, or on social media.",
  },
  {
    icon: Users,
    title: "Friend Makes a Purchase",
    description: "When your friend signs up and makes their first purchase using your referral code, they get 10% off.",
  },
  {
    icon: Gift,
    title: "You Earn Rewards",
    description: "You receive ₹50 credit for every successful referral that you can use on your next purchase.",
  },
];

const ReferralsInfoPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Refer Friends, Earn Rewards
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Share the gift of knowledge and earn rewards when your friends join CBSE GUY
          </p>
          <Link to="/login">
            <Button size="lg" variant="hero" className="gap-2">
              Login to Get Your Code
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <Card key={index} variant="glass" className="relative overflow-hidden">
                <CardContent className="p-8 text-center">
                  <div className="absolute top-4 right-4 text-6xl font-bold text-primary/10">
                    {index + 1}
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-turquoise-surf flex items-center justify-center mx-auto mb-6">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Why Refer Friends?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-primary mb-2">₹50</p>
                  <p className="text-muted-foreground">Credit per referral</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-turquoise-surf mb-2">10%</p>
                  <p className="text-muted-foreground">Discount for your friend</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-sky-aqua mb-2">Unlimited</p>
                  <p className="text-muted-foreground">Referrals allowed</p>
                </CardContent>
              </Card>
              <Card variant="glass">
                <CardContent className="p-6">
                  <p className="text-3xl font-bold text-blue-green mb-2">No Expiry</p>
                  <p className="text-muted-foreground">Credits never expire</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-muted-foreground mb-6">
            Login to your account to access your unique referral code and dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg">Login to Dashboard</Button>
            </Link>
            <Link to="/register">
              <Button size="lg" variant="outline">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReferralsInfoPage;
