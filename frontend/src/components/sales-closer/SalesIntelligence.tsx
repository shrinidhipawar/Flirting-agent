import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Clock,
  MessageSquare,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
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

const conversionData = [
  { day: "Mon", leads: 24, conversions: 8 },
  { day: "Tue", leads: 32, conversions: 12 },
  { day: "Wed", leads: 28, conversions: 9 },
  { day: "Thu", leads: 45, conversions: 18 },
  { day: "Fri", leads: 38, conversions: 15 },
  { day: "Sat", leads: 22, conversions: 7 },
  { day: "Sun", leads: 18, conversions: 5 },
];

const objectionData = [
  { name: "Price", value: 35, color: "#ef4444" },
  { name: "Timing", value: 25, color: "#f97316" },
  { name: "Competition", value: 20, color: "#eab308" },
  { name: "Trust", value: 12, color: "#22c55e" },
  { name: "Other", value: 8, color: "#6b7280" },
];

const revenueData = [
  { month: "30 Days", actual: 12.5, predicted: 15.2 },
  { month: "60 Days", actual: null, predicted: 28.7 },
  { month: "90 Days", actual: null, predicted: 42.1 },
];

const topPerformers = [
  { name: "Amit Sharma", closed: 23, revenue: "₹8.2L", rate: 78 },
  { name: "Priya Patel", closed: 19, revenue: "₹6.8L", rate: 72 },
  { name: "Rahul Verma", closed: 17, revenue: "₹5.9L", rate: 68 },
];

export function SalesIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Sales Intelligence</h2>
        <p className="text-muted-foreground">
          Real-time analytics, predictions, and recommendations
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Leads</p>
                <p className="text-2xl font-bold">1,284</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+12.5% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-2xl font-bold">34.2%</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+5.8% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Target className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenue Closed</p>
                <p className="text-2xl font-bold">₹28.4L</p>
                <div className="flex items-center gap-1 text-green-500 text-xs mt-1">
                  <ArrowUpRight className="h-3 w-3" />
                  <span>+18.2% vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Close Time</p>
                <p className="text-2xl font-bold">4.2 days</p>
                <div className="flex items-center gap-1 text-red-500 text-xs mt-1">
                  <ArrowDownRight className="h-3 w-3" />
                  <span>+0.5 days vs last week</span>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Conversion Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm">Conversion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversionData}>
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
                    dataKey="leads"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="conversions"
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
                <span className="text-sm text-muted-foreground">Leads</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-muted-foreground">Conversions</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Objection Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Objection Map</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={objectionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {objectionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {objectionData.map((item) => (
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
        {/* Revenue Forecast */}
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              AI Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" fill="hsl(var(--primary)/0.3)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-background/50 rounded-lg">
              <p className="text-sm">
                <span className="font-medium text-primary">AI Prediction:</span>{" "}
                Based on current pipeline, expected to close{" "}
                <span className="font-bold">₹42.1L</span> in the next 90 days with{" "}
                <span className="font-bold">87% confidence</span>.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Top Closers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topPerformers.map((performer, i) => (
              <div
                key={performer.name}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                  #{i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{performer.name}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{performer.closed} closed</span>
                    <span>•</span>
                    <span>{performer.revenue}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">{performer.rate}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
