import { Search, FileText, Zap, Send, Brain, Home } from "lucide-react";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "feed", label: "Opportunities", icon: Home },
  { id: "resume", label: "Resume Brain", icon: Brain },
  { id: "search", label: "Live Search", icon: Search },
  { id: "outreach", label: "Outreach Suite", icon: Send },
];

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  return (
    <aside className="w-64 sidebar-gradient border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">ScholarScout</h1>
            <p className="text-xs text-muted-foreground">AI Opportunity Engine</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === item.id
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
            }`}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="glass-panel p-3 text-center">
          <p className="text-xs text-muted-foreground">Upload your resume to unlock</p>
          <p className="text-xs font-semibold text-primary mt-1">Smart Match Scores</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
