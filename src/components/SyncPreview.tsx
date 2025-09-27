import { RefreshCw, Smartphone, Monitor } from "lucide-react";
import syncPreviewImg from "@/assets/sync-preview.jpg";

const SyncPreview = () => {
  return (
    <section id="mobile" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/2 w-96 h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-3xl transform -translate-x-1/2"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-accent/20 rounded-full blur-xl animate-float"></div>
      <div className="absolute top-40 right-20 w-16 h-16 bg-primary/20 rounded-lg blur-lg animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 glass-card px-6 py-3">
              <RefreshCw className="w-5 h-5 text-primary animate-spin" style={{ animationDuration: '3s' }} />
              <span className="text-sm font-medium text-primary">Real-Time Sync</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Never lose an idea.</span>
            <br />
            Switch devices seamlessly.
          </h2>
          
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Your notes, tasks, and ideas sync instantly across all your devices. 
            Start on mobile, continue on web, finish on extension.
          </p>
        </div>

        {/* Sync Visualization */}
        <div className="relative mb-16">
          {/* Main Preview Image */}
          <div className="glass-card p-8 animate-slide-up">
            <img 
              src={syncPreviewImg}
              alt="Mobile and Web Dashboard Sync"
              className="w-full h-auto rounded-2xl shadow-float image-loom image-float-entrance"
              style={{ animationDelay: '1.6s' }}
            />
          </div>

          {/* Floating Sync Indicators */}
          <div className="absolute top-1/4 left-8 animate-slide-in-right" style={{ animationDelay: '0.5s' }}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Mobile</div>
                <div className="text-xs text-muted-foreground">Instant capture</div>
              </div>
            </div>
          </div>

          <div className="absolute top-1/4 right-8 animate-slide-in-right" style={{ animationDelay: '1s' }}>
            <div className="glass-card p-4 flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium">Web Dashboard</div>
                <div className="text-xs text-muted-foreground">Full management</div>
              </div>
            </div>
          </div>

          {/* Sync Animation Lines */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-32 h-0.5 bg-gradient-to-r from-primary to-secondary animate-glow-pulse"></div>
            <div className="w-0.5 h-32 bg-gradient-to-b from-primary to-secondary animate-glow-pulse mx-auto"></div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Cross-Device Continuity",
              description: "Pick up where you left off, no matter which device you're using",
              icon: "🔄"
            },
            {
              title: "Offline-First Design",
              description: "Keep working even without internet. Sync when you're back online",
              icon: "📱"
            },
            {
              title: "Real-Time Updates",
              description: "See changes instantly across all your connected devices",
              icon: "⚡"
            }
          ].map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card hover-glass p-6 text-center animate-slide-up micro-bounce"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SyncPreview;