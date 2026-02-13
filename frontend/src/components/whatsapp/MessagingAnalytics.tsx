import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Clock,
  TrendingUp,
  Users,
  Target,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface MessagingAnalyticsProps {
  platform: "whatsapp" | "telegram";
}

// Mock data for analytics
const responseTimeData = [
  { day: "Mon", whatsapp: 1.2, telegram: 0.8 },
  { day: "Tue", whatsapp: 1.5, telegram: 1.0 },
  { day: "Wed", whatsapp: 0.9, telegram: 0.7 },
  { day: "Thu", whatsapp: 1.1, telegram: 0.9 },
  { day: "Fri", whatsapp: 1.3, telegram: 0.8 },
  { day: "Sat", whatsapp: 2.0, telegram: 1.5 },
  { day: "Sun", whatsapp: 1.8, telegram: 1.2 },
];

const leadScoreDistribution = [
  { range: "0-25", count: 12, label: "Cold" },
  { range: "26-50", count: 28, label: "Warm" },
  { range: "51-75", count: 45, label: "Hot" },
  { range: "76-100", count: 35, label: "Qualified" },
];

const conversionFunnelData = [
  { stage: "Conversations", whatsapp: 450, telegram: 320 },
  { stage: "Engaged", whatsapp: 380, telegram: 275 },
  { stage: "Qualified", whatsapp: 220, telegram: 165 },
  { stage: "Proposals", whatsapp: 120, telegram: 95 },
  { stage: "Converted", whatsapp: 65, telegram: 52 },
];

const conversionBySource = [
  { name: "Direct", value: 35, color: "#10b981" },
  { name: "Referral", value: 25, color: "#0ea5e9" },
  { name: "Ads", value: 22, color: "#8b5cf6" },
  { name: "Organic", value: 18, color: "#f59e0b" },
];

export function MessagingAnalytics({ platform }: MessagingAnalyticsProps) {
  const accentColor = platform === "whatsapp" ? "#10b981" : "#0ea5e9";
  const gradientId = platform === "whatsapp" ? "whatsappGradient" : "telegramGradient";

  const stats = {
    whatsapp: {
      avgResponseTime: "1.2 min",
      responseChange: 15,
      avgLeadScore: 68,
      scoreChange: 8,
      conversionRate: "14.4%",
      conversionChange: 12,
      totalConversations: 450,
      conversationChange: 23,
    },
    telegram: {
      avgResponseTime: "0.9 min",
      responseChange: 22,
      avgLeadScore: 72,
      scoreChange: 5,
      conversionRate: "16.2%",
      conversionChange: 18,
      totalConversations: 320,
      conversationChange: 31,
    },
  };

  const currentStats = stats[platform];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold mt-1">{currentStats.avgResponseTime}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">-{currentStats.responseChange}%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                platform === "whatsapp" ? "bg-emerald-500/10" : "bg-sky-500/10"
              )}>
                <Clock className={cn(
                  "h-6 w-6",
                  platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Lead Score</p>
                <p className="text-2xl font-bold mt-1">{currentStats.avgLeadScore}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">+{currentStats.scoreChange}%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                platform === "whatsapp" ? "bg-emerald-500/10" : "bg-sky-500/10"
              )}>
                <Target className={cn(
                  "h-6 w-6",
                  platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold mt-1">{currentStats.conversionRate}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">+{currentStats.conversionChange}%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                platform === "whatsapp" ? "bg-emerald-500/10" : "bg-sky-500/10"
              )}>
                <TrendingUp className={cn(
                  "h-6 w-6",
                  platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Conversations</p>
                <p className="text-2xl font-bold mt-1">{currentStats.totalConversations}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                  <span className="text-xs text-emerald-500">+{currentStats.conversationChange}%</span>
                  <span className="text-xs text-muted-foreground">vs last week</span>
                </div>
              </div>
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl",
                platform === "whatsapp" ? "bg-emerald-500/10" : "bg-sky-500/10"
              )}>
                <MessageSquare className={cn(
                  "h-6 w-6",
                  platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
                )} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Chart */}
        <Card className="glass border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Zap className={cn(
                "h-4 w-4",
                platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
              )} />
              Response Time Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={responseTimeData}>
                  <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="day" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} unit=" min" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={platform}
                    stroke={accentColor}
                    fill={`url(#${gradientId})`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Lead Score Distribution */}
        <Card className="glass border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Users className={cn(
                "h-4 w-4",
                platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
              )} />
              Lead Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadScoreDistribution}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis dataKey="label" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey="count" fill={accentColor} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="glass border-border/50 lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className={cn(
                "h-4 w-4",
                platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
              )} />
              Conversion Funnel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border/30" />
                  <XAxis type="number" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="stage" type="category" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Bar dataKey={platform} fill={accentColor} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Conversion by Source */}
        <Card className="glass border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <Target className={cn(
                "h-4 w-4",
                platform === "whatsapp" ? "text-emerald-500" : "text-sky-500"
              )} />
              Conversion Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={conversionBySource}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {conversionBySource.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}