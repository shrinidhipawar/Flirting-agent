import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Users, Eye, Heart, MessageCircle } from "lucide-react";

interface MetricData {
  label: string;
  value: string;
  change: number;
  icon: React.ElementType;
}

const metrics: MetricData[] = [
  { label: "Total Reach", value: "2.4M", change: 12.5, icon: Eye },
  { label: "Followers", value: "260.4K", change: 8.3, icon: Users },
  { label: "Engagement", value: "145.2K", change: -2.1, icon: Heart },
  { label: "Comments", value: "23.8K", change: 15.7, icon: MessageCircle },
];

const chartData = [
  { day: "Mon", value: 65 },
  { day: "Tue", value: 78 },
  { day: "Wed", value: 82 },
  { day: "Thu", value: 70 },
  { day: "Fri", value: 95 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 72 },
];

export function AnalyticsPreview() {
  const maxValue = Math.max(...chartData.map((d) => d.value));

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Analytics Overview</h2>
          <p className="text-sm text-muted-foreground">Last 7 days performance</p>
        </div>
        <select className="bg-muted border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          <option>Last 7 days</option>
          <option>Last 30 days</option>
          <option>Last 90 days</option>
        </select>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {metrics.map((metric, index) => (
          <div
            key={metric.label}
            className="rounded-xl bg-muted/50 p-4"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">{metric.label}</span>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <div
              className={cn(
                "flex items-center gap-1 text-xs mt-1",
                metric.change >= 0 ? "text-emerald-400" : "text-red-400"
              )}
            >
              {metric.change >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(metric.change)}%
            </div>
          </div>
        ))}
      </div>

      {/* Simple Bar Chart */}
      <div className="rounded-xl bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground mb-4">Engagement Trend</p>
        <div className="flex items-end justify-between gap-2 h-40">
          {chartData.map((data, index) => (
            <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-gradient-to-t from-primary to-secondary transition-all duration-500 hover:opacity-80"
                style={{
                  height: `${(data.value / maxValue) * 100}%`,
                  animationDelay: `${index * 100}ms`,
                }}
              />
              <span className="text-xs text-muted-foreground">{data.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
