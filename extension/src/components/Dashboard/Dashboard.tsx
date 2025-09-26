import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import Greeting from './Greeting';
import DateTime from './DateTime';
import TaskList from './TaskList';
import NotesSection from './NotesSection';
import AISuggestions from './AISuggestions';
import { Settings } from 'lucide-react';

/**
 * Main dashboard component for the new tab page
 * Displays personalized content and quick access to features
 */
const Dashboard: React.FC = () => {
  const { 
    preferences, 
    loadTasks, 
    loadNotes,
    setShowPopup 
  } = useAppStore();

  useEffect(() => {
    // Load data when dashboard mounts
    loadTasks();
    loadNotes();
  }, [loadTasks, loadNotes]);

  const openSettings = () => {
    // TODO: Implement settings modal or page
    console.log('Settings clicked - implement settings modal');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={openSettings}
        className="fixed top-6 right-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings className="w-6 h-6 text-gray-600" />
      </motion.button>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <Greeting />
                <DateTime />
              </div>
              <motion.button
                onClick={() => setShowPopup(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Open Tools
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          {preferences.dashboardLayout.showTasks && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <TaskList />
            </motion.div>
          )}

          {/* Right Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            {/* Notes Section */}
            {preferences.dashboardLayout.showNotes && (
              <NotesSection />
            )}

            {/* AI Suggestions */}
            {preferences.dashboardLayout.showAISuggestions && (
              <AISuggestions />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;