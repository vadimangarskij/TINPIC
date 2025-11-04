import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, User } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    full_name: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Аккаунт создан!');
      navigate('/onboarding');
    } else {
      toast.error(result.error || 'Ошибка регистрации');
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-6 text-white overflow-y-auto">
      <button onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl font-bold mb-2">Создать</h1>
        <h1 className="text-4xl font-bold mb-2">аккаунт</h1>
        <p className="text-lg opacity-90 mb-8">
          Начните свой путь к любви
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="glass rounded-2xl p-4 flex items-center space-x-3">
            <Mail className="w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="flex-1 bg-transparent outline-none placeholder-white/70"
              required
            />
          </div>

          <div className="glass rounded-2xl p-4 flex items-center space-x-3">
            <User className="w-5 h-5" />
            <input
              type="text"
              placeholder="Имя пользователя"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="flex-1 bg-transparent outline-none placeholder-white/70"
              required
            />
          </div>

          <div className="glass rounded-2xl p-4 flex items-center space-x-3">
            <User className="w-5 h-5" />
            <input
              type="text"
              placeholder="Полное имя"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="flex-1 bg-transparent outline-none placeholder-white/70"
            />
          </div>

          <div className="glass rounded-2xl p-4 flex items-center space-x-3">
            <Lock className="w-5 h-5" />
            <input
              type="password"
              placeholder="Пароль"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="flex-1 bg-transparent outline-none placeholder-white/70"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm opacity-90">Пол</label>
            <div className="flex gap-2">
              {['male', 'female', 'other'].map((gender) => (
                <button
                  key={gender}
                  type="button"
                  onClick={() => setFormData({ ...formData, gender })}
                  className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                    formData.gender === gender
                      ? 'bg-white text-pink-500'
                      : 'glass'
                  }`}
                >
                  {gender === 'male' ? 'Мужской' : gender === 'female' ? 'Женский' : 'Другое'}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-pink-500 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 mt-6"
          >
            {loading ? 'Создание...' : 'Создать аккаунт'}
          </button>
        </form>

        <p className="text-center mt-6 mb-4">
          Есть аккаунт?{' '}
          <button onClick={() => navigate('/login')} className="font-bold underline">
            Войти
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
