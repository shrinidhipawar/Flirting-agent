import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Clock, CheckCircle, AlertTriangle, Users, MessageSquare, ThumbsUp, Target, Zap, Globe, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const ticketTrendData = [
  { day: "Mon", tickets: 145, resolved: 138, aiHandled: 125 },
  { day: "Tue", tickets: 178, resolved: 170, aiHandled: 155 },
  { day: "Wed", tickets: 156, resolved: 152, aiHandled: 140 },
  { day: "Thu", tickets: 198, resolved: 190, aiHandled: 175 },
  { day: "Fri", tickets: 167, resolved: 165, aiHandled: 150 },
  { day: "Sat", tickets: 89, resolved: 87, aiHandled: 82 },
  { day: "Sun", tickets: 67, resolved: 65, aiHandled: 60 },
];

const channelDistribution = [
  { name: "WhatsApp", value: 35, color: "#25D366" },
  { name: "Email", value: 28, color: "#3B82F6" },
  { name: "Web Chat", value: 22, color: "#8B5CF6" },
  { name: "Instagram", value: 10, color: "#E1306C" },
  { name: "Voice", value: 5, color: "#06B6D4" },
];

const intentBreakdown = [
  { intent: "Order Tracking", count: 456, trend: "+12%" },
  { intent: "Refund Request", count: 234, trend: "-5%" },
  { intent: "Billing Query", count: 189, trend: "+8%" },
  { intent: "Product Inquiry", count: 167, trend: "+15%" },
  { intent: "Complaint", count: 89, trend: "-18%" },
  { intent: "Account Help", count: 78, trend: "+3%" },
];

const csatTrend = [
  { week: "W1", score: 4.2 },
  { week: "W2", score: 4.3 },
  { week: "W3", score: 4.4 },
  { week: "W4", score: 4.5 },
  { week: "W5", score: 4.6 },
  { week: "W6", score: 4.7 },
];

export function SupportInsights() {
  const [timeRange, setTimeRange] = useState("7d");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">AI Support Insights</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Tickets</p>
                <p className="text-2xl font-bold mt-1">1,234</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+15%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary/20">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">AI Resolution</p>
                <p className="text-2xl font-bold mt-1">89%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+5%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/20">
                <Zap className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold mt-1">12s</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">-8s</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-secondary/20">
                <Clock className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">CSAT Score</p>
                <p className="text-2xl font-bold mt-1">4.7/5</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+0.2</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <ThumbsUp className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-cyan-500/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cost Saved</p>
                <p className="text-2xl font-bold mt-1">₹2.4L</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+22%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Target className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket Trend */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Ticket Volume & Resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ticketTrendData}>
                  <defs>
                    <linearGradient id="ticketGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Area type="monotone" dataKey="tickets" stroke="hsl(var(--primary))" fill="url(#ticketGrad)" name="Total" />
                  <Area type="monotone" dataKey="aiHandled" stroke="#10b981" fill="url(#aiGrad)" name="AI Handled" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="h-4 w-4 text-secondary" />
              Channel Mix
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {channelDistribution.map((ch, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                    <span className="text-muted-foreground">{ch.name}</span>
                  </div>
                  <span className="font-medium">{ch.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Intent & CSAT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Intent Breakdown */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Top Customer Intents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {intentBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-32 text-sm font-medium truncate">{item.intent}</div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                      style={{ width: `${(item.count / 456) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm font-medium">{item.count}</div>
                  <Badge 
                    variant="outline" 
                    className={`w-14 justify-center ${
                      item.trend.startsWith("+") ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {item.trend}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CSAT Trend */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ThumbsUp className="h-4 w-4 text-yellow-400" />
              CSAT Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={csatTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis domain={[4, 5]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                  <Line type="monotone" dataKey="score" stroke="#eab308" strokeWidth={2} dot={{ fill: "#eab308" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around mt-4 pt-4 border-t border-border/50">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">NPS Score</p>
                <p className="text-xl font-bold text-green-400">+72</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">First Response</p>
                <p className="text-xl font-bold">12s</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Resolution Time</p>
                <p className="text-xl font-bold">2.4m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendations */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            AI Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
              <CheckCircle className="h-5 w-5 text-green-400 mb-2" />
              <h4 className="font-medium">High Performance</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Complaint tickets down 18% this week. Current escalation protocols working well.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mb-2" />
              <h4 className="font-medium">Add FAQ</h4>
              <p className="text-sm text-muted-foreground mt-1">
                34 tickets about "shipping to rural areas" - consider adding to knowledge base.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
              <TrendingUp className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-medium">Opportunity</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Product inquiry tickets up 15%. Cross-sell potential detected in 45% of cases.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
