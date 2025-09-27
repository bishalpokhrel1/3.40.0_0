import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import Login from '../components/Login';

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <Login />
      </div>
    </AuthProvider>
  );
}

export default App;