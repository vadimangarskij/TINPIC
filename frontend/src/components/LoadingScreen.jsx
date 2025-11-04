import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-pink-500 via-red-500 to-orange-500">
      <div className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="text-6xl mb-4"
        >
          💕
        </motion.div>
        <h1 className="text-3xl font-bold text-white mb-2">ConnectSphere</h1>
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.2,
              }}
              className="w-2 h-2 bg-white rounded-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
