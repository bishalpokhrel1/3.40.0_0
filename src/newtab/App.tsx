import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/appStore';
import WeatherAnimation from '@/components/WeatherAnimation';
import Greeting from '@/components/Greeting';
import FeedGrid from '@/components/FeedGrid';
import TaskPanel from '@/components/TaskPanel';
import Onboarding from '@/components/Onboarding';
import SettingsPanel from '@/components/SettingsPanel';
import { Settings } from 'lucide-react';

function App() {
  const { 
    isOnboarded, 
    showSettings, 
    setShowSettings,
    initializeApp 
  } = useAppStore();
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeApp();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [initializeApp]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-2xl font-light">Loading Manage...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!isOnboarded) {
    return <Onboarding />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <WeatherAnimation />
      </div>

      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowSettings(true)}
        className="fixed top-8 right-8 z-50 glass-button"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings className="w-6 h-6" />
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="glass-card p-6 rounded-2xl w-fit mb-8"
          >
            <Greeting />
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Feed Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="lg:col-span-8"
            >
              <div className="glass-card p-6 rounded-2xl h-full">
                <FeedGrid />
              </div>
            </motion.div>

            {/* Task Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="lg:col-span-4"
            >
              <div className="glass-card p-6 rounded-2xl sticky top-8">
                <TaskPanel />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
      </AnimatePresence>
    </div>
  );
}

export default App;