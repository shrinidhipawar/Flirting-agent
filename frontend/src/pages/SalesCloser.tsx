import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Brain,
  MessageSquare,
  CalendarClock,
  BarChart3,
  Menu,
} from "lucide-react";

import { LeadAnalysis } from "@/components/sales-closer/LeadAnalysis";
import { ClosingScriptGenerator } from "@/components/sales-closer/ClosingScriptGenerator";
import { FollowUpSequencer } from "@/components/sales-closer/FollowUpSequencer";
import { SalesIntelligence } from "@/components/sales-closer/SalesIntelligence";

const views = [
  { id: "analysis", label: "Lead Analysis", icon: Brain },
  { id: "scripts", label: "Closing Scripts", icon: MessageSquare },
  { id: "followup", label: "Follow-Up", icon: CalendarClock },
  { id: "intelligence", label: "Intelligence", icon: BarChart3 },
];

export default function SalesCloser() {
  const [activeView, setActiveView] = useState("analysis");
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
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  AI Sales Closer
                </h1>
                <p className="text-sm text-muted-foreground">
                  2035 Edition • Convert leads with AI-powered persuasion
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
          {activeView === "analysis" && <LeadAnalysis />}
          {activeView === "scripts" && <ClosingScriptGenerator />}
          {activeView === "followup" && <FollowUpSequencer />}
          {activeView === "intelligence" && <SalesIntelligence />}
        </div>
      </main>
    </div>
  );
}