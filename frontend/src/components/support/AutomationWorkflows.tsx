import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { GitBranch, Plus, Trash2, Play, Zap, MessageSquare, Mail, RefreshCw, CreditCard, Package, AlertTriangle, CheckCircle, Settings, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  conditions: string[];
  actions: string[];
  active: boolean;
  executions: number;
  successRate: number;
}

const initialRules: AutomationRule[] = [
  {
    id: "1",
    name: "Auto-Refund for Damaged Items",
    trigger: "Intent: Refund Request + Product Damaged",
    conditions: ["Order < 30 days", "Amount < ₹5000", "First refund request"],
    actions: ["Process refund", "Send confirmation email", "Update CRM"],
    active: true,
    executions: 245,
    successRate: 98
  },
  {
    id: "2",
    name: "Escalate Angry Customers",
    trigger: "Sentiment: Frustrated/Negative",
    conditions: ["3+ messages in thread", "Contains words: urgent, manager, complaint"],
    actions: ["Assign to human agent", "Priority: Urgent", "Notify manager"],
    active: true,
    executions: 89,
    successRate: 100
  },
  {
    id: "3",
    name: "Order Tracking Auto-Reply",
    trigger: "Intent: Order Tracking",
    conditions: ["Valid order ID detected"],
    actions: ["Fetch order status", "Send tracking link", "ETA notification"],
    active: true,
    executions: 1234,
    successRate: 99
  },
  {
    id: "4",
    name: "Account Password Reset",
    trigger: "Intent: Password Reset",
    conditions: ["Verified customer email"],
    actions: ["Send reset link", "Security verification SMS"],
    active: false,
    executions: 456,
    successRate: 100
  },
];

export function AutomationWorkflows() {
  const [rules, setRules] = useState(initialRules);
  const [selectedRule, setSelectedRule] = useState<string | null>("1");
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [newRuleName, setNewRuleName] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const { toast } = useToast();

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => 
      r.id === id ? { ...r, active: !r.active } : r
    ));
    const rule = rules.find(r => r.id === id);
    toast({
      title: rule?.active ? "Workflow Disabled" : "Workflow Enabled",
      description: rule?.name,
    });
  };

  const currentRule = rules.find(r => r.id === selectedRule);

  const handleCreateNew = () => {
    setIsCreating(true);
    setNewRuleName("");
  };

  const handleSaveNewRule = () => {
    if (!newRuleName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a workflow name",
        variant: "destructive",
      });
      return;
    }

    const newRule: AutomationRule = {
      id: Date.now().toString(),
      name: newRuleName,
      trigger: "Select trigger...",
      conditions: [],
      actions: [],
      active: false,
      executions: 0,
      successRate: 0
    };

    setRules(prev => [...prev, newRule]);
    setSelectedRule(newRule.id);
    setIsCreating(false);
    setNewRuleName("");

    toast({
      title: "Workflow Created",
      description: `"${newRuleName}" has been created`,
    });
  };

  const handleTestWorkflow = () => {
    if (!currentRule) return;
    setIsTesting(true);

    setTimeout(() => {
      setIsTesting(false);
      toast({
        title: "Test Completed",
        description: `Workflow "${currentRule.name}" executed successfully`,
      });
    }, 2000);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Changes Saved",
      description: `Workflow "${currentRule?.name}" has been updated`,
    });
  };

  const handleDeleteCondition = (ruleId: string, conditionIndex: number) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const newConditions = [...r.conditions];
        newConditions.splice(conditionIndex, 1);
        return { ...r, conditions: newConditions };
      }
      return r;
    }));
    toast({
      title: "Condition Removed",
      description: "The condition has been removed from the workflow",
    });
  };

  const handleDeleteAction = (ruleId: string, actionIndex: number) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const newActions = [...r.actions];
        newActions.splice(actionIndex, 1);
        return { ...r, actions: newActions };
      }
      return r;
    }));
    toast({
      title: "Action Removed",
      description: "The action has been removed from the workflow",
    });
  };

  const handleAddCondition = (ruleId: string) => {
    const conditions = [
      "Customer is VIP",
      "Order value > ₹1000",
      "Repeat customer",
      "First interaction",
      "Business hours only"
    ];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return { ...r, conditions: [...r.conditions, randomCondition] };
      }
      return r;
    }));
    toast({
      title: "Condition Added",
      description: `Added: "${randomCondition}"`,
    });
  };

  const handleAddAction = (ruleId: string) => {
    const actions = [
      "Send email notification",
      "Create support ticket",
      "Update customer record",
      "Trigger webhook",
      "Send SMS alert"
    ];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        return { ...r, actions: [...r.actions, randomAction] };
      }
      return r;
    }));
    toast({
      title: "Action Added",
      description: `Added: "${randomAction}"`,
    });
  };

  const handleDeleteWorkflow = (ruleId: string) => {
    const rule = rules.find(r => r.id === ruleId);
    setRules(prev => prev.filter(r => r.id !== ruleId));
    if (selectedRule === ruleId) {
      setSelectedRule(rules[0]?.id || null);
    }
    toast({
      title: "Workflow Deleted",
      description: `"${rule?.name}" has been deleted`,
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <GitBranch className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{rules.length}</p>
                <p className="text-xs text-muted-foreground">Workflows</p>
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
                <p className="text-2xl font-bold">{rules.filter(r => r.active).length}</p>
                <p className="text-xs text-muted-foreground">Active</p>
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
                <p className="text-2xl font-bold">{rules.reduce((a, r) => a + r.executions, 0).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Executions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <RefreshCw className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">98.5%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules List */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-primary" />
                Automation Rules
              </span>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={handleCreateNew}
              >
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {isCreating && (
              <div className="p-3 rounded-xl bg-primary/10 border border-primary space-y-2">
                <Input
                  placeholder="Enter workflow name..."
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  className="bg-background/50"
                  autoFocus
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleSaveNewRule}>Create</Button>
                  <Button size="sm" variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                </div>
              </div>
            )}
            {rules.map(rule => (
              <div
                key={rule.id}
                className={`w-full p-3 rounded-xl text-left transition-all cursor-pointer ${
                  selectedRule === rule.id
                    ? "bg-primary/10 border border-primary"
                    : "bg-background/50 hover:bg-muted/50"
                }`}
                onClick={() => setSelectedRule(rule.id)}
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{rule.name}</p>
                  <Switch 
                    checked={rule.active}
                    onCheckedChange={() => toggleRule(rule.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1 truncate">{rule.trigger}</p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span className="text-muted-foreground">{rule.executions} runs</span>
                  <Badge variant="outline" className="text-green-400">{rule.successRate}%</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Rule Editor */}
        <Card className="glass lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {currentRule ? "Edit Workflow" : "Create Workflow"}
              </span>
              {currentRule && (
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleTestWorkflow}
                    disabled={isTesting}
                  >
                    {isTesting ? (
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-1" />
                    )}
                    Test
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-destructive"
                    onClick={() => handleDeleteWorkflow(currentRule.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-primary to-secondary"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentRule ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Workflow Name</label>
                  <Input 
                    defaultValue={currentRule.name} 
                    className="bg-background/50"
                    onChange={(e) => {
                      setRules(prev => prev.map(r => 
                        r.id === currentRule.id ? { ...r, name: e.target.value } : r
                      ));
                    }}
                  />
                </div>

                {/* Trigger */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Trigger</label>
                  <div className="p-4 rounded-xl border-2 border-primary bg-primary/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/20">
                        <Zap className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-muted-foreground uppercase">When</p>
                        <p className="font-medium">{currentRule.trigger}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Conditions */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Conditions (All must match)</label>
                  <div className="space-y-2">
                    {currentRule.conditions.map((cond, i) => (
                      <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-background/50 border border-border/50">
                        <div className="p-1.5 rounded bg-secondary/20">
                          <GitBranch className="h-3 w-3 text-secondary" />
                        </div>
                        <span className="flex-1 text-sm">{cond}</span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="h-7 w-7 p-0 text-destructive"
                          onClick={() => handleDeleteCondition(currentRule.id, i)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleAddCondition(currentRule.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Condition
                    </Button>
                  </div>
                </div>

                {/* Actions Flow */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Actions (Execute in order)</label>
                  <div className="flex flex-col items-center gap-2">
                    {currentRule.actions.map((action, i) => (
                      <div key={i} className="w-full">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                          <div className="p-1.5 rounded bg-green-500/20">
                            <CheckCircle className="h-3 w-3 text-green-400" />
                          </div>
                          <span className="flex-1 text-sm">{action}</span>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 w-7 p-0 text-destructive"
                            onClick={() => handleDeleteAction(currentRule.id, i)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {i < currentRule.actions.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ArrowRight className="h-4 w-4 text-muted-foreground rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => handleAddAction(currentRule.id)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Action
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{currentRule.executions}</p>
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">{currentRule.successRate}%</p>
                    <p className="text-xs text-muted-foreground">Success Rate</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">₹45K</p>
                    <p className="text-xs text-muted-foreground">Time Saved</p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GitBranch className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Select a workflow to edit or create a new one</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
