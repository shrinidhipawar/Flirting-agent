import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PipelineLead {
  id: string;
  name: string;
  company: string;
  value: string;
  score: number;
  daysInStage: number;
}

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  leads: PipelineLead[];
  totalValue: string;
}

const pipelineStages: PipelineStage[] = [
  {
    id: "new",
    name: "New Leads",
    color: "from-blue-500 to-blue-600",
    totalValue: "₹18.5L",
    leads: [
      { id: "1", name: "Vikram Singh", company: "Global Solutions", value: "₹1.2L", score: 45, daysInStage: 3 },
      { id: "2", name: "Neha Gupta", company: "TechStart", value: "₹2.8L", score: 52, daysInStage: 1 },
      { id: "3", name: "Rohit Jain", company: "FastGrow", value: "₹3.5L", score: 38, daysInStage: 5 },
    ],
  },
  {
    id: "contacted",
    name: "Contacted",
    color: "from-violet-500 to-violet-600",
    totalValue: "₹24.2L",
    leads: [
      { id: "4", name: "Meera Reddy", company: "Innovate Tech", value: "₹3.2L", score: 68, daysInStage: 2 },
      { id: "5", name: "Sanjay Patel", company: "CloudNine", value: "₹4.5L", score: 71, daysInStage: 4 },
    ],
  },
  {
    id: "qualified",
    name: "Qualified",
    color: "from-amber-500 to-amber-600",
    totalValue: "₹32.8L",
    leads: [
      { id: "6", name: "Priya Sharma", company: "TechCorp", value: "₹4.5L", score: 92, daysInStage: 3 },
      { id: "7", name: "Arun Krishnan", company: "DataDrive", value: "₹6.2L", score: 85, daysInStage: 1 },
    ],
  },
  {
    id: "proposal",
    name: "Proposal Sent",
    color: "from-orange-500 to-orange-600",
    totalValue: "₹42.5L",
    leads: [
      { id: "8", name: "Rajesh Kumar", company: "StartupX", value: "₹2.8L", score: 85, daysInStage: 2 },
      { id: "9", name: "Kavitha Rao", company: "ScaleUp", value: "₹7.8L", score: 79, daysInStage: 5 },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    color: "from-pink-500 to-pink-600",
    totalValue: "₹58.2L",
    leads: [
      { id: "10", name: "Ananya Patel", company: "Enterprise Inc", value: "₹8.5L", score: 78, daysInStage: 4 },
    ],
  },
  {
    id: "won",
    name: "Won",
    color: "from-emerald-500 to-emerald-600",
    totalValue: "₹1.24Cr",
    leads: [
      { id: "11", name: "Arjun Nair", company: "Digital Wave", value: "₹5.8L", score: 100, daysInStage: 0 },
      { id: "12", name: "Deepa Menon", company: "GrowthLab", value: "₹9.2L", score: 100, daysInStage: 0 },
    ],
  },
];

export function PipelineView() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Sales Pipeline</h2>
          <p className="text-sm text-muted-foreground">Drag leads across stages to update their status</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90">
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Pipeline Board */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {pipelineStages.map((stage) => (
          <div
            key={stage.id}
            className="flex-shrink-0 w-72 glass rounded-xl overflow-hidden"
          >
            {/* Stage Header */}
            <div className={cn("p-4 bg-gradient-to-r", stage.color)}>
              <div className="flex items-center justify-between text-white">
                <div>
                  <h3 className="font-medium">{stage.name}</h3>
                  <p className="text-sm text-white/80">{stage.leads.length} leads • {stage.totalValue}</p>
                </div>
                <button className="p-1 rounded hover:bg-white/20">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Leads */}
            <div className="p-3 space-y-3 max-h-[500px] overflow-y-auto">
              {stage.leads.map((lead) => (
                <div
                  key={lead.id}
                  className="bg-muted/50 rounded-lg p-3 cursor-grab hover:bg-muted transition-colors group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-400 text-xs font-medium">
                        {lead.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{lead.name}</p>
                        <p className="text-xs text-muted-foreground">{lead.company}</p>
                      </div>
                    </div>
                    <button className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-background">
                      <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-indigo-400">{lead.value}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            lead.score >= 80 ? "bg-emerald-400" : lead.score >= 50 ? "bg-amber-400" : "bg-red-400"
                          )}
                        />
                        <span className="text-xs text-muted-foreground">{lead.score}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{lead.daysInStage}d</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add Lead Button */}
              <button className="w-full p-2 rounded-lg border border-dashed border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors text-sm text-muted-foreground hover:text-indigo-400">
                + Add lead
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
