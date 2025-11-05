import { useState, useEffect } from 'react';
import { Heart, X, Star, MapPin } from 'lucide-react';
import PremiumBadge from './PremiumBadge';

const SwipeCard = ({ user, onSwipe, style }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = user?.photos || [];
  const mainPhoto = photos[currentPhotoIndex] || '/placeholder-user.png';
  
  const handlePhotoClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isRightSide = x > rect.width / 2;
    
    if (isRightSide && currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    } else if (!isRightSide && currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const age = user?.age || calculateAge(user?.date_of_birth);

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={style}
    >
      <div className="relative w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Photo */}
        <div 
          className="relative w-full h-full cursor-pointer"
          onClick={handlePhotoClick}
        >
          <img
            src={mainPhoto}
            alt={user?.full_name || 'User'}
            className="w-full h-full object-cover"
          />
          
          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-4 left-0 right-0 flex gap-1 px-4">
              {photos.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1 flex-1 rounded-full transition-all ${
                    idx === currentPhotoIndex 
                      ? 'bg-white' 
                      : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* User info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            {/* Compatibility badge */}
            {user?.compatibility_score && (
              <div className="inline-flex items-center gap-2 bg-green-500 px-3 py-1 rounded-full text-sm font-semibold mb-3">
                <Star className="w-4 h-4" />
                {user.compatibility_score}% совместимость
              </div>
            )}

            {/* Name and age */}
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-3xl font-bold">
                {user?.full_name || 'Unknown'}, {age || '?'}
              </h2>
              {user?.is_verified && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              {user?.is_premium && user?.premium_badge && (
                <div className="transform scale-90">
                  <PremiumBadge type={user.premium_badge} position="inline" animated={true} />
                </div>
              )}
            </div>

            {/* Job & Location */}
            <div className="space-y-1 text-white/90 mb-3">
              {user?.job_title && (
                <p className="text-base">{user.job_title}</p>
              )}
              {user?.distance && (
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{user.distance} км от вас</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {user?.bio && (
              <p className="text-white/80 text-sm line-clamp-3 mb-4">
                {user.bio}
              </p>
            )}

            {/* Interests */}
            {user?.interests && user.interests.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {user.interests.slice(0, 5).map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons - moved below card to prevent overlap */}
        
      </div>
    </div>
  );
};

export default SwipeCard;
