import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, X, Plus, Upload } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    bio: user?.bio || '',
    job_title: user?.job_title || '',
    company: user?.company || '',
    education: user?.education || '',
    city: user?.city || '',
    height: user?.height || '',
    interests: user?.interests || [],
    smoking: user?.smoking || 'prefer_not_say',
    drinking: user?.drinking || 'prefer_not_say',
    pets: user?.pets || 'none',
    exercise: user?.exercise || 'sometimes',
  });
  
  const [photos, setPhotos] = useState(user?.photos || []);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newInterest, setNewInterest] = useState('');

  const handlePhotoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    if (photos.length + files.length > 6) {
      toast.error('Максимум 6 фотографий');
      return;
    }

    setIsUploading(true);
    
    try {
      // Convert to base64 for now (in production, upload to Supabase Storage)
      const newPhotos = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      setPhotos([...photos, ...newPhotos]);
      toast.success('Фото загружены!');
    } catch (error) {
      toast.error('Ошибка загрузки фото');
    } finally {
      setIsUploading(false);
    }
  };

  const removePhoto = (index) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (newInterest.trim() && formData.interests.length < 10) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (index) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter((_, i) => i !== index)
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const result = await updateProfile({
        ...formData,
        photos
      });
      
      if (result.success) {
        toast.success('Профиль обновлен!');
        navigate('/profile');
      } else {
        toast.error(result.error || 'Ошибка обновления');
      }
    } catch (error) {
      toast.error('Ошибка сохранения');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-800">Редактировать профиль</h1>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Photos Section */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-3">Фотографии</h2>
          <p className="text-sm text-gray-600 mb-4">Добавьте до 6 фотографий</p>
          
          <div className="grid grid-cols-3 gap-3">
            {photos.map((photo, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-2xl"
                />
                <button
                  onClick={() => removePhoto(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                    Главная
                  </div>
                )}
              </div>
            ))}
            
            {photos.length < 6 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center hover:border-pink-500 hover:bg-pink-50 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-8 h-8 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-500">Добавить</span>
                  </>
                )}
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="hidden"
          />
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Основная информация</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ваше имя"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">О себе</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              placeholder="Расскажите о себе..."
            />
            <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500</p>
          </div>
        </div>

        {/* Work & Education */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Работа и образование</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Профессия</label>
            <input
              type="text"
              value={formData.job_title}
              onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ваша профессия"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Компания</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Где вы работаете"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Образование</label>
            <input
              type="text"
              value={formData.education}
              onChange={(e) => setFormData({ ...formData, education: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Учебное заведение"
            />
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Местоположение</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Ваш город"
            />
          </div>
        </div>

        {/* Interests */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Интересы</h2>
          <p className="text-sm text-gray-600 mb-4">Добавьте до 10 интересов</p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addInterest()}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Добавить интерес"
              maxLength={20}
            />
            <button
              onClick={addInterest}
              className="px-4 py-2 bg-pink-500 text-white rounded-xl hover:bg-pink-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.interests.map((interest, index) => (
              <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-100 to-orange-100 text-pink-700 rounded-full"
              >
                <span className="text-sm font-medium">{interest}</span>
                <button
                  onClick={() => removeInterest(index)}
                  className="hover:bg-pink-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="bg-white rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-800 mb-3">Образ жизни</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Курение</label>
            <select
              value={formData.smoking}
              onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="never">Никогда</option>
              <option value="socially">Иногда</option>
              <option value="regularly">Регулярно</option>
              <option value="prefer_not_say">Предпочитаю не говорить</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Алкоголь</label>
            <select
              value={formData.drinking}
              onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="never">Никогда</option>
              <option value="socially">Социально</option>
              <option value="regularly">Регулярно</option>
              <option value="prefer_not_say">Предпочитаю не говорить</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Питомцы</label>
            <select
              value={formData.pets}
              onChange={(e) => setFormData({ ...formData, pets: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="none">Нет</option>
              <option value="dog">Собака</option>
              <option value="cat">Кошка</option>
              <option value="other">Другое</option>
              <option value="love_pets">Люблю животных</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Спорт</label>
            <select
              value={formData.exercise}
              onChange={(e) => setFormData({ ...formData, exercise: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="never">Никогда</option>
              <option value="sometimes">Иногда</option>
              <option value="regularly">Регулярно</option>
              <option value="very_active">Очень активен</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
