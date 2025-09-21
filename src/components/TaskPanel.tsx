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

  const getPriorityColor = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100'
      case 'medium': return 'text-yellow-600 bg-yellow-100'
      case 'low': return 'text-green-600 bg-green-100'
    }
  }

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
    <div className="glass-card p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <Check className="w-5 h-5" />
          <span>Tasks</span>
        </h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
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
            <div className="task-card space-y-3">
              <input
                type="text"
                placeholder="Task title..."
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
              />
              
              <textarea
                placeholder="Description (optional)..."
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              
              <div className="flex space-x-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                
                <input
                  type="date"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={handleAddTask}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTask(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto space-y-4">
        {/* Pending Tasks */}
        {pendingTasks.length > 0 && (
          <div>
            <h3 className="text-white/80 text-sm font-medium mb-3">
              Pending ({pendingTasks.length})
            </h3>
            <div className="space-y-2">
              {pendingTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="task-card"
                >
                  <div className="flex items-start space-x-3">
                    <button
                      onClick={() => toggleTask(task.id)}
                      className="mt-1 w-5 h-5 border-2 border-gray-300 rounded hover:border-blue-500 transition-colors flex items-center justify-center"
                    >
                      {task.completed && <Check className="w-3 h-3 text-blue-600" />}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 truncate">
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {task.aiSuggestions && (
                            <button
                              onClick={() => toggleTaskExpansion(task.id)}
                              className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {task.description}
                        </p>
                      )}
                      
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
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
                            className="mt-3 p-3 bg-blue-50 rounded-md"
                          >
                            <div className="flex items-center space-x-1 mb-2">
                              <Sparkles className="w-4 h-4 text-blue-600" />
                              <span className="text-sm font-medium text-blue-800">AI Suggestions</span>
                            </div>
                            <ul className="space-y-1">
                              {task.aiSuggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                                  <span className="text-blue-400 mt-1">•</span>
                                  <span>{suggestion}</span>
                                </li>
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
          <div className="text-center py-8">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-lg font-semibold text-white mb-2">No tasks yet</h3>
            <p className="text-white/70 text-sm mb-4">
              Add your first task to get started with productivity tracking.
            </p>
            <button
              onClick={() => setShowAddTask(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              Add Your First Task
            </button>
          </div>
        )}
      </div>

      {/* Google Tasks Sync Status */}
      {userPreferences.googleTasksSync && (
        <div className="mt-4 p-3 bg-green-100 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-800">Synced with Google Tasks</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default TaskPanel