import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/store/appStore'
import { 
  Plus, 
  Check, 
  Trash2, 
  Calendar,
  Sparkles
} from 'lucide-react'
import { format } from 'date-fns'

const TaskPanel: React.FC = () => {
  const { 
    tasks, 
    userPreferences,
    addTask, 
    deleteTask, 
    toggleTask 
  } = useAppStore()
  
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskDescription, setNewTaskDescription] = useState('')
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium')
  const [newTaskDueDate, setNewTaskDueDate] = useState('')
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return

    const taskData = {
      title: newTaskTitle,
      description: newTaskDescription || undefined,
      completed: false,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || undefined
    }

    // Try to get AI suggestions for task breakdown
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'getTaskSuggestions',
        task: newTaskTitle
      })
      
      if (response?.suggestions) {
        addTask({ ...taskData, aiSuggestions: response.suggestions })
      } else {
        addTask(taskData)
      }
    } catch (error) {
      console.error('Failed to get AI suggestions:', error)
      addTask(taskData)
    }

    // Reset form
    setNewTaskTitle('')
    setNewTaskDescription('')
    setNewTaskPriority('medium')
    setNewTaskDueDate('')
    setShowAddTask(false)
  }

  const toggleTaskExpansion = (taskId: string) => {
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const priorityColorMap = {
    high: 'text-red-600 bg-red-100',
    medium: 'text-yellow-600 bg-yellow-100',
    low: 'text-green-600 bg-green-100'
  } as const;

  const completedTasks = tasks.filter(task => task.completed)
  const pendingTasks = tasks.filter(task => !task.completed)

  if (!userPreferences.tasksEnabled) {
    return (
      <div className="glass-card p-6 text-center">
        <h2 className="text-xl font-semibold text-white mb-2">Tasks Disabled</h2>
        <p className="text-white/70">Enable tasks in settings to manage your to-do list.</p>
      </div>
    )
  }

  return (
    <div className="glass-card card-padding h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
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
                className="form-input text-lg font-medium"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                autoFocus
              />
              
              <textarea
                placeholder="Description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="form-textarea"
                rows={3}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                    className="form-select"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="flex space-x-3 pt-2">
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
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
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

      {/* Task Statistics */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 grid grid-cols-3 gap-4"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{tasks.length}</div>
            <div className="text-white/70 text-xs font-medium">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{completedTasks.length}</div>
            <div className="text-white/70 text-xs font-medium">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{pendingTasks.length}</div>
            <div className="text-white/70 text-xs font-medium">Pending</div>
          </div>
        </motion.div>
      )}

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-4">
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
              {pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.02 }}
                  className="task-card"
                >
                  <div className="flex items-start space-x-4">
                    <motion.button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-6 h-6 border-2 border-gray-300 rounded-lg hover:border-blue-500 transition-all duration-200 flex items-center justify-center"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {task.completed && <Check className="w-4 h-4 text-blue-600" />}
                    </motion.button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-gray-900 truncate text-lg">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className={`${priorityColorMap[task.priority]} text-xs px-2 py-1 rounded-lg`}>
                            {task.priority.toUpperCase()}
                          </span>
                          {task.aiSuggestions && (
                            <motion.button
                              onClick={() => toggleTaskExpansion(task.id)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Sparkles className="w-5 h-5" />
                            </motion.button>
                          )}
                          <motion.button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </motion.button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-2 mt-3 text-sm text-gray-500 font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>Due {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                        </div>
                      )}
                      
                      {/* AI Suggestions */}
                      <AnimatePresence>
                        {expandedTasks.has(task.id) && task.aiSuggestions && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <motion.div
                                animate={{ rotate: [0, 360] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                              >
                                <Sparkles className="w-5 h-5 text-blue-600" />
                              </motion.div>
                              <span className="text-sm font-bold text-blue-800 uppercase tracking-wide">AI Suggestions</span>
                            </div>
                            <ul className="space-y-2">
                              {task.aiSuggestions.map((suggestion, index) => (
                                <motion.li 
                                  key={index} 
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                  className="text-sm text-blue-800 flex items-start space-x-3 font-medium"
                                >
                                  <span className="text-blue-500 mt-1 font-bold">{index + 1}.</span>
                                  <span className="leading-relaxed">{suggestion}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div>
            <h3 className="text-white/60 text-sm font-medium mb-3">
              Completed ({completedTasks.length})
            </h3>
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="task-card opacity-60"
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 bg-green-500 rounded flex items-center justify-center"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-500 line-through truncate">
                          {task.title}
                        </h4>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
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
            <motion.div 
              className="text-6xl mb-6"
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              ✅
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-3">No tasks yet</h3>
            <p className="text-white/70 text-base mb-6 leading-relaxed">
              Add your first task to get started with productivity tracking.
            </p>
            <motion.button
              onClick={() => setShowAddTask(true)}
              className="btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Your First Task
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Google Tasks Sync Status */}
      {userPreferences.googleTasksSync && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200"
        >
          <div className="flex items-center space-x-3">
            <motion.div 
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-sm text-green-800 font-semibold">Synced with Google Tasks</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default TaskPanel