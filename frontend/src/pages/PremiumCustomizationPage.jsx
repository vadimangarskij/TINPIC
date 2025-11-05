import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, Sparkles, Palette, Award } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import ProfileFrame from '../components/ProfileFrame';
import PremiumBadge from '../components/PremiumBadge';
import toast from 'react-hot-toast';

const PremiumCustomizationPage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  
  const [selectedTheme, setSelectedTheme] = useState(user?.profile_theme || 'default');
  const [selectedFrame, setSelectedFrame] = useState(user?.profile_frame || 'none');
  const [selectedBadge, setSelectedBadge] = useState(user?.profile_badge || 'none');
  const [isSaving, setIsSaving] = useState(false);

  // Premium themes
  const themes = [
    { id: 'default', name: 'Стандартная', colors: 'from-pink-500 to-orange-500', free: true },
    { id: 'ocean', name: 'Океан', colors: 'from-blue-400 to-cyan-500', premium: true },
    { id: 'sunset', name: 'Закат', colors: 'from-orange-500 to-red-600', premium: true },
    { id: 'forest', name: 'Лес', colors: 'from-green-400 to-emerald-600', premium: true },
    { id: 'galaxy', name: 'Галактика', colors: 'from-purple-600 to-pink-600', premium: true },
    { id: 'fire', name: 'Огонь', colors: 'from-red-500 to-yellow-500', premium: true },
    { id: 'midnight', name: 'Полночь', colors: 'from-indigo-900 to-purple-900', premium: true },
  ];

  // Profile frames
  const frames = [
    { id: 'none', name: 'Без рамки', preview: 'none', free: true },
    { id: 'gold', name: 'Золотая', preview: 'gold', premium: true },
    { id: 'diamond', name: 'Алмазная', preview: 'diamond', premium: true },
    { id: 'ruby', name: 'Рубиновая', preview: 'ruby', premium: true },
    { id: 'rainbow', name: 'Радужная', preview: 'rainbow', premium: true },
  ];

  // Profile badges
  const badges = [
    { id: 'none', name: 'Без значка', icon: null, free: true },
    { id: 'vip', name: 'VIP', icon: '⭐', premium: true },
    { id: 'verified_plus', name: 'Verified+', icon: '✓', premium: true },
    { id: 'influencer', name: 'Инфлюенсер', icon: '📱', premium: true },
    { id: 'traveler', name: 'Путешественник', icon: '✈️', premium: true },
    { id: 'athlete', name: 'Спортсмен', icon: '🏆', premium: true },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const result = await updateProfile({
        profile_theme: selectedTheme,
        profile_frame: selectedFrame,
        profile_badge: selectedBadge,
      });
      
      if (result.success) {
        toast.success('Настройки сохранены!');
        navigate('/profile');
      } else {
        toast.error(result.error || 'Ошибка сохранения');
      }
    } catch (error) {
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const isPremiumUser = user?.is_premium;

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Кастомизация профиля</h1>
            <p className="text-xs text-gray-500">Только для Premium</p>
          </div>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving || !isPremiumUser}
          className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {!isPremiumUser && (
        <div className="mx-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Нужен Premium</h3>
          <p className="mb-4 text-white/90">
            Кастомизация профиля доступна только для Premium пользователей
          </p>
          <button
            onClick={() => navigate('/premium')}
            className="bg-white text-purple-600 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Перейти на Premium
          </button>
        </div>
      )}

      <div className="p-6 space-y-8 pb-24">
        {/* Preview */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            Предпросмотр
          </h2>
          
          <div className="flex flex-col items-center py-6">
            <ProfileFrame type={selectedFrame}>
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${themes.find(t => t.id === selectedTheme)?.colors || 'from-pink-500 to-orange-500'} flex items-center justify-center text-4xl relative`}>
                {user?.photos?.[0] ? (
                  <img src={user.photos[0]} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span>👤</span>
                )}
                {selectedBadge !== 'none' && (
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border-2 border-gray-100">
                    <span className="text-xl">{badges.find(b => b.id === selectedBadge)?.icon}</span>
                  </div>
                )}
              </div>
            </ProfileFrame>
            
            <div className="mt-4 flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-800">{user?.full_name || 'Ваше имя'}</h3>
              <PremiumBadge size="md" animated={isPremiumUser} />
            </div>
          </div>
        </div>

        {/* Themes */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5 text-purple-500" />
            Темы профиля
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => (theme.free || isPremiumUser) && setSelectedTheme(theme.id)}
                disabled={theme.premium && !isPremiumUser}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  selectedTheme === theme.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${theme.premium && !isPremiumUser ? 'opacity-50' : ''}`}
              >
                <div className={`w-full h-20 rounded-xl bg-gradient-to-br ${theme.colors} mb-2`} />
                <p className="font-semibold text-sm text-gray-800">{theme.name}</p>
                {theme.premium && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Frames */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-500" />
            Рамки профиля
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => (frame.free || isPremiumUser) && setSelectedFrame(frame.id)}
                disabled={frame.premium && !isPremiumUser}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  selectedFrame === frame.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${frame.premium && !isPremiumUser ? 'opacity-50' : ''}`}
              >
                <div className="flex justify-center mb-3">
                  <ProfileFrame type={frame.preview}>
                    <div className="w-16 h-16 rounded-full bg-gray-300" />
                  </ProfileFrame>
                </div>
                <p className="font-semibold text-sm text-gray-800">{frame.name}</p>
                {frame.premium && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Badges */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-green-500" />
            Значки профиля
          </h2>
          
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <button
                key={badge.id}
                onClick={() => (badge.free || isPremiumUser) && setSelectedBadge(badge.id)}
                disabled={badge.premium && !isPremiumUser}
                className={`relative p-4 rounded-2xl border-2 transition-all ${
                  selectedBadge === badge.id
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${badge.premium && !isPremiumUser ? 'opacity-50' : ''}`}
              >
                <div className="text-4xl mb-2">{badge.icon || '✨'}</div>
                <p className="font-semibold text-sm text-gray-800">{badge.name}</p>
                {badge.premium && (
                  <div className="absolute top-2 right-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCustomizationPage;
