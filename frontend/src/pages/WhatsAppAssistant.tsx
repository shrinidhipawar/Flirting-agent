import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ConversationsList } from "@/components/whatsapp/ConversationsList";
import { ChatWindow } from "@/components/whatsapp/ChatWindow";
import { LeadDetails } from "@/components/whatsapp/LeadDetails";
import { SalesPipeline } from "@/components/whatsapp/SalesPipeline";
import { WhatsAppOnboarding } from "@/components/whatsapp/WhatsAppOnboarding";
import { MessagingAnalytics } from "@/components/whatsapp/MessagingAnalytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MessageSquare, BarChart3, Settings, Menu, Bot, Send, PieChart } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

type WhatsAppView = "conversations" | "pipeline" | "analytics" | "settings";
type Platform = "whatsapp" | "telegram";

const WhatsAppAssistant = () => {
  const [activeSection, setActiveSection] = useState("whatsapp");
  const [view, setView] = useState<WhatsAppView>("conversations");
  const [platform, setPlatform] = useState<Platform>("whatsapp");
  const [selectedConversation, setSelectedConversation] = useState("1");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const platformConfig = {
    whatsapp: {
      name: "WhatsApp",
      icon: MessageSquare,
      gradient: "from-emerald-500 to-emerald-600",
      hoverGradient: "hover:from-emerald-600 hover:to-emerald-700",
      accent: "emerald",
    },
    telegram: {
      name: "Telegram",
      icon: Send,
      gradient: "from-sky-500 to-sky-600",
      hoverGradient: "hover:from-sky-600 hover:to-sky-700",
      accent: "sky",
    },
  };

  const currentPlatform = platformConfig[platform];
  const PlatformIcon = currentPlatform.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          "absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl",
          platform === "whatsapp" ? "bg-emerald-500/5" : "bg-sky-500/5"
        )} />
        <div className="absolute top-1/2 -left-40 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
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
            <div className={cn(
              "flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-gradient-to-br",
              currentPlatform.gradient
            )}>
              <PlatformIcon className="h-5 w-5 md:h-6 md:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold">{currentPlatform.name} Sales Assistant</h1>
              <p className="text-sm text-muted-foreground hidden sm:block">AI-powered sales automation for {currentPlatform.name}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
            {/* Platform Switcher */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
              <button
                onClick={() => setPlatform("whatsapp")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  platform === "whatsapp"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">WhatsApp</span>
              </button>
              <button
                onClick={() => setPlatform("telegram")}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  platform === "telegram"
                    ? "bg-sky-500/20 text-sky-400"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Telegram</span>
              </button>
            </div>

            {/* View Tabs */}
            <div className="flex items-center gap-1 bg-muted rounded-xl p-1 overflow-x-auto">
              <button
                onClick={() => setView("conversations")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "conversations"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="hidden sm:inline">Conversations</span>
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
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Pipeline</span>
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
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </button>
              <button
                onClick={() => setView("settings")}
                className={cn(
                  "flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                  view === "settings"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>

            <Button
              onClick={() => setShowOnboarding(true)}
              className={cn("bg-gradient-to-r", currentPlatform.gradient, currentPlatform.hoverGradient)}
            >
              <Bot className="h-4 w-4 mr-2" />
              Configure AI
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === "conversations" && (
          <div className="glass rounded-2xl overflow-hidden h-[calc(100vh-200px)] md:h-[calc(100vh-160px)]">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Conversations List */}
              <div className="md:col-span-4 lg:col-span-3 border-b md:border-b-0 md:border-r border-border">
                <ConversationsList
                  selectedId={selectedConversation}
                  onSelect={setSelectedConversation}
                  platform={platform}
                />
              </div>

              {/* Chat Window */}
              <div className="md:col-span-8 lg:col-span-6 hidden md:block">
                <ChatWindow conversationId={selectedConversation} platform={platform} />
              </div>

              {/* Lead Details */}
              <div className="lg:col-span-3 hidden lg:block">
                <LeadDetails conversationId={selectedConversation} />
              </div>
            </div>
          </div>
        )}

        {view === "pipeline" && <SalesPipeline />}

        {view === "analytics" && <MessagingAnalytics platform={platform} />}

        {view === "settings" && (
          <div className="glass rounded-2xl p-4 md:p-8">
            <h2 className="text-xl font-semibold mb-6">AI Assistant Settings - {currentPlatform.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Business Name</label>
                  <input
                    type="text"
                    placeholder="Your business name"
                    className={cn(
                      "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                      platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    {platform === "whatsapp" ? "WhatsApp Number" : "Telegram Bot Username"}
                  </label>
                  <input
                    type="text"
                    placeholder={platform === "whatsapp" ? "+91 98765 43210" : "@your_bot"}
                    className={cn(
                      "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                      platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">AI Response Delay</label>
                  <select className={cn(
                    "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                    platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                  )}>
                    <option>Instant (0 seconds)</option>
                    <option>Natural (2-5 seconds)</option>
                    <option>Thoughtful (5-10 seconds)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Default Language</label>
                  <select className={cn(
                    "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                    platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                  )}>
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Multi-language (Auto-detect)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Escalation Email</label>
                  <input
                    type="email"
                    placeholder="team@business.com"
                    className={cn(
                      "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                      platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                    )}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Working Hours</label>
                  <select className={cn(
                    "w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm focus:outline-none focus:ring-2",
                    platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
                  )}>
                    <option>24/7 Always Available</option>
                    <option>Business Hours (9 AM - 6 PM)</option>
                    <option>Custom Hours</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className={cn("bg-gradient-to-r", currentPlatform.gradient, currentPlatform.hoverGradient)}>
                Save Settings
              </Button>
            </div>
          </div>
        )}
      </main>

      <WhatsAppOnboarding isOpen={showOnboarding} onClose={() => setShowOnboarding(false)} />
    </div>
  );
};

export default WhatsAppAssistant;