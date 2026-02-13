import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Bot, Sparkles, Zap, Shield, MessageSquare, Mail, Phone, Database, FileText, Globe, Calculator, BarChart3, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const agentTypes = [
  { value: "sales", label: "Sales Agent", icon: "💼" },
  { value: "support", label: "Customer Support", icon: "🎧" },
  { value: "hr", label: "HR Assistant", icon: "👥" },
  { value: "marketing", label: "Marketing Agent", icon: "📢" },
  { value: "operations", label: "Operations Agent", icon: "⚙️" },
  { value: "finance", label: "Finance Agent", icon: "💰" },
  { value: "research", label: "Research Agent", icon: "🔬" },
  { value: "tech", label: "Tech Support", icon: "🔧" },
];

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly & Warm" },
  { value: "authoritative", label: "Authoritative" },
  { value: "casual", label: "Casual" },
  { value: "empathetic", label: "Empathetic" },
];

const capabilities = [
  { id: "messaging", label: "Send Messages", icon: MessageSquare, enabled: true },
  { id: "email", label: "Send Emails", icon: Mail, enabled: true },
  { id: "whatsapp", label: "WhatsApp", icon: Phone, enabled: false },
  { id: "crm", label: "CRM Actions", icon: Database, enabled: true },
  { id: "documents", label: "Generate Docs", icon: FileText, enabled: false },
  { id: "research", label: "Web Research", icon: Globe, enabled: true },
  { id: "calculations", label: "Calculations", icon: Calculator, enabled: false },
  { id: "analytics", label: "Analytics", icon: BarChart3, enabled: true },
];

const safetyDefaults = {
  requireConfirmation: true,
  autoEscalate: true,
  hallucinationCheck: true,
  humanOverride: true,
};

export function AgentBlueprint() {
  const [agentType, setAgentType] = useState("sales");
  const [agentName, setAgentName] = useState("");
  const [agentGoal, setAgentGoal] = useState("");
  const [tone, setTone] = useState("professional");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>(
    capabilities.filter(c => c.enabled).map(c => c.id)
  );
  const [safetySettings, setSafetySettings] = useState(safetyDefaults);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);

  const toggleCapability = (id: string) => {
    setSelectedCapabilities(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSafety = (key: keyof typeof safetySettings) => {
    setSafetySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const generateSystemPrompt = async () => {
    if (!agentName.trim()) {
      toast.error("Please enter an agent name");
      return;
    }
    if (!agentGoal.trim()) {
      toast.error("Please describe the agent's goal");
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const typeInfo = agentTypes.find(t => t.value === agentType);
      const toneInfo = toneOptions.find(t => t.value === tone);
      const capLabels = selectedCapabilities.map(id => capabilities.find(c => c.id === id)?.label).filter(Boolean);
      
      const prompt = `You are ${agentName}, an AI ${typeInfo?.label || 'Assistant'}.

## Core Mission
${agentGoal}

## Personality & Tone
Communicate in a ${toneInfo?.label?.toLowerCase() || 'professional'} manner. Be helpful, accurate, and efficient.

## Capabilities
You can perform the following actions:
${capLabels.map(c => `- ${c}`).join('\n')}

## Safety Guidelines
${safetySettings.requireConfirmation ? '- Always ask for confirmation before taking critical actions (payments, deletions, etc.)' : ''}
${safetySettings.autoEscalate ? '- Escalate to a human agent when confidence is below 70% or when dealing with sensitive issues' : ''}
${safetySettings.hallucinationCheck ? '- Only provide information you are certain about. If unsure, acknowledge uncertainty and offer to verify' : ''}
${safetySettings.humanOverride ? '- Allow human takeover at any point when requested' : ''}

## Response Format
- Keep responses concise and actionable
- Use bullet points for lists
- Provide clear next steps when applicable
- Always maintain context from previous messages`;

      setGeneratedPrompt(prompt);
      setIsGenerating(false);
      toast.success("System prompt generated successfully!");
    }, 1500);
  };

  const copyPrompt = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    toast.success("Prompt copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const saveDraft = () => {
    const draft = {
      agentName,
      agentType,
      agentGoal,
      tone,
      selectedCapabilities,
      safetySettings,
      generatedPrompt,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('agent-blueprint-draft', JSON.stringify(draft));
    toast.success("Draft saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Agent Identity */}
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            Agent Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input 
                placeholder="e.g., Sales Pro, Support Genius..."
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="bg-background/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Agent Type</Label>
              <Select value={agentType} onValueChange={setAgentType}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {agentTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Agent Goal & Mission</Label>
            <Textarea 
              placeholder="Describe what this agent should accomplish..."
              value={agentGoal}
              onChange={(e) => setAgentGoal(e.target.value)}
              className="bg-background/50 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Tone & Personality</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Capabilities */}
      <Card className="glass border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            Agent Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {capabilities.map(cap => (
              <div 
                key={cap.id}
                onClick={() => toggleCapability(cap.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedCapabilities.includes(cap.id)
                    ? "border-primary bg-primary/10"
                    : "border-border/50 bg-background/30 hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <cap.icon className={`h-5 w-5 ${
                    selectedCapabilities.includes(cap.id) ? "text-primary" : "text-muted-foreground"
                  }`} />
                  <Switch 
                    checked={selectedCapabilities.includes(cap.id)}
                    onCheckedChange={() => toggleCapability(cap.id)}
                  />
                </div>
                <p className="text-sm font-medium">{cap.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Rules */}
      <Card className="glass border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-destructive" />
            Safety & Constraints
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div>
              <p className="font-medium">Require Confirmation</p>
              <p className="text-sm text-muted-foreground">Agent asks before critical actions</p>
            </div>
            <Switch 
              checked={safetySettings.requireConfirmation}
              onCheckedChange={() => toggleSafety('requireConfirmation')}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div>
              <p className="font-medium">Auto-Escalate</p>
              <p className="text-sm text-muted-foreground">Escalate when confidence is low</p>
            </div>
            <Switch 
              checked={safetySettings.autoEscalate}
              onCheckedChange={() => toggleSafety('autoEscalate')}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div>
              <p className="font-medium">Hallucination Check</p>
              <p className="text-sm text-muted-foreground">Verify facts before responding</p>
            </div>
            <Switch 
              checked={safetySettings.hallucinationCheck}
              onCheckedChange={() => toggleSafety('hallucinationCheck')}
            />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
            <div>
              <p className="font-medium">Human Override</p>
              <p className="text-sm text-muted-foreground">Allow human takeover anytime</p>
            </div>
            <Switch 
              checked={safetySettings.humanOverride}
              onCheckedChange={() => toggleSafety('humanOverride')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Agent Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
            <div className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="h-8 w-8 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold">{agentName || "Unnamed Agent"}</h3>
                <Badge variant="secondary" className="mt-1">
                  {agentTypes.find(t => t.value === agentType)?.icon} {agentTypes.find(t => t.value === agentType)?.label}
                </Badge>
                <p className="mt-3 text-muted-foreground">
                  {agentGoal || "No goal defined yet..."}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedCapabilities.map(capId => {
                    const cap = capabilities.find(c => c.id === capId);
                    return cap ? (
                      <Badge key={capId} variant="outline" className="text-xs">
                        {cap.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </div>

          {generatedPrompt && (
            <div className="mt-6 p-4 rounded-xl bg-background/50 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">Generated System Prompt</p>
                <Button size="sm" variant="ghost" onClick={copyPrompt}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                {generatedPrompt}
              </pre>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button 
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
              onClick={generateSystemPrompt}
              disabled={isGenerating}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {isGenerating ? "Generating..." : "Generate System Prompt"}
            </Button>
            <Button variant="outline" onClick={saveDraft}>
              Save Draft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}