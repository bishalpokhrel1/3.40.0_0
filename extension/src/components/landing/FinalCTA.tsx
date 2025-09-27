import { Button } from "@/components/ui/button";
import { ArrowRight, Mail } from "lucide-react";

interface FinalCTAProps {
  onGetStarted: () => void;
  isAuthenticated: boolean;
}

const FinalCTA = ({ onGetStarted, isAuthenticated }: FinalCTAProps) => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-3xl animate-glow-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-secondary/30 to-accent/30 rounded-full blur-2xl animate-glow-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Content */}
        <div className="animate-slide-up">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Ready to simplify
            <br />
            <span className="gradient-text">your workflow?</span>
          </h2>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who have transformed their productivity. 
            Start your journey today with our free plan.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              variant="hero" 
              size="lg" 
              className="shadow-glow animate-glow-pulse group"
              onClick={onGetStarted}
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Free'}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            {!isAuthenticated && (
              <Button variant="glass-outline" size="lg" className="group">
                <Mail className="mr-2 group-hover:scale-110 transition-transform" />
                Join Waitlist
              </Button>
            )}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="text-2xl font-bold gradient-text mb-2">Free Forever</div>
              <p className="text-sm text-muted-foreground">No credit card required</p>
            </div>
            
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-2xl font-bold gradient-text mb-2">Setup in 2 min</div>
              <p className="text-sm text-muted-foreground">Quick and easy onboarding</p>
            </div>
            
            <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="text-2xl font-bold gradient-text mb-2">24/7 Support</div>
              <p className="text-sm text-muted-foreground">We're here to help</p>
            </div>
          </div>

          {/* Security Note */}
          <div className="animate-fade-in">
            <p className="text-sm text-muted-foreground">
              🔒 Enterprise-grade security • 📱 Works on all devices • ⚡ Lightning fast sync
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;