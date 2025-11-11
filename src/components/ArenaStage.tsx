import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const players = [
  { id: 1, name: "Player 1", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", encrypted: true },
  { id: 2, name: "Player 2", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", encrypted: true },
  { id: 3, name: "Player 3", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy", encrypted: true },
  { id: 4, name: "Player 4", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", encrypted: true },
];

const ArenaStage = () => {
  const [revealCountdown, setRevealCountdown] = useState(24);

  useEffect(() => {
    const timer = setInterval(() => {
      setRevealCountdown(prev => (prev > 0 ? prev - 1 : 24));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Live Arena</h2>
          <p className="text-muted-foreground text-lg">
            Watch as masked players compete in real-time
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8 relative overflow-hidden">
          {/* Stage background effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex flex-col items-center gap-3 p-4 bg-background/50 rounded-xl border border-border/50 hover:border-primary/50 transition-all"
                >
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-primary/50">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    {player.encrypted && (
                      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center mask-shimmer">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2C10.8954 2 10 2.89543 10 4V6H8C6.89543 6 6 6.89543 6 8V20C6 21.1046 6.89543 22 8 22H16C17.1046 22 18 21.1046 18 20V8C18 6.89543 17.1046 6 16 6H14V4C14 2.89543 13.1046 2 12 2Z"
                            fill="hsl(var(--primary))"
                            opacity="0.8"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm blur-sm select-none">???</p>
                    <Badge variant="outline" className="mt-2 text-xs border-primary/50">
                      Encrypted
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-background/70 px-6 py-3 rounded-full border border-primary/30">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                <span className="text-sm text-muted-foreground">
                  Identities reveal in:{" "}
                  <span className="text-primary font-mono font-bold">
                    00:{revealCountdown.toString().padStart(2, "0")}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-muted-foreground">
            Current Round: Debate • Stakes: High • Format: 1v1v1v1
          </p>
        </div>
      </div>
    </section>
  );
};

export default ArenaStage;
