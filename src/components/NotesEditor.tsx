import React, { useState, useEffect } from 'react';
import { Save, Link, Tag, Check, X } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  url?: string;
  taskId?: string;
  tags: string[];
  lastModified: Date;
}

export const NotesEditor: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [note, setNote] = useState<Note | null>(null);
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Get current URL
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.url) {
        setCurrentUrl(tabs[0].url);
        loadNoteForUrl(tabs[0].url);
      }
    });

    // Load available tasks
    loadTasks();
  }, []);

  const loadNoteForUrl = async (url: string) => {
    const stored = await chrome.storage.local.get('notes');
    const notes: Record<string, Note> = stored.notes || {};
    setNote(notes[url] || {
      id: crypto.randomUUID(),
      title: '',
      content: '',
      url,
      tags: [],
      lastModified: new Date()
    });
  };

  const loadTasks = async () => {
    const stored = await chrome.storage.local.get('tasks');
    setAvailableTasks(stored.tasks || []);
  };

  const handleSave = async () => {
    if (!note) return;
    
    setIsSaving(true);
    try {
      const stored = await chrome.storage.local.get('notes');
      const notes = stored.notes || {};
      
      notes[currentUrl] = {
        ...note,
        lastModified: new Date()
      };
      
      await chrome.storage.local.set({ notes });
      
      // If there's a task attached, update the task with the note reference
      if (note.taskId) {
        const stored = await chrome.storage.local.get('tasks');
        const tasks = stored.tasks || [];
        const taskIndex = tasks.findIndex((t: any) => t.id === note.taskId);
        
        if (taskIndex !== -1) {
          tasks[taskIndex].notes = tasks[taskIndex].notes || [];
          if (!tasks[taskIndex].notes.includes(note.id)) {
            tasks[taskIndex].notes.push(note.id);
            await chrome.storage.local.set({ tasks });
          }
        }
      }
    } catch (error) {
      console.error('Failed to save note:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTag = () => {
    if (!note || !newTag.trim()) return;
    
    if (!note.tags.includes(newTag.trim())) {
      setNote({
        ...note,
        tags: [...note.tags, newTag.trim()]
      });
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!note) return;
    
    setNote({
      ...note,
      tags: note.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleAttachTask = (taskId: string) => {
    if (!note) return;
    
    setNote({
      ...note,
      taskId: taskId === note.taskId ? undefined : taskId
    });
  };

  if (!note) return null;

  return (
    <div className="space-y-4 p-4">
      {/* Title */}
      <input
        type="text"
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Note title..."
        className="w-full px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Content */}
      <textarea
        value={note.content}
        onChange={(e) => setNote({ ...note, content: e.target.value })}
        placeholder="Start taking notes..."
        className="w-full h-40 px-3 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {/* URL */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Link className="w-4 h-4" />
        <span className="truncate">{currentUrl}</span>
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <div className="flex flex-wrap gap-2">
          {note.tags.map(tag => (
            <div
              key={tag}
              className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              <Tag className="w-3 h-3" />
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(tag)}
                className="hover:text-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
            placeholder="Add a tag..."
            className="flex-1 px-3 py-1 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTag}
            disabled={!newTag.trim()}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </div>

      {/* Task Attachment */}
      {availableTasks.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Attach to Task</label>
          <div className="grid grid-cols-2 gap-2">
            {availableTasks.map((task: any) => (
              <button
                key={task.id}
                onClick={() => handleAttachTask(task.id)}
                className={`flex items-center justify-between p-2 rounded-lg text-sm ${
                  note.taskId === task.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800 hover:border-blue-500'
                }`}
              >
                <span className="truncate">{task.title}</span>
                {note.taskId === task.id && <Check className="w-4 h-4 ml-2" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Save Note'}</span>
        </button>
      </div>
    </div>
  );
};

export default NotesEditor;