import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  ThumbsUp,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ticketVolumeData = [
  { day: "Mon", tickets: 45, resolved: 42 },
  { day: "Tue", tickets: 52, resolved: 48 },
  { day: "Wed", tickets: 38, resolved: 38 },
  { day: "Thu", tickets: 65, resolved: 60 },
  { day: "Fri", tickets: 58, resolved: 55 },
  { day: "Sat", tickets: 32, resolved: 30 },
  { day: "Sun", tickets: 28, resolved: 27 },
];

const categoryData = [
  { name: "Orders", value: 35, color: "#3b82f6" },
  { name: "Refunds", value: 25, color: "#ef4444" },
  { name: "Technical", value: 20, color: "#8b5cf6" },
  { name: "Billing", value: 12, color: "#f97316" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const channelData = [
  { channel: "WhatsApp", tickets: 120, percentage: 38 },
  { channel: "Email", tickets: 85, percentage: 27 },
  { channel: "Website", tickets: 65, percentage: 21 },
  { channel: "Instagram", tickets: 45, percentage: 14 },
];

const topIssues = [
  { issue: "Order delivery delays", count: 45, trend: "up", change: "+12%" },
  { issue: "Refund processing", count: 32, trend: "down", change: "-5%" },
  { issue: "Payment failures", count: 28, trend: "up", change: "+8%" },
  { issue: "Wrong item received", count: 22, trend: "down", change: "-15%" },
  { issue: "Account access issues", count: 18, trend: "stable", change: "0%" },
];

export function SupportAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Support Analytics</h2>
        <p className="text-muted-foreground">
          Real-time insights and performance metrics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">2.4 min</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>-18% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold">94.2%</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+3.5% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Resolution</p>
                <p className="text-2xl font-bold">78%</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Bot className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CSAT Score</p>
                <p className="text-2xl font-bold">4.7/5</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+0.2 vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <ThumbsUp className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Ticket Volume Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Ticket Volume & Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ticketVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="tickets"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="resolved"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                <span className="text-sm text-muted-foreground">Tickets</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Resolved</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Issues by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Tickets by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="channel" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="tickets" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Issues */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Top Issues This Week
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topIssues.map((issue, i) => (
              <div
                key={issue.issue}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-muted-foreground">
                    #{i + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm">{issue.issue}</p>
                    <p className="text-xs text-muted-foreground">
                      {issue.count} tickets
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    issue.trend === "up"
                      ? "destructive"
                      : issue.trend === "down"
                      ? "secondary"
                      : "outline"
                  }
                  className="text-xs"
                >
                  {issue.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : issue.trend === "down" ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : null}
                  {issue.change}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
