import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Lock, Check } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { usersAPI } from '../utils/api';
import ProfileFrame from '../components/ProfileFrame';
import PremiumBadge from '../components/PremiumBadge';
import toast from 'react-hot-toast';

const PremiumCustomizationPage = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const [selectedFrame, setSelectedFrame] = useState(user?.premium_frame || 'none');
  const [selectedBadge, setSelectedBadge] = useState(user?.premium_badge || 'premium');
  const [isSaving, setIsSaving] = useState(false);

  // Frame options
  const frames = [
    { id: 'none', name: 'Без рамки', premium: false },
    { id: 'gold', name: 'Золотая', premium: true, description: 'Роскошное золото с анимацией' },
    { id: 'diamond', name: 'Алмазная', premium: true, description: 'Сияющие кристаллы' },
    { id: 'fire', name: 'Огненная', premium: true, description: 'Пылающее пламя' },
    { id: 'rainbow', name: 'Радужная', premium: true, description: 'Вращающаяся радуга' },
    { id: 'neon', name: 'Неоновая', premium: true, description: 'Яркое неоновое свечение' },
    { id: 'cosmic', name: 'Космическая', premium: true, description: 'Галактические эффекты' },
    { id: 'vip', name: 'VIP', premium: true, description: 'Эксклюзивная VIP рамка' },
  ];

  // Badge options
  const badges = [
    { id: 'premium', name: 'Premium', premium: true, description: 'Стандартный значок Premium' },
    { id: 'vip', name: 'VIP', premium: true, description: 'Эксклюзивный VIP статус' },
    { id: 'elite', name: 'Elite', premium: true, description: 'Элитный участник' },
    { id: 'hot', name: 'Hot', premium: true, description: 'Горячий профиль' },
    { id: 'featured', name: 'Featured', premium: true, description: 'Избранный пользователь' },
    { id: 'verified', name: 'Verified', premium: true, description: 'Верифицированный аккаунт' },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = {
        premium_frame: selectedFrame,
        premium_badge: selectedBadge
      };
      
      const response = await usersAPI.updateProfile(updates);
      
      if (response.data) {
        updateUser(response.data);
        toast.success('Настройки сохранены! ✨');
      }
    } catch (error) {
      console.error('Error saving customization:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const canAccessPremium = user?.is_premium || false;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Кастомизация профиля</h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || !canAccessPremium}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Сохранить
            </>
          )}
        </button>
      </div>

      {/* Premium Warning */}
      {!canAccessPremium && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-orange-200 px-6 py-4">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="font-semibold text-orange-800">Требуется Premium подписка</p>
              <p className="text-sm text-orange-700">
                Получите доступ к эксклюзивным рамкам и значкам
              </p>
            </div>
            <button
              onClick={() => navigate('/premium')}
              className="ml-auto px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Оформить Premium
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Live Preview */}
        <div className="bg-white p-8 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-6 text-center">Предпросмотр</h2>
          <div className="flex justify-center">
            <div className="relative">
              <ProfileFrame frameType={selectedFrame} size="xl">
                <img
                  src={user?.photos?.[0] || `https://ui-avatars.com/api/?name=${user?.full_name || 'User'}&size=160&background=gradient&color=fff`}
                  alt="Preview"
                  className="w-40 h-40 object-cover"
                />
              </ProfileFrame>
              <PremiumBadge type={selectedBadge} position="top-right" animated={true} />
            </div>
          </div>
          <p className="text-center text-gray-600 mt-4">
            Так будет выглядеть ваш профиль в приложении
          </p>
        </div>

        {/* Frame Selection */}
        <div className="bg-white px-6 py-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Выберите рамку</h2>
          <div className="grid grid-cols-2 gap-4">
            {frames.map((frame) => {
              const isSelected = selectedFrame === frame.id;
              const isLocked = frame.premium && !canAccessPremium;

              return (
                <button
                  key={frame.id}
                  onClick={() => !isLocked && setSelectedFrame(frame.id)}
                  disabled={isLocked}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all
                    ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Preview */}
                  <div className="flex justify-center mb-3">
                    <ProfileFrame frameType={frame.id} size="md">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full" />
                    </ProfileFrame>
                  </div>

                  {/* Name */}
                  <p className="font-bold text-gray-800 text-center">{frame.name}</p>
                  {frame.description && (
                    <p className="text-xs text-gray-600 text-center mt-1">{frame.description}</p>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Lock indicator */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Badge Selection */}
        <div className="bg-white px-6 py-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Выберите значок</h2>
          <div className="grid grid-cols-2 gap-4">
            {badges.map((badge) => {
              const isSelected = selectedBadge === badge.id;
              const isLocked = badge.premium && !canAccessPremium;

              return (
                <button
                  key={badge.id}
                  onClick={() => !isLocked && setSelectedBadge(badge.id)}
                  disabled={isLocked}
                  className={`
                    relative p-4 rounded-2xl border-2 transition-all
                    ${isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}
                    ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {/* Preview */}
                  <div className="flex justify-center mb-3">
                    <PremiumBadge type={badge.id} position="inline" animated={false} />
                  </div>

                  {/* Name */}
                  <p className="font-bold text-gray-800 text-center">{badge.name}</p>
                  {badge.description && (
                    <p className="text-xs text-gray-600 text-center mt-1">{badge.description}</p>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Lock indicator */}
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                      <Lock className="w-8 h-8 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Box */}
        <div className="px-6 pb-6">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
            <h3 className="font-bold text-purple-900 mb-2">✨ Эксклюзивные эффекты</h3>
            <ul className="space-y-2 text-sm text-purple-800">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Ваш профиль будет выделяться среди других</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Анимированные рамки привлекают больше внимания</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Premium значки показывают ваш статус</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>Увеличьте количество лайков до 3x</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumCustomizationPage;
