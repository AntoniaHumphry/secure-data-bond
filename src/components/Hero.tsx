import { Button } from "@/components/ui/button";
import { Theater, Shield, Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 relative overflow-hidden">
      {/* Stage spotlight effect */}
      <div className="absolute inset-0 stage-spotlight opacity-20 pointer-events-none" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Hide Your Face. Reveal Your Truth.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Join an anonymous arena where you debate, trade, or bluff. All identities remain encrypted until the round ends, ensuring pure strategy without social bias.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-glow">
            <div className="mb-4">
              <Theater className="h-12 w-12 text-primary glow mask-shimmer" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Anonymous Play</h3>
            <p className="text-muted-foreground">
              Digital masks encrypt your identity during gameplay, revealing only after the match ends
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-glow">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-secondary glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Pure Strategy</h3>
            <p className="text-muted-foreground">
              No social bias. No reputation influence. Only your moves matter in the arena
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-glow">
            <div className="mb-4">
              <Sparkles className="h-12 w-12 text-accent glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Grand Reveal</h3>
            <p className="text-muted-foreground">
              Decrypt and discover who you really played against at the end of each round
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-lg text-lg px-8 mask-shimmer"
          >
            Join Arena
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8"
          >
            Watch Replay
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
