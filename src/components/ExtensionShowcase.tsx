import { Chrome, MousePointer, Sidebar } from "lucide-react";
import { Button } from "@/components/ui/button";
import extensionMockup from "@/assets/extension-mockup.jpg";

const ExtensionShowcase = () => {
  return (
    <section id="extension" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      
      {/* Floating Particles */}
      <div className="absolute top-20 left-1/4 w-4 h-4 bg-primary/40 rounded-full animate-particle-float"></div>
      <div className="absolute bottom-40 right-1/3 w-6 h-6 bg-secondary/30 rounded-lg animate-particle-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-2 glass-card px-4 py-2">
                <Chrome className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">Chrome Extension</span>
              </div>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Your workflow,
              <br />
              <span className="gradient-text">one click away</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Transform your browser into a productivity powerhouse. Capture ideas instantly, 
              manage tasks without switching tabs, and access your dashboard from any website.
            </p>

            {/* Feature List */}
            <div className="space-y-4 mb-8">
              {[
                { icon: MousePointer, text: "Quick capture from any webpage" },
                { icon: Sidebar, text: "Side panel for instant access" },
                { icon: Chrome, text: "New tab dashboard integration" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="micro-bounce">
                <Chrome className="mr-2" />
                Add to Chrome
              </Button>
              <Button variant="glass-outline" size="lg" className="micro-bounce">
                View Demo
              </Button>
            </div>
          </div>

          {/* Extension Mockup */}
          <div className="relative animate-slide-in-right">
            {/* Main Mockup Container */}
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-3xl animate-glow-pulse"></div>
              
              {/* Mockup Frame */}
              <div className="relative glass-card p-6 animate-float">
                <img 
                  src={extensionMockup}
                  alt="Chrome Extension Interface"
                  className="w-full h-auto rounded-xl shadow-float image-loom image-float-entrance"
                  style={{ animationDelay: '1.2s' }}
                />
                
                {/* Overlay Labels */}
                <div className="absolute top-8 left-8 glass-card px-3 py-1">
                  <span className="text-xs font-medium text-primary">New Tab</span>
                </div>
                
                <div className="absolute top-1/2 right-8 glass-card px-3 py-1">
                  <span className="text-xs font-medium text-secondary">Popup</span>
                </div>
                
                <div className="absolute bottom-8 left-1/3 glass-card px-3 py-1">
                  <span className="text-xs font-medium text-accent">Side Panel</span>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-primary/20 rounded-2xl animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-secondary/30 rounded-xl animate-float" style={{ animationDelay: '3s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtensionShowcase;