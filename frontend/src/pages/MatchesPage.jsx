import { motion } from 'framer-motion';

const MatchesPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gray-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center p-6"
      >
        <div className="text-6xl mb-4">💬</div>
        <h2 className="text-2xl font-bold mb-2">Чаты</h2>
        <p className="text-gray-600">Ваши совпадения</p>
      </motion.div>
    </div>
  );
};

export default MatchesPage;
