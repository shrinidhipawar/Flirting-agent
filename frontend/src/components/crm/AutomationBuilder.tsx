import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Zap,
  Plus,
  Mail,
  MessageSquare,
  Clock,
  UserPlus,
  Tag,
  ArrowRight,
  Play,
  Pause,
  MoreHorizontal,
  Edit,
  Trash2,
} from "lucide-react";

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  actions: number;
  status: "active" | "paused" | "draft";
  runs: number;
  conversions: number;
}

const workflows: Workflow[] = [
  { id: "1", name: "New Lead Welcome Sequence", trigger: "Lead Created", actions: 5, status: "active", runs: 1234, conversions: 156 },
  { id: "2", name: "Follow-up After Demo", trigger: "Stage Changed → Demo", actions: 3, status: "active", runs: 892, conversions: 89 },
  { id: "3", name: "Cold Lead Re-engagement", trigger: "No Activity 7 Days", actions: 4, status: "active", runs: 456, conversions: 34 },
  { id: "4", name: "Proposal Follow-up", trigger: "Proposal Sent", actions: 6, status: "paused", runs: 678, conversions: 78 },
  { id: "5", name: "Win Celebration + Upsell", trigger: "Stage Changed → Won", actions: 3, status: "active", runs: 234, conversions: 45 },
];

const triggerTypes = [
  { id: "lead_created", label: "Lead Created", icon: UserPlus, color: "bg-blue-500" },
  { id: "stage_changed", label: "Stage Changed", icon: ArrowRight, color: "bg-violet-500" },
  { id: "no_activity", label: "No Activity", icon: Clock, color: "bg-amber-500" },
  { id: "message_received", label: "Message Received", icon: MessageSquare, color: "bg-emerald-500" },
  { id: "tag_added", label: "Tag Added", icon: Tag, color: "bg-pink-500" },
];

const actionTypes = [
  { id: "send_email", label: "Send Email", icon: Mail, color: "bg-blue-500" },
  { id: "send_whatsapp", label: "Send WhatsApp", icon: MessageSquare, color: "bg-emerald-500" },
  { id: "wait", label: "Wait", icon: Clock, color: "bg-amber-500" },
  { id: "assign", label: "Assign to Team", icon: UserPlus, color: "bg-violet-500" },
  { id: "add_tag", label: "Add Tag", icon: Tag, color: "bg-pink-500" },
  { id: "move_stage", label: "Move Stage", icon: ArrowRight, color: "bg-indigo-500" },
];

const statusColors = {
  active: "bg-emerald-500/20 text-emerald-400",
  paused: "bg-amber-500/20 text-amber-400",
  draft: "bg-muted text-muted-foreground",
};

export function AutomationBuilder() {
  const [showBuilder, setShowBuilder] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Automation Workflows</h2>
          <p className="text-sm text-muted-foreground">Create no-code automations to save time</p>
        </div>
        <Button
          onClick={() => setShowBuilder(!showBuilder)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Workflow
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {triggerTypes.map((trigger) => (
          <button
            key={trigger.id}
            className="glass rounded-xl p-4 text-left hover:bg-muted/50 transition-colors group"
          >
            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-3", trigger.color)}>
              <trigger.icon className="h-5 w-5 text-white" />
            </div>
            <p className="font-medium text-sm group-hover:text-indigo-400 transition-colors">
              {trigger.label}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Trigger</p>
          </button>
        ))}
      </div>

      {/* Workflow Builder Preview */}
      {showBuilder && (
        <div className="glass rounded-xl p-6 animate-slide-up">
          <h3 className="font-medium mb-4">Build Your Workflow</h3>
          
          {/* Visual Builder */}
          <div className="flex items-center gap-4 overflow-x-auto pb-4">
            {/* Trigger */}
            <div className="flex-shrink-0 w-48 p-4 rounded-xl bg-blue-500/10 border-2 border-blue-500/30 border-dashed">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium">Trigger</span>
              </div>
              <select className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm">
                <option>Lead Created</option>
                <option>Stage Changed</option>
                <option>No Activity</option>
              </select>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

            {/* Action 1 */}
            <div className="flex-shrink-0 w-48 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium">Send Email</span>
              </div>
              <p className="text-xs text-muted-foreground">Welcome email template</p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

            {/* Wait */}
            <div className="flex-shrink-0 w-48 p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-amber-400" />
                <span className="text-sm font-medium">Wait</span>
              </div>
              <p className="text-xs text-muted-foreground">2 days</p>
            </div>

            <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />

            {/* Add Action */}
            <button className="flex-shrink-0 w-48 p-4 rounded-xl border-2 border-dashed border-border hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-colors">
              <div className="flex items-center justify-center gap-2 text-muted-foreground hover:text-indigo-400">
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Action</span>
              </div>
            </button>
          </div>

          {/* Available Actions */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-3">Available Actions</p>
            <div className="flex flex-wrap gap-2">
              {actionTypes.map((action) => (
                <button
                  key={action.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-sm"
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Existing Workflows */}
      <div className="glass rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Active Workflows</h3>
        </div>
        <div className="divide-y divide-border">
          {workflows.map((workflow, index) => (
            <div
              key={workflow.id}
              className="p-4 hover:bg-muted/30 transition-colors group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                    <Zap className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{workflow.name}</h4>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", statusColors[workflow.status])}>
                        {workflow.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Trigger: {workflow.trigger} • {workflow.actions} actions
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{workflow.runs.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Runs</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-emerald-400">{workflow.conversions}</p>
                    <p className="text-xs text-muted-foreground">Conversions</p>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon">
                      {workflow.status === "active" ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
