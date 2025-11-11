import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArenaStage from "@/components/ArenaStage";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16">
        <Hero />
        <ArenaStage />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
