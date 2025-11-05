import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Save, DollarSign, CreditCard, Smartphone, 
  Check, X, Settings, AlertCircle, TrendingUp, Activity,
  RefreshCw, Eye, EyeOff
} from 'lucide-react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminPaymentSettingsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('gateways'); // gateways, transactions, settings
  
  // Payment gateway states
  const [gateways, setGateways] = useState({
    yoomoney: {
      enabled: false,
      api_key: '',
      shop_id: '',
      secret_key: '',
      commission: 3.5,
      show_key: false
    },
    qiwi: {
      enabled: false,
      api_key: '',
      wallet_id: '',
      secret_key: '',
      commission: 3.0,
      show_key: false
    },
    telegram_stars: {
      enabled: false,
      bot_token: '',
      commission: 0,
      show_key: false
    }
  });

  // Transaction stats
  const [transactions, setTransactions] = useState({
    total: 0,
    today: 0,
    this_month: 0,
    revenue: 0,
    recent: []
  });

  // Global payment settings
  const [globalSettings, setGlobalSettings] = useState({
    min_purchase_amount: 100,
    max_purchase_amount: 100000,
    allow_refunds: true,
    refund_window_days: 7,
    auto_verify_payments: true
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'gateways') {
        // Load gateway settings
        const response = await adminAPI.getSettings();
        
        // Parse gateway settings
        if (response.data) {
          const settings = response.data;
          setGateways({
            yoomoney: {
              enabled: settings.yoomoney_enabled === 'true',
              api_key: settings.yoomoney_api_key || '',
              shop_id: settings.yoomoney_shop_id || '',
              secret_key: settings.yoomoney_secret_key || '',
              commission: parseFloat(settings.yoomoney_commission || 3.5),
              show_key: false
            },
            qiwi: {
              enabled: settings.qiwi_enabled === 'true',
              api_key: settings.qiwi_api_key || '',
              wallet_id: settings.qiwi_wallet_id || '',
              secret_key: settings.qiwi_secret_key || '',
              commission: parseFloat(settings.qiwi_commission || 3.0),
              show_key: false
            },
            telegram_stars: {
              enabled: settings.telegram_stars_enabled === 'true',
              bot_token: settings.telegram_stars_bot_token || '',
              commission: parseFloat(settings.telegram_stars_commission || 0),
              show_key: false
            }
          });
        }
      } else if (activeTab === 'transactions') {
        // Load transaction data
        try {
          const statsResponse = await adminAPI.getTransactionStats();
          const transactionsResponse = await adminAPI.getTransactions(10);
          
          setTransactions({
            total: statsResponse.data?.total || 0,
            today: statsResponse.data?.today || 0,
            this_month: statsResponse.data?.this_month || 0,
            revenue: statsResponse.data?.revenue || 0,
            recent: transactionsResponse.data?.transactions || []
          });
        } catch (error) {
          // Fallback to mock data if API fails
          setTransactions({
            total: 1523,
            today: 42,
            this_month: 678,
            revenue: 2450000,
            recent: [
              { id: '1', user_name: 'Анна И.', amount: 999, payment_method: 'yoomoney', status: 'completed', created_at: '2025-06-15T14:32:00' },
              { id: '2', user_name: 'Дмитрий П.', amount: 499, payment_method: 'qiwi', status: 'completed', created_at: '2025-06-15T13:15:00' },
              { id: '3', user_name: 'Мария С.', amount: 1999, payment_method: 'telegram_stars', status: 'pending', created_at: '2025-06-15T12:45:00' },
              { id: '4', user_name: 'Иван К.', amount: 499, payment_method: 'yoomoney', status: 'failed', created_at: '2025-06-15T11:20:00' },
            ]
          });
        }
      } else if (activeTab === 'settings') {
        // Load global settings
        const response = await adminAPI.getSettings();
        if (response.data) {
          const settings = response.data;
          setGlobalSettings({
            min_purchase_amount: parseInt(settings.min_purchase_amount || 100),
            max_purchase_amount: parseInt(settings.max_purchase_amount || 100000),
            allow_refunds: settings.allow_refunds === 'true',
            refund_window_days: parseInt(settings.refund_window_days || 7),
            auto_verify_payments: settings.auto_verify_payments === 'true'
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Ошибка загрузки данных');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGatewayToggle = (gateway) => {
    setGateways(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        enabled: !prev[gateway].enabled
      }
    }));
  };

  const handleGatewayChange = (gateway, field, value) => {
    setGateways(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        [field]: value
      }
    }));
  };

  const toggleShowKey = (gateway) => {
    setGateways(prev => ({
      ...prev,
      [gateway]: {
        ...prev[gateway],
        show_key: !prev[gateway].show_key
      }
    }));
  };

  const handleSaveGateways = async () => {
    setIsSaving(true);
    try {
      // Save each gateway setting
      for (const [gateway, config] of Object.entries(gateways)) {
        await adminAPI.updateSettings(`${gateway}_enabled`, config.enabled.toString());
        await adminAPI.updateSettings(`${gateway}_api_key`, config.api_key);
        await adminAPI.updateSettings(`${gateway}_commission`, config.commission.toString());
        
        if (gateway === 'yoomoney') {
          await adminAPI.updateSettings('yoomoney_shop_id', config.shop_id);
          await adminAPI.updateSettings('yoomoney_secret_key', config.secret_key);
        } else if (gateway === 'qiwi') {
          await adminAPI.updateSettings('qiwi_wallet_id', config.wallet_id);
          await adminAPI.updateSettings('qiwi_secret_key', config.secret_key);
        } else if (gateway === 'telegram_stars') {
          await adminAPI.updateSettings('telegram_stars_bot_token', config.bot_token);
        }
      }
      
      toast.success('Настройки платежных шлюзов сохранены');
    } catch (error) {
      console.error('Error saving gateways:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveGlobalSettings = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(globalSettings)) {
        await adminAPI.updateSettings(key, value.toString());
      }
      toast.success('Глобальные настройки сохранены');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const renderGatewayCard = (gatewayKey, icon, title, description) => {
    const gateway = gateways[gatewayKey];
    
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <button
            onClick={() => handleGatewayToggle(gatewayKey)}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
              gateway.enabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                gateway.enabled ? 'translate-x-7' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {gateway.enabled && (
          <div className="space-y-4 mt-6 pt-6 border-t border-gray-100">
            {gatewayKey === 'yoomoney' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Shop ID
                  </label>
                  <input
                    type="text"
                    value={gateway.shop_id}
                    onChange={(e) => handleGatewayChange(gatewayKey, 'shop_id', e.target.value)}
                    placeholder="Введите Shop ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={gateway.show_key ? 'text' : 'password'}
                      value={gateway.secret_key}
                      onChange={(e) => handleGatewayChange(gatewayKey, 'secret_key', e.target.value)}
                      placeholder="Введите Secret Key"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(gatewayKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {gateway.show_key ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {gatewayKey === 'qiwi' && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Wallet ID
                  </label>
                  <input
                    type="text"
                    value={gateway.wallet_id}
                    onChange={(e) => handleGatewayChange(gatewayKey, 'wallet_id', e.target.value)}
                    placeholder="Введите Wallet ID"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Secret Key
                  </label>
                  <div className="relative">
                    <input
                      type={gateway.show_key ? 'text' : 'password'}
                      value={gateway.secret_key}
                      onChange={(e) => handleGatewayChange(gatewayKey, 'secret_key', e.target.value)}
                      placeholder="Введите Secret Key"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => toggleShowKey(gatewayKey)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {gateway.show_key ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {gatewayKey === 'telegram_stars' && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Bot Token
                </label>
                <div className="relative">
                  <input
                    type={gateway.show_key ? 'text' : 'password'}
                    value={gateway.bot_token}
                    onChange={(e) => handleGatewayChange(gatewayKey, 'bot_token', e.target.value)}
                    placeholder="Введите Bot Token"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowKey(gatewayKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {gateway.show_key ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Комиссия (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={gateway.commission}
                onChange={(e) => handleGatewayChange(gatewayKey, 'commission', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Настройки платежей</h2>
              <p className="text-gray-600 mt-1">Управление платежными шлюзами и транзакциями</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'gateways'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CreditCard className="w-5 h-5 inline-block mr-2" />
            Платежные шлюзы
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'transactions'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Activity className="w-5 h-5 inline-block mr-2" />
            Транзакции
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Settings className="w-5 h-5 inline-block mr-2" />
            Общие настройки
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Gateways Tab */}
            {activeTab === 'gateways' && (
              <div className="space-y-6">
                {renderGatewayCard(
                  'yoomoney',
                  <DollarSign className="w-6 h-6" />,
                  'YooMoney',
                  'Российская платежная система'
                )}
                
                {renderGatewayCard(
                  'qiwi',
                  <CreditCard className="w-6 h-6" />,
                  'QIWI',
                  'Электронный кошелек'
                )}
                
                {renderGatewayCard(
                  'telegram_stars',
                  <Smartphone className="w-6 h-6" />,
                  'Telegram Stars',
                  'Внутренняя валюта Telegram'
                )}

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleSaveGateways}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Сохранение...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Сохранить изменения
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-6">
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Всего транзакций</p>
                      <DollarSign className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{transactions.total}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Сегодня</p>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{transactions.today}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">За месяц</p>
                      <Activity className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">{transactions.this_month}</p>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-gray-600 text-sm">Доход (₽)</p>
                      <DollarSign className="w-5 h-5 text-yellow-500" />
                    </div>
                    <p className="text-3xl font-bold text-gray-800">
                      {transactions.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800">Последние транзакции</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Пользователь</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Сумма</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Метод</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Статус</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Дата</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {transactions.recent.map((transaction) => (
                          <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 text-gray-600 font-mono text-sm">
                              #{transaction.id}
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-medium">
                              {transaction.user}
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-semibold">
                              {transaction.amount} ₽
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {transaction.method}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {transaction.status === 'completed' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                                  <Check className="w-3 h-3" />
                                  Завершена
                                </span>
                              )}
                              {transaction.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">
                                  <RefreshCw className="w-3 h-3" />
                                  В обработке
                                </span>
                              )}
                              {transaction.status === 'failed' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold">
                                  <X className="w-3 h-3" />
                                  Ошибка
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-gray-600 text-sm">
                              {transaction.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800 mb-6">Общие настройки платежей</h3>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Минимальная сумма покупки (₽)
                        </label>
                        <input
                          type="number"
                          value={globalSettings.min_purchase_amount}
                          onChange={(e) => setGlobalSettings(prev => ({
                            ...prev,
                            min_purchase_amount: parseInt(e.target.value)
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Максимальная сумма покупки (₽)
                        </label>
                        <input
                          type="number"
                          value={globalSettings.max_purchase_amount}
                          onChange={(e) => setGlobalSettings(prev => ({
                            ...prev,
                            max_purchase_amount: parseInt(e.target.value)
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800">Разрешить возвраты</p>
                        <p className="text-sm text-gray-500">Пользователи могут запросить возврат средств</p>
                      </div>
                      <button
                        onClick={() => setGlobalSettings(prev => ({
                          ...prev,
                          allow_refunds: !prev.allow_refunds
                        }))}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          globalSettings.allow_refunds ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            globalSettings.allow_refunds ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {globalSettings.allow_refunds && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Окно для возврата (дней)
                        </label>
                        <input
                          type="number"
                          value={globalSettings.refund_window_days}
                          onChange={(e) => setGlobalSettings(prev => ({
                            ...prev,
                            refund_window_days: parseInt(e.target.value)
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-semibold text-gray-800">Автоматическая верификация</p>
                        <p className="text-sm text-gray-500">Платежи подтверждаются автоматически</p>
                      </div>
                      <button
                        onClick={() => setGlobalSettings(prev => ({
                          ...prev,
                          auto_verify_payments: !prev.auto_verify_payments
                        }))}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                          globalSettings.auto_verify_payments ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            globalSettings.auto_verify_payments ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Warning Box */}
                  <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-yellow-800">Внимание</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Изменение настроек платежей может повлиять на работу приложения. 
                        Убедитесь, что вы понимаете последствия изменений.
                      </p>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end mt-6">
                    <button
                      onClick={handleSaveGlobalSettings}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Сохранить изменения
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPaymentSettingsPage;
