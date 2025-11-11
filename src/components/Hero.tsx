import { Button } from "@/components/ui/button";
import { Shield, Database, Key } from "lucide-react";

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Collaborate Without Exposure
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Share encrypted datasets for collaboration. Decryption keys released only upon verified usage.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
            <div className="mb-4">
              <Shield className="h-12 w-12 text-primary glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
            <p className="text-muted-foreground">
              Your data stays encrypted until usage is verified through smart contracts
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
            <div className="mb-4">
              <Database className="h-12 w-12 text-secondary glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Data Pipeline</h3>
            <p className="text-muted-foreground">
              Visualize and control your data flow through encrypted nodes
            </p>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all">
            <div className="mb-4">
              <Key className="h-12 w-12 text-accent glow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Trustless Key Exchange</h3>
            <p className="text-muted-foreground">
              Rainbow Wallet integration ensures secure key transfers on-chain
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-lg text-lg px-8"
          >
            Get Started
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-primary/50 text-foreground hover:bg-primary/10 text-lg px-8"
          >
            Learn More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
