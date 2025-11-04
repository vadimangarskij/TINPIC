import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { getUserLocation, verifyLocation } from '../utils/geolocation';

const OnboardingPage = () => {
  const navigate = useNavigate();
  const updateProfile = useAuthStore(state => state.updateProfile);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    
    // Get location
    try {
      const location = await getUserLocation();
      await updateProfile({ 
        onboarding_completed: true,
        latitude: location.latitude,
        longitude: location.longitude 
      });
      
      toast.success('Профиль настроен!');
      navigate('/');
    } catch (error) {
      toast.error('Разрешите доступ к геолокации');
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-500 via-red-500 to-orange-500">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="text-center text-white"
      >
        <div className="text-6xl mb-4">📍</div>
        <h1 className="text-3xl font-bold mb-4">Разрешите геолокацию</h1>
        <p className="text-lg mb-8 opacity-90">
          Мы покажем вам людей поблизости
        </p>
        
        <button
          onClick={handleComplete}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Настройка...' : 'Продолжить'}
        </button>
      </motion.div>
    </div>
  );
};

export default OnboardingPage;
