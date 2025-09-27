import { useState, useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import Navigation from './landing/Navigation';
import HeroSection from './landing/HeroSection';
import FeatureHighlights from './landing/FeatureHighlights';
import ExtensionShowcase from './landing/ExtensionShowcase';
import SyncPreview from './landing/SyncPreview';
import AIFeatures from './landing/AIFeatures';
import SocialProof from './landing/SocialProof';
import FinalCTA from './landing/FinalCTA';
import Footer from './landing/Footer';
import { AuthForm } from './AuthForm';

const LandingPage = () => {
  const {
    isAuthenticated,
    user,
    signOut,
    hasCompletedOnboarding,
    completeOnboarding
  } = useAppStore((state) => ({
    isAuthenticated: state.isAuthenticated,
    user: state.user,
    signOut: state.signOut,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    completeOnboarding: state.completeOnboarding
  }));

  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding) {
      completeOnboarding();
    }
  }, [isAuthenticated, hasCompletedOnboarding, completeOnboarding]);

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    completeOnboarding();
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      completeOnboarding();
    } else {
      setAuthMode('signup');
      setShowAuthModal(true);
    }
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen">
      <Navigation 
        isAuthenticated={isAuthenticated}
        user={user}
        onSignIn={handleSignIn}
        onGetStarted={handleGetStarted}
        onSignOut={handleSignOut}
      />
      
      <main>
        <HeroSection 
          onGetStarted={handleGetStarted}
          onSignIn={handleSignIn}
          isAuthenticated={isAuthenticated}
        />
        <FeatureHighlights />
        <ExtensionShowcase />
        <SyncPreview />
        <AIFeatures />
        <SocialProof />
        <FinalCTA 
          onGetStarted={handleGetStarted}
          isAuthenticated={isAuthenticated}
        />
      </main>
      
      <Footer />

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card p-8 max-w-md w-full animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold gradient-text">
                {authMode === 'signin' ? 'Welcome Back' : 'Get Started'}
              </h2>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="flex gap-2 text-sm bg-muted/20 px-3 py-1 rounded-full mb-6">
              <button
                onClick={() => setAuthMode('signin')}
                className={`transition-colors px-3 py-1 rounded-full ${
                  authMode === 'signin' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className={`transition-colors px-3 py-1 rounded-full ${
                  authMode === 'signup' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Sign Up
              </button>
            </div>
            
            <AuthForm mode={authMode} onSuccess={handleAuthSuccess} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;

