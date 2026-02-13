import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { AdCreator } from "@/components/ads/AdCreator";
import { CampaignPerformance } from "@/components/ads/CampaignPerformance";
import { CreativeGallery } from "@/components/ads/CreativeGallery";
import { AudienceTargeting } from "@/components/ads/AudienceTargeting";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sparkles,
  BarChart3,
  Image,
  Users,
  Plus,
  Megaphone,
  Menu,
} from "lucide-react";

type AdsView = "creator" | "performance" | "creatives" | "audiences";

const AdsCreator = () => {
  const [activeSection, setActiveSection] = useState("ads");
  const [view, setView] = useState<AdsView>("creator");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-orange-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-pink-500/5 blur-3xl" />
      </div>

      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
      />

      <main className={cn(
        "p-4 md:p-6 transition-all duration-300",
        isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
              <Megaphone className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI Ads Creator & Optimizer</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Create high-converting ads with predictive AI</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => setView("creator")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "creator"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">Creator</span>
              </button>
              <button
                onClick={() => setView("performance")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "performance"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Performance</span>
              </button>
              <button
                onClick={() => setView("creatives")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "creatives"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Image className="h-4 w-4" />
                <span className="hidden sm:inline">Creatives</span>
              </button>
              <button
                onClick={() => setView("audiences")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "audiences"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Audiences</span>
              </button>
            </div>

            <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === "creator" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AdCreator />
            
            {/* Quick Tips */}
            <div className="glass rounded-2xl p-4 md:p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <h3 className="font-semibold mb-4">🎯 AI Optimization Tips</h3>
              <div className="space-y-4">
                {[
                  {
                    title: "Hook in First 3 Seconds",
                    desc: "Video ads should capture attention immediately. Use bold visuals or provocative questions.",
                  },
                  {
                    title: "Test Multiple CTAs",
                    desc: "Try 'Learn More' vs 'Get Started' vs 'Shop Now' to find what resonates with your audience.",
                  },
                  {
                    title: "Use Social Proof",
                    desc: "Include customer numbers, ratings, or testimonials to build trust instantly.",
                  },
                  {
                    title: "Mobile-First Design",
                    desc: "85% of Meta ads are viewed on mobile. Optimize for vertical formats.",
                  },
                ].map((tip, i) => (
                  <div key={i} className="p-3 md:p-4 rounded-xl bg-muted/50">
                    <p className="font-medium text-sm">{tip.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {view === "performance" && <CampaignPerformance />}
        {view === "creatives" && <CreativeGallery />}
        {view === "audiences" && <AudienceTargeting />}
      </main>
    </div>
  );
};

export default AdsCreator;