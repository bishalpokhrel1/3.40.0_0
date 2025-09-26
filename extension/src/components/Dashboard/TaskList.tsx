import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { Plus, Check, Clock, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Task list component for the dashboard
 * Shows tasks with deadlines, subtasks, and quick actions
 */
const TaskList: React.FC = () => {
  const { 
    tasks, 
    tasksLoading, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask,
    addSubTask,
    toggleSubTask
  } = useAppStore();

  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: ''
  });

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await addTask({
        title: newTask.title,
        description: newTask.description || undefined,
        completed: false,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
        subtasks: [],
        tags: []
      });

      // Reset form
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
      setShowAddTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const getTaskDateStatus = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    if (isPast(date) && !isToday(date)) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    return 'upcoming';
  };

  const getDateStatusColor = (status: string | null) => {
    switch (status) {
      case 'overdue': return 'text-red-600 bg-red-100';
      case 'today': return 'text-orange-600 bg-orange-100';
      case 'tomorrow': return 'text-blue-600 bg-blue-100';
      case 'upcoming': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  if (tasksLoading) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Tasks</h2>
          <p className="text-gray-600">
            {pendingTasks.length} pending, {completedTasks.length} completed
          </p>
        </div>
        <motion.button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              
              <textarea
                placeholder="Description (optional)..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  onClick={handleAddTask}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Task
                </motion.button>
                <motion.button
                  onClick={() => setShowAddTask(false)}
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

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Tasks</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => {
                const isExpanded = expandedTasks.has(task.id);
                const dateStatus = getTaskDateStatus(task.dueDate);
                
                return (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start space-x-4">
                      {/* Checkbox */}
                      <motion.button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 w-6 h-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-colors flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {task.completed && <Check className="w-4 h-4 text-blue-600" />}
                      </motion.button>

                      {/* Task Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-800 truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center space-x-2">
                            {/* Priority Badge */}
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              task.priority === 'high' ? 'bg-red-100 text-red-800' :
                              task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {task.priority.toUpperCase()}
                            </span>
                            
                            {/* Expand/Collapse Button */}
                            {(task.subtasks?.length || task.description) && (
                              <button
                                onClick={() => toggleTaskExpansion(task.id)}
                                className="p-1 hover:bg-gray-100 rounded"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="w-4 h-4 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-gray-500" />
                                )}
                              </button>
                            )}
                            
                            {/* Delete Button */}
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-1 hover:bg-red-100 rounded text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Due Date */}
                        {task.dueDate && (
                          <div className="flex items-center space-x-2 mb-2">
                            <Clock className="w-4 h-4 text-gray-400" />
                            <span className={`text-sm px-2 py-1 rounded-full font-medium ${getDateStatusColor(dateStatus)}`}>
                              {dateStatus === 'today' ? 'Due Today' :
                               dateStatus === 'tomorrow' ? 'Due Tomorrow' :
                               dateStatus === 'overdue' ? 'Overdue' :
                               `Due ${format(new Date(task.dueDate), 'MMM d')}`}
                            </span>
                          </div>
                        )}

                        {/* Expanded Content */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 space-y-4"
                            >
                              {/* Description */}
                              {task.description && (
                                <p className="text-gray-600 leading-relaxed">
                                  {task.description}
                                </p>
                              )}

                              {/* Subtasks */}
                              {task.subtasks && task.subtasks.length > 0 && (
                                <div>
                                  <h5 className="text-sm font-semibold text-gray-700 mb-2">Subtasks</h5>
                                  <div className="space-y-2">
                                    {task.subtasks.map((subtask) => (
                                      <div key={subtask.id} className="flex items-center space-x-3 pl-4">
                                        <button
                                          onClick={() => toggleSubTask(task.id, subtask.id)}
                                          className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center hover:border-blue-500 transition-colors"
                                        >
                                          {subtask.completed && <Check className="w-3 h-3 text-blue-600" />}
                                        </button>
                                        <span className={`text-sm ${subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                                          {subtask.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.slice(0, 3).map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gray-50 rounded-lg p-4 opacity-75"
                >
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </button>
                    <span className="text-gray-600 line-through font-medium">
                      {task.title}
                    </span>
                  </div>
                </motion.div>
              ))}
              {completedTasks.length > 3 && (
                <p className="text-sm text-gray-500 text-center">
                  +{completedTasks.length - 3} more completed tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No tasks yet</h3>
            <p className="text-gray-600 mb-6">Create your first task to get started</p>
            <motion.button
              onClick={() => setShowAddTask(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Task
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TaskList;