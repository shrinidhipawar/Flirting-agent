import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  User,
  Calendar,
  Sparkles,
  TrendingUp,
  DollarSign,
  BarChart3,
  Menu,
} from "lucide-react";

import { InfluencerProfile } from "@/components/influencer/InfluencerProfile";
import { ContentCalendar } from "@/components/influencer/ContentCalendar";
import { ViralContentGenerator } from "@/components/influencer/ViralContentGenerator";
import { TrendIntelligence } from "@/components/influencer/TrendIntelligence";
import { MonetizationHub } from "@/components/influencer/MonetizationHub";
import { InfluencerAnalytics } from "@/components/influencer/InfluencerAnalytics";

const views = [
  { id: "profile", label: "Profile", icon: User },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "viral", label: "Viral Content", icon: Sparkles },
  { id: "trends", label: "Trends", icon: TrendingUp },
  { id: "monetize", label: "Monetize", icon: DollarSign },
];

export default function InfluencerEngine() {
  const [activeView, setActiveView] = useState("calendar");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="flex min-h-screen overflow-hidden bg-background">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
      />

      <main className={cn(
        "flex-1 overflow-auto transition-all duration-300",
        isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
      )}>
        <div className="p-4 md:p-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-pink-500 via-purple-500 to-primary bg-clip-text text-transparent">
                  AI Influencer Engine
                </h1>
                <p className="text-sm text-muted-foreground">
                  2035 Edition • Build, grow, and monetize your creator brand
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg overflow-x-auto">
              {views.map((view) => (
                <Button
                  key={view.id}
                  variant={activeView === view.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveView(view.id)}
                  className={cn(
                    "gap-2 whitespace-nowrap",
                    activeView === view.id && "shadow-sm"
                  )}
                >
                  <view.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{view.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeView === "profile" && <InfluencerProfile />}
          {activeView === "calendar" && <ContentCalendar />}
          {activeView === "analytics" && <InfluencerAnalytics />}
          {activeView === "viral" && <ViralContentGenerator />}
          {activeView === "trends" && <TrendIntelligence />}
          {activeView === "monetize" && <MonetizationHub />}
        </div>
      </main>
    </div>
  );
}