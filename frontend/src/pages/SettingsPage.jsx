import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Shield, CreditCard, LogOut, User, Lock, HelpCircle, Info } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Вы вышли из аккаунта');
    navigate('/welcome');
  };

  const settings = [
    { icon: User, label: 'Редактировать профиль', path: '/settings/edit-profile', color: 'text-blue-500' },
    { icon: Bell, label: 'Уведомления', path: '/settings/notifications', color: 'text-purple-500' },
    { icon: Shield, label: 'Приватность и безопасность', path: '/settings/privacy', color: 'text-green-500' },
    { icon: CreditCard, label: 'Подписка и платежи', path: '/premium', color: 'text-orange-500' },
    { icon: Lock, label: 'Изменить пароль', path: '/settings/password', color: 'text-red-500' },
    { icon: HelpCircle, label: 'Помощь и поддержка', path: '/settings/help', color: 'text-cyan-500' },
    { icon: Info, label: 'О приложении', path: '/settings/about', color: 'text-gray-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Настройки</h1>
      </div>

      {/* User Info */}
      <div className="bg-white p-6 mb-2">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.full_name?.[0] || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">{user?.full_name || 'Пользователь'}</h2>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white">
          {settings.map((setting, idx) => (
            <button
              key={idx}
              onClick={() => navigate(setting.path)}
              className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100"
            >
              <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${setting.color}`}>
                <setting.icon className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left font-medium text-gray-800">{setting.label}</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ))}
        </div>

        {/* Logout Button */}
        <div className="p-6">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 font-semibold py-4 rounded-2xl hover:bg-red-100 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Выйти из аккаунта
          </button>
        </div>

        {/* Version */}
        <div className="text-center text-sm text-gray-400 pb-6">
          ConnectSphere v2.0.0
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-2">Выйти из аккаунта?</h3>
            <p className="text-gray-600 mb-6">Вы уверены, что хотите выйти?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-800 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
