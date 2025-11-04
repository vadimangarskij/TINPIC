import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users, Zap } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Zap, text: 'Мгновенные совпадения', color: 'from-yellow-400 to-orange-500' },
    { icon: Sparkles, text: 'Умная совместимость', color: 'from-purple-400 to-pink-500' },
    { icon: Users, text: 'Проверенные анкеты', color: 'from-blue-400 to-cyan-500' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center px-6 text-white relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 right-10 w-40 h-40 bg-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="text-center mb-8"
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-white/20 rounded-full blur-xl" />
            <div className="relative text-7xl">💕</div>
          </div>
        </motion.div>
        
        <h1 className="text-5xl font-bold mb-3 tracking-tight">
          ConnectSphere
        </h1>
        <p className="text-lg text-white/90 font-medium">
          Найдите свою идеальную пару
        </p>
      </motion.div>

      {/* Features - More compact */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="w-full max-w-sm mb-8"
      >
        <div className="grid grid-cols-1 gap-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center flex-shrink-0`}>
                <feature.icon className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-semibold text-sm">{feature.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full max-w-sm space-y-3"
      >
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 bg-white text-pink-600 rounded-2xl font-bold text-base shadow-2xl hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Создать аккаунт
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl font-semibold text-base hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Уже есть аккаунт
        </button>
      </motion.div>

      {/* Bottom safe area */}
      <div className="h-8" />
    </div>
  );
};

export default WelcomePage;
