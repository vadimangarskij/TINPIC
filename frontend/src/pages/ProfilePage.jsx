import { motion } from 'framer-motion';
import { useAuthStore } from '../stores/authStore';

const ProfilePage = () => {
  const user = useAuthStore(state => state.user);

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6">Профиль</h1>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-3xl p-6 shadow-xl"
      >
        <div className="text-6xl text-center mb-4">👤</div>
        <h2 className="text-2xl font-bold text-center mb-2">
          {user?.full_name || user?.username || 'Пользователь'}
        </h2>
        <p className="text-center text-gray-600">{user?.email}</p>
      </motion.div>
    </div>
  );
};

export default ProfilePage;
