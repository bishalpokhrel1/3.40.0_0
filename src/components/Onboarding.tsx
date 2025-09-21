import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  MapPin, 
  Sparkles,
  BookOpen,
  Code,
  Briefcase,
  Heart,
  Gamepad2,
  Music,
  Camera,
  Plane,
  Coffee,
  Dumbbell
} from 'lucide-react'

const INTEREST_OPTIONS = [
  { id: 'technology', label: 'Technology', icon: Code },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'science', label: 'Science', icon: BookOpen },
  { id: 'health', label: 'Health & Fitness', icon: Dumbbell },
  { id: 'entertainment', label: 'Entertainment', icon: Gamepad2 },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'travel', label: 'Travel', icon: Plane },
  { id: 'food', label: 'Food & Cooking', icon: Coffee },
  { id: 'lifestyle', label: 'Lifestyle', icon: Heart }
]

const Onboarding: React.FC = () => {
  const { updateUserPreferences, setOnboarded } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    interests: [] as string[],
    location: undefined as { lat: number; lon: number; city: string } | undefined,
    weatherEnabled: true,
    feedEnabled: true,
    tasksEnabled: true
  })

  const steps = [
    {
      title: "Welcome to Manage",
      subtitle: "Your personalized dashboard awaits",
      component: WelcomeStep
    },
    {
      title: "What's your name?",
      subtitle: "We'll use this to personalize your experience",
      component: NameStep
    },
    {
      title: "What interests you?",
      subtitle: "Select topics you'd like to see in your feed",
      component: InterestsStep
    },
    {
      title: "Enable location?",
      subtitle: "For weather animations and local content",
      component: LocationStep
    },
    {
      title: "Choose your features",
      subtitle: "Customize what you see on your dashboard",
      component: FeaturesStep
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      completeOnboarding()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const completeOnboarding = async () => {
    await updateUserPreferences(formData)
    setOnboarded(true)
  }

  const getCurrentLocation = () => {
    return new Promise<{ lat: number; lon: number; city: string }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Try to get city name from reverse geocoding
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=demo`
            )
            const data = await response.json()
            const city = data[0]?.name || 'Unknown City'
            
            resolve({ lat: latitude, lon: longitude, city })
          } catch (error) {
            // Fallback without city name
            resolve({ lat: latitude, lon: longitude, city: 'Your Location' })
          }
        },
        (error) => reject(error),
        { timeout: 10000 }
      )
    })
  }

  function WelcomeStep() {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="text-8xl mb-8"
        >
          ✨
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Manage
        </h1>
        <p className="text-xl text-white/80 mb-8 max-w-md mx-auto">
          Your personalized dashboard with AI-powered features, weather animations, and curated content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="glass-card p-4">
            <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">AI-Powered</h3>
            <p className="text-white/70 text-sm">Smart summaries and personalized content</p>
          </div>
          <div className="glass-card p-4">
            <div className="text-2xl mb-2">🌤️</div>
            <h3 className="font-semibold text-white mb-1">Live Weather</h3>
            <p className="text-white/70 text-sm">Beautiful animated weather scenes</p>
          </div>
          <div className="glass-card p-4">
            <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <h3 className="font-semibold text-white mb-1">Task Management</h3>
            <p className="text-white/70 text-sm">Stay organized and productive</p>
          </div>
        </div>
      </motion.div>
    )
  }

  function NameStep() {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="text-6xl mb-8">👋</div>
        <div className="glass-card p-8">
          <input
            type="text"
            placeholder="Enter your name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 text-lg border border-white/20 rounded-lg bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            autoFocus
          />
        </div>
      </motion.div>
    )
  }

  function InterestsStep() {
    const toggleInterest = (interestId: string) => {
      const newInterests = formData.interests.includes(interestId)
        ? formData.interests.filter(id => id !== interestId)
        : [...formData.interests, interestId]
      
      setFormData({ ...formData, interests: newInterests })
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎯</div>
          <p className="text-white/80">Select at least 3 topics to personalize your feed</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {INTEREST_OPTIONS.map((interest) => {
            const Icon = interest.icon
            const isSelected = formData.interests.includes(interest.id)
            
            return (
              <motion.button
                key={interest.id}
                onClick={() => toggleInterest(interest.id)}
                className={`glass-card p-4 text-center transition-all duration-200 ${
                  isSelected 
                    ? 'bg-white/30 ring-2 ring-white/50' 
                    : 'hover:bg-white/20'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-8 h-8 text-white mx-auto mb-2" />
                <span className="text-white text-sm font-medium">
                  {interest.label}
                </span>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
        
        <div className="text-center mt-6">
          <span className="text-white/70">
            Selected: {formData.interests.length} / {INTEREST_OPTIONS.length}
          </span>
        </div>
      </motion.div>
    )
  }

  function LocationStep() {
    const [locationStatus, setLocationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

    const handleEnableLocation = async () => {
      setLocationStatus('loading')
      
      try {
        const location = await getCurrentLocation()
        setFormData({ ...formData, location, weatherEnabled: true })
        setLocationStatus('success')
      } catch (error) {
        console.error('Failed to get location:', error)
        setLocationStatus('error')
      }
    }

    const handleSkipLocation = () => {
      setFormData({ ...formData, location: undefined, weatherEnabled: false })
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center max-w-md mx-auto"
      >
        <div className="text-6xl mb-8">📍</div>
        
        <div className="glass-card p-8 space-y-6">
          {locationStatus === 'success' && formData.location ? (
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-white mb-2">Location Enabled</h3>
              <p className="text-white/80">
                📍 {formData.location.city}
              </p>
              <p className="text-white/60 text-sm mt-2">
                You'll see beautiful weather animations based on your local conditions.
              </p>
            </div>
          ) : (
            <>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Enable Location</h3>
                <p className="text-white/80 text-sm mb-4">
                  Get personalized weather animations and local content recommendations.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleEnableLocation}
                  disabled={locationStatus === 'loading'}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {locationStatus === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Getting location...</span>
                    </>
                  ) : (
                    <>
                      <MapPin className="w-4 h-4" />
                      <span>Enable Location</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleSkipLocation}
                  className="w-full px-6 py-3 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  Skip for now
                </button>
              </div>

              {locationStatus === 'error' && (
                <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                  <p className="text-red-200 text-sm">
                    Couldn't access your location. You can enable it later in settings.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    )
  }

  function FeaturesStep() {
    const toggleFeature = (feature: 'weatherEnabled' | 'feedEnabled' | 'tasksEnabled') => {
      setFormData({ ...formData, [feature]: !formData[feature] })
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="text-6xl mb-8">⚙️</div>
        
        <div className="space-y-4">
          <div 
            className={`glass-card p-6 cursor-pointer transition-all ${
              formData.weatherEnabled ? 'bg-white/30 ring-2 ring-white/50' : 'hover:bg-white/20'
            }`}
            onClick={() => toggleFeature('weatherEnabled')}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🌤️</div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-white">Weather Animations</h3>
                <p className="text-white/70 text-sm">Beautiful animated weather scenes with sun/moon tracking</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                formData.weatherEnabled ? 'bg-green-500 border-green-500' : 'border-white/50'
              } flex items-center justify-center`}>
                {formData.weatherEnabled && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <div 
            className={`glass-card p-6 cursor-pointer transition-all ${
              formData.feedEnabled ? 'bg-white/30 ring-2 ring-white/50' : 'hover:bg-white/20'
            }`}
            onClick={() => toggleFeature('feedEnabled')}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">📰</div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-white">Curated Feed</h3>
                <p className="text-white/70 text-sm">AI-powered article recommendations based on your interests</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                formData.feedEnabled ? 'bg-green-500 border-green-500' : 'border-white/50'
              } flex items-center justify-center`}>
                {formData.feedEnabled && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>

          <div 
            className={`glass-card p-6 cursor-pointer transition-all ${
              formData.tasksEnabled ? 'bg-white/30 ring-2 ring-white/50' : 'hover:bg-white/20'
            }`}
            onClick={() => toggleFeature('tasksEnabled')}
          >
            <div className="flex items-center space-x-4">
              <div className="text-3xl">✅</div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-white">Task Management</h3>
                <p className="text-white/70 text-sm">Organize your tasks with AI-powered suggestions</p>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 ${
                formData.tasksEnabled ? 'bg-green-500 border-green-500' : 'border-white/50'
              } flex items-center justify-center`}>
                {formData.tasksEnabled && <Check className="w-4 h-4 text-white" />}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const CurrentStepComponent = steps[currentStep].component
  const canProceed = currentStep === 0 || 
                    (currentStep === 1 && formData.name.trim()) ||
                    (currentStep === 2 && formData.interests.length >= 3) ||
                    currentStep >= 3

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/70 text-sm">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-white/70 text-sm">
              {Math.round(((currentStep + 1) / steps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <motion.div
              className="bg-white rounded-full h-2"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">
                {steps[currentStep].title}
              </h2>
              <p className="text-white/80 text-lg">
                {steps[currentStep].subtitle}
              </p>
            </div>
            
            <CurrentStepComponent />
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center space-x-2 px-6 py-3 bg-white/20 hover:bg-white/30 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <button
            onClick={nextStep}
            disabled={!canProceed}
            className="flex items-center space-x-2 px-6 py-3 bg-white hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed text-purple-600 font-semibold rounded-lg transition-colors"
          >
            <span>{currentStep === steps.length - 1 ? 'Get Started' : 'Next'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Onboarding