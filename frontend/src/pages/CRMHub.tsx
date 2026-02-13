import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { LeadTable } from "@/components/crm/LeadTable";
import { PipelineView } from "@/components/crm/PipelineView";
import { AutomationBuilder } from "@/components/crm/AutomationBuilder";
import { CRMAnalytics } from "@/components/crm/CRMAnalytics";
import { SupportDesk } from "@/components/crm/SupportDesk";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Users,
  Kanban,
  Zap,
  BarChart3,
  HeadphonesIcon,
  Plus,
  Database,
  Menu,
} from "lucide-react";

type CRMView = "leads" | "pipeline" | "automation" | "analytics" | "support";

const CRMHub = () => {
  const [activeSection, setActiveSection] = useState("crm");
  const [view, setView] = useState<CRMView>("leads");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
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
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500">
              <Database className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">AI CRM + Automation Hub</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Manage leads, automate workflows, grow revenue</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => setView("leads")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "leads"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Leads</span>
              </button>
              <button
                onClick={() => setView("pipeline")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "pipeline"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Kanban className="h-4 w-4" />
                <span className="hidden sm:inline">Pipeline</span>
              </button>
              <button
                onClick={() => setView("automation")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "automation"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Zap className="h-4 w-4" />
                <span className="hidden sm:inline">Automation</span>
              </button>
              <button
                onClick={() => setView("analytics")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "analytics"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => setView("support")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "support"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <HeadphonesIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Support</span>
              </button>
            </div>

            <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
              <Plus className="h-4 w-4 mr-2" />
              Import Leads
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === "leads" && <LeadTable />}
        {view === "pipeline" && <PipelineView />}
        {view === "automation" && <AutomationBuilder />}
        {view === "analytics" && <CRMAnalytics />}
        {view === "support" && <SupportDesk />}
      </main>
    </div>
  );
};

export default CRMHub;