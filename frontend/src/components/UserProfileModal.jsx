import { useState } from 'react';
import { X, MapPin, Briefcase, Heart, Star, MessageCircle, Share2, Flag } from 'lucide-react';
import PremiumBadge from './PremiumBadge';

const UserProfileModal = ({ user, onClose, onSwipe }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  
  if (!user) return null;
  
  const photos = user.photos || [];
  const interests = user.interests || [];
  
  const nextPhoto = () => {
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(currentPhotoIndex + 1);
    }
  };
  
  const prevPhoto = () => {
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(currentPhotoIndex - 1);
    }
  };
  
  const calculateAge = (dob) => {
    if (!dob) return user.age || null;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  
  const age = calculateAge(user.date_of_birth);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-50 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
      >
        <X className="w-6 h-6 text-white" />
      </button>

      <div className="min-h-screen pb-24">
        {/* Photo carousel */}
        <div className="relative h-[60vh] bg-gray-900">
          {photos.length > 0 ? (
            <>
              <img
                src={photos[currentPhotoIndex]}
                alt={user.full_name}
                className="w-full h-full object-cover"
              />
              
              {/* Photo indicators */}
              {photos.length > 1 && (
                <div className="absolute top-4 left-4 right-4 flex gap-1">
                  {photos.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1 flex-1 rounded-full transition-all ${
                        idx === currentPhotoIndex ? 'bg-white' : 'bg-white/30'
                      }`}
                    />
                  ))}
                </div>
              )}
              
              {/* Navigation areas */}
              {currentPhotoIndex > 0 && (
                <div
                  onClick={prevPhoto}
                  className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer"
                />
              )}
              {currentPhotoIndex < photos.length - 1 && (
                <div
                  onClick={nextPhoto}
                  className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer"
                />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500 to-orange-500">
              <span className="text-6xl">👤</span>
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="bg-white rounded-t-3xl -mt-8 relative z-10">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.full_name || 'Unknown'}, {age || '?'}
                </h2>
                {user.is_verified && (
                  <div className="w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {user.is_premium && (
                  <div className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full">
                    <span className="text-xs font-bold text-white">PREMIUM</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-gray-600">
                {user.job_title && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    <span className="text-sm">{user.job_title}</span>
                  </div>
                )}
                {user.distance && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{user.distance} км</span>
                  </div>
                )}
              </div>
              
              {user.compatibility_score && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  {user.compatibility_score}% совместимость
                </div>
              )}
            </div>

            {/* Bio */}
            {user.bio && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">О себе</h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Details */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Детали</h3>
              <div className="grid grid-cols-2 gap-3">
                {user.city && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Город</div>
                    <div className="font-semibold text-gray-800">{user.city}</div>
                  </div>
                )}
                {user.height && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Рост</div>
                    <div className="font-semibold text-gray-800">{user.height} см</div>
                  </div>
                )}
                {user.education && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Образование</div>
                    <div className="font-semibold text-gray-800 text-sm">{user.education}</div>
                  </div>
                )}
                {user.company && (
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="text-xs text-gray-500 mb-1">Компания</div>
                    <div className="font-semibold text-gray-800 text-sm">{user.company}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Interests */}
            {interests.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Интересы</h3>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Lifestyle */}
            {(user.smoking || user.drinking || user.pets || user.exercise) && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Образ жизни</h3>
                <div className="grid grid-cols-2 gap-3">
                  {user.smoking && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Курение</div>
                      <div className="font-semibold text-gray-800 capitalize">{user.smoking}</div>
                    </div>
                  )}
                  {user.drinking && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Алкоголь</div>
                      <div className="font-semibold text-gray-800 capitalize">{user.drinking}</div>
                    </div>
                  )}
                  {user.pets && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Питомцы</div>
                      <div className="font-semibold text-gray-800 capitalize">{user.pets}</div>
                    </div>
                  )}
                  {user.exercise && (
                    <div className="bg-gray-50 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-1">Спорт</div>
                      <div className="font-semibold text-gray-800 capitalize">{user.exercise}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {/* Report */}}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Flag className="w-5 h-5" />
                Пожаловаться
              </button>
              <button
                onClick={() => {/* Share */}}
                className="flex-1 py-3 border-2 border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Share2 className="w-5 h-5" />
                Поделиться
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed bottom actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="flex justify-center items-center gap-4 max-w-md mx-auto">
          <button
            onClick={() => {
              onSwipe('pass');
              onClose();
            }}
            className="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 border-2 border-gray-200"
          >
            <X className="w-8 h-8 text-red-500" strokeWidth={2.5} />
          </button>

          <button
            onClick={() => {
              onSwipe('super_like');
              onClose();
            }}
            className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Star className="w-7 h-7 text-white" fill="white" strokeWidth={2} />
          </button>

          <button
            onClick={() => {
              onSwipe('like');
              onClose();
            }}
            className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-red-500 shadow-xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
          >
            <Heart className="w-8 h-8 text-white" fill="white" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
