import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ListTodo, FileText, PanelRight, Settings } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline?: Date;
}

interface Note {
  id: string;
  title: string;
  url?: string;
  lastModified: Date;
}

const PopupApp: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

  useEffect(() => {
    loadRecentItems();
  }, []);

  const loadRecentItems = async () => {
    const stored = await chrome.storage.local.get(['tasks', 'notes']);
    
    // Get recent tasks
    const tasks = stored.tasks || [];
    setRecentTasks(tasks.slice(0, 5));

    // Get recent notes
    const notes = stored.notes || {};
    const notesList = Object.values(notes) as Note[];
    setRecentNotes(notesList.sort((a, b) => 
      new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime()
    ).slice(0, 5));
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const stored = await chrome.storage.local.get('tasks');
    const tasks = stored.tasks || [];
    const taskIndex = tasks.findIndex((t: Task) => t.id === taskId);
    
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      await chrome.storage.local.set({ tasks });
      loadRecentItems();
    }
  };

  const openSidePanel = () => {
    chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
  };

  const openDashboard = () => {
    chrome.tabs.create({ url: 'chrome://newtab' });
  };

  return (
    <div className="w-80 bg-gradient-to-br from-blue-800 via-purple-800 to-indigo-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-semibold">Manage Dashboard</h1>
          <button
            onClick={openSidePanel}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Open Side Panel"
          >
            <PanelRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        <button
          onClick={() => setActiveTab('tasks')}
          className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 ${
            activeTab === 'tasks' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <ListTodo className="w-4 h-4" />
          <span>Tasks</span>
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 ${
            activeTab === 'notes' ? 'bg-white/10' : 'hover:bg-white/5'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Notes</span>
        </button>
      </div>

      {/* Content */}
      <div className="max-h-96 overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'tasks' && (
            <motion.div
              key="tasks"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-2"
            >
              {recentTasks.length === 0 ? (
                <div className="text-center py-4 text-white/70">
                  No tasks yet. Create one from the dashboard.
                </div>
              ) : (
                recentTasks.map(task => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5"
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                      className="rounded border-white/30 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={task.completed ? 'line-through text-white/50' : ''}>
                      {task.title}
                    </span>
                  </div>
                ))
              )}
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 space-y-2"
            >
              {recentNotes.length === 0 ? (
                <div className="text-center py-4 text-white/70">
                  No notes yet. Create one from the side panel.
                </div>
              ) : (
                recentNotes.map(note => (
                  <button
                    key={note.id}
                    onClick={() => note.url && chrome.tabs.create({ url: note.url })}
                    className="w-full text-left p-2 rounded-lg hover:bg-white/5"
                  >
                    <div className="font-medium">{note.title || 'Untitled Note'}</div>
                    {note.url && (
                      <div className="text-sm text-white/70 truncate">{note.url}</div>
                    )}
                  </button>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={openDashboard}
          className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Open Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default PopupApp;