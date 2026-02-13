import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, Target, TrendingUp, Plus, ChevronRight } from "lucide-react";

interface AudienceSegment {
  id: string;
  name: string;
  type: "custom" | "lookalike" | "saved";
  size: string;
  platform: string;
  performance: "high" | "medium" | "low";
  interests: string[];
}

const audiences: AudienceSegment[] = [
  {
    id: "1",
    name: "Tech Entrepreneurs 25-45",
    type: "custom",
    size: "2.4M",
    platform: "Meta",
    performance: "high",
    interests: ["Entrepreneurship", "SaaS", "Startups", "Business"],
  },
  {
    id: "2",
    name: "Website Visitors - Lookalike 1%",
    type: "lookalike",
    size: "1.8M",
    platform: "Meta",
    performance: "high",
    interests: ["Similar to converters"],
  },
  {
    id: "3",
    name: "E-commerce Decision Makers",
    type: "custom",
    size: "890K",
    platform: "LinkedIn",
    performance: "medium",
    interests: ["E-commerce", "Retail", "Digital Marketing"],
  },
  {
    id: "4",
    name: "Video Viewers 75%+",
    type: "saved",
    size: "450K",
    platform: "Meta",
    performance: "high",
    interests: ["Engaged with video content"],
  },
];

const performanceColors = {
  high: "text-emerald-400",
  medium: "text-amber-400",
  low: "text-red-400",
};

const typeColors = {
  custom: "bg-violet-500/20 text-violet-400",
  lookalike: "bg-primary/20 text-primary",
  saved: "bg-orange-500/20 text-orange-400",
};

const suggestedInterests = [
  "Artificial Intelligence",
  "Business Automation",
  "SaaS Products",
  "Digital Marketing",
  "Growth Hacking",
  "Cloud Computing",
  "Data Analytics",
  "Productivity Tools",
];

export function AudienceTargeting() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Audience Targeting</h2>
          <p className="text-sm text-muted-foreground">AI-powered audience discovery and optimization</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Create Audience
        </Button>
      </div>

      {/* AI Recommendations */}
      <div className="glass rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20">
            <Target className="h-5 w-5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-medium">AI-Recommended Interests</h3>
            <p className="text-xs text-muted-foreground">Based on your best-performing campaigns</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestedInterests.map((interest) => (
            <button
              key={interest}
              className="px-3 py-1.5 rounded-full bg-muted hover:bg-orange-500/10 hover:text-orange-400 text-sm transition-all border border-transparent hover:border-orange-500/30"
            >
              + {interest}
            </button>
          ))}
        </div>
      </div>

      {/* Saved Audiences */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold">Saved Audiences</h3>
          <span className="text-sm text-muted-foreground">{audiences.length} audiences</span>
        </div>

        <div className="divide-y divide-border">
          {audiences.map((audience, index) => (
            <div
              key={audience.id}
              className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/10 to-pink-500/10">
                    <Users className="h-6 w-6 text-orange-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{audience.name}</h4>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", typeColors[audience.type])}>
                        {audience.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{audience.platform} • {audience.size} people</p>
                    <div className="flex flex-wrap gap-1">
                      {audience.interests.slice(0, 3).map((interest) => (
                        <span key={interest} className="text-xs bg-muted px-2 py-0.5 rounded">{interest}</span>
                      ))}
                      {audience.interests.length > 3 && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">+{audience.interests.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Performance</p>
                    <p className={cn("font-medium capitalize", performanceColors[audience.performance])}>
                      {audience.performance}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audience Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Top Performing Age</span>
          </div>
          <p className="text-2xl font-bold">25-34</p>
          <p className="text-xs text-muted-foreground">42% of conversions</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Best Interest</span>
          </div>
          <p className="text-2xl font-bold">SaaS</p>
          <p className="text-xs text-muted-foreground">3.8x ROAS</p>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium">Top Location</span>
          </div>
          <p className="text-2xl font-bold">India</p>
          <p className="text-xs text-muted-foreground">58% of leads</p>
        </div>
      </div>
    </div>
  );
}
