import React, { useState, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { Plus, Check, Calendar, Sparkles, Trash2 } from 'lucide-react'
import { format, isPast, isToday } from 'date-fns'
import SubTaskEditor from './SubTaskEditor'
import ReminderEditor from './ReminderEditor'
import TaskCard from './TaskCard'
import type { Task, SubTask } from '@/types/task'

type TaskView = 'list' | 'timeline'
type TaskPriority = 'low' | 'medium' | 'high'

const TaskPanel = () => {
  // Constants
  const priorityWeight = { high: 3, medium: 2, low: 1 } as const;
  
  // App state from store
  const { tasks, userPreferences, addTask, deleteTask, toggleTask } = useAppStore();
  
  // UI state
  const [activeTaskView, setActiveTaskView] = useState<TaskView>('list');
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  
  // Form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newSubtasks, setNewSubtasks] = useState<SubTask[]>([]);
  const [newReminders, setNewReminders] = useState<string[]>([]);
  
  // Handlers
  const handleAddSubtask = useCallback((subtask: Omit<SubTask, 'id'>) => {
    setNewSubtasks(prev => [...prev, { ...subtask, id: crypto.randomUUID() }]);
  }, []);
  
  const handleDeleteSubtask = useCallback((subtaskId: string) => {
    setNewSubtasks(prev => prev.filter(st => st.id !== subtaskId));
  }, []);
  
  const handleAddReminder = useCallback((reminder: string) => {
    setNewReminders(prev => !prev.includes(reminder) ? [...prev, reminder] : prev);
  }, []);
  
  const handleDeleteReminder = useCallback((reminder: string) => {
    setNewReminders(prev => prev.filter(r => r !== reminder));
  }, []);
  
  const handleAddTask = useCallback(async () => {
    if (!newTaskTitle.trim()) return;

    const taskData: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined,
      subtasks: newSubtasks,
      reminders: newReminders
    };

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getTaskSuggestions',
        task: newTaskTitle
      });
      
      addTask(response?.suggestions 
        ? { ...taskData, aiSuggestions: response.suggestions }
        : taskData
      );
      
      // Reset form
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      setNewSubtasks([]);
      setNewReminders([]);
      setShowAddTask(false);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      addTask(taskData);
    }
  }, [
    newTaskTitle,
    newTaskDescription,
    newTaskPriority,
    newTaskDueDate,
    newSubtasks,
    newReminders,
    addTask
  ]);
  
  const toggleTaskExpansion = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  }, []);

  // Task filtering and sorting with urgency handling
  const { pendingTasks, completedTasks } = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (!a.completed && !b.completed) {
        const aDate = a.dueDate ? new Date(a.dueDate) : null;
        const bDate = b.dueDate ? new Date(b.dueDate) : null;
        
        // Sort by urgency first
        const aUrgent = aDate && (isPast(aDate) || isToday(aDate));
        const bUrgent = bDate && (isPast(bDate) || isToday(bDate));
        if (aUrgent !== bUrgent) return aUrgent ? -1 : 1;
        
        // Then by due date
        if (aDate && bDate) {
          const dateCompare = aDate.getTime() - bDate.getTime();
          if (dateCompare !== 0) return dateCompare;
        }
        if (aDate) return -1;
        if (bDate) return 1;
        
        // Finally by priority
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      return -1;
    });
    
    return {
      pendingTasks: sorted.filter(t => !t.completed),
      completedTasks: sorted.filter(t => t.completed)
    };
  }, [tasks]);

  // Disabled state
  if (!userPreferences?.dashboardLayout?.showTasks) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Tasks Disabled</h2>
        <p className="text-white/70">Enable tasks in settings to manage your to-do list.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 h-full flex flex-col">
      {/* Header with View Toggle */}
      <div className="flex flex-col space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="heading-secondary flex items-center space-x-3">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Check className="w-6 h-6" />
            </motion.div>
            <span>Tasks</span>
          </h2>
          <motion.button
            onClick={() => setShowAddTask(!showAddTask)}
            className="btn-secondary interactive-element"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        </div>

        <div className="bg-white/10 rounded-lg p-1 flex">
          {['list', 'timeline'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveTaskView(view as TaskView)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                activeTaskView === view
                  ? 'bg-white/20 text-white'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)} View
            </button>
          ))}
        </div>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <div className="task-card space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
              
              <textarea
                placeholder="Description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              {/* Subtasks */}
              <SubTaskEditor
                subtasks={newSubtasks}
                onAdd={handleAddSubtask}
                onDelete={handleDeleteSubtask}
                onToggle={(id) => {
                  setNewSubtasks(prev => 
                    prev.map(st => st.id === id ? { ...st, completed: !st.completed } : st)
                  );
                }}
              />

              {/* Reminders */}
              <ReminderEditor
                reminders={newReminders}
                onAdd={handleAddReminder}
                onDelete={handleDeleteReminder}
              />
              
              <div className="flex space-x-3 pt-4">
                <motion.button
                  onClick={handleAddTask}
                  className="flex-1 btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </motion.button>
                <motion.button
                  onClick={() => setShowAddTask(false)}
                  className="btn-secondary"
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

      {/* Task Lists */}
      <div className="flex-1 overflow-y-auto">
        {activeTaskView === 'list' ? (
          <div className="space-y-6">
            {/* Pending Tasks */}
            {pendingTasks.length > 0 && (
              <div>
                <h3 className="text-white/90 text-base font-bold mb-4 flex items-center space-x-2">
                  <span>📋</span>
                  <span>
                    Pending ({pendingTasks.length})
                  </span>
                </h3>
                <div className="space-y-3">
                  {pendingTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      expanded={expandedTasks.has(task.id)}
                      onToggle={() => toggleTask(task.id)}
                      onExpand={() => toggleTaskExpansion(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      priorityColorMap={priorityWeight}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
              <div>
                <h3 className="text-white/90 text-base font-bold mb-4 flex items-center space-x-2">
                  <span>✅</span>
                  <span>
                    Completed ({completedTasks.length})
                  </span>
                </h3>
                <div className="space-y-3">
                  {completedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      expanded={expandedTasks.has(task.id)}
                      onToggle={() => toggleTask(task.id)}
                      onExpand={() => toggleTaskExpansion(task.id)}
                      onDelete={() => deleteTask(task.id)}
                      priorityColorMap={priorityWeight}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="text-center py-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-white/70">No tasks yet.</div>
                  <motion.button
                    onClick={() => setShowAddTask(true)}
                    className="btn-primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Create your first task
                  </motion.button>
                </motion.div>
              </div>
            )}
          </div>
        ) : (
          // Timeline View
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-px bg-white/20" />
            <div className="space-y-6 pl-12">
              {[...pendingTasks, ...completedTasks].map(task => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="relative"
                >
                  {/* Timeline Dot */}
                  <div 
                    className={`absolute -left-8 w-4 h-4 rounded-full border-2 ${
                      task.completed 
                        ? 'bg-green-500 border-green-600'
                        : 'bg-white border-white/50'
                    }`}
                  />
                  
                  {/* Task Card */}
                  <TaskCard
                    task={task}
                    expanded={expandedTasks.has(task.id)}
                    onToggle={() => toggleTask(task.id)}
                    onExpand={() => toggleTaskExpansion(task.id)}
                    onDelete={() => deleteTask(task.id)}
                    priorityColorMap={priorityWeight}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskPanel;