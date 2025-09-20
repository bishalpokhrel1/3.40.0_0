import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { format } from 'date-fns'

const Greeting: React.FC = () => {
  const { userPreferences } = useAppStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    
    if (hour < 6) return 'Good night'
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 22) return 'Good evening'
    return 'Good night'
  }

  const getGreetingEmoji = () => {
    const hour = currentTime.getHours()
    
    if (hour < 6) return '🌙'
    if (hour < 12) return '🌅'
    if (hour < 17) return '☀️'
    if (hour < 22) return '🌆'
    return '🌙'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center mb-8"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-card p-8 max-w-2xl mx-auto"
      >
        <div className="flex items-center justify-center space-x-4 mb-4">
          <motion.span
            animate={{ 
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
            className="text-4xl"
          >
            {getGreetingEmoji()}
          </motion.span>
          <div className="text-left">
            <h1 className="text-3xl font-light text-white mb-1">
              {getGreeting()}{userPreferences.name ? `, ${userPreferences.name}` : ''}!
            </h1>
            <p className="text-white/80 text-lg">
              {format(currentTime, 'EEEE, MMMM do, yyyy')}
            </p>
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-white/70 text-lg font-light"
        >
          {format(currentTime, 'h:mm:ss a')}
        </motion.div>
        
        {userPreferences.location?.city && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-white/60 text-sm mt-2"
          >
            📍 {userPreferences.location.city}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )
}

export default Greeting