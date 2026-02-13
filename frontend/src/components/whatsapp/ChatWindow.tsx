import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Send,
  Paperclip,
  Mic,
  Smile,
  Phone,
  Video,
  MoreVertical,
  Bot,
  Sparkles,
  CheckCheck,
  Loader2,
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  time: string;
  sender: "user" | "lead" | "ai";
  status?: "sent" | "delivered" | "read";
}

interface ChatWindowProps {
  conversationId: string;
  platform?: "whatsapp" | "telegram";
}

const getInitialMessages = (platform: "whatsapp" | "telegram"): Message[] => {
  if (platform === "telegram") {
    return [
      {
        id: "1",
        content: "Hey! I found your bot through a tech community. Looking for AI automation for my startup.",
        time: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "lead",
      },
    ];
  }
  return [
    {
      id: "1",
      content: "Hi! I saw your services on LinkedIn. I'm interested in learning more about your AI automation solutions.",
      time: new Date(Date.now() - 300000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "lead",
    },
  ];
};

const leadInfo = {
  whatsapp: { name: "Priya Sharma", initials: "PS" },
  telegram: { name: "Alex Chen", initials: "AC" },
};

export function ChatWindow({ conversationId, platform = "whatsapp" }: ChatWindowProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(getInitialMessages(platform));
  const [isAITyping, setIsAITyping] = useState(false);
  const [suggestedActions, setSuggestedActions] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentLead = leadInfo[platform];
  const accentGradient = platform === "whatsapp"
    ? "from-emerald-500 to-emerald-600"
    : "from-sky-500 to-sky-600";
  const accentHover = platform === "whatsapp"
    ? "hover:from-emerald-600 hover:to-emerald-700"
    : "hover:from-sky-600 hover:to-sky-700";
  const aiGradient = platform === "whatsapp"
    ? "from-emerald-600 to-emerald-700"
    : "from-sky-600 to-sky-700";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping]);

  useEffect(() => {
    setMessages(getInitialMessages(platform));
    setSuggestedActions([]);
  }, [platform]);

  const handleSend = async (content?: string) => {
    const messageToSend = content || message.trim();
    if (!messageToSend) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: messageToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sender: "user",
      status: "sent",
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsAITyping(true);
    setSuggestedActions([]);

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.sender === "lead" ? "user" as const : "assistant" as const,
        content: msg.content,
      }));

      const { data, error } = await supabase.functions.invoke('whatsapp-ai-chat', {
        body: {
          message: messageToSend,
          conversationHistory,
          leadContext: {
            name: currentLead.name,
            company: platform === "whatsapp" ? "TechCorp Solutions" : "StartupHub",
            status: "Hot Lead",
            score: 85,
            platform,
          },
        },
      });

      if (error) throw error;

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sender: "ai",
        status: "read",
      };

      setMessages(prev => [...prev, aiMessage]);
      setSuggestedActions(data.suggestedActions || []);
    } catch (error) {
      console.error('Error getting AI response:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsAITyping(false);
    }
  };

  const handleQuickAction = (action: string) => {
    toast.success(`Action triggered: ${action}`);
  };

  const handleSuggestedAction = (action: string) => {
    handleSend(`Please help me ${action.toLowerCase()}`);
  };

  return (
    <div className="flex flex-col h-full border-x border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-white font-medium bg-gradient-to-br",
            accentGradient
          )}>
            {currentLead.initials}
          </div>
          <div>
            <h3 className="font-medium">{currentLead.name}</h3>
            <p className={cn("text-xs", platform === "whatsapp" ? "text-emerald-400" : "text-sky-400")}>
              Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-2 p-3 border-b border-border overflow-x-auto">
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => handleQuickAction("Send Proposal")}
        >
          <Sparkles className="h-4 w-4 mr-1 text-primary" />
          Send Proposal
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => handleQuickAction("Schedule Call")}
        >
          <Phone className="h-4 w-4 mr-1" />
          Schedule Call
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => handleSend("Generate a pricing proposal for our Enterprise AI solution")}
        >
          <Bot className="h-4 w-4 mr-1 text-violet-400" />
          AI Response
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.sender === "lead" ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-4 py-3",
                msg.sender === "lead"
                  ? "bg-muted rounded-tl-none"
                  : msg.sender === "ai"
                    ? cn("text-white rounded-tr-none bg-gradient-to-br", aiGradient)
                    : "bg-primary text-primary-foreground rounded-tr-none"
              )}
            >
              {msg.sender === "ai" && (
                <div className={cn(
                  "flex items-center gap-1 text-xs mb-1",
                  platform === "whatsapp" ? "text-emerald-200" : "text-sky-200"
                )}>
                  <Bot className="h-3 w-3" />
                  AI Assistant
                </div>
              )}
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className={cn(
                  "text-xs",
                  msg.sender === "lead" ? "text-muted-foreground" : "text-white/70"
                )}>
                  {msg.time}
                </span>
                {msg.status && msg.sender !== "lead" && (
                  <CheckCheck className={cn(
                    "h-3 w-3",
                    msg.status === "read"
                      ? (platform === "whatsapp" ? "text-emerald-300" : "text-sky-300")
                      : "text-white/50"
                  )} />
                )}
              </div>
            </div>
          </div>
        ))}

        {isAITyping && (
          <div className="flex justify-end">
            <div className={cn("rounded-2xl rounded-tr-none px-4 py-3 bg-gradient-to-br", aiGradient)}>
              <div className={cn(
                "flex items-center gap-1 text-xs mb-1",
                platform === "whatsapp" ? "text-emerald-200" : "text-sky-200"
              )}>
                <Bot className="h-3 w-3" />
                AI Assistant
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Actions */}
      {suggestedActions.length > 0 && (
        <div className="px-4 py-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Suggested actions:</p>
          <div className="flex gap-2 flex-wrap">
            {suggestedActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedAction(action)}
                className="text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                {action}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5 text-muted-foreground" />
          </Button>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message or let AI respond..."
            className={cn(
              "flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2",
              platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
            )}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            disabled={isAITyping}
          />
          <Button variant="ghost" size="icon">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button
            className={cn("bg-gradient-to-r", accentGradient, accentHover)}
            size="icon"
            onClick={() => handleSend()}
            disabled={isAITyping || !message.trim()}
          >
            {isAITyping ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
