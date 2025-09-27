import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

// Import landing page components
import Navigation from '../components/Navigation';
import HeroSection from '../components/HeroSection';
import FeatureHighlights from '../components/FeatureHighlights';
import ExtensionShowcase from '../components/ExtensionShowcase';
import SyncPreview from '../components/SyncPreview';
import AIFeatures from '../components/AIFeatures';
import SocialProof from '../components/SocialProof';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';

// Import dashboard components
import Greeting from '../components/Greeting';
import TaskPanel from '../components/TaskPanel';
import AISummary from '../components/AISummary';
import FeedGrid from '../components/FeedGrid';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <FeatureHighlights />
        <ExtensionShowcase />
        <SyncPreview />
        <AIFeatures />
        <SocialProof />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
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
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;