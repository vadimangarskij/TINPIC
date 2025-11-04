import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown } from 'lucide-react';

const PremiumPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-gradient-to-br from-purple-500 to-pink-500 text-white">
      <div className="p-6">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      
      <div className="flex flex-col items-center justify-center px-6">
        <Crown className="w-20 h-20 mb-4" />
        <h1 className="text-4xl font-bold mb-2">Premium</h1>
        <p className="text-center text-lg opacity-90">
          Получите больше возможностей
        </p>
      </div>
    </div>
  );
};

export default PremiumPage;
