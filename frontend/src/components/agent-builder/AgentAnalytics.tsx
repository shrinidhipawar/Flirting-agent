import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Bot, Zap, Target, DollarSign, Users, ArrowUpRight, ArrowDownRight, Download, RefreshCw } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { toast } from "sonner";

const performanceData = [
  { day: "Mon", tasks: 245, success: 232 },
  { day: "Tue", tasks: 312, success: 298 },
  { day: "Wed", tasks: 289, success: 275 },
  { day: "Thu", tasks: 356, success: 341 },
  { day: "Fri", tasks: 298, success: 289 },
  { day: "Sat", tasks: 189, success: 182 },
  { day: "Sun", tasks: 145, success: 140 },
];

const taskDistribution = [
  { name: "Emails Sent", value: 35, color: "#8b5cf6" },
  { name: "Messages Replied", value: 28, color: "#06b6d4" },
  { name: "CRM Updates", value: 22, color: "#10b981" },
  { name: "Reports Generated", value: 15, color: "#f59e0b" },
];

const initialAgentMetrics = [
  { id: "1", name: "Sales Agent", tasks: 456, accuracy: 94, savings: 12500, status: "active" },
  { id: "2", name: "Support Bot", tasks: 892, accuracy: 91, savings: 28000, status: "active" },
  { id: "3", name: "HR Assistant", tasks: 234, accuracy: 96, savings: 8500, status: "active" },
  { id: "4", name: "Marketing Agent", tasks: 345, accuracy: 89, savings: 15000, status: "paused" },
];

export function AgentAnalytics() {
  const [agentMetrics, setAgentMetrics] = useState(initialAgentMetrics);
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const totalTasks = performanceData.reduce((acc, d) => acc + d.tasks, 0);
  const totalSuccess = performanceData.reduce((acc, d) => acc + d.success, 0);
  const successRate = Math.round((totalSuccess / totalTasks) * 100);
  const totalSavings = agentMetrics.reduce((acc, a) => acc + a.savings, 0);

  const refreshData = () => {
    setIsRefreshing(true);
    toast.info("Refreshing analytics data...");
    
    setTimeout(() => {
      setAgentMetrics(prev => prev.map(agent => ({
        ...agent,
        tasks: agent.tasks + Math.floor(Math.random() * 50),
        accuracy: Math.min(99, agent.accuracy + Math.floor(Math.random() * 3)),
        savings: agent.savings + Math.floor(Math.random() * 1000),
      })));
      setIsRefreshing(false);
      toast.success("Analytics data refreshed");
    }, 1500);
  };

  const exportReport = () => {
    const report = {
      generatedAt: new Date().toISOString(),
      timeRange,
      summary: {
        totalTasks,
        successRate,
        totalSavings,
      },
      agents: agentMetrics,
      dailyPerformance: performanceData,
      taskDistribution,
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-analytics-${timeRange}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report exported successfully");
  };

  const viewAgentDetails = (agentId: string) => {
    const agent = agentMetrics.find(a => a.id === agentId);
    if (agent) {
      toast.info(`Viewing ${agent.name} details`, {
        description: `${agent.tasks} tasks completed with ${agent.accuracy}% accuracy`,
      });
    }
  };

  const toggleAgentStatus = (agentId: string) => {
    setAgentMetrics(prev => prev.map(agent => {
      if (agent.id === agentId) {
        const newStatus = agent.status === "active" ? "paused" : "active";
        toast.success(`${agent.name} ${newStatus === "active" ? "activated" : "paused"}`);
        return { ...agent, status: newStatus };
      }
      return agent;
    }));
  };

  const applyImprovement = (improvementType: string) => {
    toast.success(`Improvement applied: ${improvementType}`, {
      description: "Changes will take effect in the next cycle",
    });
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold mt-1">{totalTasks.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+23%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-primary/20">
                <Zap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold mt-1">{successRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+2.1%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-green-500/20">
                <Target className="h-5 w-5 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Cost Savings</p>
                <p className="text-2xl font-bold mt-1">${(totalSavings / 1000).toFixed(1)}K</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">+18%</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-secondary/20">
                <DollarSign className="h-5 w-5 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold mt-1">1.4s</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowDownRight className="h-3 w-3 text-green-400" />
                  <span className="text-xs text-green-400">-0.3s</span>
                </div>
              </div>
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Weekly Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="taskGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }} 
                  />
                  <Area type="monotone" dataKey="tasks" stroke="hsl(var(--primary))" fill="url(#taskGradient)" />
                  <Area type="monotone" dataKey="success" stroke="hsl(var(--secondary))" fill="url(#successGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Task Distribution */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="text-base">Task Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {taskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {taskDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Leaderboard */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              Agent Performance Leaderboard
            </div>
            <Button size="sm" variant="outline" onClick={() => toast.info("Showing all agents")}>
              View All
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agentMetrics.map((agent, index) => (
              <div key={agent.id} className="flex items-center gap-4 p-4 rounded-xl bg-background/50">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                  index === 0 ? "bg-yellow-500/20 text-yellow-400" :
                  index === 1 ? "bg-gray-400/20 text-gray-400" :
                  index === 2 ? "bg-orange-500/20 text-orange-400" :
                  "bg-muted/20 text-muted-foreground"
                }`}>
                  #{index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{agent.name}</h4>
                      <Badge 
                        variant={agent.status === "active" ? "default" : "secondary"}
                        className="cursor-pointer"
                        onClick={() => toggleAgentStatus(agent.id)}
                      >
                        {agent.status}
                      </Badge>
                    </div>
                    <Badge variant="outline">{agent.tasks} tasks</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Accuracy</span>
                        <span className="text-green-400">{agent.accuracy}%</span>
                      </div>
                      <Progress value={agent.accuracy} className="h-1.5" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Savings</p>
                      <p className="font-medium text-green-400">${agent.savings.toLocaleString()}</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => viewAgentDetails(agent.id)}>
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            AI Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 cursor-pointer hover:bg-yellow-500/20 transition-colors"
              onClick={() => applyImprovement("Add pricing FAQ")}
            >
              <AlertTriangle className="h-5 w-5 text-yellow-400 mb-2" />
              <h4 className="font-medium">Escalation Pattern</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Support Bot escalates 12% of pricing questions. Consider adding pricing FAQ to knowledge base.
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-yellow-400">
                Apply Fix
              </Button>
            </div>
            <div 
              className="p-4 rounded-xl bg-green-500/10 border border-green-500/30 cursor-pointer hover:bg-green-500/20 transition-colors"
              onClick={() => applyImprovement("Clone HR workflow")}
            >
              <CheckCircle className="h-5 w-5 text-green-400 mb-2" />
              <h4 className="font-medium">High Performance</h4>
              <p className="text-sm text-muted-foreground mt-1">
                HR Assistant shows 96% accuracy. Consider cloning its workflow for similar use cases.
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-green-400">
                Clone Workflow
              </Button>
            </div>
            <div 
              className="p-4 rounded-xl bg-primary/10 border border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors"
              onClick={() => applyImprovement("Add competitor data")}
            >
              <Zap className="h-5 w-5 text-primary mb-2" />
              <h4 className="font-medium">Optimization</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Sales Agent could improve by 8% with additional competitor comparison data.
              </p>
              <Button size="sm" variant="ghost" className="mt-2 text-primary">
                Add Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}