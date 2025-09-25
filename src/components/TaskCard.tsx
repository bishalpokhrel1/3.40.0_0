import React from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronRight, Bell, Calendar, Trash2 } from 'lucide-react';
import type { Task } from '@/types/task';

interface TaskCardProps {
  task: Task;
  expanded: boolean;
  onToggle: () => void;
  onExpand: () => void;
  onDelete: () => void;
  priorityColorMap: Record<string, string>;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  expanded,
  onToggle,
  onExpand,
  onDelete,
  priorityColorMap
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      className="task-card"
    >
      <div className="flex items-start space-x-4">
        <motion.button
          onClick={onToggle}
          className={`mt-1 w-6 h-6 border-2 rounded-lg transition-all duration-200 flex items-center justify-center ${
            task.completed 
              ? 'border-green-500 bg-green-500'
              : 'border-white/30 hover:border-white/50'
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </motion.button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <h4 className={`font-medium truncate text-lg ${
                task.completed ? 'line-through text-white/50' : 'text-white'
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className={`text-sm ${
                  task.completed ? 'text-white/30' : 'text-white/70'
                }`}>
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-lg ${priorityColorMap[task.priority]}`}>
                {task.priority.toUpperCase()}
              </span>
              {task.dueDate && (
                <div className="text-xs text-white/50 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {(task.subtasks?.length > 0 || task.reminders?.length > 0) && (
            <button
              onClick={onExpand}
              className="mt-2 flex items-center space-x-1 text-white/50 hover:text-white text-sm"
            >
              {expanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span>Details</span>
            </button>
          )}

          {expanded && (
            <div className="mt-4 space-y-4">
              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white/70">Subtasks</h5>
                  {task.subtasks.map(subtask => (
                    <div
                      key={subtask.id}
                      className="flex items-center space-x-2 text-sm"
                    >
                      <div className={`w-3 h-3 rounded-sm ${
                        subtask.completed 
                          ? 'bg-green-500' 
                          : 'border border-white/30'
                      }`} />
                      <span className={subtask.completed ? 'line-through text-white/30' : 'text-white'}>
                        {subtask.title}
                      </span>
                      {subtask.dueDate && (
                        <span className="text-white/50">
                          · {new Date(subtask.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Reminders */}
              {task.reminders && task.reminders.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-white/70">Reminders</h5>
                  {task.reminders.map((reminder, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 text-sm text-white/70"
                    >
                      <Bell className="w-3 h-3" />
                      <span>{new Date(reminder).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <motion.button
          onClick={onDelete}
          className="mt-1 p-2 text-white/30 hover:text-red-500 rounded-lg transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskCard;