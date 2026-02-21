import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import AboutPage from "@/components/AboutPage";
import Footer from "@/components/Footer";
import logo from "@/assets/logo.png";

const About = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="DevScoutLaunchPad logo" className="w-9 h-9 rounded-lg" />
            <span className="text-lg font-bold text-foreground">DevScoutLaunchPad</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/contact">
              <Button variant="ghost" size="sm">Contact</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm">Get Started <ChevronRight className="w-4 h-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <AboutPage />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
