import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const SettingsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full bg-white">
      <div className="p-6 border-b">
        <button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold mt-4">Настройки</h1>
      </div>
    </div>
  );
};

export default SettingsPage;
