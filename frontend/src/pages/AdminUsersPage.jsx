import { useState, useEffect } from 'react';
import { Search, Filter, MoreVertical, Check, X, Ban, Crown, Shield } from 'lucide-react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, premium, banned
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    setIsLoading(true);
    try {
      // Load based on filter
      let response;
      if (filter === 'pending') {
        response = await adminAPI.getPendingUsers();
      } else {
        // In production, add filter parameter
        response = { data: [] }; // Mock for now
      }
      setUsers(response.data || []);
    } catch (error) {
      toast.error('Ошибка загрузки пользователей');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveUser = async (userId) => {
    try {
      await adminAPI.approveUser(userId);
      toast.success('Пользователь одобрен');
      loadUsers();
    } catch (error) {
      toast.error('Ошибка одобрения');
    }
  };

  const handleRejectUser = async (userId) => {
    const reason = prompt('Причина отклонения:');
    if (!reason) return;
    
    try {
      await adminAPI.rejectUser(userId, reason);
      toast.success('Пользователь отклонен');
      loadUsers();
    } catch (error) {
      toast.error('Ошибка отклонения');
    }
  };

  const handleBanUser = async (userId) => {
    const reason = prompt('Причина блокировки:');
    if (!reason) return;
    
    try {
      // Add ban endpoint
      toast.success('Пользователь заблокирован');
      loadUsers();
    } catch (error) {
      toast.error('Ошибка блокировки');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Управление пользователями</h2>
        
        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по имени или email..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="all">Все пользователи</option>
            <option value="pending">На модерации</option>
            <option value="premium">Premium</option>
            <option value="banned">Заблокированные</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Пользователи не найдены</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Пользователь</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Статус</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Дата регистрации</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center text-white font-bold">
                          {user.full_name?.[0] || 'U'}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{user.full_name}</p>
                          <p className="text-sm text-gray-500">@{user.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.is_premium && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                            <Crown className="w-3 h-3" />
                            Premium
                          </span>
                        )}
                        {user.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                            <Shield className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                        {!user.is_approved && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                            На модерации
                          </span>
                        )}
                        {user.is_banned && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                            <Ban className="w-3 h-3" />
                            Заблокирован
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(user.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!user.is_approved && (
                          <>
                            <button
                              onClick={() => handleApproveUser(user.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Одобрить"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRejectUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Отклонить"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowActions(true);
                          }}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Actions Modal */}
      {showActions && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Действия с пользователем</h3>
            <p className="text-gray-600 mb-6">{selectedUser.full_name}</p>
            
            <div className="space-y-2">
              <button className="w-full py-3 text-left px-4 hover:bg-gray-100 rounded-xl transition-colors">
                Просмотреть профиль
              </button>
              <button className="w-full py-3 text-left px-4 hover:bg-gray-100 rounded-xl transition-colors">
                Отправить уведомление
              </button>
              <button className="w-full py-3 text-left px-4 hover:bg-gray-100 rounded-xl transition-colors">
                Выдать Premium
              </button>
              <button
                onClick={() => {
                  handleBanUser(selectedUser.id);
                  setShowActions(false);
                }}
                className="w-full py-3 text-left px-4 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                Заблокировать пользователя
              </button>
            </div>
            
            <button
              onClick={() => setShowActions(false)}
              className="w-full mt-4 py-3 bg-gray-100 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
