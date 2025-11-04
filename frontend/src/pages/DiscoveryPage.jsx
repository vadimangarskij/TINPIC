import { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import SwipeCard from '../components/SwipeCard';
import UserProfileModal from '../components/UserProfileModal';
import { RefreshCw, Settings, Sparkles, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';

const DiscoveryPage = () => {
  const { 
    discoveryCards, 
    currentCardIndex, 
    isLoadingCards,
    loadDiscoveryCards,
    swipeCard,
    getCurrentCard
  } = useUserStore();

  const [swipeDirection, setSwipeDirection] = useState(null);
  const [showMatch, setShowMatch] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (discoveryCards.length === 0 && !isLoadingCards) {
      loadDiscoveryCards(10);
    }
  }, []);

  const handleSwipe = async (action) => {
    const currentCard = getCurrentCard();
    if (!currentCard) return;

    // Trigger swipe animation
    setSwipeDirection(action === 'like' || action === 'super_like' ? 'right' : 'left');

    // Wait for animation
    setTimeout(async () => {
      const result = await swipeCard(currentCard.id, action);
      
      if (result.success) {
        if (result.match) {
          // Show match modal
          setMatchedUser(currentCard);
          setShowMatch(true);
          toast.success('🎉 Это матч!');
        } else if (action === 'super_like') {
          toast.success('⭐ Super Like отправлен!');
        }
      } else {
        toast.error(result.error || 'Ошибка свайпа');
      }
      
      setSwipeDirection(null);
    }, 300);
  };
  
  const handleShowProfile = () => {
    const currentCard = getCurrentCard();
    if (currentCard) {
      setSelectedUser(currentCard);
      setShowProfileModal(true);
    }
  };

  const currentCard = getCurrentCard();
  const remainingCards = discoveryCards.length - currentCardIndex;

  if (isLoadingCards) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Загружаем профили...</p>
        </div>
      </div>
    );
  }

  if (!currentCard || remainingCards === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50 p-6">
        <div className="text-center">
          <Sparkles className="w-20 h-20 text-pink-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Все профили просмотрены!
          </h2>
          <p className="text-gray-600 mb-6">
            Расширьте настройки поиска или зайдите позже
          </p>
          <button
            onClick={() => loadDiscoveryCards(10)}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Загрузить еще
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-pink-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
            <span className="text-sm font-semibold text-gray-700">
              {remainingCards} профилей
            </span>
          </div>
        </div>
        
        <button className="w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md">
          <Settings className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Cards Stack */}
      <div className="absolute inset-0 flex items-center justify-center p-4 pt-20 pb-28">
        <div className="relative w-full max-w-md h-full">
          {/* Next card preview */}
          {discoveryCards[currentCardIndex + 1] && (
            <div className="absolute inset-0 w-full h-full transform scale-95 opacity-50">
              <div className="w-full h-full bg-white rounded-3xl shadow-xl" />
            </div>
          )}

          {/* Current card */}
          <SwipeCard
            user={currentCard}
            onSwipe={handleSwipe}
            style={{
              transform: swipeDirection === 'right' 
                ? 'translateX(500px) rotate(30deg)' 
                : swipeDirection === 'left'
                ? 'translateX(-500px) rotate(-30deg)'
                : 'none',
              transition: swipeDirection ? 'transform 0.3s ease-out' : 'none',
              opacity: swipeDirection ? 0 : 1
            }}
          />
        </div>
      </div>

      {/* Match Modal */}
      {showMatch && matchedUser && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            recycle={false}
            numberOfPieces={500}
          />
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-bounce-in">
              <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent mb-4">
                Это матч! 🎉
              </h1>
              <div className="flex justify-center gap-4 mb-6">
                <img
                  src={matchedUser.photos?.[0] || '/placeholder-user.png'}
                  alt={matchedUser.full_name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-pink-500"
                />
              </div>
              <p className="text-gray-600 mb-6">
                Вы понравились друг другу! Начните общение прямо сейчас
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowMatch(false);
                    // Navigate to chat
                  }}
                  className="w-full btn-primary"
                >
                  Написать сообщение
                </button>
                <button
                  onClick={() => setShowMatch(false)}
                  className="w-full btn-secondary"
                >
                  Продолжить свайпы
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DiscoveryPage;
