import React from 'react';
import { Crown, Star, Zap, Sparkles, Shield } from 'lucide-react';

const PremiumBadge = ({ type = 'premium', position = 'top-right', animated = true }) => {
  const badges = {
    premium: {
      icon: Crown,
      label: 'Premium',
      gradient: 'from-yellow-400 to-orange-500',
      glow: 'shadow-yellow-500/50',
      textColor: 'text-white',
    },
    vip: {
      icon: Crown,
      label: 'VIP',
      gradient: 'from-yellow-500 via-yellow-400 to-yellow-600',
      glow: 'shadow-yellow-600/60',
      textColor: 'text-yellow-900',
    },
    elite: {
      icon: Star,
      label: 'Elite',
      gradient: 'from-purple-500 to-pink-600',
      glow: 'shadow-purple-500/50',
      textColor: 'text-white',
    },
    hot: {
      icon: Zap,
      label: 'Hot',
      gradient: 'from-red-500 to-orange-600',
      glow: 'shadow-red-500/50',
      textColor: 'text-white',
    },
    featured: {
      icon: Sparkles,
      label: 'Featured',
      gradient: 'from-cyan-400 to-blue-500',
      glow: 'shadow-cyan-400/50',
      textColor: 'text-white',
    },
    verified: {
      icon: Shield,
      label: 'Verified',
      gradient: 'from-blue-500 to-cyan-400',
      glow: 'shadow-blue-500/50',
      textColor: 'text-white',
    },
  };

  const positionClasses = {
    'top-right': 'absolute -top-2 -right-2',
    'top-left': 'absolute -top-2 -left-2',
    'bottom-right': 'absolute -bottom-2 -right-2',
    'bottom-left': 'absolute -bottom-2 -left-2',
    'inline': 'inline-flex',
  };

  const badge = badges[type] || badges.premium;
  const Icon = badge.icon;

  return (
    <div className={`${positionClasses[position]} z-10`}>
      <div
        className={`
          flex items-center gap-1 px-3 py-1.5 rounded-full
          bg-gradient-to-r ${badge.gradient}
          ${badge.glow} shadow-lg
          ${badge.textColor}
          ${animated ? 'animate-bounce-slow' : ''}
          text-xs font-bold
          border-2 border-white
        `}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{badge.label}</span>
      </div>
      
      {/* Sparkle effects for premium badges */}
      {animated && (type === 'vip' || type === 'elite') && (
        <>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-300 rounded-full animate-ping animation-delay-300" />
        </>
      )}
    </div>
  );
};

export default PremiumBadge;
