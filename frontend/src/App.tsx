import React, { useState, useEffect, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { WorkoutProvider } from './context/WorkoutContext';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { Dashboard } from './components/dashboard/Dashboard';
// import { ProfileSettings } from './components/profile/ProfileSettings';
const ProfileSettings = React.lazy(() => import('./components/profile/ProfileSettings').then(m => ({ default: m.ProfileSettings })));
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { Settings, Dumbbell } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { initScrollPreservation } from './utils/scrollPreservation';
import { installAxiosInterceptors } from './utils/axiosSetup';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showProfile, setShowProfile] = useState(false);

  // Initialize scroll position preservation
  useEffect(() => {
    const cleanup = initScrollPreservation();
    return cleanup;
  }, []);

  // Install axios interceptors once
  useEffect(() => {
    installAxiosInterceptors();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400 mt-4">Loading FitTracker...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-300">
        <div className="w-full max-w-md">
          {isLogin ? (
            <>
            <LoginForm onToggleForm={() => setIsLogin(false)} />
            </>
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    );
  }

  return (
    <WorkoutProvider>
      <div className="relative">

        <button
          onClick={() => setShowProfile(true)}
          className="fixed top-4 right-4 z-40 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
        >
          <Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" />
        </button>

        <Dashboard />

        {showProfile && (
          <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center"><LoadingSpinner size="md" /></div>}>
            <ProfileSettings onClose={() => setShowProfile(false)} />
          </Suspense>
        )}
      </div>
    </WorkoutProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;