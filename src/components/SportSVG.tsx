import React from 'react';

interface SportSVGProps {
  sportType: string;
  colorStart?: string;
  colorEnd?: string;
  className?: string;
}

export const SportSVG: React.FC<SportSVGProps> = ({
  sportType,
  colorStart = "#003C3C",
  colorEnd = "#E0BC66",
  className = ""
}) => {
  const getSportEmoji = (type: string) => {
    const emojis: Record<string, string> = {
      football: "⚽",
      basketball: "🏀",
      tennis: "🎾",
      swimming: "🏊",
      cricket: "🏏",
      badminton: "🏸",
      athletics: "🏃",
      tabletennis: "🏓",
      beginner: "🌱",
      advanced: "⚡",
      summer: "☀️",
      personal: "🎯",
      story: "🏛️",
      facilities: "🏟️",
      blog: "📰"
    };
    return emojis[type] || "🏅";
  };

  return (
    <svg 
      viewBox="0 0 400 250" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={`w-full h-full object-cover ${className}`}
    >
      <defs>
        <linearGradient id={`grad-${sportType}`} x1="0" y1="0" x2="400" y2="250" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={colorStart} />
          <stop offset="100%" stopColor={colorEnd} />
        </linearGradient>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
      </defs>
      {/* Background gradient */}
      <rect width="400" height="250" fill={`url(#grad-${sportType})`} />
      <rect width="400" height="250" fill="url(#grid)" />
      
      {/* Semi-translucent design accents */}
      <circle cx="350" cy="50" r="120" fill="rgba(255,255,255,0.05)" />
      <path d="M-50 200 L250 50 L450 250 Z" fill="rgba(255,255,255,0.03)" />
      
      {/* Sport Badge Shape */}
      <g transform="translate(200, 125)">
        <circle cx="0" cy="0" r="55" fill="rgba(0, 0, 0, 0.2)" stroke="rgba(224, 188, 102, 0.4)" strokeWidth="2" />
        <circle cx="0" cy="0" r="48" fill="rgba(0, 60, 60, 0.4)" />
        <text x="0" y="12" fontSize="36" textAnchor="middle" fontFamily="Segoe UI Emoji, Arial" fill="#E0BC66">
          {getSportEmoji(sportType)}
        </text>
      </g>
      
      {/* Typography Label overlay */}
      <text x="20" y="225" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="14" fontWeight="700" fill="#E0BC66" letterSpacing="2">
        RANILAXMIBAI PERFORMANCE
      </text>
    </svg>
  );
};
