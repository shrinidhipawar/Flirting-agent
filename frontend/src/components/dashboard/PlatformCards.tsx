import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  Instagram, Facebook, Twitter, Linkedin, Youtube, Plus, Check, 
  Mail, MessageSquare, Zap, ExternalLink, Settings2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Platform {
  id: string;
  name: string;
  icon: React.ElementType;
  connected: boolean;
  followers?: string;
  engagement?: string;
  gradient: string;
  category: "social" | "ads" | "email" | "messaging" | "automation";
  description?: string;
}

const platforms: Platform[] = [
  // Social Media
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    connected: true,
    followers: "125.4K",
    engagement: "4.8%",
    gradient: "from-pink-500 via-purple-500 to-orange-400",
    category: "social",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    connected: true,
    followers: "89.2K",
    engagement: "3.2%",
    gradient: "from-blue-600 to-blue-400",
    category: "social",
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    icon: Twitter,
    connected: true,
    followers: "45.8K",
    engagement: "2.9%",
    gradient: "from-gray-800 to-gray-600",
    category: "social",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    connected: false,
    gradient: "from-blue-700 to-blue-500",
    category: "social",
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    connected: false,
    gradient: "from-red-600 to-red-400",
    category: "social",
  },
  // Ad Platforms
  {
    id: "meta-ads",
    name: "Meta Ads",
    icon: Facebook,
    connected: false,
    gradient: "from-blue-600 to-indigo-600",
    category: "ads",
    description: "Facebook & Instagram advertising",
  },
  {
    id: "google-ads",
    name: "Google Ads",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
      </svg>
    ),
    connected: false,
    gradient: "from-yellow-500 via-red-500 to-blue-500",
    category: "ads",
    description: "Search, Display & YouTube ads",
  },
  {
    id: "tiktok-ads",
    name: "TikTok Ads",
    icon: () => (
      <svg viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
      </svg>
    ),
    connected: false,
    gradient: "from-black via-pink-500 to-cyan-400",
    category: "ads",
    description: "Short-form video advertising",
  },
  // Email Marketing
  {
    id: "mailchimp",
    name: "Mailchimp",
    icon: Mail,
    connected: false,
    gradient: "from-yellow-400 to-yellow-600",
    category: "email",
    description: "Email campaigns & automation",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    icon: Mail,
    connected: false,
    gradient: "from-blue-400 to-blue-600",
    category: "email",
    description: "Transactional & marketing emails",
  },
  {
    id: "brevo",
    name: "Brevo (Sendinblue)",
    icon: Mail,
    connected: false,
    gradient: "from-indigo-500 to-purple-600",
    category: "email",
    description: "Email, SMS & chat marketing",
  },
  // Messaging Platforms
  {
    id: "whatsapp-business",
    name: "WhatsApp Business",
    icon: MessageSquare,
    connected: true,
    gradient: "from-green-500 to-green-600",
    category: "messaging",
    description: "Business messaging & campaigns",
  },
  {
    id: "telegram",
    name: "Telegram",
    icon: MessageSquare,
    connected: false,
    gradient: "from-blue-400 to-blue-500",
    category: "messaging",
    description: "Channel & bot messaging",
  },
  {
    id: "slack",
    name: "Slack",
    icon: MessageSquare,
    connected: false,
    gradient: "from-purple-600 to-pink-500",
    category: "messaging",
    description: "Team collaboration & notifications",
  },
  // Automation Tools
  {
    id: "zapier",
    name: "Zapier",
    icon: Zap,
    connected: false,
    gradient: "from-orange-500 to-orange-600",
    category: "automation",
    description: "Connect 5000+ apps",
  },
  {
    id: "make",
    name: "Make (Integromat)",
    icon: Zap,
    connected: false,
    gradient: "from-purple-500 to-indigo-600",
    category: "automation",
    description: "Visual workflow automation",
  },
  {
    id: "n8n",
    name: "n8n",
    icon: Zap,
    connected: false,
    gradient: "from-red-500 to-pink-500",
    category: "automation",
    description: "Open-source automation",
  },
];

const categories = [
  { id: "social", label: "Social Media", icon: Instagram },
  { id: "ads", label: "Ad Platforms", icon: ExternalLink },
  { id: "email", label: "Email Marketing", icon: Mail },
  { id: "messaging", label: "Messaging", icon: MessageSquare },
  { id: "automation", label: "Automation", icon: Zap },
];

export function PlatformCards() {
  const [platformState, setPlatformState] = useState(platforms);

  const handleConnect = (platformId: string) => {
    setPlatformState(prev => 
      prev.map(p => p.id === platformId ? { ...p, connected: true } : p)
    );
    const platform = platforms.find(p => p.id === platformId);
    toast.success(`${platform?.name} connected successfully!`);
  };

  const handleDisconnect = (platformId: string) => {
    setPlatformState(prev => 
      prev.map(p => p.id === platformId ? { ...p, connected: false } : p)
    );
    const platform = platforms.find(p => p.id === platformId);
    toast.info(`${platform?.name} disconnected`);
  };

  const renderPlatformCard = (platform: Platform & { connected: boolean }, index: number) => {
    const currentState = platformState.find(p => p.id === platform.id);
    const isConnected = currentState?.connected ?? platform.connected;

    return (
      <div
        key={platform.id}
        className={cn(
          "flex items-center justify-between rounded-xl p-4 transition-all hover:scale-[1.01]",
          isConnected ? "glass" : "border border-dashed border-border"
        )}
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shrink-0",
              platform.gradient,
              !isConnected && "opacity-40"
            )}
          >
            {typeof platform.icon === "function" ? (
              <platform.icon />
            ) : (
              <platform.icon className="h-6 w-6 text-white" />
            )}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium">{platform.name}</span>
              {isConnected && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400">
                  <Check className="h-3 w-3" />
                  Connected
                </span>
              )}
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {isConnected 
                ? (platform.followers ? `${platform.followers} followers` : platform.description)
                : (platform.description || "Not connected")
              }
            </p>
          </div>
        </div>
        
        <div className="text-right shrink-0 ml-4">
          {isConnected ? (
            <div className="flex items-center gap-2">
              {platform.engagement && (
                <div className="hidden sm:block mr-2">
                  <p className="text-lg font-semibold text-primary">{platform.engagement}</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              )}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => handleDisconnect(platform.id)}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleConnect(platform.id)}
            >
              Connect
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass rounded-2xl p-4 md:p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold">Platform Integrations</h2>
          <p className="text-sm text-muted-foreground">Connect platforms to run campaigns</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Custom
        </Button>
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-muted/50 p-1 mb-6">
          {categories.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="flex-1 min-w-[100px] gap-2 text-xs sm:text-sm"
            >
              <cat.icon className="h-4 w-4 hidden sm:block" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-3">
            {platformState
              .filter(p => p.category === cat.id)
              .map((platform, index) => renderPlatformCard(platform, index))
            }
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}