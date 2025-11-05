import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, TrendingUp, DollarSign, Heart, Settings, 
  Shield, FileText, Bell, BarChart3, Menu, X 
} from 'lucide-react';
import { adminAPI } from '../utils/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState('dashboard');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Dashboard', path: '/admin' },
    { id: 'users', icon: Users, label: 'Пользователи', path: '/admin/users' },
    { id: 'moderation', icon: Shield, label: 'Модерация', path: '/admin/moderation' },
    { id: 'payments', icon: DollarSign, label: 'Платежи', path: '/admin/payments' },
    { id: 'reports', icon: FileText, label: 'Жалобы', path: '/admin/reports' },
    { id: 'settings', icon: Settings, label: 'Настройки', path: '/admin/settings' },
  ];

  const statsCards = [
    { 
      title: 'Всего пользователей', 
      value: stats?.total_users || 0, 
      change: '+12%',
      icon: Users,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      title: 'Активных сегодня', 
      value: stats?.active_today || 0,
      change: '+5%',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500'
    },
    { 
      title: 'Premium подписок', 
      value: stats?.premium_users || 0,
      change: '+8%',
      icon: DollarSign,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      title: 'Матчей сегодня', 
      value: stats?.matches_today || 0,
      change: '+15%',
      icon: Heart,
      color: 'from-pink-500 to-red-500'
    },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Загрузка админ-панели...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
            ConnectSphere
          </h1>
          <p className="text-sm text-gray-500 mt-1">Admin Panel</p>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setSelectedMenu(item.id);
                navigate(item.path);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                selectedMenu === item.id
                  ? 'bg-gradient-to-r from-pink-500 to-orange-500 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
              A
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-800 text-sm">Admin</p>
              <p className="text-xs text-gray-500">Администратор</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Обзор статистики приложения</p>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                    <card.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-green-500 text-sm font-semibold">{card.change}</span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{card.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{card.value.toLocaleString()}</p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* User Growth Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Рост пользователей</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[40, 65, 55, 80, 70, 90, 85].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-pink-500 to-orange-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Доход</h3>
              <div className="h-64 flex items-end justify-between gap-2">
                {[30, 45, 60, 50, 75, 65, 80].map((height, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-emerald-500 rounded-t-lg transition-all hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'][idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Последняя активность</h3>
            <div className="space-y-4">
              {[
                { user: 'Анна И.', action: 'зарегистрировалась', time: '2 минуты назад', type: 'user' },
                { user: 'Дмитрий П.', action: 'создал матч', time: '5 минут назад', type: 'match' },
                { user: 'Мария С.', action: 'оформила Premium', time: '10 минут назад', type: 'premium' },
                { user: 'Иван К.', action: 'отправил жалобу', time: '15 минут назад', type: 'report' },
              ].map((activity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600' :
                    activity.type === 'match' ? 'bg-pink-100 text-pink-600' :
                    activity.type === 'premium' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {activity.type === 'user' && <Users className="w-5 h-5" />}
                    {activity.type === 'match' && <Heart className="w-5 h-5" />}
                    {activity.type === 'premium' && <DollarSign className="w-5 h-5" />}
                    {activity.type === 'report' && <Bell className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">
                      <span className="font-bold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
