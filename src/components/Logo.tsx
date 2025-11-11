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
        {/* Blockchain ring */}
        <circle 
          cx="20" 
          cy="20" 
          r="18" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
          fill="none"
          className="animate-pulse-glow"
        />
        
        {/* Happy mask (left) */}
        <g transform="translate(5, 12)">
          <ellipse cx="7" cy="6" rx="6" ry="8" fill="hsl(var(--primary))" opacity="0.9" />
          {/* Eyes */}
          <circle cx="5" cy="4" r="1" fill="hsl(var(--background))" />
          <circle cx="9" cy="4" r="1" fill="hsl(var(--background))" />
          {/* Smile */}
          <path 
            d="M 4 7 Q 7 9 10 7" 
            stroke="hsl(var(--background))" 
            strokeWidth="1.2" 
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Sad mask (right) */}
        <g transform="translate(22, 12)">
          <ellipse cx="7" cy="6" rx="6" ry="8" fill="hsl(var(--secondary))" opacity="0.9" />
          {/* Eyes */}
          <circle cx="5" cy="4" r="1" fill="hsl(var(--background))" />
          <circle cx="9" cy="4" r="1" fill="hsl(var(--background))" />
          {/* Frown */}
          <path 
            d="M 4 9 Q 7 7 10 9" 
            stroke="hsl(var(--background))" 
            strokeWidth="1.2" 
            fill="none"
            strokeLinecap="round"
          />
        </g>
      </svg>
      <span className="text-2xl font-bold text-gradient">MaskArena</span>
    </div>
  );
};

export default Logo;
