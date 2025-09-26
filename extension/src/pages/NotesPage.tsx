import React from 'react';
import NotesManager from '../components/Notes/NotesManager';

/**
 * Dedicated page for notes management
 * Provides full-featured note creation, editing, and organization
 */
const NotesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <NotesManager />
      </div>
    </div>
  );
};

export default NotesPage;