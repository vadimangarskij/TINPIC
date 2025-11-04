import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Camera, Settings, Edit, MapPin, Briefcase, Heart, Star, Eye, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: user?.bio || '',
    job_title: user?.job_title || '',
    interests: user?.interests || []
  });

  const stats = [
    { icon: Eye, label: 'Просмотры', value: user?.profile_views || 0, color: 'text-blue-500' },
    { icon: Heart, label: 'Лайки', value: user?.total_likes_received || 0, color: 'text-pink-500' },
    { icon: Star, label: 'Super Likes', value: user?.total_super_likes_received || 0, color: 'text-purple-500' },
  ];

  const handleSaveProfile = async () => {
    const result = await updateProfile(editForm);
    if (result.success) {
      toast.success('Профиль обновлен');
      setIsEditing(false);
    } else {
      toast.error(result.error || 'Ошибка обновления');
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Header with photo */}
      <div className="relative">
        <div className="h-80 bg-gradient-to-br from-pink-500 to-orange-500 relative overflow-hidden">
          {user?.photos?.[0] ? (
            <img
              src={user.photos[0]}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Camera className="w-20 h-20 text-white/50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Settings button */}
          <button
            onClick={() => navigate('/settings')}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>

          {/* Premium badge */}
          {user?.is_premium && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">PREMIUM</span>
            </div>
          )}
        </div>

        {/* Main info card */}
        <div className="px-4 -mt-20 relative z-10">
          <div className="bg-white rounded-3xl p-6 shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-gray-800">
                    {user?.full_name || 'Без имени'}, {user?.age || '?'}
                  </h1>
                  {user?.is_verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  {user?.job_title && (
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      <span>{user.job_title}</span>
                    </div>
                  )}
                  {user?.city && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{user.city}</span>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6 pt-4 border-t border-gray-100">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
                  <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Bio */}
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    О себе
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                    placeholder="Расскажите о себе..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editForm.bio.length}/500
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Профессия
                  </label>
                  <input
                    type="text"
                    value={editForm.job_title}
                    onChange={(e) => setEditForm({ ...editForm, job_title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Ваша профессия"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProfile}
                    className="flex-1 btn-primary"
                  >
                    Сохранить
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 btn-secondary"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">О себе</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {user?.bio || 'Расскажите о себе...'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Interests */}
        {user?.interests && user.interests.length > 0 && (
          <div className="px-4 mt-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Интересы</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Photos grid */}
        {user?.photos && user.photos.length > 1 && (
          <div className="px-4 mt-4">
            <div className="bg-white rounded-3xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-3">Фотографии</h3>
              <div className="grid grid-cols-3 gap-2">
                {user.photos.slice(1).map((photo, idx) => (
                  <div key={idx} className="aspect-square rounded-2xl overflow-hidden">
                    <img
                      src={photo}
                      alt={`Photo ${idx + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Premium CTA */}
        {!user?.is_premium && (
          <div className="px-4 mt-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
              <Crown className="w-12 h-12 mb-3" />
              <h3 className="text-xl font-bold mb-2">Обновите до Premium</h3>
              <p className="text-white/90 text-sm mb-4">
                Получите безлимитные свайпы, супер лайки и видите, кто вас лайкнул!
              </p>
              <button
                onClick={() => navigate('/premium')}
                className="w-full bg-white text-purple-600 font-semibold py-3 rounded-full hover:bg-gray-100 transition-colors"
              >
                Узнать больше
              </button>
            </div>
          </div>
        )}

        <div className="h-20" /> {/* Bottom spacing for nav */}
      </div>
    </div>
  );
};

export default ProfilePage;
