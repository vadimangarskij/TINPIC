import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Pages
import WelcomePage from './pages/WelcomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import HomePage from './pages/HomePage';
import DiscoveryPage from './pages/DiscoveryPage';
import MatchesPage from './pages/MatchesPage';
import ChatPage from './pages/ChatPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PremiumPage from './pages/PremiumPage';
import SettingsPage from './pages/SettingsPage';
import FeaturesPage from './pages/FeaturesPage';
import EditProfilePage from './pages/EditProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsersPage from './pages/AdminUsersPage';
import AdminPaymentSettingsPage from './pages/AdminPaymentSettingsPage';

// Components
import BottomNav from './components/BottomNav';
import LoadingScreen from './components/LoadingScreen';
import PWAPrompt from './components/PWAPrompt';

// Layout для защищенных маршрутов
const ProtectedLayout = ({ children }) => {
  return (
    <div className="h-full flex flex-col bg-gray-50">
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

// Layout для авторизации
const AuthLayout = ({ children }) => {
  return (
    <div className="h-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-500">
      {children}
    </div>
  );
};

function App() {
  const { user, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Проверка на desktop и предложение открыть как PWA
  useEffect(() => {
    const isDesktop = window.innerWidth >= 768;
    const isPWA = window.matchMedia('(display-mode: standalone)').matches;
    
    if (isDesktop && !isPWA) {
      // Показать модальное окно с предложением открыть в мобильном режиме
      const showDesktopWarning = localStorage.getItem('hideDesktopWarning') !== 'true';
      if (showDesktopWarning) {
        setTimeout(() => {
          const hide = window.confirm(
            '👋 ConnectSphere оптимизирован для мобильных устройств!\n\n' +
            'Для лучшего опыта:\n' +
            '1. Откройте с телефона\n' +
            '2. Или уменьшите окно браузера\n\n' +
            'Продолжить на десктопе?'
          );
          if (hide) {
            localStorage.setItem('hideDesktopWarning', 'true');
          }
        }, 1000);
      }
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div className="h-full w-full bg-white">
        <Routes>
          {/* Публичные маршруты */}
          {!user ? (
            <>
              <Route
                path="/welcome"
                element={
                  <AuthLayout>
                    <WelcomePage />
                  </AuthLayout>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                }
              />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="*" element={<Navigate to="/welcome" replace />} />
            </>
          ) : (
            <>
              {/* Онбординг если профиль не завершен */}
              {!user.onboarding_completed && (
                <Route path="/onboarding" element={<OnboardingPage />} />
              )}
              
              {/* Защищенные маршруты */}
              <Route
                path="/"
                element={
                  <ProtectedLayout>
                    <HomePage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/discovery"
                element={
                  <ProtectedLayout>
                    <DiscoveryPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/matches"
                element={
                  <ProtectedLayout>
                    <MatchesPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/chat/:matchId"
                element={
                  <div className="h-full">
                    <ChatPage />
                  </div>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedLayout>
                    <ProfilePage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/places"
                element={
                  <ProtectedLayout>
                    <PlacesPage />
                  </ProtectedLayout>
                }
              />
              <Route
                path="/premium"
                element={
                  <div className="h-full">
                    <PremiumPage />
                  </div>
                }
              />
              <Route
                path="/settings"
                element={
                  <div className="h-full">
                    <SettingsPage />
                  </div>
                }
              />
              <Route
                path="/settings/edit-profile"
                element={
                  <div className="h-full">
                    <EditProfilePage />
                  </div>
                }
              />
              
              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <div className="h-full">
                    <AdminDashboard />
                  </div>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <div className="h-full">
                    <AdminUsersPage />
                  </div>
                }
              />
              <Route
                path="/admin/payments"
                element={
                  <div className="h-full">
                    <AdminPaymentSettingsPage />
                  </div>
                }
              />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          )}
        </Routes>

        {/* PWA install prompt */}
        <PWAPrompt />

        {/* Toast notifications */}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '16px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;
