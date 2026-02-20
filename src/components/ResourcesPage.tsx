import { ExternalLink, Trophy, Briefcase } from "lucide-react";

const hackathons = [
  { name: "Devpost", url: "https://devpost.com/hackathons", description: "Discover online & in-person hackathons worldwide" },
  { name: "MLH (Major League Hacking)", url: "https://mlh.io/seasons/2026/events", description: "Official student hackathon league with global events" },
  { name: "Unstop", url: "https://unstop.com/hackathons", description: "Competitions, hackathons & challenges across India" },
  { name: "HackerEarth", url: "https://www.hackerearth.com/challenges/", description: "Coding challenges & hackathons from top companies" },
  { name: "Hackathon.com", url: "https://www.hackathon.com/", description: "Global hackathon directory with filters" },
  { name: "ETHGlobal", url: "https://ethglobal.com/", description: "Web3 & blockchain hackathons worldwide" },
  { name: "Google Summer of Code", url: "https://summerofcode.withgoogle.com/", description: "Open-source mentorship program by Google" },
  { name: "Microsoft Imagine Cup", url: "https://imaginecup.microsoft.com/", description: "Global student technology competition" },
];

const jobBoards = [
  { name: "LinkedIn Jobs", url: "https://www.linkedin.com/jobs/", description: "Professional networking & job search" },
  { name: "Indeed", url: "https://www.indeed.com/", description: "World's largest job search engine" },
  { name: "Glassdoor", url: "https://www.glassdoor.com/Job/", description: "Job listings with company reviews & salaries" },
  { name: "AngelList / Wellfound", url: "https://wellfound.com/", description: "Startup jobs with equity information" },
  { name: "Levels.fyi", url: "https://www.levels.fyi/jobs", description: "Tech jobs with verified compensation data" },
  { name: "Handshake", url: "https://joinhandshake.com/", description: "Career platform for college students & new grads" },
  { name: "Y Combinator Jobs", url: "https://www.ycombinator.com/jobs", description: "Jobs at YC-backed startups" },
  { name: "RemoteOK", url: "https://remoteok.com/", description: "Remote jobs in tech, design & more" },
];

const ResourcesPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Hackathons & Job Boards</h2>
        <p className="text-sm text-muted-foreground mt-1">Curated list of platforms to find opportunities</p>
      </div>

      {/* Hackathons */}
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Trophy className="w-5 h-5 text-primary" /> Hackathons
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {hackathons.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel-hover p-4 flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Trophy className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  {item.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Job Boards */}
      <div>
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-primary" /> Job Boards
        </h3>
        <div className="grid gap-3 md:grid-cols-2">
          {jobBoards.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-panel-hover p-4 flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-accent/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Briefcase className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors flex items-center gap-1">
                  {item.name}
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;
