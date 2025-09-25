import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import Greeting from '@/components/Greeting'
import TaskPanel from '@/components/TaskPanel'
import SettingsPanel from '@/components/SettingsPanel'
import NotesOverview from '@/components/NotesOverview'
import AISuggestions from '@/components/AISuggestions'
import Clock from '@/components/Clock'
import { Settings } from 'lucide-react'

/**
 * Main app component for the new tab page
 * Loads user data and displays the dashboard
 */
function App() {
  const { 
    showSettings, 
    setShowSettings,
    initializeApp 
  } = useAppStore()
  
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        await initializeApp()
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [initializeApp])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-white text-2xl font-light">Loading Manage...</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900">
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-4">
              <Clock />
              <Greeting />
            </div>
            <motion.button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Settings className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Settings Panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-8"
              >
                <SettingsPanel />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tasks and Notes Column */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <TaskPanel />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <NotesOverview />
                </motion.div>
              </div>
            </div>
            
            {/* AI Suggestions Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              <AISuggestions />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App