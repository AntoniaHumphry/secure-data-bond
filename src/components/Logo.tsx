const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="glow"
      >
        {/* Connected nodes */}
        <circle cx="10" cy="10" r="4" fill="hsl(var(--primary))" className="animate-pulse-glow" />
        <circle cx="30" cy="10" r="4" fill="hsl(var(--primary))" className="animate-pulse-glow" />
        <circle cx="10" cy="30" r="4" fill="hsl(var(--primary))" className="animate-pulse-glow" />
        <circle cx="30" cy="30" r="4" fill="hsl(var(--primary))" className="animate-pulse-glow" />
        
        {/* Connection lines */}
        <line x1="10" y1="10" x2="30" y2="10" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
        <line x1="10" y1="10" x2="10" y2="30" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
        <line x1="30" y1="10" x2="30" y2="30" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
        <line x1="10" y1="30" x2="30" y2="30" stroke="hsl(var(--primary))" strokeWidth="2" opacity="0.6" />
        
        {/* Lock in center */}
        <rect x="16" y="18" width="8" height="6" rx="1" fill="hsl(var(--secondary))" />
        <path
          d="M18 18V16C18 14.8954 18.8954 14 20 14C21.1046 14 22 14.8954 22 16V18"
          stroke="hsl(var(--secondary))"
          strokeWidth="2"
          fill="none"
        />
      </svg>
      <span className="text-2xl font-bold text-gradient">DataBond</span>
    </div>
  );
};

export default Logo;
