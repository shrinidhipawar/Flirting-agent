import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Inbox,
  Phone,
  GitBranch,
  BarChart3,
  Book,
  Settings,
  Ticket,
  Headphones,
  Menu,
} from "lucide-react";

import { OmnichannelInbox } from "@/components/support/OmnichannelInbox";
import { VoiceAIEngine } from "@/components/support/VoiceAIEngine";
import { AutomationWorkflows } from "@/components/support/AutomationWorkflows";
import { SupportInsights } from "@/components/support/SupportInsights";
import { KnowledgeBase } from "@/components/support/KnowledgeBase";
import { TicketManager } from "@/components/support/TicketManager";
import { BusinessSetup } from "@/components/support/BusinessSetup";

const views = [
  { id: "inbox", label: "Omnichannel Inbox", icon: Inbox },
  { id: "voice", label: "Voice AI", icon: Phone },
  { id: "tickets", label: "Tickets", icon: Ticket },
  { id: "automation", label: "Automation", icon: GitBranch },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "knowledge", label: "Knowledge", icon: Book },
  { id: "setup", label: "Setup", icon: Settings },
];

export default function SupportBot() {
  const [activeView, setActiveView] = useState("inbox");
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
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 via-primary to-blue-500">
                <Headphones className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  AI Customer Support
                  <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white hidden sm:inline-flex">
                    2035
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Autonomous support across all channels • 89% AI resolution rate
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
                  <span className="hidden md:inline">{view.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Content */}
          {activeView === "inbox" && <OmnichannelInbox />}
          {activeView === "voice" && <VoiceAIEngine />}
          {activeView === "tickets" && <TicketManager />}
          {activeView === "automation" && <AutomationWorkflows />}
          {activeView === "insights" && <SupportInsights />}
          {activeView === "knowledge" && <KnowledgeBase />}
          {activeView === "setup" && <BusinessSetup />}
        </div>
      </main>
    </div>
  );
}