import React from 'react';
import TaskManager from '../components/Tasks/TaskManager';

/**
 * Dedicated page for task management
 * Provides full-featured task planning and organization
 */
const TasksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <TaskManager />
      </div>
    </div>
  );
};

export default TasksPage;