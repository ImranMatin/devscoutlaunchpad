import { Search, FileText, Zap, Send, Brain, Home, LogOut, User, Globe, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "feed", label: "Opportunities", icon: Home },
  { id: "resume", label: "Resume Brain", icon: Brain },
  { id: "search", label: "Live Search", icon: Search },
  { id: "outreach", label: "Outreach Suite", icon: Send },
  { id: "resources", label: "Hackathons & Jobs", icon: Globe },
  { id: "about", label: "About", icon: Info },
];

const AppSidebar = ({ activeTab, onTabChange }: AppSidebarProps) => {
  const { user, signOut } = useAuth();

  return (
    <aside className="w-64 sidebar-gradient border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground tracking-tight">DevScoutLaunchPad</h1>
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

      <div className="p-4 border-t border-border space-y-3">
        {user && (
          <div className="glass-panel p-3 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-foreground truncate">{user.email}</p>
            </div>
            <button onClick={signOut} className="text-muted-foreground hover:text-foreground transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="glass-panel p-3 text-center">
          <p className="text-xs text-muted-foreground">Upload your resume to unlock</p>
          <p className="text-xs font-semibold text-primary mt-1">Smart Match Scores</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
