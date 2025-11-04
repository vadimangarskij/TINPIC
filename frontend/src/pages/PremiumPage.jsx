import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Check, X as CloseIcon, Sparkles, Zap, Eye, RefreshCw, Star } from 'lucide-react';
import { premiumAPI } from '../utils/api';
import toast from 'react-hot-toast';

const PremiumPage = () => {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [isProcessing, setIsProcessing] = useState(false);

  const features = [
    { icon: Zap, text: 'Безлимитные свайпы', premium: true },
    { icon: Star, text: 'Безлимитные Super Likes', premium: true },
    { icon: Eye, text: 'Смотрите, кто вас лайкнул', premium: true },
    { icon: RefreshCw, text: 'Отменяйте свайпы', premium: true },
    { icon: Crown, text: 'Профильный значок Premium', premium: true },
    { icon: Sparkles, text: 'Буст профиля 1x в месяц', premium: true },
    { icon: Check, text: 'Приоритет в показе', premium: true },
    { icon: Check, text: 'Режим невидимки', premium: true },
    { icon: Check, text: 'Продвинутые фильтры', premium: true },
    { icon: Check, text: 'Отключение рекламы', premium: true },
  ];

  const plans = [
    {
      id: 'monthly',
      name: 'Месячная',
      price: 990,
      period: 'месяц',
      savings: null,
      popular: false
    },
    {
      id: 'quarterly',
      name: '3 месяца',
      price: 2490,
      pricePerMonth: 830,
      period: '3 месяца',
      savings: '16%',
      popular: true
    },
    {
      id: 'yearly',
      name: 'Годовая',
      price: 7990,
      pricePerMonth: 666,
      period: 'год',
      savings: '33%',
      popular: false
    }
  ];

  const handleSubscribe = async () => {
    setIsProcessing(true);
    try {
      const result = await premiumAPI.subscribe(selectedPlan, 'card');
      if (result.data.success) {
        toast.success('Поздравляем с Premium подпиской! 🎉');
        // Redirect to payment or success page
      } else {
        toast.error('Ошибка оформления подписки');
      }
    } catch (error) {
      toast.error('Не удалось оформить подписку');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500">
      {/* Header */}
      <div className="relative pt-12 pb-8 px-6 text-center text-white">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
        >
          <CloseIcon className="w-6 h-6" />
        </button>

        <div className="mb-4">
          <Crown className="w-20 h-20 mx-auto mb-4 text-yellow-300" strokeWidth={1.5} />
          <h1 className="text-4xl font-bold mb-2">ConnectSphere Premium</h1>
          <p className="text-white/90 text-lg">
            Найдите свою любовь быстрее
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="px-6 mb-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">
            Что вы получаете:
          </h2>
          <div className="space-y-3">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-3 text-white">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 mb-8">
        <h2 className="text-xl font-bold text-white mb-4 text-center">
          Выберите план:
        </h2>
        <div className="space-y-3">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`w-full rounded-2xl p-5 transition-all relative ${
                selectedPlan === plan.id
                  ? 'bg-white text-gray-800 shadow-2xl scale-105'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-800 px-4 py-1 rounded-full text-xs font-bold">
                  ПОПУЛЯРНЫЙ
                </div>
              )}
              
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h3 className="font-bold text-lg mb-1">{plan.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{plan.price}₽</span>
                    {plan.pricePerMonth && (
                      <span className="text-sm opacity-70">
                        ({plan.pricePerMonth}₽/мес)
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="text-right">
                  {plan.savings && (
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold mb-1">
                      Экономия {plan.savings}
                    </div>
                  )}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedPlan === plan.id
                      ? 'border-purple-600 bg-purple-600'
                      : 'border-current'
                  }`}>
                    {selectedPlan === plan.id && (
                      <Check className="w-4 h-4 text-white" strokeWidth={3} />
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-safe sticky bottom-0 bg-gradient-to-t from-purple-600 pt-4">
        <button
          onClick={handleSubscribe}
          disabled={isProcessing}
          className="w-full bg-white text-purple-600 font-bold py-4 rounded-full shadow-2xl hover:shadow-3xl transition-all disabled:opacity-50 mb-4"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              Обработка...
            </span>
          ) : (
            <span>Продолжить</span>
          )}
        </button>
        
        <p className="text-white/70 text-xs text-center mb-6">
          Подписка автоматически продлевается. Отменить можно в любой момент в настройках.
        </p>
      </div>

      {/* Testimonials */}
      <div className="px-6 py-8 bg-white/5 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Что говорят наши пользователи:
        </h2>
        <div className="space-y-4">
          {[
            {
              name: 'Анна, 28',
              text: 'С Premium я нашла свою вторую половинку за 2 недели! Супер лайки реально работают 💕',
              rating: 5
            },
            {
              name: 'Дмитрий, 32',
              text: 'Возможность видеть, кто лайкнул меня, сильно упростила поиск. Рекомендую!',
              rating: 5
            },
            {
              name: 'Мария, 25',
              text: 'Безлимитные свайпы это must have! Без Premium было бы сложно найти того самого.',
              rating: 5
            }
          ].map((review, idx) => (
            <div
              key={idx}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-white text-sm mb-2">{review.text}</p>
              <p className="text-white/60 text-xs font-semibold">{review.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="h-20" /> {/* Bottom spacing */}
    </div>
  );
};

export default PremiumPage;
