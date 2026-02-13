import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Building2,
  Palette,
  MessageSquare,
  Settings,
  Check,
  ChevronRight,
  Upload,
  Globe,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const tones = [
  { id: "helpful", label: "Helpful & Friendly", emoji: "😊" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "premium", label: "Premium & Concierge", emoji: "✨" },
  { id: "casual", label: "Casual & Fun", emoji: "😄" },
];

const initialChannels = [
  { id: "whatsapp", label: "WhatsApp Business", enabled: true },
  { id: "email", label: "Email", enabled: true },
  { id: "website", label: "Website Chat", enabled: true },
  { id: "instagram", label: "Instagram DMs", enabled: false },
  { id: "sms", label: "SMS", enabled: false },
];

const initialAutomations = [
  { id: "auto-reply", label: "Auto-reply to messages", description: "Instantly respond to all incoming messages", enabled: true },
  { id: "sentiment", label: "Sentiment detection", description: "Detect frustrated customers and prioritize", enabled: true },
  { id: "escalation", label: "Auto-escalation", description: "Escalate unresolved issues after 24 hours", enabled: true },
  { id: "ticket", label: "Auto-create tickets", description: "Create tickets for complex issues", enabled: true },
  { id: "followup", label: "Follow-up reminders", description: "Send satisfaction surveys after resolution", enabled: false },
];

export function BusinessSetup() {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [selectedTone, setSelectedTone] = useState("helpful");
  const [customGreeting, setCustomGreeting] = useState("");
  const [escalationMessage, setEscalationMessage] = useState("");
  const [channelSettings, setChannelSettings] = useState(initialChannels);
  const [automationSettings, setAutomationSettings] = useState(initialAutomations);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isLaunching, setIsLaunching] = useState(false);
  const { toast } = useToast();

  const toggleChannel = (id: string) => {
    setChannelSettings((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, enabled: !ch.enabled } : ch))
    );
    const channel = channelSettings.find(ch => ch.id === id);
    toast({
      title: channel?.enabled ? "Channel Disabled" : "Channel Enabled",
      description: channel?.label,
    });
  };

  const toggleAutomation = (id: string) => {
    setAutomationSettings((prev) =>
      prev.map((auto) => (auto.id === id ? { ...auto, enabled: !auto.enabled } : auto))
    );
    const automation = automationSettings.find(a => a.id === id);
    toast({
      title: automation?.enabled ? "Automation Disabled" : "Automation Enabled",
      description: automation?.label,
    });
  };

  const handleFileUpload = () => {
    setIsUploading(true);
    // Simulate file upload
    setTimeout(() => {
      setUploadedFiles(prev => [...prev, `document_${Date.now()}.pdf`]);
      setIsUploading(false);
      toast({
        title: "File Uploaded",
        description: "Knowledge base document has been added",
      });
    }, 1500);
  };

  const handleNext = () => {
    if (step === 1 && !businessName.trim()) {
      toast({
        title: "Business Name Required",
        description: "Please enter your business name to continue",
        variant: "destructive",
      });
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
    toast({
      title: `Step ${step} Complete`,
      description: `Moving to step ${step + 1}`,
    });
  };

  const handlePrevious = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleLaunch = () => {
    setIsLaunching(true);
    
    setTimeout(() => {
      setIsLaunching(false);
      toast({
        title: "🎉 Support Bot Launched!",
        description: `${businessName || "Your"} AI support bot is now live across ${channelSettings.filter(c => c.enabled).length} channels`,
      });
    }, 2000);
  };

  const steps = [
    { number: 1, title: "Business Info", icon: Building2 },
    { number: 2, title: "Brand Voice", icon: Palette },
    { number: 3, title: "Channels", icon: Globe },
    { number: 4, title: "Automation", icon: Settings },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Business Setup</h2>
        <p className="text-muted-foreground">
          Configure your AI support bot for your business
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <button
              onClick={() => setStep(s.number)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                step === s.number
                  ? "bg-primary text-primary-foreground"
                  : step > s.number
                  ? "bg-green-500/20 text-green-500"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {step > s.number ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span className="text-sm hidden sm:inline">{s.title}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Name *</label>
                <Input
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Your Company Name"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <Input
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., E-commerce, SaaS, Healthcare"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Business Description</label>
                <textarea
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                  placeholder="Describe your products/services, target customers, and what makes you unique..."
                  className="w-full h-24 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Upload Knowledge Base</label>
                <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop your FAQs, policies, product docs
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      "Browse Files"
                    )}
                  </Button>
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, i) => (
                        <Badge key={i} variant="secondary" className="mr-2">
                          {file}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Support Bot Tone</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => {
                        setSelectedTone(tone.id);
                        toast({
                          title: "Tone Selected",
                          description: tone.label,
                        });
                      }}
                      className={cn(
                        "p-4 rounded-xl text-center transition-all border-2",
                        selectedTone === tone.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted hover:border-border"
                      )}
                    >
                      <span className="text-2xl block mb-2">{tone.emoji}</span>
                      <span className="text-sm">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Greeting Message</label>
                <textarea
                  value={customGreeting}
                  onChange={(e) => setCustomGreeting(e.target.value)}
                  placeholder={`Hi! 👋 Welcome to ${businessName || "[Company]"}. I'm your AI assistant. How can I help you today?`}
                  className="w-full h-24 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Escalation Message</label>
                <textarea
                  value={escalationMessage}
                  onChange={(e) => setEscalationMessage(e.target.value)}
                  placeholder="I understand this is important. Let me connect you with our support team for personalized assistance."
                  className="w-full h-24 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Enable the channels where you want AI support
              </p>
              <div className="space-y-3">
                {channelSettings.map((channel) => (
                  <div
                    key={channel.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-all",
                      channel.enabled ? "bg-primary/5 border border-primary/20" : "bg-muted"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className={cn(
                        "h-5 w-5",
                        channel.enabled ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="font-medium">{channel.label}</span>
                      {channel.enabled && (
                        <Badge variant="outline" className="text-green-500 border-green-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <Switch
                      checked={channel.enabled}
                      onCheckedChange={() => toggleChannel(channel.id)}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {channelSettings.filter(c => c.enabled).length} of {channelSettings.length} channels enabled
              </p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Configure automation rules for your support bot
              </p>
              <div className="space-y-3">
                {automationSettings.map((auto) => (
                  <div
                    key={auto.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg transition-all",
                      auto.enabled ? "bg-primary/5 border border-primary/20" : "bg-muted"
                    )}
                  >
                    <div>
                      <p className="font-medium flex items-center gap-2">
                        {auto.label}
                        {auto.enabled && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {auto.description}
                      </p>
                    </div>
                    <Switch
                      checked={auto.enabled}
                      onCheckedChange={() => toggleAutomation(auto.id)}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                {automationSettings.filter(a => a.enabled).length} of {automationSettings.length} automations enabled
              </p>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button onClick={handleNext}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={handleLaunch}
                disabled={isLaunching}
              >
                {isLaunching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Launching...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Launch Support Bot
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      {step === 4 && businessName && (
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <h3 className="font-bold mb-4">Setup Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Business</p>
                <p className="font-medium">{businessName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Tone</p>
                <p className="font-medium capitalize">{selectedTone}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Channels</p>
                <p className="font-medium">{channelSettings.filter(c => c.enabled).length} active</p>
              </div>
              <div>
                <p className="text-muted-foreground">Automations</p>
                <p className="font-medium">{automationSettings.filter(a => a.enabled).length} enabled</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
