import { cn } from "@/lib/utils";
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface PipelineStage {
  id: string;
  name: string;
  count: number;
  value: string;
  color: string;
}

const pipelineStages: PipelineStage[] = [
  { id: "new", name: "New Leads", count: 24, value: "₹12L", color: "from-blue-500 to-blue-600" },
  { id: "qualified", name: "Qualified", count: 18, value: "₹28L", color: "from-violet-500 to-violet-600" },
  { id: "proposal", name: "Proposal Sent", count: 12, value: "₹42L", color: "from-amber-500 to-amber-600" },
  { id: "negotiation", name: "Negotiation", count: 8, value: "₹36L", color: "from-orange-500 to-orange-600" },
  { id: "won", name: "Won", count: 5, value: "₹18L", color: "from-emerald-500 to-emerald-600" },
];

const stats = [
  { label: "Total Leads", value: "67", change: "+12%", positive: true, icon: Users },
  { label: "Pipeline Value", value: "₹1.36Cr", change: "+23%", positive: true, icon: DollarSign },
  { label: "Conversion Rate", value: "28%", change: "+5%", positive: true, icon: Target },
  { label: "Avg. Deal Size", value: "₹4.5L", change: "-2%", positive: false, icon: TrendingUp },
];

export function SalesPipeline() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="glass rounded-xl p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs mt-1",
                  stat.positive ? "text-emerald-400" : "text-red-400"
                )}>
                  {stat.positive ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Visualization */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-6">Sales Pipeline</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {pipelineStages.map((stage, index) => (
            <div
              key={stage.id}
              className="flex-1 min-w-[180px] animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={cn(
                "rounded-xl p-4 bg-gradient-to-br text-white",
                stage.color
              )}>
                <p className="text-white/80 text-sm">{stage.name}</p>
                <p className="text-3xl font-bold mt-1">{stage.count}</p>
                <p className="text-white/70 text-sm mt-1">{stage.value}</p>
              </div>
              {index < pipelineStages.length - 1 && (
                <div className="hidden lg:flex items-center justify-center py-2">
                  <div className="w-8 h-0.5 bg-border" />
                  <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Sales Activity</h3>
        <div className="space-y-4">
          {[
            { action: "New lead captured", lead: "Anita Verma", time: "5 min ago", type: "new" },
            { action: "Proposal sent to", lead: "GlobalTech Solutions", time: "1 hour ago", type: "proposal" },
            { action: "Deal won!", lead: "Digital Dynamics", time: "3 hours ago", type: "won" },
            { action: "Meeting scheduled with", lead: "StartupX", time: "5 hours ago", type: "meeting" },
            { action: "Follow-up sent to", lead: "Enterprise Corp", time: "1 day ago", type: "followup" },
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
              <div className={cn(
                "h-2 w-2 rounded-full shrink-0",
                activity.type === "new" && "bg-blue-400",
                activity.type === "proposal" && "bg-amber-400",
                activity.type === "won" && "bg-emerald-400",
                activity.type === "meeting" && "bg-violet-400",
                activity.type === "followup" && "bg-primary"
              )} />
              <div className="flex-1 min-w-0">
                <p className="text-sm">
                  <span className="text-muted-foreground">{activity.action}</span>{" "}
                  <span className="font-medium">{activity.lead}</span>
                </p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
