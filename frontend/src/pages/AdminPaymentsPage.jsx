import { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, DollarSign, CreditCard } from 'lucide-react';
import { adminAPI } from '../utils/api';
import toast from 'react-hot-toast';

const AdminPaymentsPage = () => {
  const [settings, setSettings] = useState({
    yoomoney_shop_id: '',
    yoomoney_secret_key: '',
    qiwi_shop_id: '',
    qiwi_secret_key: '',
    telegram_bot_token: '',
    telegram_payment_token: '',
  });
  
  const [showKeys, setShowKeys] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      if (response.data) {
        // Filter payment settings
        const paymentSettings = {};
        response.data.forEach(setting => {
          if (setting.setting_key.startsWith('payment_')) {
            const key = setting.setting_key.replace('payment_', '');
            paymentSettings[key] = setting.setting_value || '';
          }
        });
        setSettings(prev => ({ ...prev, ...paymentSettings }));
      }
    } catch (error) {
      toast.error('Ошибка загрузки настроек');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      // Save each setting
      for (const [key, value] of Object.entries(settings)) {
        await adminAPI.updateSettings(`payment_${key}`, value);
      }
      toast.success('Настройки сохранены!');
    } catch (error) {
      toast.error('Ошибка сохранения настроек');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleShowKey = (key) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Настройки платежей</h2>
            <p className="text-gray-600 mt-1">Настройте интеграцию с платежными системами</p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-5 h-5" />
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* YooMoney */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">YooMoney</h3>
              <p className="text-sm text-gray-500">Российская платежная система</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop ID
              </label>
              <input
                type="text"
                value={settings.yoomoney_shop_id}
                onChange={(e) => setSettings({ ...settings, yoomoney_shop_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Введите Shop ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.yoomoney ? 'text' : 'password'}
                  value={settings.yoomoney_secret_key}
                  onChange={(e) => setSettings({ ...settings, yoomoney_secret_key: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 pr-12"
                  placeholder="Введите Secret Key"
                />
                <button
                  onClick={() => toggleShowKey('yoomoney')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.yoomoney ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* QIWI */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">QIWI</h3>
              <p className="text-sm text-gray-500">Платежная система QIWI</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shop ID
              </label>
              <input
                type="text"
                value={settings.qiwi_shop_id}
                onChange={(e) => setSettings({ ...settings, qiwi_shop_id: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Введите Shop ID"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secret Key
              </label>
              <div className="relative">
                <input
                  type={showKeys.qiwi ? 'text' : 'password'}
                  value={settings.qiwi_secret_key}
                  onChange={(e) => setSettings({ ...settings, qiwi_secret_key: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 pr-12"
                  placeholder="Введите Secret Key"
                />
                <button
                  onClick={() => toggleShowKey('qiwi')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.qiwi ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Telegram Stars */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Telegram Stars</h3>
              <p className="text-sm text-gray-500">Оплата через Telegram</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bot Token
              </label>
              <div className="relative">
                <input
                  type={showKeys.telegram_bot ? 'text' : 'password'}
                  value={settings.telegram_bot_token}
                  onChange={(e) => setSettings({ ...settings, telegram_bot_token: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Введите Bot Token"
                />
                <button
                  onClick={() => toggleShowKey('telegram_bot')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.telegram_bot ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Token
              </label>
              <div className="relative">
                <input
                  type={showKeys.telegram_payment ? 'text' : 'password'}
                  value={settings.telegram_payment_token}
                  onChange={(e) => setSettings({ ...settings, telegram_payment_token: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  placeholder="Введите Payment Token"
                />
                <button
                  onClick={() => toggleShowKey('telegram_payment')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKeys.telegram_payment ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
          <h4 className="font-bold text-blue-900 mb-3">📝 Инструкции</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>YooMoney:</strong> Получите ключи в личном кабинете YooMoney → Настройки → API</p>
            <p><strong>QIWI:</strong> Зарегистрируйтесь на p2p.qiwi.com и создайте ключи API</p>
            <p><strong>Telegram Stars:</strong> Создайте бота через @BotFather и получите токены для платежей</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentsPage;
