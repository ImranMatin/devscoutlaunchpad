import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src={logo} alt="DevScoutLaunchPad logo" className="w-8 h-8 rounded-lg" />
              <span className="text-lg font-bold text-foreground">DevScoutLaunchPad</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered opportunity engine for developers. Find hackathons, internships, and jobs tailored to your skills.
            </p>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">License (MIT)</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://github.com/ImranMatin/devscoutlaunchpad" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Contribute on GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/imran-matin17/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Connect on LinkedIn</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center">
          <p className="text-xs text-muted-foreground">© 2026 DevScoutLaunchPad. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
