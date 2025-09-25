import React, { useState } from 'react';
import { Plus, Bell, X } from 'lucide-react';

interface ReminderEditorProps {
  reminders: string[];
  onAdd: (reminder: string) => void;
  onDelete: (reminder: string) => void;
}

const ReminderEditor: React.FC<ReminderEditorProps> = ({
  reminders,
  onAdd,
  onDelete
}) => {
  const [newReminder, setNewReminder] = useState('');
  
  const handleAddReminder = () => {
    if (!newReminder.trim()) return;
    onAdd(newReminder);
    setNewReminder('');
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium text-white/80 mb-2">Reminders</div>

      {/* Add new reminder */}
      <div className="flex gap-2">
        <input
          type="datetime-local"
          value={newReminder}
          onChange={(e) => setNewReminder(e.target.value)}
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-white/40"
        />
        <button
          onClick={handleAddReminder}
          disabled={!newReminder}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Reminder list */}
      <div className="space-y-2">
        {reminders.map((reminder, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
          >
            <Bell className="w-4 h-4 text-white/70" />
            <span className="flex-1 text-sm text-white">
              {new Date(reminder).toLocaleString()}
            </span>
            <button
              onClick={() => onDelete(reminder)}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded"
            >
              <X className="w-3 h-3 text-white/70" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReminderEditor;