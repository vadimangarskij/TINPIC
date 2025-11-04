import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Sparkles, TrendingUp, User, Star, Eye, Zap } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useUserStore } from '../stores/userStore';

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { matches, loadMatches, receivedLikes, loadReceivedLikes } = useUserStore();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Доброе утро');
    else if (hour < 18) setGreeting('Добрый день');
    else setGreeting('Добрый вечер');

    // Load data
    loadMatches();
    loadReceivedLikes();
  }, []);

  const stats = [
    { icon: Eye, label: 'Просмотры', value: user?.profile_views || 0, color: 'text-blue-500', bg: 'bg-blue-50' },
    { icon: Heart, label: 'Лайки', value: user?.total_likes_received || 0, color: 'text-pink-500', bg: 'bg-pink-50' },
    { icon: Star, label: 'Super Likes', value: user?.total_super_likes_received || 0, color: 'text-purple-500', bg: 'bg-purple-50' },
    { icon: MessageCircle, label: 'Матчи', value: matches.length, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  const quickActions = [
    { 
      icon: Zap, 
      label: 'Начать поиск', 
      subtitle: 'Найди свою пару',
      path: '/discovery', 
      gradient: 'from-pink-500 to-red-500' 
    },
    { 
      icon: MessageCircle, 
      label: 'Сообщения', 
      subtitle: `${matches.length} совпадений`,
      path: '/matches', 
      gradient: 'from-purple-500 to-pink-500',
      badge: matches.filter(m => m.unread_count > 0).length 
    },
    { 
      icon: User, 
      label: 'Мой профиль', 
      subtitle: 'Редактировать',
      path: '/profile', 
      gradient: 'from-blue-500 to-cyan-500' 
    },
    { 
      icon: Sparkles, 
      label: 'Premium', 
      subtitle: 'Больше возможностей',
      path: '/premium', 
      gradient: 'from-yellow-500 to-orange-500',
      premium: true
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <div className="p-6 pb-0">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            {greeting}, {user?.full_name?.split(' ')[0] || 'друг'}! 👋
          </h1>
          <p className="text-gray-600">Готовы найти свою любовь сегодня?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`${stat.bg} rounded-2xl p-3 text-center`}
            >
              <stat.icon className={`w-5 h-5 mx-auto mb-1 ${stat.color}`} />
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
              <p className="text-xs text-gray-600 truncate">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.path)}
              className="relative group"
            >
              <div className={`bg-gradient-to-br ${action.gradient} rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all group-hover:scale-[1.02] active:scale-[0.98]`}>
                {action.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-xs font-bold">{action.badge}</span>
                  </div>
                )}
                {action.premium && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-yellow-400 rounded-full p-1">
                      <Sparkles className="w-3 h-3 text-white" fill="white" />
                    </div>
                  </div>
                )}
                <action.icon className="w-10 h-10 mb-3" strokeWidth={2} />
                <p className="font-bold text-base mb-0.5">{action.label}</p>
                <p className="text-xs text-white/80">{action.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Received Likes Preview */}
      {receivedLikes?.count > 0 && (
        <div className="px-6 mb-6">
          <div 
            onClick={() => navigate('/matches')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl p-6 text-white cursor-pointer hover:shadow-xl transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  {receivedLikes.count} {receivedLikes.count === 1 ? 'человек' : 'людей'} лайкнул вас!
                </h3>
                <p className="text-white/90 text-sm">
                  {receivedLikes.premium_required 
                    ? 'Обновитесь до Premium, чтобы увидеть'
                    : 'Посмотрите, кто вас лайкнул'
                  }
                </p>
              </div>
              <Star className="w-12 h-12" fill="white" />
            </div>
          </div>
        </div>
      )}

      {/* Online Users - Quick Match */}
      <div className="px-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Онлайн сейчас</h3>
          <button
            onClick={() => navigate('/discovery')}
            className="text-sm text-pink-500 font-semibold"
          >
            Смотреть всех
          </button>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map((_, idx) => (
            <div
              key={idx}
              onClick={() => navigate('/discovery')}
              className="flex-shrink-0 cursor-pointer"
            >
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-orange-400 p-0.5">
                <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <p className="text-xs text-center mt-1 text-gray-600">User {idx + 1}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tips Section */}
      <div className="px-6 pb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Полезные советы</h3>
        
        <div className="space-y-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-pink-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-pink-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Добавьте больше фото</h4>
                <p className="text-sm text-gray-600">
                  Профили с 3+ фотографиями получают на 40% больше совпадений
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Начинайте диалог</h4>
                <p className="text-sm text-gray-600">
                  Отправьте первое сообщение в течение 24 часов для лучших результатов
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-purple-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Используйте Super Like</h4>
                <p className="text-sm text-gray-600">
                  Super Likes увеличивают шанс совпадения в 3 раза!
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 mb-1">Заполните профиль</h4>
                <p className="text-sm text-gray-600">
                  Добавьте интересы и био - это увеличивает доверие на 60%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" /> {/* Bottom spacing for nav */}
    </div>
  );
};

export default HomePage;
