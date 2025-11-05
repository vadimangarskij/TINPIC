import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../stores/userStore';
import { MessageCircle, Heart, Clock, Star } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';
import ProfileFrame from '../components/ProfileFrame';
import PremiumBadge from '../components/PremiumBadge';

const MatchesPage = () => {
  const navigate = useNavigate();
  const { matches, loadMatches, isLoadingMatches, receivedLikes, loadReceivedLikes } = useUserStore();
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' or 'likes'

  useEffect(() => {
    loadMatches();
    loadReceivedLikes();
  }, []);

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { 
        addSuffix: true, 
        locale: ru 
      });
    } catch {
      return '';
    }
  };

  if (isLoadingMatches) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Загружаем совпадения...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Совпадения</h1>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'matches'
                ? 'text-pink-600'
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" />
              Матчи ({matches.length})
            </div>
            {activeTab === 'matches' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('likes')}
            className={`flex-1 py-3 text-sm font-semibold transition-colors relative ${
              activeTab === 'likes'
                ? 'text-pink-600'
                : 'text-gray-500'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Star className="w-4 h-4" />
              Лайки ({receivedLikes?.count || 0})
            </div>
            {activeTab === 'likes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-pink-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'matches' ? (
          matches.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <Heart className="w-20 h-20 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Пока нет совпадений
              </h3>
              <p className="text-gray-600 mb-6">
                Начните свайпать, чтобы найти свои матчи!
              </p>
              <button
                onClick={() => navigate('/discovery')}
                className="btn-primary"
              >
                Начать поиск
              </button>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {matches.map((match) => (
                <div
                  key={match.match_id}
                  onClick={() => navigate(`/chat/${match.match_id}`)}
                  className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar with ProfileFrame */}
                    <div className="relative">
                      <ProfileFrame frameType={match.matched_user?.premium_frame || 'none'} size="sm">
                        <img
                          src={match.matched_user?.photos?.[0] || '/placeholder-user.png'}
                          alt={match.matched_user?.full_name}
                          className="w-16 h-16 object-cover"
                        />
                      </ProfileFrame>
                      {match.matched_user?.is_premium && match.matched_user?.premium_badge && (
                        <div className="absolute -top-1 -right-1 transform scale-75">
                          <PremiumBadge type={match.matched_user.premium_badge} position="inline" animated={false} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {match.matched_user?.full_name}
                      </h3>
                      
                      {match.last_message ? (
                        <p className="text-sm text-gray-600 truncate">
                          {match.last_message.content}
                        </p>
                      ) : (
                        <p className="text-sm text-pink-500">
                          Новый матч! Напишите первым
                        </p>
                      )}
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">
                          {formatTime(match.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Message indicator */}
                    <div className="flex flex-col items-end gap-2">
                      <MessageCircle className="w-5 h-5 text-pink-500" />
                      {match.unread_count > 0 && (
                        <div className="w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-bold">
                            {match.unread_count > 9 ? '9+' : match.unread_count}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          // Likes tab
          <div className="p-4">
            {receivedLikes?.premium_required ? (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center">
                <Star className="w-16 h-16 mx-auto mb-4" fill="white" />
                <h3 className="text-xl font-bold mb-2">
                  {receivedLikes.count} {receivedLikes.count === 1 ? 'человек' : 'людей'} лайкнул вас!
                </h3>
                <p className="text-white/90 mb-4">
                  Обновитесь до Premium, чтобы увидеть, кто вас лайкнул
                </p>
                <button
                  onClick={() => navigate('/premium')}
                  className="bg-white text-purple-600 font-semibold py-3 px-6 rounded-full hover:bg-gray-100 transition-colors"
                >
                  Перейти на Premium
                </button>
              </div>
            ) : receivedLikes?.users && receivedLikes.users.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {receivedLikes.users.map((user) => (
                  <div
                    key={user.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={user.photos?.[0] || '/placeholder-user.png'}
                        alt={user.full_name}
                        className="w-full h-full object-cover"
                      />
                      {user.is_super_like && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" fill="white" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-semibold text-sm truncate">
                        {user.full_name}, {user.age}
                      </h4>
                      {user.job_title && (
                        <p className="text-xs text-gray-600 truncate">
                          {user.job_title}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Пока никто не лайкнул вас</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchesPage;
