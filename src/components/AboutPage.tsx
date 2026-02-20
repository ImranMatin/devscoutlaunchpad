import { Zap, Target, Eye, Rocket, Users, Brain } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold text-foreground">About DevScoutLaunchPad</h2>
        <p className="text-sm text-muted-foreground mt-1">Empowering developers to find and win opportunities</p>
      </div>

      {/* Vision */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Our Vision</h3>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          We envision a world where every developer — regardless of background, location, or network — has equal access 
          to career-defining opportunities. DevScoutLaunchPad aims to be the AI-powered launchpad that bridges the gap 
          between talented developers and the hackathons, internships, and jobs that can transform their careers.
        </p>
      </div>

      {/* Mission */}
      <div className="glass-panel p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
        </div>
        <p className="text-sm text-foreground/80 leading-relaxed">
          To empower developers with AI-driven tools that automate the tedious parts of opportunity hunting — from 
          discovering relevant hackathons and jobs, to tailoring resumes, generating compelling outreach, and crafting 
          cover letters — so they can focus on what they do best: building amazing things.
        </p>
      </div>

      {/* What we offer */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">What We Offer</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { icon: Brain, title: "Resume Brain", desc: "AI-powered resume parsing that understands your skills and experience" },
            { icon: Zap, title: "Smart Matching", desc: "Compatibility scoring that shows how well you fit each opportunity" },
            { icon: Rocket, title: "Resume Tailoring", desc: "Auto-tailor your resume for any role with downloadable PDF & Word" },
            { icon: Users, title: "Outreach Suite", desc: "AI-generated pitches, LinkedIn messages, and cold emails that get replies" },
          ].map((item) => (
            <div key={item.title} className="glass-panel p-4 space-y-2">
              <div className="flex items-center gap-2">
                <item.icon className="w-4 h-4 text-primary" />
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
              </div>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
