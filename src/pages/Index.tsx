import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PipelineSection from "@/components/PipelineSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16">
        <Hero />
        <PipelineSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
