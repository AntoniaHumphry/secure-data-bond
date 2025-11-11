import DataPipeline from "./DataPipeline";

const PipelineSection = () => {
  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto max-w-6xl">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-6 text-gradient">
          Data Pipeline Visualization
        </h2>
        <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
          Monitor your encrypted datasets and track key transfers in real-time
        </p>
        <DataPipeline />
      </div>
    </section>
  );
};

export default PipelineSection;
