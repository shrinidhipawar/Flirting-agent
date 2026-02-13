import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Eye, MousePointer, ShoppingCart, ArrowUpRight } from "lucide-react";

interface CampaignMetric {
  id: string;
  name: string;
  platform: string;
  status: "active" | "paused" | "ended";
  spend: string;
  impressions: string;
  clicks: string;
  conversions: number;
  ctr: string;
  roas: string;
  trend: "up" | "down" | "neutral";
}

const campaigns: CampaignMetric[] = [
  {
    id: "1",
    name: "Summer Sale Campaign",
    platform: "Meta",
    status: "active",
    spend: "₹45,230",
    impressions: "1.2M",
    clicks: "38.4K",
    conversions: 842,
    ctr: "3.2%",
    roas: "4.8x",
    trend: "up",
  },
  {
    id: "2",
    name: "Brand Awareness - Q4",
    platform: "Google",
    status: "active",
    spend: "₹28,500",
    impressions: "890K",
    clicks: "22.1K",
    conversions: 156,
    ctr: "2.5%",
    roas: "3.2x",
    trend: "up",
  },
  {
    id: "3",
    name: "Lead Gen - Enterprise",
    platform: "LinkedIn",
    status: "active",
    spend: "₹52,000",
    impressions: "245K",
    clicks: "8.2K",
    conversions: 89,
    ctr: "3.3%",
    roas: "5.6x",
    trend: "up",
  },
  {
    id: "4",
    name: "Product Launch",
    platform: "TikTok",
    status: "paused",
    spend: "₹18,200",
    impressions: "2.1M",
    clicks: "52.3K",
    conversions: 234,
    ctr: "2.5%",
    roas: "2.8x",
    trend: "down",
  },
];

const overallMetrics = [
  { label: "Total Spend", value: "₹1,43,930", icon: DollarSign, change: "+12%", positive: true },
  { label: "Total Impressions", value: "4.4M", icon: Eye, change: "+28%", positive: true },
  { label: "Total Clicks", value: "121K", icon: MousePointer, change: "+15%", positive: true },
  { label: "Total Conversions", value: "1,321", icon: ShoppingCart, change: "+22%", positive: true },
];

const platformColors: Record<string, string> = {
  Meta: "bg-blue-500/20 text-blue-400",
  Google: "bg-red-500/20 text-red-400",
  LinkedIn: "bg-sky-500/20 text-sky-400",
  TikTok: "bg-pink-500/20 text-pink-400",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  paused: "bg-amber-500/20 text-amber-400",
  ended: "bg-muted text-muted-foreground",
};

export function CampaignPerformance() {
  return (
    <div className="space-y-6">
      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallMetrics.map((metric, index) => (
          <div
            key={metric.label}
            className="glass rounded-xl p-4 animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold mt-1">{metric.value}</p>
                <div className={cn(
                  "flex items-center gap-1 text-xs mt-1",
                  metric.positive ? "text-emerald-400" : "text-red-400"
                )}>
                  {metric.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {metric.change}
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <metric.icon className="h-5 w-5 text-orange-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign Table */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Active Campaigns</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Campaign</th>
                <th className="text-left p-4 text-sm text-muted-foreground font-medium">Status</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">Spend</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">Impressions</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">Clicks</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">CTR</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">ROAS</th>
                <th className="text-right p-4 text-sm text-muted-foreground font-medium">Trend</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{campaign.name}</p>
                      <span className={cn("text-xs px-2 py-0.5 rounded", platformColors[campaign.platform])}>
                        {campaign.platform}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn("text-xs px-2 py-1 rounded-full capitalize", statusColors[campaign.status])}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="p-4 text-right font-medium">{campaign.spend}</td>
                  <td className="p-4 text-right">{campaign.impressions}</td>
                  <td className="p-4 text-right">{campaign.clicks}</td>
                  <td className="p-4 text-right text-orange-400">{campaign.ctr}</td>
                  <td className="p-4 text-right font-medium text-emerald-400">{campaign.roas}</td>
                  <td className="p-4 text-right">
                    {campaign.trend === "up" ? (
                      <TrendingUp className="h-4 w-4 text-emerald-400 ml-auto" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-400 ml-auto" />
                    )}
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
