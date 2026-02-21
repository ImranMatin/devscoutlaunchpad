import { Brain, Target, Rocket, Send, FileText, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNavbar />

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-28 hero-gradient relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl space-y-6 relative z-10"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
          >
            <Sparkles className="w-3 h-3" /> AI-Powered Opportunity Engine
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight tracking-tight">
            Your Launchpad to <span className="text-gradient">Developer Opportunities</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            DevScoutLaunchPad uses AI to match you with hackathons, internships, and jobs — then tailors your resume, crafts cover letters, and generates outreach messages so you can focus on building.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-3 justify-center pt-2"
          >
            <Link to="/auth">
              <Button size="lg" className="gap-2 glow-purple">
                Get Started Free <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="outline" size="lg">Learn More</Button>
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-card/30">
        <div className="max-w-5xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-bold text-foreground">Everything You Need to Land Opportunities</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">From resume parsing to personalized outreach — all powered by AI.</p>
          </motion.div>
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="glass-panel p-6 space-y-3 cursor-default hover:border-primary/30 hover:shadow-[0_0_30px_-10px_hsl(var(--primary)/0.3)] transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 faq-section-bg">
        <div className="max-w-3xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="text-3xl font-bold">
              <span className="text-gradient-faq">Frequently Asked Questions</span>
            </h2>
            <p className="text-muted-foreground">Got questions? We've got answers.</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border rounded-xl px-5 border-[hsl(var(--faq-border))] bg-[hsl(var(--faq-bg)/0.5)] backdrop-blur-sm hover:border-[hsl(var(--faq-accent)/0.4)] transition-colors data-[state=open]:border-[hsl(var(--faq-accent)/0.5)] data-[state=open]:shadow-[0_0_20px_-8px_hsl(var(--faq-accent)/0.3)]"
                >
                  <AccordionTrigger className="text-left text-foreground hover:no-underline py-4">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-card/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(ellipse at center, hsl(260 70% 60% / 0.15), transparent 70%)" }} />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center space-y-5 relative z-10"
        >
          <h2 className="text-2xl font-bold text-foreground">Ready to Launch Your Career?</h2>
          <p className="text-muted-foreground">Join DevScoutLaunchPad and let AI do the heavy lifting.</p>
          <Link to="/auth">
            <Button size="lg" className="gap-2 glow-purple">
              Sign Up Free <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
