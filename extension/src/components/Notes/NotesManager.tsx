import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { 
  Plus, 
  Search, 
  Tag, 
  ExternalLink, 
  Edit3, 
  Trash2,
  StickyNote,
  Sparkles
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Comprehensive notes management component
 * Handles note creation, editing, tagging, and AI integration placeholders
 */
const NotesManager: React.FC = () => {
  const { 
    notes, 
    addNote, 
    updateNote, 
    deleteNote 
  } = useAppStore();

  const [showAddNote, setShowAddNote] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [] as string[],
    url: '',
    domain: ''
  });

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    try {
      await addNote({
        title: newNote.title,
        content: newNote.content,
        tags: newNote.tags,
        url: newNote.url || undefined,
        domain: newNote.domain || undefined
      });

      // Reset form
      setNewNote({ title: '', content: '', tags: [], url: '', domain: '' });
      setShowAddNote(false);
    } catch (error) {
      console.error('Failed to add note:', error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(noteId);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  const handleAISummarize = async (noteId: string) => {
    console.log('AI summarize placeholder for note:', noteId);
    // TODO: Implement AI summarization when API is connected
  };

  // Filter notes based on search and tags
  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery || 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = !selectedTag || note.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  // Get all unique tags
  const allTags = Array.from(new Set(notes.flatMap(note => note.tags || [])));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Notes</h2>
          <p className="text-gray-600">Capture and organize your thoughts</p>
        </div>
        
        <motion.button
          onClick={() => setShowAddNote(!showAddNote)}
          className="px-6 py-3 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Note</span>
        </motion.button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          
          {/* Tag Filter */}
          <div className="flex items-center space-x-2">
            <Tag className="w-5 h-5 text-gray-400" />
            <select
              value={selectedTag || ''}
              onChange={(e) => setSelectedTag(e.target.value || null)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            >
              <option value="">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add Note Form */}
      <AnimatePresence>
        {showAddNote && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg overflow-hidden"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Note</h3>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Note title..."
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              
              <textarea
                placeholder="Write your note here..."
                value={newNote.content}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
                rows={8}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  placeholder="Link to website (optional)..."
                  value={newNote.url}
                  onChange={(e) => setNewNote({ ...newNote, url: e.target.value })}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
                
                <input
                  type="text"
                  placeholder="Tags (comma-separated)..."
                  value={newNote.tags.join(', ')}
                  onChange={(e) => setNewNote({ 
                    ...newNote, 
                    tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                  })}
                  className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              
              <div className="flex space-x-4">
                <motion.button
                  onClick={handleAddNote}
                  className="flex-1 px-6 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Save Note
                </motion.button>
                <motion.button
                  onClick={() => setShowAddNote(false)}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes Grid */}
      {filteredNotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-yellow-400 hover:shadow-xl transition-shadow"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-gray-800 text-lg line-clamp-2">
                  {note.title}
                </h4>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEditingNote(note.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Note Content */}
              <p className="text-gray-600 mb-4 line-clamp-4 leading-relaxed">
                {note.content}
              </p>

              {/* Note Meta */}
              <div className="space-y-3">
                {/* Tags */}
                {note.tags && note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* URL Link */}
                {note.url && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <ExternalLink className="w-4 h-4" />
                    <a 
                      href={note.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline truncate"
                    >
                      {note.domain || note.url}
                    </a>
                  </div>
                )}

                {/* Timestamp */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                  
                  {/* AI Summarize Button */}
                  <motion.button
                    onClick={() => handleAISummarize(note.id)}
                    className="flex items-center space-x-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Summarize</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 shadow-lg text-center"
        >
          <StickyNote className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {searchQuery || selectedTag ? 'No matching notes' : 'No notes yet'}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchQuery || selectedTag 
              ? 'Try adjusting your search or filter criteria.'
              : 'Create your first note to start capturing ideas and information.'
            }
          </p>
          <motion.button
            onClick={() => setShowAddNote(true)}
            className="px-8 py-4 bg-yellow-500 text-white rounded-xl font-semibold hover:bg-yellow-600 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Note
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default NotesManager;