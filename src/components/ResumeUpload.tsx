import { useState, useCallback } from "react";
import { Upload, FileText, CheckCircle2, Loader2, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResumeData } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

interface ResumeUploadProps {
  resumeData: ResumeData | null;
  onResumeProcessed: (data: ResumeData) => void;
}

const ResumeUpload = ({ resumeData, onResumeProcessed }: ResumeUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

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
      onResumeProcessed(data as ResumeData);
    } catch (err) {
      console.error("Resume processing error:", err);
      // Fallback: extract basic info
      onResumeProcessed({
        name: file.name.replace(".pdf", ""),
        skills: ["Unable to parse - please try again"],
        projects: [],
        rawText: "",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [onResumeProcessed]);

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
            className="glass-panel p-6 space-y-4"
          >
            <div className="flex items-center gap-2 text-primary">
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-semibold">Resume Processed</span>
              {fileName && <span className="text-xs text-muted-foreground">({fileName})</span>}
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Name</p>
              <p className="text-foreground font-medium">{resumeData.name}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Core Skills</p>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span key={skill} className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {resumeData.projects.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Past Projects</p>
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
