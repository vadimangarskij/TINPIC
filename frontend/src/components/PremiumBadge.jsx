import { Crown } from 'lucide-react';

const PremiumBadge = ({ size = 'md', animated = true }) => {
  const sizes = {
    sm: 'w-5 h-5 text-xs',
    md: 'w-6 h-6 text-sm',
    lg: 'w-8 h-8 text-base'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <div className={`${sizes[size]} inline-flex items-center justify-center`}>
      <div className={`
        relative px-2 py-1 rounded-full
        bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500
        ${animated ? 'animate-pulse' : ''}
      `}>
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 blur-md opacity-75 animate-pulse" />
        <Crown className={`${iconSizes[size]} text-white relative z-10`} fill="white" />
      </div>
    </div>
  );
};

export default PremiumBadge;
