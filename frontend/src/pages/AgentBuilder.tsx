import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Bot, Sparkles, GitBranch, BookOpen, Wrench, Play, BarChart3, LayoutGrid, Store, Menu } from "lucide-react";
import { toast } from "sonner";
import { AgentBlueprint } from "@/components/agent-builder/AgentBlueprint";
import { WorkflowBuilder } from "@/components/agent-builder/WorkflowBuilder";
import { KnowledgeManager } from "@/components/agent-builder/KnowledgeManager";
import { ToolsConnector } from "@/components/agent-builder/ToolsConnector";
import { AgentSandbox } from "@/components/agent-builder/AgentSandbox";
import { AgentAnalytics } from "@/components/agent-builder/AgentAnalytics";
import { TemplateGallery } from "@/components/agent-builder/TemplateGallery";
import { AgentMarketplace } from "@/components/agent-builder/AgentMarketplace";

const navItems = [
  { id: "templates", label: "Templates", icon: LayoutGrid },
  { id: "marketplace", label: "Marketplace", icon: Store },
  { id: "blueprint", label: "Agent Blueprint", icon: Bot },
  { id: "workflow", label: "Workflow Builder", icon: GitBranch },
  { id: "knowledge", label: "Knowledge Base", icon: BookOpen },
  { id: "tools", label: "Tools & Integrations", icon: Wrench },
  { id: "sandbox", label: "Test Sandbox", icon: Play },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function AgentBuilder() {
  const [activeTab, setActiveTab] = useState("templates");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const handleUseTemplate = (template: any) => {
    setActiveTab("blueprint");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "templates":
        return <TemplateGallery onUseTemplate={handleUseTemplate} />;
      case "marketplace":
        return <AgentMarketplace onUseTemplate={handleUseTemplate} />;
      case "blueprint":
        return <AgentBlueprint />;
      case "workflow":
        return <WorkflowBuilder />;
      case "knowledge":
        return <KnowledgeManager />;
      case "tools":
        return <ToolsConnector />;
      case "sandbox":
        return <AgentSandbox />;
      case "analytics":
        return <AgentAnalytics />;
      default:
        return <TemplateGallery onUseTemplate={handleUseTemplate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
      />
      
      <main className={cn(
        "min-h-screen transition-all duration-300",
        isMobile ? "ml-0" : isCollapsed ? "ml-20" : "ml-64"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-4 md:px-8 py-4 gap-4">
            <div className="flex items-center gap-4">
              {isMobile && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  AI Agent Builder
                  <Badge className="bg-gradient-to-r from-primary to-secondary text-primary-foreground hidden sm:inline-flex">
                    2035
                  </Badge>
                </h1>
                <p className="text-sm text-muted-foreground hidden sm:block">
                  Create autonomous AI agents for any business workflow
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => {
                  localStorage.setItem('agent-builder-draft', JSON.stringify({ savedAt: new Date().toISOString() }));
                  toast.success("Draft saved successfully!");
                }}
              >
                Save Draft
              </Button>
              <Button 
                size="sm"
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={() => {
                  toast.success("Agent deployed successfully!", {
                    description: "Your agent is now live and ready to handle requests.",
                  });
                }}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Deploy Agent
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="px-4 md:px-8 pb-0 overflow-x-auto">
            <nav className="flex gap-1">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "relative rounded-b-none px-3 md:px-4 py-2 md:py-3 whitespace-nowrap",
                    activeTab === item.id
                      ? "bg-primary/10 text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              ))}
            </nav>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 md:p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}