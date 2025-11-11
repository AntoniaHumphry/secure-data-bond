import { Key, ArrowRight } from "lucide-react";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Key className="h-4 w-4 text-primary" />
            <span>Key Transfer Status:</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
              <span className="text-sm text-success-foreground">Secure Channel Active</span>
            </div>
            <ArrowRight className="h-4 w-4 text-primary animate-pulse" />
            <div className="text-sm font-mono text-muted-foreground">
              0x7a8c...4f2e
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
