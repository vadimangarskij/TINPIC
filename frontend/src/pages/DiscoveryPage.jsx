import { motion } from 'framer-motion';

const DiscoveryPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center p-6"
      >
        <div className="text-6xl mb-4">❤️</div>
        <h2 className="text-2xl font-bold mb-2">Открытия</h2>
        <p className="text-gray-600">Свайпинг карточек</p>
      </motion.div>
    </div>
  );
};

export default DiscoveryPage;
