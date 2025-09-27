import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Product Manager",
    company: "TechFlow Inc.",
    avatar: "👩‍💼",
    quote: "ProductivSync has completely transformed how I manage my workflow. The cross-platform sync is seamless and the AI suggestions are incredibly helpful.",
    rating: 5
  },
  {
    name: "Marcus Rodriguez", 
    role: "Entrepreneur",
    company: "StartupLab",
    avatar: "👨‍💻",
    quote: "I've tried every productivity app out there. This is the first one that actually gets out of my way and just works. The browser extension is a game-changer.",
    rating: 5
  },
  {
    name: "Emily Foster",
    role: "Creative Director", 
    company: "Design Studio",
    avatar: "👩‍🎨",
    quote: "The instant capture feature has saved me countless ideas. Being able to jot something down on my phone and see it in my browser immediately is magical.",
    rating: 5
  }
];

const stats = [
  { value: "500K+", label: "Active Users" },
  { value: "50M+", label: "Tasks Completed" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "User Rating" }
];

const SocialProof = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl animate-float"></div>
      <div className="absolute bottom-20 right-1/4 w-24 h-24 bg-secondary/10 rounded-full blur-xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Loved by <span className="gradient-text">thousands</span> of professionals
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join a growing community of productivity enthusiasts who have transformed their workflows.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className="text-center animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="glass-card hover-glass p-6">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.name}
              className="glass-card hover-glass p-8 relative group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20 group-hover:opacity-40 transition-opacity">
                <Quote className="w-8 h-8 text-primary" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-4 h-4 text-yellow-400 fill-current"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-muted-foreground leading-relaxed mb-6 italic">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-2xl shadow-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="font-semibold text-card-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <p className="text-muted-foreground mb-6">
            Ready to join them?
          </p>
          <button className="glass-card hover-glow px-8 py-4 gradient-text font-semibold">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;