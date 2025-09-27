import { Bot, Sparkles, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import aiFeaturesBg from "@/assets/ai-features-bg.jpg";

const AIFeatures = () => {
  const aiFeatures = [
    {
      icon: Bot,
      title: "Smart Task Organization",
      description: "AI automatically categorizes and prioritizes your tasks based on context and deadlines."
    },
    {
      icon: Sparkles,
      title: "Auto Note Summaries",
      description: "Long meetings? No problem. Get AI-generated summaries of your notes instantly."
    },
    {
      icon: Lightbulb,
      title: "Personalized Productivity Tips",
      description: "Learn from your patterns and get personalized suggestions to boost your efficiency."
    }
  ];

  return (
    <section id="ai-features" className="py-24 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={aiFeaturesBg}
          alt="AI Features Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
      </div>

      {/* Animated Particles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-primary/40 rounded-full animate-particle-float"
          style={{
            left: `${10 + (i * 7)}%`,
            top: `${20 + (i % 3) * 20}%`,
            animationDelay: `${i * 0.5}s`,
            animationDuration: `${8 + (i % 3) * 2}s`
          }}
        />
      ))}

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3 glass-card px-6 py-3 animate-glow-pulse">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium gradient-text">AI-Powered Intelligence</span>
            </div>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Intelligence that</span>
            <br />
            <span className="text-foreground">adapts to you</span>
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Experience productivity enhanced by artificial intelligence. Our AI learns from your 
            habits to provide smarter suggestions and automate repetitive tasks.
          </p>
        </div>

        {/* AI Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {aiFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={feature.title}
                className="glass-card hover-glass p-8 group relative overflow-hidden animate-slide-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary p-4 shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-full h-full text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover indicator */}
                <div className="absolute bottom-4 right-4 w-2 h-2 bg-primary rounded-full opacity-0 group-hover:opacity-100 animate-glow-pulse transition-opacity duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* Central AI Visualization */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="relative inline-block">
            <div className="glass-card p-12 rounded-3xl">
              <div className="relative">
                {/* Central AI Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-6 shadow-glow animate-glow-pulse mx-auto mb-6">
                  <Target className="w-full h-full text-white" />
                </div>
                
                {/* Orbiting Elements */}
                <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                  <div className="absolute -top-4 left-1/2 w-4 h-4 bg-primary/60 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 -right-4 w-3 h-3 bg-secondary/60 rounded-full transform -translate-y-1/2"></div>
                  <div className="absolute -bottom-4 left-1/2 w-4 h-4 bg-accent/60 rounded-full transform -translate-x-1/2"></div>
                  <div className="absolute top-1/2 -left-4 w-3 h-3 bg-primary/60 rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold gradient-text mb-4">
                Your Personal AI Assistant
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Continuously learning and improving to make your workflow more efficient every day.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center animate-slide-up">
          <Button variant="hero" size="lg" className="shadow-glow micro-bounce">
            <Sparkles className="mr-2" />
            Experience AI Magic
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Join the future of productivity today
          </p>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;