import { motion } from 'framer-motion';

const PlacesPage = () => {
  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Куда сходить</h1>
      
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center p-12"
      >
        <div className="text-6xl mb-4">📍</div>
        <h2 className="text-2xl font-bold mb-2">Места для свиданий</h2>
        <p className="text-gray-600">Рестораны, кафе, парки</p>
      </motion.div>
    </div>
  );
};

export default PlacesPage;
