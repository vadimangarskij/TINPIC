import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Sparkles, MapPin, MessageCircle, Crown, Gift, 
  Shield, RefreshCw, Eye, Zap, Palette, Award, TrendingUp, Lock,
  CheckCircle, AlertTriangle, DollarSign, CreditCard
} from 'lucide-react';

const FeaturesPage = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    { 
      icon: Heart, 
      title: 'Умный свайпинг', 
      desc: 'Интерфейс в стиле Tinder с плавными анимациями',
      color: 'from-pink-500 to-red-500'
    },
    { 
      icon: Sparkles, 
      title: 'AI совместимость', 
      desc: 'Система подбора на основе интересов и личности',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: MapPin, 
      title: 'Геолокация', 
      desc: 'Находите людей рядом с вами',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: MessageCircle, 
      title: 'Реал-тайм чат', 
      desc: 'Мгновенные сообщения с матчами',
      color: 'from-green-500 to-teal-500'
    },
    { 
      icon: Crown, 
      title: 'Премиум функции', 
      desc: 'Неограниченные лайки, супер-лайки, перемотка',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      icon: Gift, 
      title: 'Виртуальные подарки', 
      desc: 'Система монет и подарков',
      color: 'from-red-500 to-pink-500'
    },
    { 
      icon: Shield, 
      title: 'Верификация', 
      desc: 'Подтвержденные профили для безопасности',
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      icon: Palette, 
      title: 'Кастомизация', 
      desc: 'Темы, бейджи, рамки для премиум пользователей',
      color: 'from-violet-500 to-fuchsia-500'
    },
  ];

  const premiumFeatures = [
    { icon: Zap, text: 'Неограниченные лайки и супер-лайки' },
    { icon: RefreshCw, text: 'Отмена последнего свайпа' },
    { icon: Eye, text: 'Просмотр кто вас лайкнул' },
    { icon: TrendingUp, text: 'Буст профиля (топ выдачи на 30 мин)' },
    { icon: Palette, text: 'Кастомные темы и анимации' },
    { icon: Award, text: 'Эксклюзивные бейджи' },
    { icon: TrendingUp, text: 'Расширенная аналитика профиля' },
  ];

  const securityFeatures = [
    { icon: CheckCircle, text: 'Верификация фото' },
    { icon: Sparkles, text: 'Модерация контента с AI' },
    { icon: AlertTriangle, text: 'Система жалоб и блокировок' },
    { icon: Lock, text: 'Приватность настроек' },
    { icon: Shield, text: 'Шифрование данных' },
  ];

  const pricingPlans = [
    { icon: DollarSign, title: 'Подписка Premium', price: '499₽/месяц или 2999₽/год' },
    { icon: Gift, title: 'Виртуальные монеты', price: 'Для подарков и бустов' },
    { icon: CreditCard, title: 'Российские платежи', price: 'ЮMoney, QIWI, Telegram Stars' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 via-purple-50 to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Возможности</h1>
      </div>

      <div className="p-6 space-y-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            ConnectSphere - Всё для вашей любви
          </h2>
          <p className="text-gray-600">
            Современное приложение для знакомств с AI и премиум функциями
          </p>
        </div>

        {/* Main Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500" />
            Основные возможности
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mainFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3`}>
                  <feature.icon className="w-6 h-6 text-white" strokeWidth={2} />
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            Премиум возможности
          </h3>
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white">
            <div className="space-y-3">
              {premiumFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/premium')}
              className="w-full mt-6 py-3 bg-white text-purple-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Перейти на Premium
            </button>
          </div>
        </div>

        {/* Security Features */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-500" />
            Безопасность
          </h3>
          <div className="bg-white rounded-3xl p-6 shadow-md">
            <div className="space-y-3">
              {securityFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-gray-800 font-medium">{feature.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-blue-500" />
            Монетизация
          </h3>
          <div className="space-y-3">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 shadow-md flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800">{plan.title}</h4>
                  <p className="text-sm text-gray-600">{plan.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 rounded-3xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-3">Готовы начать?</h3>
          <p className="mb-6 text-white/90">
            Присоединяйтесь к тысячам счастливых пар уже сегодня!
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-colors"
          >
            Создать аккаунт бесплатно
          </button>
        </div>

        <div className="h-8" /> {/* Bottom spacing */}
      </div>
    </div>
  );
};

export default FeaturesPage;
