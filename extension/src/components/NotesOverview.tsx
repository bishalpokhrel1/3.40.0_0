import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Tag } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  url?: string;
  lastModified: Date;
}

const NotesOverview: React.FC = () => {
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);

  useEffect(() => {
    // TODO: Replace with actual storage integration
    const loadNotes = async () => {
      const stored = await chrome.storage.local.get('notes');
      if (stored.notes) {
        setRecentNotes(stored.notes);
      }
    };
    loadNotes();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-4"
    >
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <FileText className="mr-2" /> Recent Notes
      </h2>
      <div className="space-y-4">
        {recentNotes.length === 0 ? (
          <div className="text-white/70 text-center py-4">
            No notes yet. Click to create your first note.
          </div>
        ) : (
          recentNotes.map(note => (
            <div key={note.id} className="p-3 bg-white/10 rounded-lg">
              <h3 className="text-white font-medium">{note.title}</h3>
              <p className="text-white/70 text-sm line-clamp-2 mt-1">
                {note.content}
              </p>
              {note.tags.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {note.tags.map(tag => (
                    <div key={tag} className="flex items-center text-xs bg-white/20 px-2 py-1 rounded">
                      <Tag size={12} className="mr-1" />
                      {tag}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default NotesOverview;