import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Send,
  Sparkles,
  User,
  Bot,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  RefreshCw,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: number;
  role: "customer" | "bot";
  content: string;
  timestamp: string;
  sentiment?: "positive" | "neutral" | "negative" | "frustrated";
}

interface Conversation {
  id: number;
  customer: string;
  channel: "whatsapp" | "email" | "chat" | "instagram";
  status: "active" | "resolved" | "escalated";
  lastMessage: string;
  sentiment: "positive" | "neutral" | "negative" | "frustrated";
  unread: number;
}

const mockConversations: Conversation[] = [
  { id: 1, customer: "Priya Sharma", channel: "whatsapp", status: "active", lastMessage: "My order hasn't arrived yet...", sentiment: "frustrated", unread: 2 },
  { id: 2, customer: "Rahul Verma", channel: "chat", status: "active", lastMessage: "How do I upgrade my plan?", sentiment: "neutral", unread: 1 },
  { id: 3, customer: "Anita Patel", channel: "email", status: "escalated", lastMessage: "I need a refund immediately!", sentiment: "negative", unread: 0 },
  { id: 4, customer: "Vikram Singh", channel: "instagram", status: "resolved", lastMessage: "Thanks for your help!", sentiment: "positive", unread: 0 },
];

const mockMessages: Message[] = [
  { id: 1, role: "customer", content: "Hi, I placed an order 5 days ago and it still hasn't arrived. Order #ORD-2035-4821", timestamp: "10:30 AM", sentiment: "frustrated" },
  { id: 2, role: "bot", content: "Hi Priya! I'm sorry to hear about the delay with your order. Let me check the status of order #ORD-2035-4821 for you right away. 🔍", timestamp: "10:30 AM" },
  { id: 3, role: "bot", content: "I found your order! It's currently in transit and the estimated delivery is tomorrow by 6 PM. The delay was due to a weather disruption at the logistics hub. I sincerely apologize for the inconvenience. Would you like me to:\n\n1. Send you live tracking updates?\n2. Arrange priority delivery?\n3. Apply a 10% discount on your next order as a gesture of apology?", timestamp: "10:31 AM" },
  { id: 4, role: "customer", content: "This is unacceptable! I needed this for an event tomorrow morning!", timestamp: "10:33 AM", sentiment: "negative" },
];

const channelIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  chat: MessageSquare,
  instagram: MessageSquare,
};

const sentimentColors = {
  positive: "text-green-500 bg-green-500/10",
  neutral: "text-blue-500 bg-blue-500/10",
  negative: "text-orange-500 bg-orange-500/10",
  frustrated: "text-red-500 bg-red-500/10",
};

export function CustomerChat() {
  const [selectedConversation, setSelectedConversation] = useState<number>(1);
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>(mockMessages);

  const handleSendResponse = () => {
    if (!inputMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        role: "bot",
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInputMessage("");
  };

  const selectedCustomer = mockConversations.find((c) => c.id === selectedConversation);

  return (
    <div className="grid gap-6 lg:grid-cols-3 h-[calc(100vh-200px)]">
      {/* Conversations List */}
      <Card className="lg:col-span-1 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Active Conversations</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {mockConversations.map((conv) => {
              const ChannelIcon = channelIcons[conv.channel];
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv.id)}
                  className={cn(
                    "w-full p-4 text-left transition-colors hover:bg-muted/50",
                    selectedConversation === conv.id && "bg-primary/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium truncate">{conv.customer}</p>
                        {conv.unread > 0 && (
                          <Badge className="ml-2">{conv.unread}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <ChannelIcon className="h-3 w-3 text-muted-foreground" />
                        <Badge
                          variant="outline"
                          className={cn("text-xs", sentimentColors[conv.sentiment])}
                        >
                          {conv.sentiment}
                        </Badge>
                        <Badge
                          variant={
                            conv.status === "escalated"
                              ? "destructive"
                              : conv.status === "resolved"
                              ? "secondary"
                              : "default"
                          }
                          className="text-xs"
                        >
                          {conv.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Chat Window */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{selectedCustomer?.customer}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn("text-xs", sentimentColors[selectedCustomer?.sentiment || "neutral"])}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {selectedCustomer?.sentiment} sentiment
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="destructive" size="sm">
                Escalate
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.role === "bot" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  msg.role === "customer"
                    ? "bg-muted"
                    : "bg-gradient-to-br from-primary to-secondary"
                )}
              >
                {msg.role === "customer" ? (
                  <User className="h-4 w-4" />
                ) : (
                  <Bot className="h-4 w-4 text-primary-foreground" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[70%] rounded-2xl px-4 py-3",
                  msg.role === "customer"
                    ? "bg-muted"
                    : "bg-primary text-primary-foreground"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p
                  className={cn(
                    "text-xs mt-1",
                    msg.role === "customer"
                      ? "text-muted-foreground"
                      : "text-primary-foreground/70"
                  )}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        <div className="p-3 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium">AI Suggested Response</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Offer express delivery
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Process full refund
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Connect to manager
            </Button>
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type AI response or let AI generate..."
              className="flex-1"
              onKeyDown={(e) => e.key === "Enter" && handleSendResponse()}
            />
            <Button variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button onClick={handleSendResponse}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
