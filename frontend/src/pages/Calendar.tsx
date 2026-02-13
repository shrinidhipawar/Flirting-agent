import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ContentCalendar } from "@/components/dashboard/ContentCalendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Calendar as CalendarIcon, Menu, Plus } from "lucide-react";

const Calendar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <Sidebar 
        activeSection="calendar" 
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
            <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500">
              <CalendarIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">Content Calendar</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">Schedule and manage your content across all platforms</p>
            </div>
          </div>

          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Post
          </Button>
        </div>

        {/* Content */}
        <ContentCalendar />
      </main>
    </div>
  );
};

export default Calendar;