import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { X, StickyNote, Sparkles, FileText, Save } from 'lucide-react';
import { apiService } from '../../services/apiService';

/**
 * Popup panel that appears on websites
 * Provides quick access to notes and AI features for the current page
 */
const PopupPanel: React.FC = () => {
  const { 
    showPopup, 
    setShowPopup, 
    currentPageContext,
    addNote,
    getNotesByUrl
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'notes' | 'ai'>('notes');
  const [noteContent, setNoteContent] = useState('');
  const [noteTitle, setNoteTitle] = useState('');
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [pageNotes, setPageNotes] = useState<any[]>([]);

  useEffect(() => {
    if (showPopup && currentPageContext) {
      // Load existing notes for this page
      const existingNotes = getNotesByUrl(currentPageContext.url);
      setPageNotes(existingNotes);
      
      // Set default note title to page title
      if (!noteTitle && existingNotes.length === 0) {
        setNoteTitle(currentPageContext.title);
      }
    }
  }, [showPopup, currentPageContext, getNotesByUrl, noteTitle]);

  const handleSaveNote = async () => {
    if (!noteContent.trim() || !currentPageContext) return;

    try {
      await addNote({
        title: noteTitle || currentPageContext.title,
        content: noteContent,
        url: currentPageContext.url,
        domain: currentPageContext.domain,
        tags: []
      });

      // Reset form
      setNoteContent('');
      setNoteTitle('');
      
      // Refresh page notes
      const updatedNotes = getNotesByUrl(currentPageContext.url);
      setPageNotes(updatedNotes);
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleAIAction = async (action: 'summarize' | 'analyze') => {
    if (!currentPageContext) return;

    setAiLoading(true);
    try {
      // Get page content
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab.id) throw new Error('No active tab');

      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });
      const content = response?.content || '';

      if (action === 'summarize') {
        const summary = await apiService.summarizeContent(content);
        console.log('AI Summary:', summary.text);
        // TODO: Display summary in UI
      } else if (action === 'analyze') {
        const analysis = await apiService.analyzeContent(content);
        console.log('AI Analysis:', analysis);
        // TODO: Display analysis in UI
      }
    } catch (error) {
      console.error('AI action failed:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleSendToAI = async () => {
    if (!aiInput.trim()) return;

    setAiLoading(true);
    try {
      const suggestions = await apiService.generateTaskSuggestions(aiInput);
      console.log('AI Suggestions:', suggestions);
      // TODO: Display suggestions in UI or create tasks
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
    } finally {
      setAiLoading(false);
    }
  };

  if (!showPopup) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={() => setShowPopup(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Manage Tools</h2>
              <button
                onClick={() => setShowPopup(false)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {currentPageContext && (
              <div className="text-white/90">
                <p className="font-medium truncate">{currentPageContext.title}</p>
                <p className="text-sm text-white/70 truncate">{currentPageContext.domain}</p>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'notes'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <StickyNote className="w-5 h-5 inline mr-2" />
              Notes
            </button>
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                activeTab === 'ai'
                  ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Sparkles className="w-5 h-5 inline mr-2" />
              AI Tools
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {activeTab === 'notes' && (
              <div className="space-y-6">
                {/* New Note Form */}
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Note title..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <textarea
                    placeholder="Write your note here..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={6}
                  />
                  
                  <motion.button
                    onClick={handleSaveNote}
                    disabled={!noteContent.trim()}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Save className="w-5 h-5" />
                    <span>Save Note</span>
                  </motion.button>
                </div>

                {/* Existing Notes for this page */}
                {pageNotes.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Notes for this page ({pageNotes.length})
                    </h4>
                    <div className="space-y-2">
                      {pageNotes.map((note) => (
                        <div key={note.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                          <h5 className="font-medium text-gray-800 mb-1">{note.title}</h5>
                          <p className="text-sm text-gray-600 line-clamp-2">{note.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                {/* AI Input */}
                <div className="space-y-4">
                  <textarea
                    placeholder="Send text to AI for analysis or task generation..."
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={4}
                  />
                  
                  <motion.button
                    onClick={handleSendToAI}
                    disabled={!aiInput.trim() || aiLoading}
                    className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {aiLoading ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                    <span>{aiLoading ? 'Processing...' : 'Send to AI'}</span>
                  </motion.button>
                </div>

                {/* Quick AI Actions */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Quick Actions</h4>
                  
                  <motion.button
                    onClick={() => handleAIAction('summarize')}
                    disabled={aiLoading}
                    className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg text-left hover:shadow-sm transition-shadow disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-blue-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Summarize Page</h5>
                        <p className="text-sm text-gray-600">Get a concise summary of this page's content</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleAIAction('analyze')}
                    disabled={aiLoading}
                    className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-left hover:shadow-sm transition-shadow disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      <div>
                        <h5 className="font-semibold text-gray-800">Analyze Content</h5>
                        <p className="text-sm text-gray-600">Get insights and suggestions about this content</p>
                      </div>
                    </div>
                  </motion.button>
                </div>

                {/* AI Status */}
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                    <span className="font-semibold text-amber-800">AI Ready</span>
                  </div>
                  <p className="text-sm text-amber-700">
                    AI features are prepared for integration. Connect your API to enable intelligent assistance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PopupPanel;