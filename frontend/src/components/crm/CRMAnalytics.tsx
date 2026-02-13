import { cn } from "@/lib/utils";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Clock,
  BarChart3,
  PieChart,
} from "lucide-react";

const stats = [
  { label: "Total Revenue", value: "₹1.86Cr", change: "+18%", positive: true, icon: DollarSign },
  { label: "Active Leads", value: "342", change: "+24%", positive: true, icon: Users },
  { label: "Conversion Rate", value: "32%", change: "+5%", positive: true, icon: Target },
  { label: "Avg. Close Time", value: "12 days", change: "-3 days", positive: true, icon: Clock },
];

const pipelineData = [
  { stage: "New", count: 45, value: "₹18.5L", percentage: 15 },
  { stage: "Contacted", count: 32, value: "₹24.2L", percentage: 20 },
  { stage: "Qualified", count: 28, value: "₹32.8L", percentage: 25 },
  { stage: "Proposal", count: 18, value: "₹42.5L", percentage: 18 },
  { stage: "Negotiation", count: 12, value: "₹58.2L", percentage: 12 },
  { stage: "Won", count: 8, value: "₹1.24Cr", percentage: 10 },
];

const teamPerformance = [
  { name: "Amit Shah", deals: 12, value: "₹45L", conversion: "38%" },
  { name: "Meera Kapoor", deals: 10, value: "₹38L", conversion: "35%" },
  { name: "Priya Joshi", deals: 8, value: "₹32L", conversion: "32%" },
  { name: "Rahul Dev", deals: 6, value: "₹24L", conversion: "28%" },
];

const recentActivity = [
  { action: "Deal Won", lead: "Digital Wave", value: "₹5.8L", time: "2 hours ago", type: "won" },
  { action: "Proposal Sent", lead: "TechCorp", value: "₹4.5L", time: "4 hours ago", type: "proposal" },
  { action: "Meeting Scheduled", lead: "StartupX", value: "₹2.8L", time: "5 hours ago", type: "meeting" },
  { action: "New Lead", lead: "FastGrow", value: "₹3.5L", time: "6 hours ago", type: "new" },
  { action: "Follow-up Sent", lead: "CloudNine", value: "₹4.5L", time: "8 hours ago", type: "followup" },
];

const activityColors = {
  won: "bg-emerald-500",
  proposal: "bg-orange-500",
  meeting: "bg-violet-500",
  new: "bg-blue-500",
  followup: "bg-primary",
};

export function CRMAnalytics() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
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
                  {stat.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {stat.change}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10">
                <stat.icon className="h-5 w-5 text-indigo-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Funnel */}
        <div className="lg:col-span-2 glass rounded-xl p-6">
          <h3 className="font-semibold mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Pipeline Overview
          </h3>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.stage} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{stage.stage}</span>
                    <span className="text-sm text-muted-foreground">{stage.count} leads</span>
                  </div>
                  <span className="font-medium text-indigo-400">{stage.value}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${stage.percentage * 4}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Performance */}
        <div className="glass rounded-xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-400" />
            Team Leaderboard
          </h3>
          <div className="space-y-4">
            {teamPerformance.map((member, index) => (
              <div
                key={member.name}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-sm font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.deals} deals • {member.conversion}</p>
                </div>
                <span className="font-medium text-indigo-400">{member.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="glass rounded-xl p-6">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("h-2 w-2 rounded-full shrink-0", activityColors[activity.type as keyof typeof activityColors])} />
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.action}</span>
                  {" - "}
                  <span className="text-muted-foreground">{activity.lead}</span>
                </p>
              </div>
              <span className="font-medium text-indigo-400">{activity.value}</span>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Forecast */}
      <div className="glass rounded-xl p-6 gradient-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
            <Target className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="font-semibold">AI Revenue Forecast</h3>
            <p className="text-sm text-muted-foreground">Based on current pipeline & historical data</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">This Week</p>
            <p className="text-2xl font-bold mt-1">₹12.5L</p>
            <p className="text-xs text-emerald-400 mt-1">85% confidence</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl font-bold mt-1">₹48.2L</p>
            <p className="text-xs text-emerald-400 mt-1">72% confidence</p>
          </div>
          <div className="p-4 rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">This Quarter</p>
            <p className="text-2xl font-bold mt-1">₹1.45Cr</p>
            <p className="text-xs text-amber-400 mt-1">65% confidence</p>
          </div>
        </div>
      </div>
    </div>
  );
}
