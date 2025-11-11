import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import Logo from "./Logo";

const Header = () => {
  const handleConnectWallet = () => {
    // Rainbow Wallet integration would go here
    console.log("Connect Rainbow Wallet");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <Button
            onClick={handleConnectWallet}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow transition-all"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
