import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Swords, TrendingUp, Theater } from "lucide-react";
import { useAccount } from "wagmi";
import { useToast } from "@/hooks/use-toast";

const gameModes = [
  {
    id: "debate",
    name: "Debate Arena",
    icon: Theater,
    description: "Argue positions and persuade others",
    players: "2-4 players",
    duration: "5 minutes",
    color: "text-primary"
  },
  {
    id: "trade",
    name: "Trading Floor",
    icon: TrendingUp,
    description: "Buy low, sell high, deceive competitors",
    players: "3-6 players",
    duration: "10 minutes",
    color: "text-secondary"
  },
  {
    id: "bluff",
    name: "Bluff Battle",
    icon: Swords,
    description: "Poker-style strategy and deception",
    players: "2-8 players",
    duration: "15 minutes",
    color: "text-accent"
  }
];

interface GameLobbyProps {
  onJoinGame: (mode: string) => void;
}

const GameLobby = ({ onJoinGame }: GameLobbyProps) => {
  const { address, isConnected } = useAccount();
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const handleJoinGame = (modeId: string) => {
    if (!isConnected) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to enter the arena",
        variant: "destructive"
      });
      return;
    }

    setSelectedMode(modeId);
    
    toast({
      title: "Entering Arena",
      description: "Your identity is being encrypted...",
    });

    setTimeout(() => {
      onJoinGame(modeId);
    }, 1500);
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-gradient">Choose Your Arena</h2>
          <p className="text-muted-foreground text-lg">
            Select a game mode and prepare to compete anonymously
          </p>
          {isConnected && address && (
            <div className="mt-4 inline-flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-primary/30">
              <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span className="text-sm font-mono text-muted-foreground">
                Identity: {address.slice(0, 6)}...{address.slice(-4)}
              </span>
              <Badge variant="outline" className="border-success/50 text-success">Encrypted</Badge>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {gameModes.map((mode) => {
            const Icon = mode.icon;
            return (
              <Card 
                key={mode.id}
                className={`cursor-pointer transition-all hover:border-primary/50 hover:shadow-glow ${
                  selectedMode === mode.id ? 'border-primary shadow-glow' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className={`h-10 w-10 ${mode.color} glow`} />
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-xl">{mode.name}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Players:</span>
                      <span className="font-medium">{mode.players}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{mode.duration}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleJoinGame(mode.id)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={selectedMode === mode.id}
                  >
                    {selectedMode === mode.id ? 'Entering...' : 'Join Arena'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-card border border-border/50 rounded-xl p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">How It Works</h3>
          <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
            Connect your wallet → Choose a game mode → Your identity is encrypted → 
            Compete with masked opponents → Round ends → Identities revealed
          </p>
        </div>
      </div>
    </section>
  );
};

export default GameLobby;
