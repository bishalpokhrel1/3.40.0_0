import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { StickyNote, Plus, ExternalLink } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Notes section for the dashboard
 * Shows recent notes and quick access to notes management
 */
const NotesSection: React.FC = () => {
  const { notes, notesLoading } = useAppStore();
  const [showAllNotes, setShowAllNotes] = useState(false);

  const recentNotes = notes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, showAllNotes ? notes.length : 5);

  const openNotesPage = () => {
    // TODO: Open notes management page
    console.log('Open notes page - implement notes management');
  };

  if (notesLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-gray-200 rounded w-1/2"></div>
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <StickyNote className="w-6 h-6 text-yellow-600" />
          <h3 className="text-xl font-bold text-gray-800">Notes</h3>
        </div>
        <motion.button
          onClick={openNotesPage}
          className="p-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Notes List */}
      {recentNotes.length > 0 ? (
        <div className="space-y-3">
          {recentNotes.map((note) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={openNotesPage}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate mb-1">
                    {note.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {note.content}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}</span>
                    {note.url && (
                      <>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <ExternalLink className="w-3 h-3" />
                          <span>{note.domain || 'Linked'}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {notes.length > 5 && !showAllNotes && (
            <button
              onClick={() => setShowAllNotes(true)}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-700 py-2"
            >
              Show {notes.length - 5} more notes
            </button>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <StickyNote className="w-12 h-12 text-yellow-400 mx-auto mb-3 opacity-50" />
          <p className="text-gray-600 mb-4">No notes yet</p>
          <motion.button
            onClick={openNotesPage}
            className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg font-medium hover:bg-yellow-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Note
          </motion.button>
        </div>
      )}
    </div>
  );
};

export default NotesSection;