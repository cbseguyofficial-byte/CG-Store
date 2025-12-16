import { Link } from "react-router-dom";
import { Home, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const humorousMessages = [
  "Our website stopped working… but your studying shouldn't 😭📚",
  "Damn, our server can't even open a book. Can you? 🙂",
  "Looks like even our server is tired of studying 😩",
  "This page is missing… just like half your syllabus.",
  "Server be like: 'Aaj mood nahi hai.' 😭",
  "Even our servers need a break — unlike your exams.",
  "Error 503: Server bunked the class.",
  "Page not found — teacher said it's out of syllabus.",
  "Aur do Modi ko vote 😭",
  "Relax, it's just an error. Unlike CBSE boards.",
  "This page ran away. Probably to Kota.",
  "Server crashed harder than your physics exam.",
  "This page is buffering… like your life decisions.",
  "Error 404: The page got promoted without passing.",
  "Even the server couldn't handle CBSE pressure.",
  "Who took this page? Check your group project partner.",
  "This page failed its unit test.",
  "Server is revising… come back after exams.",
  "404: Page not found. But your stress? Always found.",
  "The server has gone to drink chai. Will be back soon.",
];

const randomMessage = humorousMessages[Math.floor(Math.random() * humorousMessages.length)];

const Error503 = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4">
      <div className="text-center max-w-2xl mx-auto animate-fade-in">
        {/* Icon */}
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-500 to-french-blue shadow-glow animate-float">
          <Coffee className="h-12 w-12 text-white" />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-amber-400 via-turquoise-surf to-sky-aqua bg-clip-text text-transparent mb-4 tracking-tight">
          503
        </h1>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-light-cyan mb-6">
          Server Skipped Class
        </h2>

        {/* Humorous Message */}
        <p className="text-lg md:text-xl text-frosted-blue mb-10 leading-relaxed">
          {randomMessage}
        </p>

        {/* Back to Home Button */}
        <Link to="/">
          <Button size="xl" variant="hero" className="gap-3 shadow-glow">
            <Home className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>

        {/* Decorative Elements */}
        <div className="mt-16 flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-amber-400/50"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Error503;
