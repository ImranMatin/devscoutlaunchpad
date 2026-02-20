import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, Loader2, Brain, Globe, Linkedin, Github, MapPin, Mail, Phone, Briefcase, GraduationCap, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

interface ResumeUploadProps {
  resumeData: ResumeData | null;
  onResumeProcessed: (data: ResumeData) => void;
}

const ResumeUpload = ({ resumeData, onResumeProcessed }: ResumeUploadProps) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const saveProfile = async (data: ResumeData) => {
    if (!user) return;
    await supabase.from("profiles").update({
      name: data.name,
      skills: data.skills as any,
      projects: data.projects as any,
      raw_text: data.rawText,
      contact_info: data.contactInfo as any,
      links: data.links as any,
      education: data.education as any,
      experience: data.experience as any,
      hackathons: data.hackathons as any,
    }).eq("user_id", user.id);
  };

  const processFile = useCallback(async (file: File) => {
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF file.");
      return;
    }
    setFileName(file.name);
    setIsProcessing(true);

    try {
      const text = await file.text();
      const { data, error } = await supabase.functions.invoke("analyze-resume", {
        body: { resumeText: text, fileName: file.name },
      });
      if (error) throw error;
      const resumeResult: ResumeData = {
        name: data.name || "",
        contactInfo: data.contactInfo || {},
        links: data.links || {},
        skills: data.skills || [],
        projects: data.projects || [],
        experience: data.experience || [],
        education: data.education || [],
        hackathons: data.hackathons || [],
        rawText: data.rawText || "",
      };
      onResumeProcessed(resumeResult);
      await saveProfile(resumeResult);
    } catch (err) {
      console.error("Resume processing error:", err);
      const fallback: ResumeData = {
        name: file.name.replace(".pdf", ""),
        contactInfo: {},
        links: {},
        skills: ["Unable to parse - please try again"],
        projects: [],
        experience: [],
        education: [],
        hackathons: [],
        rawText: "",
      };
      onResumeProcessed(fallback);
    } finally {
      setIsProcessing(false);
    }
  }, [onResumeProcessed, user]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }, [processFile]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary" />
          Resume Brain
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Upload your resume and let AI extract your profile for smart matching.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!resumeData ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`glass-panel border-dashed border-2 p-12 text-center transition-all duration-300 ${
              dragOver ? "border-primary bg-primary/5" : "border-border"
            }`}
          >
            {isProcessing ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">AI is analyzing your resume...</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload className="w-10 h-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Drag & drop your PDF resume here
                </p>
                <label>
                  <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      Browse Files
                    </span>
                  </Button>
                  <input type="file" accept=".pdf" className="hidden" onChange={handleFileInput} />
                </label>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel p-6 space-y-5"
          >
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Resume Processed</span>
              {fileName && <span className="text-xs text-muted-foreground">({fileName})</span>}
            </div>

            {/* Name & Contact */}
            <div>
              <p className="text-lg font-bold text-foreground">{resumeData.name}</p>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-muted-foreground">
                {resumeData.contactInfo?.location && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{resumeData.contactInfo.location}</span>
                )}
                {resumeData.contactInfo?.phone && (
                  <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{resumeData.contactInfo.phone}</span>
                )}
                {resumeData.contactInfo?.email && (
                  <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{resumeData.contactInfo.email}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 mt-1 text-xs">
                {resumeData.links?.portfolio && (
                  <span className="flex items-center gap-1 text-primary"><Globe className="w-3 h-3" />Portfolio</span>
                )}
                {resumeData.links?.linkedin && (
                  <span className="flex items-center gap-1 text-primary"><Linkedin className="w-3 h-3" />LinkedIn</span>
                )}
                {resumeData.links?.github && (
                  <span className="flex items-center gap-1 text-primary"><Github className="w-3 h-3" />GitHub</span>
                )}
              </div>
            </div>

            {/* Skills */}
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Technical Skills</p>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Experience */}
            {resumeData.experience?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Briefcase className="w-3 h-3" /> Relevant Experience
                </p>
                <div className="space-y-3">
                  {resumeData.experience.map((exp, i) => (
                    <div key={i} className="pl-3 border-l-2 border-primary/30">
                      <p className="text-sm font-semibold text-foreground">{exp.role}</p>
                      <p className="text-xs text-muted-foreground">{exp.company} | {exp.dates}</p>
                      <ul className="mt-1 space-y-0.5">
                        {exp.bullets.map((b, j) => (
                          <li key={j} className="text-xs text-foreground/80 pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-primary/60">{b}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resumeData.projects.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Projects</p>
                <ul className="space-y-1">
                  {resumeData.projects.map((proj) => (
                    <li key={proj} className="text-sm text-foreground/80 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                      {proj}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Hackathons */}
            {resumeData.hackathons?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> Hackathon Achievements
                </p>
                <div className="space-y-2">
                  {resumeData.hackathons.map((h, i) => (
                    <div key={i} className="pl-3 border-l-2 border-amber-400/30">
                      <p className="text-sm font-semibold text-foreground">{h.name}</p>
                      <p className="text-xs text-amber-400">{h.achievement}</p>
                      <p className="text-xs text-foreground/70">{h.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resumeData.education?.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1">
                  <GraduationCap className="w-3 h-3" /> Education
                </p>
                <div className="space-y-1">
                  {resumeData.education.map((edu, i) => (
                    <div key={i}>
                      <p className="text-sm text-foreground">{edu.institution}</p>
                      <p className="text-xs text-muted-foreground">{edu.degree} | {edu.dates}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onResumeProcessed(null as any);
                setFileName(null);
              }}
            >
              Upload New Resume
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeUpload;
