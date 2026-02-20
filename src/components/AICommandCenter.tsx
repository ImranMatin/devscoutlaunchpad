import { useState } from "react";
import { X, Sparkles, Copy, Mail, Linkedin, Loader2, CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Opportunity, ResumeData, SmartMatchResult, OutreachDraft } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface AICommandCenterProps {
  opportunity: Opportunity;
  resumeData: ResumeData | null;
  onClose: () => void;
}

const AICommandCenter = ({ opportunity, resumeData, onClose }: AICommandCenterProps) => {
  const [matchResult, setMatchResult] = useState<SmartMatchResult | null>(null);
  const [outreach, setOutreach] = useState<OutreachDraft | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingOutreach, setLoadingOutreach] = useState(false);
  const { toast } = useToast();

  const runSmartMatch = async () => {
    if (!resumeData) return;
    setLoadingMatch(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-match", {
        body: { resume: resumeData, opportunity },
      });
      if (error) throw error;
      setMatchResult(data as SmartMatchResult);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to analyze match. Please try again.", variant: "destructive" });
    } finally {
      setLoadingMatch(false);
    }
  };

  const generateOutreach = async () => {
    setLoadingOutreach(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-outreach", {
        body: { resume: resumeData, opportunity },
      });
      if (error) throw error;
      setOutreach(data as OutreachDraft);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate outreach.", variant: "destructive" });
    } finally {
      setLoadingOutreach(false);
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-[420px] sidebar-gradient border-l border-border z-50 flex flex-col overflow-hidden"
    >
      <div className="p-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h2 className="font-bold text-foreground">AI Command Center</h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-6">
        {/* Selected Opportunity */}
        <div className="glass-panel p-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Selected</p>
          <h3 className="font-semibold text-foreground">{opportunity.title}</h3>
          <p className="text-sm text-muted-foreground">{opportunity.company}</p>
        </div>

        {/* Smart Match */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Smart Match Analysis</h3>
          {!resumeData ? (
            <p className="text-xs text-muted-foreground glass-panel p-3">Upload your resume first to unlock smart matching.</p>
          ) : !matchResult ? (
            <Button onClick={runSmartMatch} disabled={loadingMatch} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              {loadingMatch ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Analyze Compatibility
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full border-4 border-primary flex items-center justify-center glow-emerald">
                  <span className="text-2xl font-bold text-primary">{matchResult.score}%</span>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Compatibility Score</p>
                  <p className="text-xs text-muted-foreground">
                    {matchResult.score >= 75 ? "Strong match!" : matchResult.score >= 50 ? "Good potential" : "Room to grow"}
                  </p>
                </div>
              </div>

              <div className="glass-panel p-3 space-y-2">
                <p className="text-xs font-semibold text-primary flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Top Highlights
                </p>
                {matchResult.highlights.map((h, i) => (
                  <p key={i} className="text-xs text-foreground/80 pl-4">• {h}</p>
                ))}
              </div>

              <div className="glass-panel p-3">
                <p className="text-xs font-semibold text-amber-400 mb-1">⚡ Skill Gap</p>
                <p className="text-xs text-foreground/80">{matchResult.skillGap}</p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Outreach Suite */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Outreach Suite</h3>
          {!outreach ? (
            <Button onClick={generateOutreach} disabled={loadingOutreach} variant="outline" className="w-full">
              {loadingOutreach ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
              Draft Outreach
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              {/* Pitch */}
              <div className="glass-panel p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">Intro Pitch</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyText(outreach.pitch, "Pitch")}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{outreach.pitch}</p>
              </div>

              {/* LinkedIn */}
              <div className="glass-panel p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Linkedin className="w-3 h-3 text-blue-400" /> LinkedIn Connect
                  </p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyText(outreach.linkedinMessage, "LinkedIn message")}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-foreground/80">{outreach.linkedinMessage}</p>
                <a
                  href={`https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(opportunity.company)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary mt-2 inline-block hover:underline"
                >
                  Search {opportunity.company} on LinkedIn →
                </a>
              </div>

              {/* Email */}
              <div className="glass-panel p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3 text-primary" /> Cold Email
                  </p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyText(`Subject: ${outreach.email.subject}\n\n${outreach.email.body}`, "Email")}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-[10px] text-muted-foreground mb-1">Subject: {outreach.email.subject}</p>
                <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{outreach.email.body}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default AICommandCenter;
