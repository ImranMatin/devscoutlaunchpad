import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const PublicNavbar = () => {
  const location = useLocation();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src={logo} alt="DevScoutLaunchPad logo" className="w-9 h-9 rounded-lg transition-transform group-hover:scale-110" />
          <span className="text-lg font-bold text-foreground">DevScoutLaunchPad</span>
        </Link>
        <nav className="flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.to} to={link.to}>
              <Button
                variant="ghost"
                size="sm"
                className={`relative transition-all ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
                {location.pathname === link.to && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-2 right-2 h-0.5 rounded-full bg-primary"
                  />
                )}
              </Button>
            </Link>
          ))}
          <Link to="/auth" className="ml-2">
            <Button size="sm" className="gap-1.5 glow-purple">
              Get Started <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </motion.header>
  );
};

export default PublicNavbar;
