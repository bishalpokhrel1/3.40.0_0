import { Button } from "@/components/ui/button";
import { Play, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import heroMockup from "@/assets/hero-mockup.jpg";

const HeroSection = () => {
  const { signInWithGoogle, loading } = useAuth();

  const handleGetStarted = async () => {
    try {
      await signInWithGoogle();
      // Redirect to dashboard after successful login
      window.location.href = '/dashboard';
    } catch (error) {
      console.error('Sign in failed:', error);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 hero-glow animate-glow-pulse"></div>
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-secondary/20 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-accent/20 rounded-full blur-lg animate-float" style={{ animationDelay: '4s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left animate-slide-up">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              <span className="gradient-text">Stay Organized.</span>
              <br />
              <span className="text-foreground">Anywhere.</span>
              <br />
              <span className="gradient-text">Instantly.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl leading-relaxed">
              A unified productivity hub for web, mobile, and browser. Capture tasks, jot notes, 
              and manage your day without switching apps — all synced in one simple dashboard.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={handleGetStarted}
                disabled={loading}
                className="animate-glow-pulse micro-bounce"
              >
                {loading ? 'Signing in...' : 'Get Started Free'}
                <ArrowRight className="ml-2" />
              </Button>
              <Button variant="glass-outline" size="lg" className="group micro-bounce">
                <Play className="mr-2 group-hover:scale-110 transition-transform" />
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-secondary rounded-full animate-glow-pulse"></div>
                Free forever plan
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-accent rounded-full animate-glow-pulse"></div>
                500K+ users
              </div>
            </div>
          </div>

          {/* Hero Mockup */}
          <div className="relative animate-slide-in-right" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card p-4 animate-float">
              <img 
                src={heroMockup} 
                alt="ProductivSync Dashboard Preview"
                className="w-full h-auto rounded-xl shadow-float image-loom image-float-entrance"
                style={{ animationDelay: '0.8s' }}
              />
            </div>
            {/* Floating elements around mockup */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary/30 rounded-lg animate-particle-float"></div>
            <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-secondary/30 rounded-xl animate-particle-float" style={{ animationDelay: '3s' }}></div>
            <div className="absolute top-1/4 -right-8 w-6 h-6 bg-accent/40 rounded-full animate-particle-float" style={{ animationDelay: '1.5s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;