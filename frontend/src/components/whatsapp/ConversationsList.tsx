import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  status: "lead" | "prospect" | "customer" | "cold";
  score: number;
  platform: "whatsapp" | "telegram";
}

const conversations: Conversation[] = [
  // WhatsApp conversations
  {
    id: "1",
    name: "Priya Sharma",
    avatar: "PS",
    lastMessage: "I'm interested in the enterprise plan. Can you share pricing?",
    time: "2m ago",
    unread: 2,
    status: "lead",
    score: 85,
    platform: "whatsapp",
  },
  {
    id: "2",
    name: "Rajesh Kumar",
    avatar: "RK",
    lastMessage: "Thanks for the demo! Let me discuss with my team.",
    time: "15m ago",
    unread: 0,
    status: "prospect",
    score: 72,
    platform: "whatsapp",
  },
  {
    id: "3",
    name: "TechVentures Pvt Ltd",
    avatar: "TV",
    lastMessage: "Can we schedule a call for tomorrow?",
    time: "1h ago",
    unread: 1,
    status: "lead",
    score: 90,
    platform: "whatsapp",
  },
  {
    id: "4",
    name: "Ananya Patel",
    avatar: "AP",
    lastMessage: "Payment completed! 🎉",
    time: "3h ago",
    unread: 0,
    status: "customer",
    score: 100,
    platform: "whatsapp",
  },
  {
    id: "5",
    name: "Global Solutions Inc",
    avatar: "GS",
    lastMessage: "We'll get back to you next quarter.",
    time: "1d ago",
    unread: 0,
    status: "cold",
    score: 25,
    platform: "whatsapp",
  },
  // Telegram conversations
  {
    id: "t1",
    name: "Alex Chen",
    avatar: "AC",
    lastMessage: "Your bot is amazing! How do I upgrade to premium?",
    time: "5m ago",
    unread: 3,
    status: "lead",
    score: 88,
    platform: "telegram",
  },
  {
    id: "t2",
    name: "StartupHub Group",
    avatar: "SH",
    lastMessage: "Can you integrate with our existing CRM?",
    time: "30m ago",
    unread: 1,
    status: "prospect",
    score: 75,
    platform: "telegram",
  },
  {
    id: "t3",
    name: "Maria Rodriguez",
    avatar: "MR",
    lastMessage: "Thanks for the quick support! ⭐",
    time: "2h ago",
    unread: 0,
    status: "customer",
    score: 95,
    platform: "telegram",
  },
  {
    id: "t4",
    name: "DevOps Masters",
    avatar: "DM",
    lastMessage: "Need API documentation for the webhook",
    time: "4h ago",
    unread: 2,
    status: "lead",
    score: 82,
    platform: "telegram",
  },
  {
    id: "t5",
    name: "CloudTech Solutions",
    avatar: "CT",
    lastMessage: "Will evaluate next month",
    time: "2d ago",
    unread: 0,
    status: "cold",
    score: 30,
    platform: "telegram",
  },
];

const statusColors = {
  lead: "bg-emerald-500/20 text-emerald-400",
  prospect: "bg-amber-500/20 text-amber-400",
  customer: "bg-primary/20 text-primary",
  cold: "bg-muted text-muted-foreground",
};

interface ConversationsListProps {
  selectedId: string;
  onSelect: (id: string) => void;
  platform?: "whatsapp" | "telegram";
}

export function ConversationsList({ selectedId, onSelect, platform = "whatsapp" }: ConversationsListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter((c) =>
    c.platform === platform && c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const accentColor = platform === "whatsapp" ? "emerald" : "sky";

  return (
    <div className="flex flex-col h-full border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">
          {platform === "whatsapp" ? "WhatsApp" : "Telegram"} Conversations
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full rounded-xl bg-muted border border-border pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2",
              platform === "whatsapp" ? "focus:ring-emerald-500" : "focus:ring-sky-500"
            )}
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={cn(
              "w-full flex items-start gap-3 p-4 text-left transition-colors hover:bg-muted/50",
              selectedId === conversation.id && "bg-muted/70"
            )}
          >
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full text-white font-medium bg-gradient-to-br",
                platform === "whatsapp" ? "from-emerald-500 to-emerald-600" : "from-sky-500 to-sky-600"
              )}>
                {conversation.avatar}
              </div>
              {conversation.unread > 0 && (
                <span className={cn(
                  "absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white",
                  platform === "whatsapp" ? "bg-emerald-500" : "bg-sky-500"
                )}>
                  {conversation.unread}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium truncate">{conversation.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{conversation.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate mb-2">{conversation.lastMessage}</p>
              <div className="flex items-center gap-2">
                <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", statusColors[conversation.status])}>
                  {conversation.status}
                </span>
                <span className="text-xs text-muted-foreground">Score: {conversation.score}%</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
