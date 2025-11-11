import { Shield, Users, Unlock, Trophy } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Enter Masked",
    description: "Connect your Rainbow Wallet and join the arena with an encrypted identity. No one knows who you are.",
  },
  {
    icon: Shield,
    title: "Play Anonymously",
    description: "Debate, trade, or bluff your way through the match. Your mask keeps your identity hidden from all players.",
  },
  {
    icon: Unlock,
    title: "Round Ends",
    description: "When time expires, smart contracts trigger the decryption sequence, revealing all player identities.",
  },
  {
    icon: Trophy,
    title: "Truth Revealed",
    description: "Discover who you played against. Review strategies. Learn from the reveal. Then mask up for the next round.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gradient">How It Works</h2>
          <p className="text-muted-foreground text-lg">
            Four simple steps from masked entry to grand reveal
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all hover:shadow-glow"
              >
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm glow">
                  {index + 1}
                </div>
                <div className="mb-4 mt-2">
                  <Icon className="h-10 w-10 text-primary glow" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-card border border-primary/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-3 text-gradient">Pure Strategy, Zero Bias</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            MaskArena eliminates social influence, reputation, and prejudice. Every match is judged purely on skill, 
            wit, and strategy. Only after the round ends do you learn who you truly faced.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
