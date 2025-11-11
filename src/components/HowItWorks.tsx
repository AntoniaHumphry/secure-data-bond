import { Upload, Lock, CheckCircle, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Dataset",
    description: "Encrypt and upload your dataset to the decentralized network",
  },
  {
    icon: Lock,
    title: "Set Access Rules",
    description: "Define who can access your data and under what conditions",
  },
  {
    icon: CheckCircle,
    title: "Verify Usage",
    description: "Smart contracts verify legitimate data usage automatically",
  },
  {
    icon: Download,
    title: "Release Keys",
    description: "Decryption keys are released only after verification",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gradient">
          How It Works
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all h-full">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 border border-primary/30">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold glow">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
