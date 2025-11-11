import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ArenaStage from "@/components/ArenaStage";
import HowItWorks from "@/components/HowItWorks";
import GameLobby from "@/components/GameLobby";
import ActiveGame from "@/components/ActiveGame";
import Footer from "@/components/Footer";

const Index = () => {
  const [gameState, setGameState] = useState<'home' | 'lobby' | 'active'>('home');
  const [selectedGameMode, setSelectedGameMode] = useState<string>('');

  const handleEnterLobby = () => {
    setGameState('lobby');
  };

  const handleJoinGame = (mode: string) => {
    setSelectedGameMode(mode);
    setGameState('active');
  };

  const handleGameEnd = () => {
    setGameState('lobby');
  };

  const handleBackHome = () => {
    setGameState('home');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-16">
        {gameState === 'home' && (
          <>
            <Hero onEnterArena={handleEnterLobby} />
            <ArenaStage />
            <HowItWorks />
          </>
        )}
        
        {gameState === 'lobby' && (
          <GameLobby onJoinGame={handleJoinGame} />
        )}

        {gameState === 'active' && (
          <ActiveGame 
            gameMode={selectedGameMode} 
            onGameEnd={handleGameEnd}
          />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
