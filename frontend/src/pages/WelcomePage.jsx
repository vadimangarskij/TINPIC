import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Users } from 'lucide-react';

const WelcomePage = () => {
  const navigate = useNavigate();

  const features = [
    { icon: Heart, text: 'AI-подбор пары' },
    { icon: Sparkles, text: 'Умная совместимость' },
    { icon: Users, text: 'Реальные знакомства' },
  ];

  return (
    <div className="h-full flex flex-col items-center justify-between p-6 text-white">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', duration: 0.8 }}
        className="flex-1 flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-8xl mb-4"
          >
            💕
          </motion.div>
          <h1 className="text-5xl font-display font-bold mb-2 text-glow">
            ConnectSphere
          </h1>
          <p className="text-xl opacity-90">
            Найдите свою идеальную пару
          </p>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="space-y-4 w-full"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-center space-x-3 glass rounded-2xl p-4"
          >
            <feature.icon className="w-6 h-6" />
            <span className="font-medium">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Buttons */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="w-full space-y-3 pb-safe"
      >
        <button
          onClick={() => navigate('/register')}
          className="w-full py-4 bg-white text-pink-500 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform"
        >
          Создать аккаунт
        </button>
        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 glass rounded-full font-bold text-lg hover:scale-105 active:scale-95 transition-transform"
        >
          Уже есть аккаунт
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
