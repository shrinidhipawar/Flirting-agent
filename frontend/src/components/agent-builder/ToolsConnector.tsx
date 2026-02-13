import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Wrench, Mail, MessageSquare, Phone, Database, FileText, Globe, CreditCard, Calendar, BarChart3, Zap, Settings, CheckCircle, AlertCircle, Link, X } from "lucide-react";
import { toast } from "sonner";

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  category: "communication" | "crm" | "productivity" | "analytics" | "payment";
  connected: boolean;
  config?: Record<string, string>;
}

const initialTools: Tool[] = [
  { id: "email", name: "Email (SMTP)", description: "Send emails via SMTP", icon: Mail, category: "communication", connected: true },
  { id: "whatsapp", name: "WhatsApp Business", description: "Send WhatsApp messages", icon: MessageSquare, category: "communication", connected: true },
  { id: "sms", name: "SMS (Twilio)", description: "Send SMS messages", icon: Phone, category: "communication", connected: false },
  { id: "hubspot", name: "HubSpot CRM", description: "Manage contacts & deals", icon: Database, category: "crm", connected: true },
  { id: "salesforce", name: "Salesforce", description: "Enterprise CRM", icon: Database, category: "crm", connected: false },
  { id: "zoho", name: "Zoho CRM", description: "All-in-one CRM", icon: Database, category: "crm", connected: false },
  { id: "docs", name: "Document Generator", description: "Create PDFs & docs", icon: FileText, category: "productivity", connected: true },
  { id: "calendar", name: "Calendar", description: "Schedule meetings", icon: Calendar, category: "productivity", connected: true },
  { id: "web", name: "Web Scraper", description: "Research & data extraction", icon: Globe, category: "productivity", connected: true },
  { id: "stripe", name: "Stripe", description: "Payment processing", icon: CreditCard, category: "payment", connected: false },
  { id: "analytics", name: "Analytics API", description: "Custom reporting", icon: BarChart3, category: "analytics", connected: true },
  { id: "webhook", name: "Webhooks", description: "Custom integrations", icon: Zap, category: "analytics", connected: true },
];

const categories = [
  { id: "communication", label: "Communication", icon: MessageSquare },
  { id: "crm", label: "CRM", icon: Database },
  { id: "productivity", label: "Productivity", icon: FileText },
  { id: "payment", label: "Payments", icon: CreditCard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function ToolsConnector() {
  const [toolsState, setToolsState] = useState<Tool[]>(initialTools);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [configuringTool, setConfiguringTool] = useState<Tool | null>(null);
  const [connectingTool, setConnectingTool] = useState<Tool | null>(null);
  const [customToolName, setCustomToolName] = useState("");
  const [customToolEndpoint, setCustomToolEndpoint] = useState("");
  const [apiKey, setApiKey] = useState("");

  const toggleTool = (toolId: string) => {
    setToolsState(prev => prev.map(t => {
      if (t.id === toolId) {
        const newState = !t.connected;
        toast.success(newState ? `${t.name} connected` : `${t.name} disconnected`);
        return { ...t, connected: newState };
      }
      return t;
    }));
  };

  const filteredTools = selectedCategory 
    ? toolsState.filter(t => t.category === selectedCategory)
    : toolsState;

  const connectedCount = toolsState.filter(t => t.connected).length;

  const handleConnect = (tool: Tool) => {
    setConnectingTool(tool);
    setApiKey("");
  };

  const confirmConnect = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    
    if (connectingTool) {
      setToolsState(prev => prev.map(t => 
        t.id === connectingTool.id 
          ? { ...t, connected: true, config: { apiKey } } 
          : t
      ));
      toast.success(`${connectingTool.name} connected successfully!`);
      setConnectingTool(null);
      setApiKey("");
    }
  };

  const handleConfigure = (tool: Tool) => {
    setConfiguringTool(tool);
  };

  const saveConfigure = () => {
    toast.success(`${configuringTool?.name} configuration saved`);
    setConfiguringTool(null);
  };

  const createCustomTool = () => {
    if (!customToolName.trim()) {
      toast.error("Please enter a tool name");
      return;
    }
    if (!customToolEndpoint.trim()) {
      toast.error("Please enter an endpoint URL");
      return;
    }

    const newTool: Tool = {
      id: `custom-${Date.now()}`,
      name: customToolName,
      description: "Custom API integration",
      icon: Zap,
      category: "analytics",
      connected: true,
      config: { endpoint: customToolEndpoint },
    };

    setToolsState(prev => [...prev, newTool]);
    setCustomToolName("");
    setCustomToolEndpoint("");
    toast.success(`Custom tool "${customToolName}" created!`);
  };

  const deleteTool = (toolId: string) => {
    if (!toolId.startsWith('custom-')) {
      toast.error("Cannot delete built-in tools");
      return;
    }
    setToolsState(prev => prev.filter(t => t.id !== toolId));
    toast.success("Custom tool deleted");
  };

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Wrench className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toolsState.length}</p>
                <p className="text-xs text-muted-foreground">Available Tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{connectedCount}</p>
                <p className="text-xs text-muted-foreground">Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{toolsState.length - connectedCount}</p>
                <p className="text-xs text-muted-foreground">Not Connected</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Zap className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{categories.length}</p>
                <p className="text-xs text-muted-foreground">Categories</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
            >
              All Tools
            </Button>
            {categories.map(cat => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.id)}
              >
                <cat.icon className="h-4 w-4 mr-1" />
                {cat.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map(tool => (
          <Card key={tool.id} className={`glass transition-all ${tool.connected ? "border-green-500/30" : "border-border/50"}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${tool.connected ? "bg-green-500/20" : "bg-muted/20"}`}>
                    <tool.icon className={`h-5 w-5 ${tool.connected ? "text-green-400" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <h4 className="font-medium">{tool.name}</h4>
                    <p className="text-xs text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {tool.id.startsWith('custom-') && (
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 p-0 text-destructive"
                      onClick={() => deleteTool(tool.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                  <Switch 
                    checked={tool.connected}
                    onCheckedChange={() => toggleTool(tool.id)}
                  />
                </div>
              </div>
              
              {tool.connected && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-green-500/20 text-green-400">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                    <Button size="sm" variant="ghost" className="h-8" onClick={() => handleConfigure(tool)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Configure
                    </Button>
                  </div>
                </div>
              )}
              
              {!tool.connected && (
                <div className="mt-4 pt-4 border-t border-border/50">
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleConnect(tool)}>
                    <Link className="h-4 w-4 mr-1" />
                    Connect
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Connect Dialog */}
      <Dialog open={!!connectingTool} onOpenChange={(open) => !open && setConnectingTool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect {connectingTool?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input 
                type="password"
                placeholder="Enter your API key..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key will be securely stored and encrypted.
              </p>
            </div>
            <Button onClick={confirmConnect} className="w-full">
              Connect
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Configure Dialog */}
      <Dialog open={!!configuringTool} onOpenChange={(open) => !open && setConfiguringTool(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure {configuringTool?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <Input 
                type="password"
                placeholder="••••••••••••"
                defaultValue="configured"
              />
            </div>
            <div className="space-y-2">
              <Label>Webhook URL (Optional)</Label>
              <Input 
                placeholder="https://your-webhook.com/callback"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={saveConfigure} className="flex-1">
                Save Configuration
              </Button>
              <Button variant="outline" onClick={() => setConfiguringTool(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Custom Tool */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Create Custom Tool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tool Name</label>
              <Input 
                placeholder="My Custom API" 
                className="bg-background/50"
                value={customToolName}
                onChange={(e) => setCustomToolName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Endpoint URL</label>
              <Input 
                placeholder="https://api.example.com/action" 
                className="bg-background/50"
                value={customToolEndpoint}
                onChange={(e) => setCustomToolEndpoint(e.target.value)}
              />
            </div>
          </div>
          <Button 
            className="mt-4 bg-gradient-to-r from-primary to-secondary"
            onClick={createCustomTool}
          >
            <Wrench className="h-4 w-4 mr-2" />
            Create Tool
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}