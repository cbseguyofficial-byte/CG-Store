import { BookOpen, Users, Shield, Award, Target, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const values = [
  {
    icon: BookOpen,
    title: "Quality Content",
    description: "Every book is curated by subject experts and toppers to ensure accuracy and relevance.",
  },
  {
    icon: Users,
    title: "Student-First Approach",
    description: "We design everything keeping students' needs, learning patterns, and exam requirements in mind.",
  },
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "Clear pricing, genuine reviews, and transparent policies. No hidden charges, ever.",
  },
  {
    icon: Award,
    title: "Excellence in Education",
    description: "Committed to helping every student achieve their academic goals and beyond.",
  },
];

const timeline = [
  { year: "2020", title: "The Beginning", description: "Started as a small initiative to help CBSE students with quality study materials." },
  { year: "2021", title: "Digital Launch", description: "Launched our digital platform with PDF books for instant access." },
  { year: "2022", title: "Growing Community", description: "Reached 10,000+ students and expanded to cover all major subjects." },
  { year: "2023", title: "Physical Books", description: "Added physical book delivery to serve students who prefer printed materials." },
  { year: "2024", title: "2025 Editions", description: "Released comprehensive 2025 edition books with updated syllabus coverage." },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-hero py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            About CBSE GUY
          </h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Empowering CBSE students with premium study materials since 2020
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <Target className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              To make high-quality CBSE study materials accessible to every student across India. 
              We believe that quality education resources shouldn't be a privilege – they should be 
              available to everyone who seeks to learn and excel in their academic journey.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Students Trust Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} variant="glass" className="hover-lift">
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-turquoise-surf flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {item.year.slice(2)}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-2" />
                  )}
                </div>
                <div className="pb-8">
                  <p className="text-sm text-primary font-medium">{item.year}</p>
                  <h3 className="text-lg font-bold mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 gradient-hero">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">50K+</p>
              <p className="text-primary-foreground/70 mt-2">Happy Students</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">200+</p>
              <p className="text-primary-foreground/70 mt-2">Study Materials</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">4.8★</p>
              <p className="text-primary-foreground/70 mt-2">Average Rating</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-bold text-primary-foreground">98%</p>
              <p className="text-primary-foreground/70 mt-2">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Spirit */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <Heart className="h-12 w-12 text-destructive mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Made with Love for Students</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            CBSE GUY is built by a team of educators, toppers, and tech enthusiasts who 
            understand the challenges students face. We're constantly improving our materials 
            based on student feedback and changing exam patterns.
          </p>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
