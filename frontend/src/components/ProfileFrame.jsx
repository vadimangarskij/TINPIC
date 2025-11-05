import React from 'react';

const ProfileFrame = ({ children, frameType = 'none', size = 'md' }) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-40 h-40',
  };

  const frameStyles = {
    none: '',
    gold: 'ring-4 ring-yellow-500 shadow-lg shadow-yellow-500/50 animate-pulse-slow',
    diamond: 'ring-4 ring-cyan-400 shadow-lg shadow-cyan-400/50',
    fire: 'ring-4 ring-orange-500 shadow-lg shadow-orange-500/50',
    rainbow: 'ring-4 ring-gradient-rainbow shadow-lg',
    neon: 'ring-4 ring-pink-500 shadow-lg shadow-pink-500/50',
    cosmic: 'ring-4 ring-purple-600 shadow-lg shadow-purple-600/50',
    vip: 'ring-4 ring-yellow-600 shadow-2xl shadow-yellow-600/60',
  };

  // Animated SVG frames
  const renderAnimatedFrame = () => {
    switch (frameType) {
      case 'gold':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow-gold">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#gold-gradient)" strokeWidth="4" filter="url(#glow-gold)">
              <animate attributeName="stroke-dasharray" values="0,300;300,0;0,300" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      case 'diamond':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="diamond-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#00CED1', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#87CEEB', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#00CED1', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#diamond-gradient)" strokeWidth="3">
              <animate attributeName="r" values="46;48;46" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#diamond-gradient)" strokeWidth="2" opacity="0.5">
              <animate attributeName="r" values="43;45;43" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      case 'fire':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="fire-gradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#FF4500', stopOpacity: 1 }}>
                  <animate attributeName="stop-color" values="#FF4500;#FF8C00;#FF4500" dur="1.5s" repeatCount="indefinite" />
                </stop>
                <stop offset="100%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }}>
                  <animate attributeName="stop-color" values="#FF8C00;#FFD700;#FF8C00" dur="1.5s" repeatCount="indefinite" />
                </stop>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#fire-gradient)" strokeWidth="4" />
          </svg>
        );

      case 'rainbow':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="rainbow-gradient">
                <stop offset="0%" style={{ stopColor: '#FF0080', stopOpacity: 1 }} />
                <stop offset="25%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#40E0D0', stopOpacity: 1 }} />
                <stop offset="75%" style={{ stopColor: '#9370DB', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FF0080', stopOpacity: 1 }} />
                <animateTransform
                  attributeName="gradientTransform"
                  type="rotate"
                  from="0 0.5 0.5"
                  to="360 0.5 0.5"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#rainbow-gradient)" strokeWidth="4" />
          </svg>
        );

      case 'neon':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <filter id="neon-glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="#FF1493" strokeWidth="3" filter="url(#neon-glow)">
              <animate attributeName="opacity" values="1;0.5;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      case 'cosmic':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <radialGradient id="cosmic-gradient">
                <stop offset="0%" style={{ stopColor: '#8B00FF', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#4B0082', stopOpacity: 1 }} />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#cosmic-gradient)" strokeWidth="4">
              <animate attributeName="stroke-dasharray" values="10,5;5,10;10,5" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="50" cy="50" r="44" fill="none" stroke="#9370DB" strokeWidth="2" opacity="0.6">
              <animate attributeName="r" values="42;44;42" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>
        );

      case 'vip':
        return (
          <svg className="absolute inset-0 w-full h-full -z-10" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="vip-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
                <stop offset="50%" style={{ stopColor: '#FFA500', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
              </linearGradient>
              <filter id="glow-vip">
                <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="48" fill="none" stroke="url(#vip-gradient)" strokeWidth="5" filter="url(#glow-vip)">
              <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
            </circle>
            {/* Stars */}
            <polygon points="50,10 52,16 58,16 53,20 55,26 50,22 45,26 47,20 42,16 48,16" fill="#FFD700" opacity="0.8">
              <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
            </polygon>
          </svg>
        );

      default:
        return null;
    }
  };

  if (frameType === 'none') {
    return <div className={`relative ${sizeClasses[size]} rounded-full overflow-hidden`}>{children}</div>;
  }

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {renderAnimatedFrame()}
      <div className={`relative rounded-full overflow-hidden ${frameStyles[frameType]}`}>
        {children}
      </div>
    </div>
  );
};

export default ProfileFrame;
