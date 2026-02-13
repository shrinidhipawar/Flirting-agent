import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  MoreHorizontal,
  Bot,
} from "lucide-react";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  priority: "high" | "medium" | "low";
  status: "open" | "pending" | "resolved";
  category: string;
  created: string;
  assignee: string;
  aiSummary: string;
}

const tickets: Ticket[] = [
  {
    id: "TKT-001",
    subject: "Unable to access dashboard after upgrade",
    customer: "Priya Sharma",
    priority: "high",
    status: "open",
    category: "Technical",
    created: "30 min ago",
    assignee: "AS",
    aiSummary: "User facing login issues post v2.0 upgrade. Likely cache/session issue. Recommended: Clear browser cache, logout/login.",
  },
  {
    id: "TKT-002",
    subject: "Billing discrepancy in last invoice",
    customer: "Rajesh Kumar",
    priority: "medium",
    status: "pending",
    category: "Billing",
    created: "2 hours ago",
    assignee: "MK",
    aiSummary: "Customer charged extra ₹2,000. Investigation shows duplicate subscription entry. Action: Issue refund + credit.",
  },
  {
    id: "TKT-003",
    subject: "Feature request: Export to PDF",
    customer: "Ananya Patel",
    priority: "low",
    status: "open",
    category: "Feature Request",
    created: "5 hours ago",
    assignee: "PJ",
    aiSummary: "Customer requests PDF export for analytics reports. Similar requests from 12 other users this month. Consider for Q2 roadmap.",
  },
  {
    id: "TKT-004",
    subject: "Integration with Salesforce not syncing",
    customer: "Vikram Singh",
    priority: "high",
    status: "pending",
    category: "Integration",
    created: "1 day ago",
    assignee: "AS",
    aiSummary: "API sync failing due to expired OAuth token. Customer needs to re-authenticate in Salesforce settings.",
  },
  {
    id: "TKT-005",
    subject: "How to add team members?",
    customer: "Meera Reddy",
    priority: "low",
    status: "resolved",
    category: "General",
    created: "2 days ago",
    assignee: "MK",
    aiSummary: "Onboarding question. Shared documentation link + video tutorial. Customer confirmed issue resolved.",
  },
];

const priorityColors = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-amber-500/20 text-amber-400",
  low: "bg-emerald-500/20 text-emerald-400",
};

const statusColors = {
  open: "bg-blue-500/20 text-blue-400",
  pending: "bg-amber-500/20 text-amber-400",
  resolved: "bg-emerald-500/20 text-emerald-400",
};

const statusIcons = {
  open: AlertCircle,
  pending: Clock,
  resolved: CheckCircle2,
};

export function SupportDesk() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(tickets[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
      {/* Ticket List */}
      <div className="lg:col-span-1 glass rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Support Tickets</h3>
            <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg bg-muted border border-border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {tickets.map((ticket) => {
            const StatusIcon = statusIcons[ticket.status];
            return (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "w-full p-4 text-left border-b border-border/50 hover:bg-muted/30 transition-colors",
                  selectedTicket?.id === ticket.id && "bg-muted/50"
                )}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-muted-foreground">{ticket.id}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", priorityColors[ticket.priority])}>
                    {ticket.priority}
                  </span>
                </div>
                <p className="font-medium text-sm mb-1 line-clamp-1">{ticket.subject}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{ticket.customer}</span>
                  <div className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground capitalize">{ticket.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticket Detail */}
      {selectedTicket && (
        <div className="lg:col-span-2 glass rounded-xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{selectedTicket.id}</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", statusColors[selectedTicket.status])}>
                    {selectedTicket.status}
                  </span>
                  <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", priorityColors[selectedTicket.priority])}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <h3 className="text-lg font-semibold">{selectedTicket.subject}</h3>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {selectedTicket.customer}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {selectedTicket.created}
              </span>
              <span className="px-2 py-0.5 bg-muted rounded">{selectedTicket.category}</span>
            </div>
          </div>

          {/* AI Summary */}
          <div className="p-4 border-b border-border bg-indigo-500/5">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 shrink-0">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-indigo-400 font-medium mb-1">AI Summary & Recommendation</p>
                <p className="text-sm">{selectedTicket.aiSummary}</p>
              </div>
            </div>
          </div>

          {/* Conversation */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium shrink-0">
                {selectedTicket.customer.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{selectedTicket.customer}</span>
                  <span className="text-xs text-muted-foreground">{selectedTicket.created}</span>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm">
                    Hi, I'm facing an issue with {selectedTicket.subject.toLowerCase()}. 
                    This is urgent as it's affecting our team's productivity. Please help!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <div className="flex-1 max-w-[80%]">
                <div className="flex items-center gap-2 mb-1 justify-end">
                  <span className="text-xs text-muted-foreground">2 min later</span>
                  <span className="font-medium text-sm">Support Team</span>
                </div>
                <div className="p-3 rounded-lg bg-indigo-500/10">
                  <p className="text-sm">
                    Hi {selectedTicket.customer.split(" ")[0]}, thank you for reaching out! 
                    We understand the urgency and are looking into this right away. 
                    I'll get back to you within the next 30 minutes with an update.
                  </p>
                </div>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-medium shrink-0">
                {selectedTicket.assignee}
              </div>
            </div>
          </div>

          {/* Reply Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your reply..."
                className="flex-1 bg-muted border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
                <MessageSquare className="h-4 w-4 mr-2" />
                Reply
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
