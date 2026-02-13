import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Globe, Menu, Plus } from "lucide-react";

const Platforms = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-green-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-teal-500/5 blur-3xl" />
      </div>

      <Sidebar 
        activeSection="platforms" 
        onSectionChange={() => {}}
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
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500">
              <Globe className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Connected Platforms</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Manage your social media connections and integrations</p>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-green-500 to-teal-500 hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Connect Platform
          </Button>
        </div>

        {/* Content */}
        <PlatformCards />
      </main>
    </div>
  );
};

export default Platforms;