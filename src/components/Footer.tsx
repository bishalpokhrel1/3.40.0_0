import { Github, Twitter, Mail, Chrome, Smartphone } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Home', href: '#home' },
      { name: 'Features', href: '#features' },
      { name: 'Extension', href: '#extension' },
      { name: 'Mobile', href: '#mobile' },
      { name: 'Dashboard', href: '#dashboard' }
    ],
    Resources: [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' }
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#contact' }
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Github, href: '#', label: 'GitHub' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Mail, href: '#', label: 'Email' }
  ];

  return (
    <footer className="relative overflow-hidden border-t border-glass-border">
      {/* Background */}
      <div className="absolute inset-0 glass-nav"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold gradient-text mb-4">ProductivSync</h3>
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                The unified productivity hub that keeps you organized across all your devices. 
                Simple, powerful, and always in sync.
              </p>
            </div>

            {/* Download Links */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button className="glass-card hover-glass px-4 py-2 flex items-center gap-2 text-sm">
                <Chrome className="w-4 h-4" />
                Chrome Extension
              </button>
              <button className="glass-card hover-glass px-4 py-2 flex items-center gap-2 text-sm">
                <Smartphone className="w-4 h-4" />
                Mobile App
              </button>
            </div>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 glass-card hover-glass flex items-center justify-center group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-semibold mb-4 text-foreground">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-glass-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © 2024 ProductivSync. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Made with ❤️ for productivity enthusiasts</span>
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-glow-pulse"></div>
                <span>All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      <div className="absolute top-0 right-1/4 w-24 h-24 bg-secondary/5 rounded-full blur-xl"></div>
    </footer>
  );
};

export default Footer;