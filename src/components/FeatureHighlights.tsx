import { Smartphone, Brain, Zap } from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Cross-Platform Hub",
    description: "Browser extension, web app, and mobile app all synced seamlessly. Access your productivity tools anywhere, anytime.",
    gradient: "from-primary to-primary-light"
  },
  {
    icon: Zap,
    title: "Smart Notes & Tasks",
    description: "Organize, edit, and prioritize in one clean dashboard. Never lose track of important information again.",
    gradient: "from-secondary to-secondary-light"
  },
  {
    icon: Brain,
    title: "AI Productivity Boost",
    description: "Smart suggestions, reminders, and quick capture powered by AI. Let technology work for you.",
    gradient: "from-accent to-primary"
  }
];

const FeatureHighlights = () => {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-2xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Productivity Reimagined</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience the future of productivity with our intelligent, cross-platform solution 
            designed to keep you organized and focused.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="glass-card hover-glass p-8 group animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Icon with Gradient Background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-all duration-300 shadow-glow`}>
                  <Icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 text-card-foreground group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover Effect Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-muted-foreground mb-6">Ready to supercharge your productivity?</p>
          <div className="inline-flex gap-4">
            <button className="glass-card hover-glass px-8 py-3 text-primary font-medium micro-bounce">
              Learn More
            </button>
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-xl font-medium shadow-glow hover:scale-105 transition-transform micro-bounce">
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;