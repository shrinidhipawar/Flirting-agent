import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  Instagram, 
  Facebook, 
  Globe, 
  Send, 
  Search,
  MoreVertical,
  Star,
  Archive,
  CheckCircle,
  AlertTriangle,
  User,
  Bot,
  Sparkles,
  Zap,
  RefreshCw,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/hooks/useNotifications";

interface UnifiedMessage {
  id: string;
  channel: "whatsapp" | "email" | "webchat" | "instagram" | "facebook" | "sms" | "voice";
  customer: {
    name: string;
    email?: string;
    phone?: string;
    avatar?: string;
  };
  preview: string;
  timestamp: string;
  status: "unread" | "open" | "pending" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  sentiment: "positive" | "neutral" | "negative" | "frustrated";
  intent: string;
  assignedTo?: string;
  tags: string[];
  starred?: boolean;
  archived?: boolean;
}

interface AIAnalysis {
  intent: string;
  sentiment: "positive" | "neutral" | "negative" | "frustrated";
  sentimentScore: number;
  priority: "low" | "medium" | "high" | "urgent";
  suggestedResponse: string;
  suggestedActions: string[];
  churnRisk: "low" | "medium" | "high";
  summary: string;
}

const channelConfig = {
  whatsapp: { icon: MessageSquare, color: "text-green-500 bg-green-500/10", label: "WhatsApp" },
  email: { icon: Mail, color: "text-blue-500 bg-blue-500/10", label: "Email" },
  webchat: { icon: Globe, color: "text-purple-500 bg-purple-500/10", label: "Web Chat" },
  instagram: { icon: Instagram, color: "text-pink-500 bg-pink-500/10", label: "Instagram" },
  facebook: { icon: Facebook, color: "text-blue-600 bg-blue-600/10", label: "Facebook" },
  sms: { icon: Phone, color: "text-orange-500 bg-orange-500/10", label: "SMS" },
  voice: { icon: Phone, color: "text-cyan-500 bg-cyan-500/10", label: "Voice" },
};

const initialMessages: UnifiedMessage[] = [
  { id: "1", channel: "whatsapp", customer: { name: "Priya Sharma", phone: "+91 98765 43210" }, preview: "My order hasn't arrived yet, it's been 5 days!", timestamp: "2 min ago", status: "unread", priority: "high", sentiment: "frustrated", intent: "Order Tracking", tags: ["urgent", "delivery"], starred: false, archived: false },
  { id: "2", channel: "email", customer: { name: "Rahul Verma", email: "rahul@example.com" }, preview: "I need to upgrade my subscription plan to enterprise", timestamp: "15 min ago", status: "open", priority: "medium", sentiment: "neutral", intent: "Upgrade Request", tags: ["sales", "upgrade"], starred: false, archived: false },
  { id: "3", channel: "instagram", customer: { name: "Anita Patel" }, preview: "Love your products! Can I get a discount code?", timestamp: "32 min ago", status: "unread", priority: "low", sentiment: "positive", intent: "Discount Request", tags: ["promo"], starred: false, archived: false },
  { id: "4", channel: "voice", customer: { name: "Vikram Singh", phone: "+91 87654 32109" }, preview: "[Voice Call] Refund request for damaged item", timestamp: "1 hour ago", status: "pending", priority: "urgent", sentiment: "negative", intent: "Refund Request", tags: ["refund", "escalation"], starred: false, archived: false },
  { id: "5", channel: "webchat", customer: { name: "Meera Joshi" }, preview: "How do I reset my password?", timestamp: "2 hours ago", status: "resolved", priority: "low", sentiment: "neutral", intent: "Account Help", tags: ["self-service"], starred: false, archived: false },
  { id: "6", channel: "facebook", customer: { name: "Arjun Kapoor" }, preview: "Your delivery partner was extremely rude!", timestamp: "3 hours ago", status: "open", priority: "high", sentiment: "negative", intent: "Complaint", tags: ["complaint", "delivery"], starred: false, archived: false },
];

const sentimentStyles = {
  positive: "bg-green-500/10 text-green-500 border-green-500/30",
  neutral: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  negative: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  frustrated: "bg-red-500/10 text-red-500 border-red-500/30",
};

const priorityStyles = {
  low: "bg-slate-500/10 text-slate-500",
  medium: "bg-yellow-500/10 text-yellow-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500 animate-pulse",
};

export function OmnichannelInbox() {
  const [messages, setMessages] = useState<UnifiedMessage[]>(initialMessages);
  const [selectedChannel, setSelectedChannel] = useState<string>("all");
  const [selectedMessage, setSelectedMessage] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingReply, setIsGeneratingReply] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [aiReply, setAiReply] = useState<string>("");
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const [conversationHistory, setConversationHistory] = useState<{role: string; content: string; timestamp: string}[]>([]);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Simulate incoming messages for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const shouldAddMessage = Math.random() > 0.7; // 30% chance every 30 seconds
      if (shouldAddMessage) {
        const newCustomers = [
          { name: "Sanjay Kumar", phone: "+91 99887 76655" },
          { name: "Neha Gupta", email: "neha@example.com" },
          { name: "Amit Shah", phone: "+91 88776 65544" },
        ];
        const channels: UnifiedMessage["channel"][] = ["whatsapp", "email", "instagram", "webchat"];
        const intents = ["Order Inquiry", "Product Question", "Delivery Update", "Support Request"];
        const previews = [
          "Hi, I have a question about my recent order",
          "Can you help me with product recommendations?",
          "When will my order be delivered?",
          "I need assistance with my account",
        ];

        const randomCustomer = newCustomers[Math.floor(Math.random() * newCustomers.length)];
        const randomChannel = channels[Math.floor(Math.random() * channels.length)];
        const randomIntent = intents[Math.floor(Math.random() * intents.length)];
        const randomPreview = previews[Math.floor(Math.random() * previews.length)];

        const newMessage: UnifiedMessage = {
          id: `msg-${Date.now()}`,
          channel: randomChannel,
          customer: randomCustomer,
          preview: randomPreview,
          timestamp: "Just now",
          status: "unread",
          priority: "medium",
          sentiment: "neutral",
          intent: randomIntent,
          tags: [],
          starred: false,
          archived: false,
        };

        setMessages(prev => [newMessage, ...prev]);
        
        // Trigger notification with sound
        addNotification({
          type: "message",
          title: `New message from ${randomCustomer.name}`,
          description: randomPreview.substring(0, 50) + "...",
          priority: "medium",
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification]);

  const filteredMessages = messages
    .filter(m => !m.archived)
    .filter(m => selectedChannel === "all" || m.channel === selectedChannel)
    .filter(m => 
      searchQuery === "" || 
      m.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.preview.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const currentMessage = messages.find(m => m.id === selectedMessage);

  const channelCounts = {
    all: messages.filter(m => !m.archived).length,
    whatsapp: messages.filter(m => m.channel === "whatsapp" && !m.archived).length,
    email: messages.filter(m => m.channel === "email" && !m.archived).length,
    webchat: messages.filter(m => m.channel === "webchat" && !m.archived).length,
    instagram: messages.filter(m => m.channel === "instagram" && !m.archived).length,
    facebook: messages.filter(m => m.channel === "facebook" && !m.archived).length,
    voice: messages.filter(m => m.channel === "voice" && !m.archived).length,
  };

  // Analyze message with AI
  const analyzeMessage = async (message: string, customerName: string) => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    
    try {
      const { data, error } = await supabase.functions.invoke("analyze-support", {
        body: { 
          message,
          customerContext: {
            name: customerName,
            previousInteractions: 5,
            lifetimeValue: 45000
          }
        }
      });

      if (error) throw error;

      setAiAnalysis(data);
      toast({
        title: "Analysis Complete",
        description: `Intent: ${data.intent} | Sentiment: ${data.sentiment}`,
      });
    } catch (error) {
      console.error("Error analyzing message:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate AI reply
  const generateReply = async () => {
    if (!currentMessage) return;
    
    setIsGeneratingReply(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-support-reply", {
        body: { 
          customerMessage: currentMessage.preview,
          customerName: currentMessage.customer.name,
          intent: aiAnalysis?.intent || currentMessage.intent,
          sentiment: aiAnalysis?.sentiment || currentMessage.sentiment,
          businessContext: {
            companyName: "SocialAI",
            industry: "Technology",
            tone: "friendly"
          }
        }
      });

      if (error) throw error;

      setAiReply(data.reply);
      setReplyText(data.reply);
      setSuggestedActions(data.suggestedActions || []);
      
      toast({
        title: "Reply Generated",
        description: "AI has drafted a response for you.",
      });
    } catch (error) {
      console.error("Error generating reply:", error);
      toast({
        title: "Generation Failed",
        description: "Could not generate reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReply(false);
    }
  };

  // Auto-analyze when selecting a message
  const handleSelectMessage = async (messageId: string) => {
    setSelectedMessage(messageId);
    setAiAnalysis(null);
    setAiReply("");
    setSuggestedActions([]);
    setReplyText("");
    setConversationHistory([]);
    
    const message = messages.find(m => m.id === messageId);
    if (message) {
      // Mark as read
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, status: m.status === "unread" ? "open" : m.status } : m
      ));
      
      // Set initial conversation
      setConversationHistory([
        { role: "customer", content: message.preview, timestamp: message.timestamp }
      ]);
      
      await analyzeMessage(message.preview, message.customer.name);
    }
  };

  // Star message
  const handleStar = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, starred: !m.starred } : m
    ));
    const msg = messages.find(m => m.id === messageId);
    toast({
      title: msg?.starred ? "Removed from starred" : "Added to starred",
      description: `Conversation with ${msg?.customer.name}`,
    });
  };

  // Archive message
  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(m => 
      m.id === messageId ? { ...m, archived: true } : m
    ));
    const msg = messages.find(m => m.id === messageId);
    toast({
      title: "Conversation Archived",
      description: `Archived conversation with ${msg?.customer.name}`,
    });
    if (selectedMessage === messageId) {
      setSelectedMessage(null);
    }
  };

  // Mark as resolved
  const handleMarkResolved = () => {
    if (!currentMessage) return;
    setMessages(prev => prev.map(m => 
      m.id === currentMessage.id ? { ...m, status: "resolved" } : m
    ));
    toast({
      title: "Marked as Resolved",
      description: `Ticket for ${currentMessage.customer.name} has been resolved.`,
    });
  };

  // Send tracking info
  const handleSendTracking = () => {
    if (!currentMessage) return;
    const trackingNumber = `TRK${Date.now().toString().slice(-8)}`;
    setConversationHistory(prev => [
      ...prev,
      { 
        role: "bot", 
        content: `I've looked up your order status. Your tracking number is ${trackingNumber}. Your package is currently in transit and expected to arrive within 24-48 hours. You can track it at: tracking.example.com/${trackingNumber}`,
        timestamp: "Just now"
      }
    ]);
    toast({
      title: "Tracking Info Sent",
      description: `Sent tracking #${trackingNumber} to ${currentMessage.customer.name}`,
    });
  };

  // Escalate to human
  const handleEscalate = () => {
    if (!currentMessage) return;
    setMessages(prev => prev.map(m => 
      m.id === currentMessage.id ? { ...m, status: "pending", priority: "urgent", assignedTo: "Support Team" } : m
    ));
    
    // Trigger escalation notification with sound
    addNotification({
      type: "escalation",
      title: "Ticket Escalated",
      description: `${currentMessage.customer.name}'s conversation requires human attention`,
      priority: "urgent",
    });
  };

  // Send reply
  const handleSendReply = () => {
    if (!replyText.trim() || !currentMessage) return;
    
    setConversationHistory(prev => [
      ...prev,
      { role: "bot", content: replyText, timestamp: "Just now" }
    ]);
    
    setAiReply(replyText);
    setReplyText("");
    
    toast({
      title: "Reply Sent",
      description: `Message sent to ${currentMessage.customer.name}`,
    });
  };

  // Execute suggested action
  const handleSuggestedAction = (action: string) => {
    const actionLower = action.toLowerCase();
    
    if (actionLower.includes("refund") || actionLower.includes("process")) {
      toast({
        title: "Refund Initiated",
        description: "Refund request has been submitted for processing.",
      });
    } else if (actionLower.includes("track") || actionLower.includes("status")) {
      handleSendTracking();
    } else if (actionLower.includes("escalate") || actionLower.includes("human")) {
      handleEscalate();
    } else if (actionLower.includes("ticket") || actionLower.includes("create")) {
      addNotification({
        type: "ticket",
        title: "Ticket Created",
        description: `New ticket created for ${currentMessage?.customer.name}`,
        priority: "medium",
      });
    } else if (actionLower.includes("discount") || actionLower.includes("coupon")) {
      toast({
        title: "Discount Applied",
        description: "10% discount code sent to customer: SORRY10",
      });
    } else {
      toast({
        title: "Action Executed",
        description: action,
      });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[calc(100vh-220px)]">
      {/* Channel Tabs & Message List */}
      <div className="lg:col-span-4 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden glass">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Unified Inbox
              </CardTitle>
              <Badge variant="secondary">{messages.filter(m => m.status === "unread" && !m.archived).length} unread</Badge>
            </div>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-9 bg-background/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          
          <div className="px-4 pb-2">
            <ScrollArea className="w-full">
              <div className="flex gap-1 pb-2">
                <Button 
                  size="sm" 
                  variant={selectedChannel === "all" ? "default" : "ghost"}
                  onClick={() => setSelectedChannel("all")}
                  className="text-xs"
                >
                  All ({channelCounts.all})
                </Button>
                {Object.entries(channelConfig).map(([key, config]) => (
                  <Button 
                    key={key}
                    size="sm" 
                    variant={selectedChannel === key ? "default" : "ghost"}
                    onClick={() => setSelectedChannel(key)}
                    className="text-xs gap-1"
                  >
                    <config.icon className="h-3 w-3" />
                    {channelCounts[key as keyof typeof channelCounts] || 0}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>

          <CardContent className="flex-1 overflow-hidden p-0">
            <ScrollArea className="h-full">
              <div className="divide-y divide-border/50">
                {filteredMessages.map((msg) => {
                  const config = channelConfig[msg.channel];
                  return (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg.id)}
                      className={`w-full p-3 text-left transition-all hover:bg-muted/50 ${
                        selectedMessage === msg.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                      } ${msg.status === "unread" ? "bg-primary/5" : ""}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${config.color}`}>
                          <config.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className={`font-medium text-sm ${msg.status === "unread" ? "text-foreground" : "text-muted-foreground"}`}>
                              {msg.customer.name}
                              {msg.starred && <Star className="inline h-3 w-3 ml-1 text-yellow-500 fill-yellow-500" />}
                            </span>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{msg.preview}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${sentimentStyles[msg.sentiment]}`}>
                              {msg.sentiment}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {msg.intent}
                            </Badge>
                            {msg.priority === "urgent" && (
                              <Badge className={`text-[10px] px-1.5 py-0 ${priorityStyles[msg.priority]}`}>
                                URGENT
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Conversation View */}
      <div className="lg:col-span-5 flex flex-col">
        <Card className="flex-1 flex flex-col overflow-hidden glass">
          {currentMessage ? (
            <>
              <CardHeader className="pb-2 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{currentMessage.customer.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{currentMessage.customer.email || currentMessage.customer.phone}</span>
                        <Badge variant="outline" className={channelConfig[currentMessage.channel].color}>
                          {channelConfig[currentMessage.channel].label}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleStar(currentMessage.id)}
                    >
                      <Star className={`h-4 w-4 ${currentMessage.starred ? "fill-yellow-500 text-yellow-500" : ""}`} />
                    </Button>
                    <Button 
                      size="icon" 
                      variant="ghost"
                      onClick={() => handleArchive(currentMessage.id)}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost"><MoreVertical className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {/* Conversation History */}
                {conversationHistory.map((msg, idx) => (
                  <div key={idx} className={`flex gap-3 ${msg.role === "bot" ? "flex-row-reverse" : ""}`}>
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "customer" ? "bg-muted" : "bg-gradient-to-br from-primary to-secondary"
                    }`}>
                      {msg.role === "customer" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-primary-foreground" />}
                    </div>
                    <div className="max-w-[80%]">
                      <div className={`rounded-2xl px-4 py-3 ${
                        msg.role === "customer" ? "bg-muted" : "bg-primary text-primary-foreground"
                      }`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <div className={`flex items-center gap-2 mt-1 ${msg.role === "bot" ? "justify-end" : ""}`}>
                        {msg.role === "bot" && (
                          <Badge variant="outline" className="text-[10px]">
                            <Sparkles className="h-2.5 w-2.5 mr-1" />
                            AI Generated
                          </Badge>
                        )}
                        <p className="text-xs text-muted-foreground">{msg.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              {/* AI Suggestions */}
              <div className="px-4 py-2 border-t border-border/50 bg-primary/5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-xs font-medium">AI Quick Actions</span>
                  {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin" />}
                </div>
                <div className="flex flex-wrap gap-2">
                  {suggestedActions.length > 0 ? (
                    suggestedActions.map((action, i) => (
                      <Button 
                        key={i} 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={() => handleSuggestedAction(action)}
                      >
                        {action}
                      </Button>
                    ))
                  ) : (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={handleMarkResolved}
                      >
                        <CheckCircle className="h-3 w-3 mr-1" /> Mark Resolved
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={handleSendTracking}
                      >
                        <RefreshCw className="h-3 w-3 mr-1" /> Send Tracking
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs h-7"
                        onClick={handleEscalate}
                      >
                        <AlertTriangle className="h-3 w-3 mr-1" /> Escalate
                      </Button>
                    </>
                  )}
                </div>
              </div>

              {/* Reply Input */}
              <div className="p-3 border-t border-border/50">
                <div className="flex gap-2">
                  <Input 
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 bg-background/50"
                    onKeyDown={(e) => e.key === "Enter" && handleSendReply()}
                  />
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={generateReply}
                    disabled={isGeneratingReply}
                  >
                    {isGeneratingReply ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                  </Button>
                  <Button 
                    className="bg-gradient-to-r from-primary to-secondary"
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              Select a conversation to view
            </div>
          )}
        </Card>
      </div>

      {/* Customer Context Panel */}
      <div className="lg:col-span-3 space-y-4">
        {currentMessage && (
          <>
            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Customer Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">{currentMessage.customer.name}</p>
                    <p className="text-xs text-muted-foreground">Customer since 2024</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-background/50">
                    <p className="text-muted-foreground">Total Orders</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div className="p-2 rounded-lg bg-background/50">
                    <p className="text-muted-foreground">Lifetime Value</p>
                    <p className="font-medium">₹45,000</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  AI Analysis
                  {isAnalyzing && <Loader2 className="h-3 w-3 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Intent</span>
                    <Badge>{aiAnalysis?.intent || currentMessage.intent}</Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Sentiment</span>
                    <Badge className={sentimentStyles[aiAnalysis?.sentiment || currentMessage.sentiment]}>
                      {aiAnalysis?.sentiment || currentMessage.sentiment}
                      {aiAnalysis?.sentimentScore !== undefined && ` (${aiAnalysis.sentimentScore}%)`}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Priority</span>
                    <Badge className={priorityStyles[aiAnalysis?.priority || currentMessage.priority]}>
                      {aiAnalysis?.priority || currentMessage.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Churn Risk</span>
                    <Badge variant={aiAnalysis?.churnRisk === "high" ? "destructive" : "outline"}>
                      {aiAnalysis?.churnRisk || "Analyzing..."}
                    </Badge>
                  </div>
                </div>
                {aiAnalysis?.summary && (
                  <div className="pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground">Summary</p>
                    <p className="text-xs mt-1">{aiAnalysis.summary}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recent Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span>Delivery delay</span>
                    <Badge variant="outline">Resolved</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-background/50">
                    <span>Payment issue</span>
                    <Badge variant="outline">Resolved</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
