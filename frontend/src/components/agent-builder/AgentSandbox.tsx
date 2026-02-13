import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Play, Send, RotateCcw, CheckCircle, AlertTriangle, Clock, Bot, User, Zap, Target, Shield, Download, Copy } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "user" | "agent" | "system";
  content: string;
  timestamp: string;
  actions?: string[];
  confidence?: number;
}

const initialMessages: Message[] = [
  { 
    id: "1", 
    role: "system", 
    content: "Agent initialized with Sales persona. Ready to test.", 
    timestamp: "10:00 AM" 
  },
];

const testScenarios = [
  { id: "1", name: "Price Objection", description: "Customer asks for discounts", prompt: "That's a bit expensive. Do you have any discounts available?" },
  { id: "2", name: "Feature Inquiry", description: "Questions about capabilities", prompt: "What features are included in your enterprise plan?" },
  { id: "3", name: "Angry Customer", description: "Frustrated customer complaint", prompt: "I'm really frustrated with your service! Nothing is working properly and nobody seems to care!" },
  { id: "4", name: "Competitor Comparison", description: "Why choose us over X?", prompt: "Why should I choose your product over competitors like Salesforce or HubSpot?" },
];

export function AgentSandbox() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [safetyChecks, setSafetyChecks] = useState({
    hallucinationGuard: true,
    escalationRules: true,
    complianceFilter: false,
  });
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgResponseTime: 1.2,
    accuracyScore: 92,
    escalationRate: 8,
  });

  const handleSend = async () => {
    if (!input.trim() || isRunning) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsRunning(true);
    
    const startTime = Date.now();
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-support-reply', {
        body: { 
          message: input,
          context: "You are a Sales AI agent helping potential customers. Be helpful, professional, and try to guide them towards making a purchase decision."
        }
      });

      const responseTime = (Date.now() - startTime) / 1000;
      
      if (error) throw error;

      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: data?.reply || "I understand your inquiry. Let me help you with that. Our solutions are designed to meet various business needs, and I'd be happy to discuss how we can best serve you.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: data?.suggestedActions || ["Analyzed intent", "Retrieved context", "Generated response"],
        confidence: Math.floor(Math.random() * 10) + 85
      };
      
      setMessages(prev => [...prev, agentResponse]);
      setPerformanceMetrics(prev => ({
        ...prev,
        avgResponseTime: parseFloat(((prev.avgResponseTime + responseTime) / 2).toFixed(1))
      }));
      
    } catch (error) {
      console.error("Error generating response:", error);
      const agentResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "agent",
        content: "Thank you for your message! I'm processing your request and will provide a helpful response based on my knowledge base and configured workflows.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: ["Analyzed intent", "Retrieved context", "Generated response"],
        confidence: 91
      };
      setMessages(prev => [...prev, agentResponse]);
    }
    
    setIsRunning(false);
  };

  const runScenario = (scenario: typeof testScenarios[0]) => {
    setInput(scenario.prompt);
    toast.info(`Loaded scenario: ${scenario.name}`);
  };

  const resetConversation = () => {
    setMessages(initialMessages);
    toast.success("Conversation reset");
  };

  const exportConversation = () => {
    const exportData = messages.map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
      confidence: m.confidence,
      actions: m.actions
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agent-test-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Conversation exported");
  };

  const copyConversation = () => {
    const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
    navigator.clipboard.writeText(text);
    toast.success("Conversation copied to clipboard");
  };

  const toggleSafetyCheck = (key: keyof typeof safetyChecks) => {
    setSafetyChecks(prev => {
      const newValue = !prev[key];
      toast.success(`${key.replace(/([A-Z])/g, ' $1').trim()} ${newValue ? 'enabled' : 'disabled'}`);
      return { ...prev, [key]: newValue };
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Window */}
        <Card className="glass border-primary/20 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                Agent Sandbox
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={copyConversation}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={exportConversation}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={resetConversation}>
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Reset
                </Button>
                <Badge className={isRunning ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}>
                  {isRunning ? <Clock className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
                  {isRunning ? "Processing..." : "Ready"}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {messages.map(message => (
                  <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.role === "agent" ? "bg-primary/20" :
                      message.role === "user" ? "bg-secondary/20" : "bg-muted/20"
                    }`}>
                      {message.role === "agent" && <Bot className="h-4 w-4 text-primary" />}
                      {message.role === "user" && <User className="h-4 w-4 text-secondary" />}
                      {message.role === "system" && <Zap className="h-4 w-4 text-muted-foreground" />}
                    </div>
                    <div className={`max-w-[80%] ${message.role === "user" ? "text-right" : ""}`}>
                      <div className={`p-3 rounded-xl ${
                        message.role === "agent" ? "bg-primary/10 border border-primary/20" :
                        message.role === "user" ? "bg-secondary/10 border border-secondary/20" :
                        "bg-muted/10 border border-muted/20"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.actions && (
                        <div className="mt-2 space-y-1">
                          {message.actions.map((action, i) => (
                            <p key={i} className="text-xs text-muted-foreground flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              {action}
                            </p>
                          ))}
                        </div>
                      )}
                      {message.confidence && (
                        <div className="mt-1 flex items-center gap-2">
                          <Target className="h-3 w-3 text-primary" />
                          <span className="text-xs text-primary">{message.confidence}% confidence</span>
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
              <Input 
                placeholder="Type a test message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="bg-background/50"
              />
              <Button onClick={handleSend} disabled={isRunning} className="bg-gradient-to-r from-primary to-secondary">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Scenarios & Controls */}
        <div className="space-y-6">
          <Card className="glass border-secondary/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Play className="h-4 w-4 text-secondary" />
                Test Scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {testScenarios.map(scenario => (
                <Button
                  key={scenario.id}
                  variant="outline"
                  className="w-full justify-start h-auto p-3"
                  onClick={() => runScenario(scenario)}
                >
                  <div className="text-left">
                    <p className="font-medium text-sm">{scenario.name}</p>
                    <p className="text-xs text-muted-foreground">{scenario.description}</p>
                  </div>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Safety Checks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div 
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${safetyChecks.hallucinationGuard ? "bg-green-500/10" : "bg-muted/10"}`}
                onClick={() => toggleSafetyCheck('hallucinationGuard')}
              >
                <span className="text-sm">Hallucination Guard</span>
                {safetyChecks.hallucinationGuard ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div 
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${safetyChecks.escalationRules ? "bg-green-500/10" : "bg-muted/10"}`}
                onClick={() => toggleSafetyCheck('escalationRules')}
              >
                <span className="text-sm">Escalation Rules</span>
                {safetyChecks.escalationRules ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div 
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${safetyChecks.complianceFilter ? "bg-green-500/10" : "bg-yellow-500/10"}`}
                onClick={() => toggleSafetyCheck('complianceFilter')}
              >
                <span className="text-sm">Compliance Filter</span>
                {safetyChecks.complianceFilter ? (
                  <CheckCircle className="h-4 w-4 text-green-400" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader>
              <CardTitle className="text-base">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg Response Time</span>
                <span className="font-medium">{performanceMetrics.avgResponseTime}s</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Accuracy Score</span>
                <span className="font-medium text-green-400">{performanceMetrics.accuracyScore}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Escalation Rate</span>
                <span className="font-medium">{performanceMetrics.escalationRate}%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}