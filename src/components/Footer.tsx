import { Shield, Clock } from "lucide-react";
import { useState, useEffect } from "react";

const Footer = () => {
  const [countdown, setCountdown] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-primary mask-shimmer" />
            <span className="text-sm font-semibold text-foreground">Encryption Status:</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm text-success-foreground font-mono">Active</span>
            </div>
          </div>
          
          <div className="h-6 w-px bg-border hidden sm:block" />

          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-accent" />
            <span className="text-sm font-semibold text-foreground">Reveal Countdown:</span>
            <span className="text-sm font-mono text-primary glow">
              00:{countdown.toString().padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
