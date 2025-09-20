import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import WeatherAnimation from '@/components/WeatherAnimation'
import Greeting from '@/components/Greeting'
import FeedGrid from '@/components/FeedGrid'
import TaskPanel from '@/components/TaskPanel'
import Onboarding from '@/components/Onboarding'
import SettingsPanel from '@/components/SettingsPanel'
import { Settings } from 'lucide-react'

function App() {
  const { 
    isOnboarded, 
    showSettings, 
    setShowSettings,
    initializeApp 
  } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await initializeApp()
      setIsLoading(false)
    }
    init()
  }, [initializeApp])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-white text-2xl font-light"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Loading Manage...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!isOnboarded) {
    return <Onboarding />
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Weather Background Animation */}
      <WeatherAnimation />
      
      {/* Settings Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowSettings(true)}
        className="fixed top-6 right-6 z-50 glass-card p-3 hover:bg-white/20 transition-colors"
      >
        <Settings className="w-5 h-5 text-white" />
      </motion.button>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Greeting />
          </motion.div>

          {/* Main Grid Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-[calc(100vh-200px)]">
            {/* Feed Section - Takes up most space */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="xl:col-span-3"
            >
              <FeedGrid />
            </motion.div>

            {/* Task Panel - Right sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="xl:col-span-1"
            >
              <TaskPanel />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && <SettingsPanel />}
      </AnimatePresence>
    </div>
  )
}

export default App