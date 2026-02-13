import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ContentCalendar } from "@/components/dashboard/ContentCalendar";
import { AIGenerator } from "@/components/dashboard/AIGenerator";
import { PlatformCards } from "@/components/dashboard/PlatformCards";
import { AnalyticsPreview } from "@/components/dashboard/AnalyticsPreview";
import { OnboardingModal } from "@/components/dashboard/OnboardingModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { TrendingUp, Users, Zap, BarChart3 } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Show onboarding on first visit
    const hasSeenOnboarding = localStorage.getItem("socialai-onboarding");
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem("socialai-onboarding", "true");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -bottom-40 right-1/3 w-80 h-80 rounded-full bg-primary/3 blur-3xl" />
      </div>

      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main
        className={cn(
          "transition-all duration-300 p-4 md:p-8",
          isMobile ? "ml-0" : (sidebarCollapsed ? "ml-20" : "ml-64")
        )}
      >
        <Header 
          onNewContent={() => setShowOnboarding(true)} 
          onMenuClick={isMobile ? () => setSidebarOpen(true) : undefined}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
          <StatsCard
            title="Total Reach"
            value="2.4M"
            change="+12.5% from last month"
            changeType="positive"
            icon={TrendingUp}
            delay={0}
          />
          <StatsCard
            title="Followers"
            value="260.4K"
            change="+8.3% from last month"
            changeType="positive"
            icon={Users}
            delay={100}
          />
          <StatsCard
            title="Posts Generated"
            value="1,248"
            change="This month"
            changeType="neutral"
            icon={Zap}
            delay={200}
          />
          <StatsCard
            title="Engagement Rate"
            value="4.8%"
            change="-0.2% from last month"
            changeType="negative"
            icon={BarChart3}
            delay={300}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <ContentCalendar />
          <AIGenerator />
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <PlatformCards />
          <AnalyticsPreview />
        </div>
      </main>

      <OnboardingModal isOpen={showOnboarding} onClose={handleCloseOnboarding} />
    </div>
  );
};

export default Index;
