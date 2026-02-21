import { Zap, Brain, Target, Rocket, Send, FileText, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const features = [
  { icon: Brain, title: "Resume Brain", desc: "AI-powered parsing that deeply understands your skills, projects, and experience." },
  { icon: Target, title: "Smart Matching", desc: "Compatibility scoring that shows exactly how well you fit each opportunity." },
  { icon: Rocket, title: "Resume Tailoring", desc: "Auto-tailor your resume using Google's X,Y,Z method with strong action verbs and metrics." },
  { icon: Send, title: "Outreach Suite", desc: "AI-generated pitches, LinkedIn messages, and cold emails that actually get replies." },
  { icon: FileText, title: "Cover Letters", desc: "Personalized cover letters aligned with each role's requirements." },
];

const faqs = [
  { q: "What is DevScoutLaunchPad?", a: "DevScoutLaunchPad is an AI-powered opportunity engine that helps developers discover hackathons, internships, and jobs — then automatically tailors resumes, generates cover letters, and crafts outreach messages to maximize your chances." },
  { q: "How does the Resume Brain work?", a: "Upload your resume as a PDF and our AI extracts your skills, experience, education, projects, and hackathon participation into a structured profile. This profile is then used for smart matching and tailoring." },
  { q: "What is the Google X,Y,Z method?", a: "It's a proven format for writing impactful resume bullets: 'Accomplished [X] as measured by [Y], by doing [Z].' Our AI rewrites your experience using this method with strong action verbs and quantifiable metrics." },
  { q: "Is my data secure?", a: "Yes. All data is stored securely with Row Level Security policies ensuring only you can access your profile and resume information. We never share your data with third parties." },
  { q: "Is DevScoutLaunchPad free to use?", a: "Yes! DevScoutLaunchPad is free to use. Sign up with your email to get started with AI-powered opportunity matching and resume tailoring." },
  { q: "Can I export my tailored resume?", a: "Absolutely. You can download your tailored resume as a PDF or Word document, ready to submit to any application." },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">DevScoutLaunchPad</span>
          </div>
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

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium">
            <Zap className="w-3 h-3" /> AI-Powered Opportunity Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
            Your Launchpad to <span className="text-gradient">Developer Opportunities</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DevScoutLaunchPad uses AI to match you with hackathons, internships, and jobs — then tailors your resume, crafts cover letters, and generates outreach messages so you can focus on building.
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <Link to="/auth">
              <Button size="lg" className="gap-2">
                Get Started Free <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">Learn More</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Everything You Need to Land Opportunities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From resume parsing to personalized outreach — all powered by AI.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="glass-panel p-6 space-y-3 hover:border-primary/20 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Got questions? We've got answers.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-card/30">
        <div className="max-w-2xl mx-auto text-center space-y-5">
          <h2 className="text-2xl font-bold text-foreground">Ready to Launch Your Career?</h2>
          <p className="text-muted-foreground">Join DevScoutLaunchPad and let AI do the heavy lifting.</p>
          <Link to="/auth">
            <Button size="lg" className="gap-2">
              Sign Up Free <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
