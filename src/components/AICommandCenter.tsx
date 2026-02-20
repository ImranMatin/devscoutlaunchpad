import { useState } from "react";
import { X, Sparkles, Copy, Mail, Linkedin, Loader2, CheckCircle2, Send, FileText, Save, Download, Edit3, FileDown, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Opportunity, ResumeData, SmartMatchResult, OutreachDraft, TailoredResume, CoverLetterData } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { downloadResumePDF, downloadResumeWord, downloadCoverLetterPDF, downloadCoverLetterWord } from "@/lib/resumeDownload";

interface AICommandCenterProps {
  opportunity: Opportunity;
  resumeData: ResumeData | null;
  onClose: () => void;
}

const AICommandCenter = ({ opportunity, resumeData, onClose }: AICommandCenterProps) => {
  const [matchResult, setMatchResult] = useState<SmartMatchResult | null>(null);
  const [outreach, setOutreach] = useState<OutreachDraft | null>(null);
  const [tailoredResume, setTailoredResume] = useState<TailoredResume | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterData | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const [loadingOutreach, setLoadingOutreach] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);
  const [editingResume, setEditingResume] = useState(false);
  const [editingCoverLetter, setEditingCoverLetter] = useState(false);
  const [editedSummary, setEditedSummary] = useState("");
  const [editedProjects, setEditedProjects] = useState("");
  const [editedCoverLetter, setEditedCoverLetter] = useState("");
  const { toast } = useToast();

  const saveMatchHistory = async (result: SmartMatchResult) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      await supabase.from("match_history").insert({
        user_id: session.user.id,
        opportunity_id: opportunity.id,
        opportunity_title: opportunity.title,
        score: result.score,
        highlights: result.highlights as any,
        skill_gap: result.skillGap,
      });
    } catch (err) {
      console.error("Failed to save match history:", err);
    }
  };

  const runSmartMatch = async () => {
    if (!resumeData) return;
    setLoadingMatch(true);
    try {
      const { data, error } = await supabase.functions.invoke("smart-match", {
        body: { resume: resumeData, opportunity },
      });
      if (error) throw error;
      const result = data as SmartMatchResult;
      setMatchResult(result);
      await saveMatchHistory(result);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to analyze match.", variant: "destructive" });
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

  const tailorResume = async () => {
    if (!resumeData) return;
    setLoadingTailor(true);
    try {
      const { data, error } = await supabase.functions.invoke("tailor-resume", {
        body: { resume: resumeData, opportunity },
      });
      if (error) throw error;
      const result = data as TailoredResume;
      setTailoredResume(result);
      setEditedSummary(result.summary);
      setEditedProjects(result.projects.join("\n"));
      toast({ title: "Resume Tailored!", description: "Your resume has been optimized for this role." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to tailor resume.", variant: "destructive" });
    } finally {
      setLoadingTailor(false);
    }
  };

  const generateCoverLetter = async () => {
    setLoadingCoverLetter(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-cover-letter", {
        body: { resume: resumeData, opportunity, tailoredResume },
      });
      if (error) throw error;
      const result = data as CoverLetterData;
      setCoverLetter(result);
      setEditedCoverLetter(result.coverLetter);
      toast({ title: "Cover Letter Generated!", description: "Tailored to the job description." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to generate cover letter.", variant: "destructive" });
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  const saveResumeEdits = () => {
    if (!tailoredResume) return;
    setTailoredResume({
      ...tailoredResume,
      summary: editedSummary,
      projects: editedProjects.split("\n").filter(Boolean),
    });
    setEditingResume(false);
    toast({ title: "Saved!", description: "Resume edits applied." });
  };

  const saveCoverLetterEdits = () => {
    if (!coverLetter) return;
    setCoverLetter({ ...coverLetter, coverLetter: editedCoverLetter });
    setEditingCoverLetter(false);
    toast({ title: "Saved!", description: "Cover letter edits applied." });
  };

  const saveToProfile = async () => {
    if (!tailoredResume) return;
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      const allSkills = tailoredResume.technicalSkills.flatMap(cat => cat.skills);
      await supabase.from("profiles").update({
        skills: allSkills as any,
        projects: tailoredResume.projects as any,
      }).eq("user_id", session.user.id);
      toast({ title: "Saved!", description: "Tailored skills & projects saved to your profile." });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to save to profile.", variant: "destructive" });
    }
  };

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied to clipboard.` });
  };

  const copyTailoredResume = () => {
    if (!tailoredResume) return;
    const skillsText = tailoredResume.technicalSkills
      .map(cat => `${cat.category}: ${cat.skills.join(", ")}`)
      .join("\n");
    const full = `SUMMARY\n${tailoredResume.summary}\n\nTECHNICAL SKILLS\n${skillsText}\n\nPROJECTS & ACHIEVEMENTS\n${tailoredResume.projects.join("\n")}`;
    copyText(full, "Tailored resume");
  };

  const candidateName = resumeData?.name || "Candidate";

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed right-0 top-0 h-screen w-[440px] sidebar-gradient border-l border-border z-50 flex flex-col overflow-hidden"
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

              {matchResult.resumeTips && matchResult.resumeTips.length > 0 && (
                <div className="glass-panel p-3 space-y-2">
                  <p className="text-xs font-semibold text-primary flex items-center gap-1">
                    📝 Resume Improvement Tips
                  </p>
                  {matchResult.resumeTips.map((tip, i) => (
                    <p key={i} className="text-xs text-foreground/80 pl-4">• {tip}</p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Tailor Resume - Always visible when resume exists */}
        {resumeData && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Tailor Resume</h3>
            {!tailoredResume ? (
              <Button onClick={tailorResume} disabled={loadingTailor} className="w-full" variant="outline">
                {loadingTailor ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <FileText className="w-4 h-4 mr-2" />}
                Tailor My Resume
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    <FileText className="w-4 h-4" /> Tailored Resume
                  </p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditingResume(!editingResume); }} title="Edit">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={copyTailoredResume} title="Copy All">
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={saveToProfile} title="Save to Profile">
                      <Save className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {editingResume ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Summary</p>
                      <Textarea value={editedSummary} onChange={(e) => setEditedSummary(e.target.value)} className="text-xs bg-card/60 border-border min-h-[80px]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-1">Projects (one per line)</p>
                      <Textarea value={editedProjects} onChange={(e) => setEditedProjects(e.target.value)} className="text-xs bg-card/60 border-border min-h-[100px]" />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveResumeEdits}>Save Changes</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingResume(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="glass-panel p-3">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">Summary</p>
                      <p className="text-xs text-foreground/80 leading-relaxed">{tailoredResume.summary}</p>
                    </div>

                    <div className="glass-panel p-3 space-y-3">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">Technical Skills</p>
                      {tailoredResume.technicalSkills.map((cat, i) => (
                        <div key={i}>
                          <p className="text-[10px] font-semibold text-primary mb-1">{cat.category}</p>
                          <div className="flex flex-wrap gap-1">
                            {cat.skills.map((skill, j) => (
                              <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary">{skill}</span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="glass-panel p-3 space-y-2">
                      <p className="text-xs font-bold text-foreground uppercase tracking-wider">Projects & Achievements</p>
                      {tailoredResume.projects.map((proj, i) => (
                        <p key={i} className="text-xs text-foreground/80 pl-4">• {proj}</p>
                      ))}
                    </div>

                    <div className="glass-panel p-3">
                      <p className="text-xs font-semibold text-amber-400 mb-1">✨ What Changed</p>
                      <p className="text-xs text-foreground/80">{tailoredResume.tips}</p>
                    </div>
                  </>
                )}

                {/* Download buttons */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadResumePDF(tailoredResume, candidateName)}>
                    <Download className="w-3 h-3 mr-1" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadResumeWord(tailoredResume, candidateName)}>
                    <FileDown className="w-3 h-3 mr-1" /> Word
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}

        {/* Cover Letter */}
        {resumeData && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Cover Letter</h3>
            {!coverLetter ? (
              <Button onClick={generateCoverLetter} disabled={loadingCoverLetter} className="w-full" variant="outline">
                {loadingCoverLetter ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <PenLine className="w-4 h-4 mr-2" />}
                Generate Cover Letter
              </Button>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-primary flex items-center gap-1">
                    <PenLine className="w-4 h-4" /> Cover Letter
                  </p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditingCoverLetter(!editingCoverLetter)} title="Edit">
                      <Edit3 className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyText(coverLetter.coverLetter, "Cover letter")} title="Copy">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {editingCoverLetter ? (
                  <div className="space-y-3">
                    <Textarea value={editedCoverLetter} onChange={(e) => setEditedCoverLetter(e.target.value)} className="text-xs bg-card/60 border-border min-h-[200px]" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={saveCoverLetterEdits}>Save Changes</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingCoverLetter(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="glass-panel p-3">
                    <p className="text-[10px] text-muted-foreground mb-2">Subject: {coverLetter.subject}</p>
                    <p className="text-xs text-foreground/80 leading-relaxed whitespace-pre-line">{coverLetter.coverLetter}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCoverLetterPDF(coverLetter.coverLetter, candidateName, opportunity.company)}>
                    <Download className="w-3 h-3 mr-1" /> PDF
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => downloadCoverLetterWord(coverLetter.coverLetter, candidateName, opportunity.company)}>
                    <FileDown className="w-3 h-3 mr-1" /> Word
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        )}

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
              <div className="glass-panel p-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-foreground">Intro Pitch</p>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyText(outreach.pitch, "Pitch")}>
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs text-foreground/80 leading-relaxed">{outreach.pitch}</p>
              </div>

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
