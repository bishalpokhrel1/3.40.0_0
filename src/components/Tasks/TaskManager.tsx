import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/appStore';
import { 
  Plus, 
  Check, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Trash2, 
  Calendar,
  Flag,
  Target
} from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

/**
 * Comprehensive task management component
 * Handles task creation, editing, subtasks, and timeline view
 */
const TaskManager: React.FC = () => {
  const { 
    tasks, 
    addTask, 
    updateTask, 
    deleteTask, 
    toggleTask,
    addSubTask,
    toggleSubTask
  } = useAppStore();

  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');
  const [showAddTask, setShowAddTask] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    dueDate: '',
    notes: ''
  });
  const [newSubtask, setNewSubtask] = useState<{ [taskId: string]: string }>({});

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      await addTask({
        title: newTask.title,
        description: newTask.description || undefined,
        completed: false,
        priority: newTask.priority,
        dueDate: newTask.dueDate || undefined,
        notes: newTask.notes || undefined,
        subtasks: [],
        tags: []
      });

      // Reset form
      setNewTask({ title: '', description: '', priority: 'medium', dueDate: '', notes: '' });
      setShowAddTask(false);
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleAddSubtask = async (taskId: string) => {
    const subtaskTitle = newSubtask[taskId];
    if (!subtaskTitle?.trim()) return;

    try {
      await addSubTask(taskId, {
        title: subtaskTitle,
        completed: false
      });

      // Clear input
      setNewSubtask({ ...newSubtask, [taskId]: '' });
    } catch (error) {
      console.error('Failed to add subtask:', error);
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

  const getTasksByStatus = () => {
    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);
    
    return {
      overdue: pending.filter(task => task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))),
      today: pending.filter(task => task.dueDate && isToday(new Date(task.dueDate))),
      upcoming: pending.filter(task => !task.dueDate || (!isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate)))),
      completed
    };
  };

  const taskGroups = getTasksByStatus();

  const TaskCard: React.FC<{ task: any; groupType: string }> = ({ task, groupType }) => {
    const isExpanded = expandedTasks.has(task.id);
    const completedSubtasks = task.subtasks?.filter((st: any) => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-xl p-6 shadow-sm border-l-4 hover:shadow-md transition-shadow ${
          groupType === 'overdue' ? 'border-red-500' :
          groupType === 'today' ? 'border-orange-500' :
          groupType === 'completed' ? 'border-green-500' :
          'border-blue-500'
        }`}
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
              <h4 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {task.title}
              </h4>
              <div className="flex items-center space-x-2">
                {/* Priority Badge */}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  <Flag className="w-3 h-3 inline mr-1" />
                  {task.priority.toUpperCase()}
                </span>
                
                {/* Expand Button */}
                {(task.subtasks?.length || task.description || task.notes) && (
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
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className={`text-sm font-medium ${
                  groupType === 'overdue' ? 'text-red-600' :
                  groupType === 'today' ? 'text-orange-600' :
                  'text-gray-600'
                }`}>
                  {isToday(new Date(task.dueDate)) ? 'Due Today' :
                   isTomorrow(new Date(task.dueDate)) ? 'Due Tomorrow' :
                   isPast(new Date(task.dueDate)) ? 'Overdue' :
                   `Due ${format(new Date(task.dueDate), 'MMM d, yyyy')}`}
                </span>
              </div>
            )}

            {/* Subtask Progress */}
            {totalSubtasks > 0 && (
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {completedSubtasks}/{totalSubtasks} subtasks completed
                </span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                  />
                </div>
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
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Description</h5>
                      <p className="text-gray-600 leading-relaxed">{task.description}</p>
                    </div>
                  )}

                  {/* Notes */}
                  {task.notes && (
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-2">Notes</h5>
                      <p className="text-gray-600 leading-relaxed">{task.notes}</p>
                    </div>
                  )}

                  {/* Subtasks */}
                  {task.subtasks && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h5 className="font-medium text-gray-800 mb-3">Subtasks</h5>
                      <div className="space-y-2">
                        {task.subtasks.map((subtask: any) => (
                          <div key={subtask.id} className="flex items-center space-x-3">
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
                        
                        {/* Add Subtask */}
                        <div className="flex items-center space-x-2 mt-3">
                          <input
                            type="text"
                            placeholder="Add subtask..."
                            value={newSubtask[task.id] || ''}
                            onChange={(e) => setNewSubtask({ ...newSubtask, [task.id]: e.target.value })}
                            className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                          />
                          <button
                            onClick={() => handleAddSubtask(task.id)}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
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
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Task Management</h2>
          <p className="text-gray-600">Organize your work with deadlines and subtasks</p>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'timeline' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
              }`}
            >
              Timeline
            </button>
          </div>
          
          <motion.button
            onClick={() => setShowAddTask(!showAddTask)}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5" />
            <span>Add Task</span>
          </motion.button>
        </div>
      </div>

      {/* Add Task Form */}
      <AnimatePresence>
        {showAddTask && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-2xl p-8 shadow-lg overflow-hidden"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6">Create New Task</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Task Title</label>
                  <input
                    type="text"
                    placeholder="What needs to be done?"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Add more details..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">🟢 Low Priority</option>
                    <option value="medium">🟡 Medium Priority</option>
                    <option value="high">🔴 High Priority</option>
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
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    placeholder="Additional notes..."
                    value={newTask.notes}
                    onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex space-x-4 mt-6">
              <motion.button
                onClick={handleAddTask}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Create Task
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Groups */}
      <div className="space-y-8">
        {/* Overdue Tasks */}
        {taskGroups.overdue.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-red-600 mb-4 flex items-center space-x-2">
              <Clock className="w-6 h-6" />
              <span>Overdue ({taskGroups.overdue.length})</span>
            </h3>
            <div className="space-y-4">
              {taskGroups.overdue.map((task) => (
                <TaskCard key={task.id} task={task} groupType="overdue" />
              ))}
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        {taskGroups.today.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-orange-600 mb-4 flex items-center space-x-2">
              <Calendar className="w-6 h-6" />
              <span>Due Today ({taskGroups.today.length})</span>
            </h3>
            <div className="space-y-4">
              {taskGroups.today.map((task) => (
                <TaskCard key={task.id} task={task} groupType="today" />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {taskGroups.upcoming.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-blue-600 mb-4 flex items-center space-x-2">
              <Target className="w-6 h-6" />
              <span>Upcoming ({taskGroups.upcoming.length})</span>
            </h3>
            <div className="space-y-4">
              {taskGroups.upcoming.map((task) => (
                <TaskCard key={task.id} task={task} groupType="upcoming" />
              ))}
            </div>
          </div>
        )}

        {/* Completed Tasks */}
        {taskGroups.completed.length > 0 && (
          <div>
            <h3 className="text-xl font-bold text-green-600 mb-4 flex items-center space-x-2">
              <Check className="w-6 h-6" />
              <span>Completed ({taskGroups.completed.length})</span>
            </h3>
            <div className="space-y-4">
              {taskGroups.completed.slice(0, 5).map((task) => (
                <TaskCard key={task.id} task={task} groupType="completed" />
              ))}
              {taskGroups.completed.length > 5 && (
                <p className="text-center text-gray-500 text-sm">
                  +{taskGroups.completed.length - 5} more completed tasks
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-12 shadow-lg text-center"
        >
          <div className="text-8xl mb-6">📋</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">No tasks yet</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Create your first task to start organizing your work and boost productivity.
          </p>
          <motion.button
            onClick={() => setShowAddTask(true)}
            className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Create Your First Task
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TaskManager;