import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, MapPin, Crown } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br from-pink-50 to-red-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Главная</h1>
      
      <div className="space-y-4">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/discovery')}
          className="w-full p-6 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-3xl shadow-xl"
        >
          <Heart className="w-8 h-8 mx-auto mb-2" />
          <div className="font-bold text-lg">Начать знакомства</div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/places')}
          className="w-full p-6 bg-white rounded-3xl shadow-xl"
        >
          <MapPin className="w-8 h-8 mx-auto mb-2 text-blue-500" />
          <div className="font-bold text-lg">Куда сходить</div>
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/premium')}
          className="w-full p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl shadow-xl"
        >
          <Crown className="w-8 h-8 mx-auto mb-2" />
          <div className="font-bold text-lg">Premium</div>
        </motion.button>
      </div>
    </div>
  );
};

export default HomePage;
