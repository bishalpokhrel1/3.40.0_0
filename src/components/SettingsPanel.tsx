import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { 
  X, 
  User, 
  MapPin, 
  Palette, 
  Shield, 
  Trash2,
  Download,
  Upload,
  ExternalLink
} from 'lucide-react'

const SettingsPanel: React.FC = () => {
  const { 
    userPreferences, 
    updateUserPreferences, 
    setShowSettings,
    setOnboarded
  } = useAppStore()
  
  const [activeTab, setActiveTab] = useState<'profile' | 'features' | 'privacy' | 'data'>('profile')

  const handleLocationUpdate = async () => {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 })
      })
      
      const { latitude, longitude } = position.coords
      
      // Try to get city name
      try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=demo`
        )
        const data = await response.json()
        const city = data[0]?.name || 'Unknown City'
        
        updateUserPreferences({
          location: { lat: latitude, lon: longitude, city }
        })
      } catch (error) {
        updateUserPreferences({
          location: { lat: latitude, lon: longitude, city: 'Your Location' }
        })
      }
    } catch (error) {
      console.error('Failed to get location:', error)
      alert('Failed to get your location. Please check your browser permissions.')
    }
  }

  const handleDataExport = async () => {
    try {
      const data = await chrome.storage.local.get(null)
      const exportData = {
        ...data,
        exportedAt: new Date().toISOString(),
        version: '1.0.0'
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `manage-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to export data:', error)
      alert('Failed to export data. Please try again.')
    }
  }

  const handleDataImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        await chrome.storage.local.set(data)
        alert('Data imported successfully! Please refresh the page.')
      } catch (error) {
        console.error('Failed to import data:', error)
        alert('Failed to import data. Please check the file format.')
      }
    }
    reader.readAsText(file)
  }

  const handleDataClear = async () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        await chrome.storage.local.clear()
        setOnboarded(false)
        setShowSettings(false)
      } catch (error) {
        console.error('Failed to clear data:', error)
        alert('Failed to clear data. Please try again.')
      }
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'features', label: 'Features', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield },
    { id: 'data', label: 'Data', icon: Download }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={() => setShowSettings(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Settings</h2>
            <button
              onClick={() => setShowSettings(false)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r border-gray-200">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={userPreferences.name}
                        onChange={(e) => updateUserPreferences({ name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Interests
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {userPreferences.interests.map((interest) => (
                          <span
                            key={interest}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center space-x-1"
                          >
                            <span>{interest}</span>
                            <button
                              onClick={() => {
                                const newInterests = userPreferences.interests.filter(i => i !== interest)
                                updateUserPreferences({ interests: newInterests })
                              }}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Go through onboarding again to modify your interests.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <div className="flex items-center space-x-3">
                        {userPreferences.location ? (
                          <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md">
                            📍 {userPreferences.location.city}
                          </div>
                        ) : (
                          <div className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-md text-gray-500">
                            Location not set
                          </div>
                        )}
                        <button
                          onClick={handleLocationUpdate}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>Update</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'features' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Feature Settings</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Weather Animations</h4>
                        <p className="text-sm text-gray-500">Show animated weather scenes with sun/moon tracking</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.weatherEnabled}
                          onChange={(e) => updateUserPreferences({ weatherEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Curated Feed</h4>
                        <p className="text-sm text-gray-500">Show AI-powered article recommendations</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.feedEnabled}
                          onChange={(e) => updateUserPreferences({ feedEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Task Management</h4>
                        <p className="text-sm text-gray-500">Enable task planning and management features</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.tasksEnabled}
                          onChange={(e) => updateUserPreferences({ tasksEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Google Tasks Sync</h4>
                        <p className="text-sm text-gray-500">Sync tasks with your Google Tasks account</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={userPreferences.googleTasksSync}
                          onChange={(e) => updateUserPreferences({ googleTasksSync: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Theme</h3>
                  <div className="space-y-2">
                    {['auto', 'light', 'dark'].map((theme) => (
                      <label key={theme} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="theme"
                          value={theme}
                          checked={userPreferences.theme === theme}
                          onChange={(e) => updateUserPreferences({ theme: e.target.value as any })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="capitalize">{theme}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-green-900">Privacy by Default</h4>
                          <p className="text-sm text-green-700 mt-1">
                            All your data is stored locally in your browser. We don't collect or transmit personal information.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Data Usage</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>Your preferences and tasks are stored locally</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>Weather data is fetched anonymously from public APIs</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>Feed articles are processed locally using Chrome's built-in AI</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-green-500 mt-1">✓</span>
                          <span>No tracking, analytics, or data collection</span>
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Permissions</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">ℹ</span>
                          <span><strong>Storage:</strong> To save your preferences and tasks locally</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">ℹ</span>
                          <span><strong>Active Tab:</strong> To summarize page content in the side panel</span>
                        </li>
                        <li className="flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">ℹ</span>
                          <span><strong>Location:</strong> Optional, for weather animations only</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Download a backup of all your data including preferences, tasks, and feed history.
                      </p>
                      <button
                        onClick={handleDataExport}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export Data</span>
                      </button>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Restore your data from a previously exported backup file.
                      </p>
                      <label className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors cursor-pointer flex items-center space-x-2 inline-flex">
                        <Upload className="w-4 h-4" />
                        <span>Import Data</span>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleDataImport}
                          className="hidden"
                        />
                      </label>
                    </div>

                    <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-2">Clear All Data</h4>
                      <p className="text-sm text-red-700 mb-3">
                        Permanently delete all your data and reset the extension. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDataClear}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear All Data</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                  <div className="space-y-3 text-sm text-gray-600">
                    <p><strong>Version:</strong> 1.0.0</p>
                    <p><strong>Built with:</strong> React, TypeScript, Chrome Extensions API</p>
                    <p><strong>AI Features:</strong> Chrome Built-in AI (Gemini Nano)</p>
                    <div className="flex items-center space-x-2">
                      <span><strong>Source Code:</strong></span>
                      <a 
                        href="https://github.com/your-repo/manage-extension" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
                      >
                        <span>GitHub</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SettingsPanel