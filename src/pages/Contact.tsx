import { useState } from "react";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import PublicNavbar from "@/components/PublicNavbar";

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
      <PublicNavbar />

      <main className="flex-1 py-20 px-6 hero-gradient">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto space-y-10"
        >
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold text-foreground">Contact Us</h1>
            <p className="text-muted-foreground">Have questions or feedback? We'd love to hear from you.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="grid gap-4 md:grid-cols-2"
          >
            <div className="glass-panel-hover p-5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Email</p>
                <p className="text-xs text-muted-foreground">support@devscoutlaunchpad.com</p>
              </div>
            </div>
            <div className="glass-panel-hover p-5 flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground">Community</p>
                <p className="text-xs text-muted-foreground">Join our Discord or GitHub Discussions</p>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            onSubmit={handleSubmit}
            className="glass-panel p-6 space-y-4"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <Input placeholder="Your name" required className="bg-background/50" />
              <Input type="email" placeholder="Your email" required className="bg-background/50" />
            </div>
            <Input placeholder="Subject" required className="bg-background/50" />
            <Textarea placeholder="Your message..." rows={5} required className="bg-background/50" />
            <Button type="submit" disabled={sending} className="w-full gap-2 glow-purple">
              <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
            </Button>
          </motion.form>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
