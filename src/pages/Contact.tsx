import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      setSending(false);
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      (e.target as HTMLFormElement).reset();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="border-b border-border bg-card/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">DevScoutLaunchPad</span>
          </Link>
          <Link to="/auth">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-20 px-6">
        <div className="max-w-2xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="glass-panel p-5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <p className="text-xs text-muted-foreground">support@codemasteracademy.com</p>
              </div>
            </div>
            <div className="glass-panel p-5 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Community</p>
                <p className="text-xs text-muted-foreground">Join our Discord or GitHub Discussions</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="glass-panel p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Your name" required className="bg-background/50" />
              <Input type="email" placeholder="Your email" required className="bg-background/50" />
            </div>
            <Input placeholder="Subject" required className="bg-background/50" />
            <Textarea placeholder="Your message..." rows={5} required className="bg-background/50" />
            <Button type="submit" disabled={sending} className="w-full gap-2">
              <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
