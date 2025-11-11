import { Lock, Unlock } from "lucide-react";
import { useState } from "react";

interface DataNode {
  id: number;
  x: number;
  y: number;
  locked: boolean;
  label: string;
}

const DataPipeline = () => {
  const [nodes] = useState<DataNode[]>([
    { id: 1, x: 10, y: 50, locked: true, label: "Dataset A" },
    { id: 2, x: 35, y: 30, locked: true, label: "Dataset B" },
    { id: 3, x: 35, y: 70, locked: false, label: "Dataset C" },
    { id: 4, x: 60, y: 40, locked: true, label: "Analysis" },
    { id: 5, x: 85, y: 50, locked: false, label: "Results" },
  ]);

  return (
    <div className="relative w-full h-[400px] bg-card border border-border rounded-xl overflow-hidden">
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        
        {/* Draw connections */}
        <line x1="10%" y1="50%" x2="35%" y2="30%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="10%" y1="50%" x2="35%" y2="70%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="35%" y1="30%" x2="60%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="35%" y1="70%" x2="60%" y2="40%" stroke="url(#lineGradient)" strokeWidth="2" />
        <line x1="60%" y1="40%" x2="85%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" />
      </svg>

      {/* Data nodes */}
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 2,
          }}
        >
          <div
            className={`
              relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all
              ${
                node.locked
                  ? "bg-muted border-primary/50 shadow-[0_0_20px_hsl(var(--glow-primary)/0.3)]"
                  : "bg-success/10 border-success shadow-[0_0_20px_hsl(var(--success)/0.3)]"
              }
            `}
          >
            {node.locked ? (
              <Lock className="h-6 w-6 text-primary animate-pulse-glow" />
            ) : (
              <Unlock className="h-6 w-6 text-success" />
            )}
            <span className="text-xs font-semibold whitespace-nowrap text-foreground">
              {node.label}
            </span>
            <div
              className={`
                absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full
                ${node.locked ? "bg-primary animate-pulse-glow" : "bg-success"}
              `}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataPipeline;
