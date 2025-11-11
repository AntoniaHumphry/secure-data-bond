import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Clock, Unlock, Trophy } from "lucide-react";
import { useAccount } from "wagmi";

interface Player {
  id: number;
  name: string;
  avatar: string;
  address?: string;
  score: number;
  isRevealed: boolean;
}

interface ActiveGameProps {
  gameMode: string;
  onGameEnd: () => void;
}

const ActiveGame = ({ gameMode, onGameEnd }: ActiveGameProps) => {
  const { address } = useAccount();
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [isRevealing, setIsRevealing] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: 1, name: "Anonymous Player", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", score: 0, isRevealed: false },
    { id: 2, name: "Anonymous Player", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka", score: 0, isRevealed: false },
    { id: 3, name: "Anonymous Player", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy", score: 0, isRevealed: false },
    { id: 4, name: "Anonymous Player", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max", score: 0, isRevealed: false },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleRoundEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleRoundEnd = () => {
    setIsRevealing(true);
    
    // Simulate score generation
    const updatedPlayers = players.map(player => ({
      ...player,
      score: Math.floor(Math.random() * 100) + 50
    }));
    setPlayers(updatedPlayers);

    // Reveal players one by one
    updatedPlayers.forEach((_, index) => {
      setTimeout(() => {
        setPlayers(prev => prev.map((p, i) => 
          i === index ? { 
            ...p, 
            isRevealed: true,
            name: `Player ${String.fromCharCode(65 + i)}`,
            address: `0x${Math.random().toString(16).slice(2, 10)}`
          } : p
        ));
      }, (index + 1) * 1000);
    });

    setTimeout(() => {
      // Game ends after all reveals
    }, (players.length + 2) * 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressValue = ((300 - timeRemaining) / 300) * 100;

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Game Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full border border-primary/30 mb-4">
            <Shield className="h-5 w-5 text-primary mask-shimmer" />
            <span className="text-lg font-bold">
              {gameMode.charAt(0).toUpperCase() + gameMode.slice(1)} Arena
            </span>
          </div>

          <div className="flex items-center justify-center gap-8 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-accent" />
              <span className="text-2xl font-mono font-bold text-primary">
                {formatTime(timeRemaining)}
              </span>
            </div>
            {isRevealing && (
              <div className="flex items-center gap-2 animate-fade-in">
                <Unlock className="h-5 w-5 text-success animate-pulse" />
                <span className="text-lg font-semibold text-success">Revealing...</span>
              </div>
            )}
          </div>

          <Progress value={progressValue} className="w-full max-w-md mx-auto h-2" />
        </div>

        {/* Players Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {players.map((player) => (
            <Card 
              key={player.id}
              className={`transition-all ${
                player.isRevealed 
                  ? 'border-success shadow-glow animate-scale-in' 
                  : 'border-border'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-primary/50">
                      <AvatarImage src={player.avatar} alt={player.name} />
                      <AvatarFallback>{player.name[0]}</AvatarFallback>
                    </Avatar>
                    {!player.isRevealed && !isRevealing && (
                      <div className="absolute inset-0 bg-background/90 backdrop-blur-sm rounded-full flex items-center justify-center mask-shimmer">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="text-center w-full">
                    <CardTitle className={`text-sm ${!player.isRevealed ? 'blur-sm' : ''}`}>
                      {player.name}
                    </CardTitle>
                    {player.isRevealed && player.address && (
                      <p className="text-xs text-muted-foreground font-mono mt-1">
                        {player.address}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {player.isRevealed ? (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Score:</span>
                    <Badge variant="outline" className="border-primary/50">
                      {player.score} pts
                    </Badge>
                  </div>
                ) : (
                  <div className="text-center">
                    <Badge variant="outline" className="border-warning/50 text-warning">
                      Encrypted
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Game Actions */}
        {!isRevealing ? (
          <Card className="bg-card/50 border-primary/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Trophy className="h-12 w-12 text-primary glow" />
                <div>
                  <h3 className="text-xl font-bold mb-2">Arena Active</h3>
                  <p className="text-muted-foreground">
                    Compete anonymously. Your identity and strategies remain hidden until the timer runs out.
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    variant="outline" 
                    className="border-primary/50"
                    onClick={() => {
                      // Simulate making a move
                    }}
                  >
                    Make Move
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={handleRoundEnd}
                  >
                    End Round (Debug)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/50 border-success/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center gap-4 text-center">
                <Unlock className="h-12 w-12 text-success glow animate-pulse" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gradient">Round Complete!</h3>
                  <p className="text-muted-foreground">
                    Smart contracts are decrypting identities. See who you truly played against.
                  </p>
                </div>
                <Button 
                  onClick={onGameEnd}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
                >
                  Return to Lobby
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Player Info */}
        {address && (
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Your Encrypted Address: <span className="font-mono text-primary">{address.slice(0, 6)}...{address.slice(-4)}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ActiveGame;
