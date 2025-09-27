import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../components/LoginPage';
import ProtectedRoute from '../components/ProtectedRoute';

// Import your other components
import Greeting from '../components/Greeting';
import TaskPanel from '../components/TaskPanel';
import AISummary from '../components/AISummary';
import FeedGrid from '../components/FeedGrid';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
          <Routes>
            {/* Public route - Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <div className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* Main content */}
                      <div className="lg:col-span-2 space-y-6">
                        <Greeting />
                        <AISummary />
                        <FeedGrid />
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-6">
                        <TaskPanel />
                      </div>
                    </div>
                  </div>
                </ProtectedRoute>
              }
            />

            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;