import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Добро пожаловать!');
      navigate('/');
    } else {
      toast.error(result.error || 'Ошибка входа');
    }
    
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col p-6 text-white">
      <button onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex-1 flex flex-col items-center justify-center"
      >
        <div className="w-full max-w-md text-center mb-8">
          <h1 className="text-4xl font-bold mb-3">Добро пожаловать!</h1>
          <p className="text-lg opacity-90">
            Войдите в свой аккаунт
          </p>
        </div>

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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-pink-500 rounded-full font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50"
          >
            {loading ? 'Загрузка...' : 'Войти'}
          </button>
        </form>

        <p className="text-center mt-6">
          Нет аккаунта?{' '}
          <button
            onClick={() => navigate('/register')}
            className="font-bold underline"
          >
            Зарегистрироваться
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
