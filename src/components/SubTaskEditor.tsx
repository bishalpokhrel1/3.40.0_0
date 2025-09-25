import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import type { SubTask } from '@/types/task';

interface SubTaskEditorProps {
  subtasks: SubTask[];
  onAdd: (subtask: Omit<SubTask, 'id'>) => void;
  onDelete: (subtaskId: string) => void;
  onToggle: (subtaskId: string) => void;
}

const SubTaskEditor: React.FC<SubTaskEditorProps> = ({
  subtasks,
  onAdd,
  onDelete,
  onToggle
}) => {
  const [newSubTask, setNewSubTask] = useState('');
  const [newDueDate, setNewDueDate] = useState('');

  const handleAddSubTask = () => {
    if (!newSubTask.trim()) return;

    onAdd({
      title: newSubTask.trim(),
      completed: false,
      dueDate: newDueDate || undefined
    });

    setNewSubTask('');
    setNewDueDate('');
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium text-white/80 mb-2">Subtasks</div>
      
      {/* Add new subtask */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newSubTask}
          onChange={(e) => setNewSubTask(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSubTask()}
          placeholder="Add a subtask..."
          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40"
        />
        <input
          type="date"
          value={newDueDate}
          onChange={(e) => setNewDueDate(e.target.value)}
          className="w-32 bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-white/40"
        />
        <button
          onClick={handleAddSubTask}
          disabled={!newSubTask.trim()}
          className="p-2 bg-white/10 hover:bg-white/20 rounded-lg disabled:opacity-50"
        >
          <Plus className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Subtask list */}
      <div className="space-y-2">
        {subtasks.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center gap-2 p-2 bg-white/5 rounded-lg group"
          >
            <button
              onClick={() => onToggle(subtask.id)}
              className="flex-shrink-0"
            >
              <div className={`w-4 h-4 rounded border ${
                subtask.completed 
                  ? 'bg-green-500 border-green-600' 
                  : 'border-white/30 hover:border-white/50'
              } flex items-center justify-center`}>
                {subtask.completed && <Check className="w-3 h-3 text-white" />}
              </div>
            </button>
            <span className={`flex-1 text-sm ${subtask.completed ? 'line-through text-white/50' : 'text-white'}`}>
              {subtask.title}
            </span>
            {subtask.dueDate && (
              <span className="text-xs text-white/50">
                {new Date(subtask.dueDate).toLocaleDateString()}
              </span>
            )}
            <button
              onClick={() => onDelete(subtask.id)}
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

export default SubTaskEditor;