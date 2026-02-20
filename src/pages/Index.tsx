import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import OpportunityCard from "@/components/OpportunityCard";
import ResumeUpload from "@/components/ResumeUpload";
import AICommandCenter from "@/components/AICommandCenter";
import { mockOpportunities } from "@/lib/opportunities";
import { Opportunity, OpportunityType, ResumeData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { AnimatePresence } from "framer-motion";

const filterTabs: { label: string; value: OpportunityType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Hackathons", value: "hackathon" },
  { label: "Internships", value: "internship" },
  { label: "Jobs", value: "job" },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [filter, setFilter] = useState<OpportunityType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const opportunities = useMemo(() => {
    let filtered = mockOpportunities;
    if (filter !== "all") filtered = filtered.filter((o) => o.type === filter);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) => o.title.toLowerCase().includes(q) || o.company.toLowerCase().includes(q) || o.skills.some((s) => s.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [filter, searchQuery]);

  const renderContent = () => {
    switch (activeTab) {
      case "resume":
        return <ResumeUpload resumeData={resumeData} onResumeProcessed={setResumeData} />;
      case "search":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Live Web Search</h2>
            <p className="text-sm text-muted-foreground">Real-time search for hackathons and opportunities across Devpost, MLH, and Unstop.</p>
            <div className="glass-panel p-8 text-center">
              <Search className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Coming soon — live MCP web search integration.</p>
            </div>
          </div>
        );
      case "outreach":
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Outreach Suite</h2>
            <p className="text-sm text-muted-foreground">Select an opportunity from the feed to generate personalized outreach materials.</p>
            {!selectedOpp && (
              <div className="glass-panel p-8 text-center">
                <p className="text-sm text-muted-foreground">No opportunity selected. Go to the feed and click on one.</p>
              </div>
            )}
          </div>
        );
      default:
        return (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Opportunity Feed</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {resumeData ? `Matched for ${resumeData.name}` : "Upload your resume to see match scores"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card/60 border-border"
                />
              </div>
              <div className="flex gap-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => setFilter(tab.value)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                      filter === tab.value
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {opportunities.map((opp, i) => (
                <OpportunityCard key={opp.id} opportunity={opp} onSelect={(o) => { setSelectedOpp(o); }} index={i} />
              ))}
            </div>

            {opportunities.length === 0 && (
              <div className="glass-panel p-8 text-center">
                <p className="text-sm text-muted-foreground">No opportunities found.</p>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 p-8 overflow-y-auto scrollbar-thin">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <AnimatePresence>
        {selectedOpp && (
          <AICommandCenter
            opportunity={selectedOpp}
            resumeData={resumeData}
            onClose={() => setSelectedOpp(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
