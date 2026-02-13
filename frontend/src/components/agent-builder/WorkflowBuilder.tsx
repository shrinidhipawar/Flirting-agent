import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { GitBranch, Plus, Trash2, Play, Zap, MessageSquare, Mail, AlertTriangle, CheckCircle, ArrowRight, Settings, Copy } from "lucide-react";
import { toast } from "sonner";

interface WorkflowNode {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  config: Record<string, string>;
}

interface Workflow {
  id: string;
  name: string;
  nodes: WorkflowNode[];
  active: boolean;
}

const triggerOptions = [
  { value: "new_lead", label: "New Lead Received" },
  { value: "message_received", label: "Message Received" },
  { value: "ticket_created", label: "Ticket Created" },
  { value: "schedule", label: "Scheduled Time" },
  { value: "webhook", label: "Webhook Trigger" },
];

const conditionOptions = [
  { value: "lead_score", label: "Lead Score" },
  { value: "sentiment", label: "Sentiment Analysis" },
  { value: "keyword", label: "Contains Keyword" },
  { value: "time", label: "Time Condition" },
  { value: "status", label: "Status Check" },
];

const actionOptions = [
  { value: "send_email", label: "Send Email", icon: Mail },
  { value: "send_whatsapp", label: "Send WhatsApp", icon: MessageSquare },
  { value: "create_ticket", label: "Create Ticket", icon: Plus },
  { value: "update_crm", label: "Update CRM", icon: Settings },
  { value: "escalate", label: "Escalate to Human", icon: AlertTriangle },
  { value: "notify", label: "Send Notification", icon: Zap },
];

const workflowTemplates = [
  { 
    name: "Lead Nurturing", 
    desc: "7-day follow-up sequence", 
    icon: "📧",
    nodes: [
      { id: "1", type: "trigger" as const, label: "New Lead Received", config: { trigger: "new_lead" } },
      { id: "2", type: "condition" as const, label: "Lead Score > 50", config: { field: "lead_score", operator: ">", value: "50" } },
      { id: "3", type: "action" as const, label: "Send Welcome Email", config: { action: "send_email" } },
    ]
  },
  { 
    name: "Support Escalation", 
    desc: "Auto-escalate angry customers", 
    icon: "🚨",
    nodes: [
      { id: "1", type: "trigger" as const, label: "Message Received", config: { trigger: "message_received" } },
      { id: "2", type: "condition" as const, label: "Sentiment = Negative", config: { field: "sentiment", operator: "=", value: "negative" } },
      { id: "3", type: "action" as const, label: "Escalate to Human", config: { action: "escalate" } },
    ]
  },
  { 
    name: "Onboarding Flow", 
    desc: "Welcome new users", 
    icon: "👋",
    nodes: [
      { id: "1", type: "trigger" as const, label: "New User Signup", config: { trigger: "new_lead" } },
      { id: "2", type: "action" as const, label: "Send Welcome Email", config: { action: "send_email" } },
      { id: "3", type: "action" as const, label: "Create Onboarding Ticket", config: { action: "create_ticket" } },
    ]
  },
  { 
    name: "Cart Recovery", 
    desc: "Recover abandoned carts", 
    icon: "🛒",
    nodes: [
      { id: "1", type: "trigger" as const, label: "Cart Abandoned", config: { trigger: "webhook" } },
      { id: "2", type: "condition" as const, label: "Cart Value > $50", config: { field: "status", operator: ">", value: "50" } },
      { id: "3", type: "action" as const, label: "Send Recovery Email", config: { action: "send_email" } },
    ]
  },
];

export function WorkflowBuilder() {
  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "1",
      name: "Lead Follow-Up",
      nodes: [
        { id: "1", type: "trigger", label: "New Lead Received", config: {} },
        { id: "2", type: "condition", label: "Lead Score > 70", config: { field: "lead_score", operator: ">", value: "70" } },
        { id: "3", type: "action", label: "Send Follow-Up Email", config: { action: "send_email" } },
      ],
      active: true,
    },
    {
      id: "2",
      name: "Angry Customer Escalation",
      nodes: [
        { id: "1", type: "trigger", label: "Message Received", config: {} },
        { id: "2", type: "condition", label: "Sentiment = Negative", config: { field: "sentiment", operator: "=", value: "negative" } },
        { id: "3", type: "action", label: "Escalate to Human", config: { action: "escalate" } },
      ],
      active: true,
    },
  ]);

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(workflows[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [newWorkflowName, setNewWorkflowName] = useState("");
  const [showNewWorkflowDialog, setShowNewWorkflowDialog] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "trigger": return <Zap className="h-4 w-4" />;
      case "condition": return <GitBranch className="h-4 w-4" />;
      case "action": return <CheckCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "trigger": return "border-primary bg-primary/10 text-primary";
      case "condition": return "border-secondary bg-secondary/10 text-secondary";
      case "action": return "border-accent bg-accent/10 text-accent-foreground";
      default: return "";
    }
  };

  const createWorkflow = () => {
    if (!newWorkflowName.trim()) {
      toast.error("Please enter a workflow name");
      return;
    }
    
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: newWorkflowName,
      nodes: [
        { id: "1", type: "trigger", label: "New Trigger", config: {} }
      ],
      active: false,
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    setNewWorkflowName("");
    setShowNewWorkflowDialog(false);
    setIsEditing(true);
    toast.success("Workflow created! Add conditions and actions.");
  };

  const deleteNode = (nodeId: string) => {
    if (!selectedWorkflow) return;
    
    const updatedNodes = selectedWorkflow.nodes.filter(n => n.id !== nodeId);
    const updatedWorkflow = { ...selectedWorkflow, nodes: updatedNodes };
    
    setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
    setSelectedWorkflow(updatedWorkflow);
    toast.success("Step removed");
  };

  const addCondition = () => {
    if (!selectedWorkflow) return;
    
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: "condition",
      label: "New Condition",
      config: { field: "lead_score", operator: ">", value: "50" },
    };
    
    const updatedNodes = [...selectedWorkflow.nodes, newNode];
    const updatedWorkflow = { ...selectedWorkflow, nodes: updatedNodes };
    
    setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
    setSelectedWorkflow(updatedWorkflow);
    toast.success("Condition added");
  };

  const addAction = () => {
    if (!selectedWorkflow) return;
    
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: "action",
      label: "New Action",
      config: { action: "send_email" },
    };
    
    const updatedNodes = [...selectedWorkflow.nodes, newNode];
    const updatedWorkflow = { ...selectedWorkflow, nodes: updatedNodes };
    
    setWorkflows(prev => prev.map(w => w.id === selectedWorkflow.id ? updatedWorkflow : w));
    setSelectedWorkflow(updatedWorkflow);
    toast.success("Action added");
  };

  const testRun = () => {
    if (!selectedWorkflow) return;
    
    setIsRunning(true);
    toast.info("Running workflow test...");
    
    setTimeout(() => {
      setIsRunning(false);
      toast.success(`Workflow "${selectedWorkflow.name}" executed successfully!`, {
        description: `${selectedWorkflow.nodes.length} steps completed`,
      });
    }, 2000);
  };

  const toggleWorkflowActive = (workflowId: string) => {
    setWorkflows(prev => prev.map(w => {
      if (w.id === workflowId) {
        const updated = { ...w, active: !w.active };
        if (selectedWorkflow?.id === workflowId) {
          setSelectedWorkflow(updated);
        }
        toast.success(updated.active ? "Workflow activated" : "Workflow deactivated");
        return updated;
      }
      return w;
    }));
  };

  const useTemplate = (template: typeof workflowTemplates[0]) => {
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      name: template.name,
      nodes: template.nodes,
      active: false,
    };
    
    setWorkflows(prev => [...prev, newWorkflow]);
    setSelectedWorkflow(newWorkflow);
    toast.success(`Template "${template.name}" applied!`);
  };

  const duplicateWorkflow = () => {
    if (!selectedWorkflow) return;
    
    const duplicated: Workflow = {
      ...selectedWorkflow,
      id: Date.now().toString(),
      name: `${selectedWorkflow.name} (Copy)`,
      active: false,
    };
    
    setWorkflows(prev => [...prev, duplicated]);
    setSelectedWorkflow(duplicated);
    toast.success("Workflow duplicated");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Workflow List */}
        <Card className="glass border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Workflows</span>
              <Dialog open={showNewWorkflowDialog} onOpenChange={setShowNewWorkflowDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Workflow</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Workflow Name</Label>
                      <Input 
                        placeholder="e.g., Lead Nurturing Flow"
                        value={newWorkflowName}
                        onChange={(e) => setNewWorkflowName(e.target.value)}
                      />
                    </div>
                    <Button onClick={createWorkflow} className="w-full">
                      Create Workflow
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workflows.map(workflow => (
              <div
                key={workflow.id}
                onClick={() => setSelectedWorkflow(workflow)}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedWorkflow?.id === workflow.id
                    ? "bg-primary/20 border border-primary"
                    : "bg-background/50 hover:bg-primary/10"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{workflow.name}</span>
                  <Badge 
                    variant={workflow.active ? "default" : "secondary"} 
                    className="text-xs cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWorkflowActive(workflow.id);
                    }}
                  >
                    {workflow.active ? "Active" : "Draft"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {workflow.nodes.length} steps
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Workflow Canvas */}
        <Card className="glass border-secondary/20 lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-secondary" />
                {selectedWorkflow?.name || "Select Workflow"}
              </div>
              <div className="flex gap-2">
                {selectedWorkflow && (
                  <Button size="sm" variant="ghost" onClick={duplicateWorkflow}>
                    <Copy className="h-4 w-4" />
                  </Button>
                )}
                <Button size="sm" variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Settings className="h-4 w-4 mr-1" />
                  {isEditing ? "Done" : "Edit"}
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-primary to-secondary"
                  onClick={testRun}
                  disabled={isRunning || !selectedWorkflow}
                >
                  <Play className="h-4 w-4 mr-1" />
                  {isRunning ? "Running..." : "Test Run"}
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedWorkflow && (
              <div className="space-y-4">
                {/* Visual Flow */}
                <div className="flex flex-col items-center gap-2 py-8">
                  {selectedWorkflow.nodes.map((node, index) => (
                    <div key={node.id} className="flex flex-col items-center">
                      <div className={`relative p-4 rounded-xl border-2 min-w-[250px] ${getNodeColor(node.type)}`}>
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            node.type === "trigger" ? "bg-primary/20" :
                            node.type === "condition" ? "bg-secondary/20" : "bg-accent/20"
                          }`}>
                            {getNodeIcon(node.type)}
                          </div>
                          <div>
                            <p className="text-xs uppercase tracking-wider opacity-70">{node.type}</p>
                            <p className="font-medium">{node.label}</p>
                          </div>
                          {isEditing && node.type !== "trigger" && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="ml-auto h-8 w-8 p-0 text-destructive"
                              onClick={() => deleteNode(node.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {index < selectedWorkflow.nodes.length - 1 && (
                        <div className="flex flex-col items-center py-2">
                          <div className="w-0.5 h-4 bg-border" />
                          <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                          <div className="w-0.5 h-4 bg-border" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Step */}
                {isEditing && (
                  <div className="flex justify-center gap-3 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" onClick={addCondition}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Condition
                    </Button>
                    <Button variant="outline" size="sm" onClick={addAction}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Templates */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="text-base">Quick Workflow Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {workflowTemplates.map((template, i) => (
              <div 
                key={i} 
                onClick={() => useTemplate(template)}
                className="p-4 rounded-xl border border-border/50 bg-background/30 hover:border-primary/50 cursor-pointer transition-all"
              >
                <span className="text-2xl">{template.icon}</span>
                <h4 className="font-medium mt-2">{template.name}</h4>
                <p className="text-xs text-muted-foreground">{template.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}