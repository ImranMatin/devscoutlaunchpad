import { Clock, ExternalLink, Zap, MapPin } from "lucide-react";
import { Opportunity, LocationType } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onSelect: (opp: Opportunity) => void;
  index: number;
}

const typeColors: Record<string, string> = {
  hackathon: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  internship: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  job: "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

const locationLabels: Record<LocationType, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

function getCountdown(deadline: string): string {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours}h left`;
}

const OpportunityCard = ({ opportunity, onSelect, index }: OpportunityCardProps) => {
  const countdown = getCountdown(opportunity.deadline);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      onClick={() => onSelect(opportunity)}
      className="glass-panel-hover p-5 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="outline" className={`text-[10px] uppercase tracking-wider border ${typeColors[opportunity.type]}`}>
              {opportunity.type}
            </Badge>
            {opportunity.isLatest && (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                <Zap className="w-2.5 h-2.5 mr-1" /> Latest
              </Badge>
            )}
          </div>
          <h3 className="text-foreground font-semibold group-hover:text-primary transition-colors">
            {opportunity.title}
          </h3>
          <p className="text-sm text-muted-foreground">{opportunity.company}</p>
        </div>

        {opportunity.matchScore !== undefined && (
          <div className="flex flex-col items-center ml-4">
            <div className="w-12 h-12 rounded-full border-2 border-primary/40 flex items-center justify-center">
              <span className="text-sm font-bold text-primary">{opportunity.matchScore}%</span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1">Match</span>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{opportunity.description}</p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        {opportunity.skills.slice(0, 4).map((skill) => (
          <span key={skill} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{countdown}</span>
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            <span>{locationLabels[opportunity.location]}</span>
          </div>
        </div>
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

export default OpportunityCard;
