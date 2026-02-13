import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Plus,
  Mail,
  Phone,
  MessageSquare,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Star,
  ChevronDown,
} from "lucide-react";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
  stage: "new" | "contacted" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
  score: number;
  value: string;
  lastActivity: string;
  assignee: string;
}

const leads: Lead[] = [
  { id: "1", name: "Priya Sharma", email: "priya@techcorp.com", phone: "+91 98765 43210", company: "TechCorp", source: "Meta Ads", stage: "qualified", score: 92, value: "₹4,50,000", lastActivity: "2 hours ago", assignee: "AS" },
  { id: "2", name: "Rajesh Kumar", email: "rajesh@startup.io", phone: "+91 87654 32109", company: "StartupX", source: "Website", stage: "proposal", score: 85, value: "₹2,80,000", lastActivity: "5 hours ago", assignee: "MK" },
  { id: "3", name: "Ananya Patel", email: "ananya@enterprise.com", phone: "+91 76543 21098", company: "Enterprise Inc", source: "LinkedIn", stage: "negotiation", score: 78, value: "₹8,50,000", lastActivity: "1 day ago", assignee: "AS" },
  { id: "4", name: "Vikram Singh", email: "vikram@globalsol.com", phone: "+91 65432 10987", company: "Global Solutions", source: "Referral", stage: "new", score: 45, value: "₹1,20,000", lastActivity: "3 days ago", assignee: "PJ" },
  { id: "5", name: "Meera Reddy", email: "meera@innovate.tech", phone: "+91 54321 09876", company: "Innovate Tech", source: "WhatsApp", stage: "contacted", score: 68, value: "₹3,20,000", lastActivity: "6 hours ago", assignee: "MK" },
  { id: "6", name: "Arjun Nair", email: "arjun@digitalwave.in", phone: "+91 43210 98765", company: "Digital Wave", source: "Meta Ads", stage: "won", score: 100, value: "₹5,80,000", lastActivity: "2 days ago", assignee: "AS" },
];

const stageColors: Record<string, string> = {
  new: "bg-blue-500/20 text-blue-400",
  contacted: "bg-violet-500/20 text-violet-400",
  qualified: "bg-amber-500/20 text-amber-400",
  proposal: "bg-orange-500/20 text-orange-400",
  negotiation: "bg-pink-500/20 text-pink-400",
  won: "bg-emerald-500/20 text-emerald-400",
  lost: "bg-red-500/20 text-red-400",
};

const sourceColors: Record<string, string> = {
  "Meta Ads": "bg-blue-500/10 text-blue-400",
  Website: "bg-primary/10 text-primary",
  LinkedIn: "bg-sky-500/10 text-sky-400",
  Referral: "bg-emerald-500/10 text-emerald-400",
  WhatsApp: "bg-emerald-500/10 text-emerald-400",
};

export function LeadTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedLeads((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  };

  const filteredLeads = leads.filter((lead) =>
    lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl bg-muted border border-border pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-10 p-4">
                  <input type="checkbox" className="rounded border-border" />
                </th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Lead</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Source</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Stage</th>
                <th className="text-center p-4 text-sm text-muted-foreground font-medium">Score</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">Value</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Last Activity</th>
                <th className="w-20 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedLeads.includes(lead.id)}
                      onChange={() => toggleSelect(lead.id)}
                      className="rounded border-border"
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-medium">
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-xs px-2 py-1 rounded", sourceColors[lead.source])}>
                      {lead.source}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full capitalize", stageColors[lead.stage])}>
                      {lead.stage}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <div
                        className={cn(
                          "text-sm font-bold",
                          lead.score >= 80 ? "text-emerald-400" : lead.score >= 50 ? "text-amber-400" : "text-red-400"
                        )}
                      >
                        {lead.score}
                      </div>
                      {lead.score >= 80 ? (
                        <TrendingUp className="h-3 w-3 text-emerald-400" />
                      ) : lead.score < 50 ? (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      ) : null}
                    </div>
                  </td>
                  <td className="p-4 text-right font-medium">{lead.value}</td>
                  <td className="p-4 text-sm text-muted-foreground">{lead.lastActivity}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded hover:bg-muted">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button className="p-1.5 rounded hover:bg-muted">
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
