import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain } from 'lucide-react';

/**
 * AI suggestions placeholder component
 * Will be connected to actual AI API later
 */
const AISuggestions: React.FC = () => {
  const mockSuggestions = [
    {
      id: '1',
      type: 'productivity',
      title: 'Focus Time Suggestion',
      description: 'Based on your task patterns, consider blocking 2-3 hours for deep work.',
      icon: Zap,
      color: 'blue'
    },
    {
      id: '2',
      type: 'organization',
      title: 'Note Organization',
      description: 'You have 12 notes. Consider creating tags to organize them better.',
      icon: Brain,
      color: 'purple'
    }
  ];

  const handleAIAction = (suggestionId: string) => {
    console.log('AI suggestion clicked:', suggestionId);
    // TODO: Implement AI suggestion actions when API is connected
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center space-x-2 mb-6">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-6 h-6 text-purple-600" />
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800">AI Suggestions</h3>
      </div>

      {/* Suggestions List */}
      <div className="space-y-4">
        {mockSuggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          
          return (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-gradient-to-r ${
                suggestion.color === 'blue' ? 'from-blue-50 to-indigo-50 border-blue-200' :
                'from-purple-50 to-pink-50 border-purple-200'
              } border rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow`}
              onClick={() => handleAIAction(suggestion.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  suggestion.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-1">
                    {suggestion.title}
                  </h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {suggestion.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* AI Status */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-gray-700">AI Integration</span>
        </div>
        <p className="text-xs text-gray-600">
          AI features are ready for integration. Connect your API to enable smart suggestions.
        </p>
      </div>
    </div>
  );
};

export default AISuggestions;