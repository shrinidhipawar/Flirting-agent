import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Clock,
  MessageSquare,
  Mail,
  Phone,
  Gift,
  AlertCircle,
  Plus,
  Play,
  Pause,
  Trash2,
  GripVertical,
  Sparkles,
} from "lucide-react";

interface SequenceStep {
  id: number;
  day: number;
  channel: "whatsapp" | "email" | "sms" | "call";
  type: "reminder" | "value" | "scarcity" | "social-proof" | "offer";
  message: string;
  isActive: boolean;
}

const mockSequence: SequenceStep[] = [
  {
    id: 1,
    day: 0,
    channel: "whatsapp",
    type: "value",
    message: "Quick follow-up with case study PDF",
    isActive: true,
  },
  {
    id: 2,
    day: 1,
    channel: "email",
    type: "social-proof",
    message: "Success story from similar industry",
    isActive: true,
  },
  {
    id: 3,
    day: 3,
    channel: "whatsapp",
    type: "reminder",
    message: "Gentle check-in on their decision",
    isActive: true,
  },
  {
    id: 4,
    day: 5,
    channel: "sms",
    type: "scarcity",
    message: "Pilot program closing in 48 hours",
    isActive: true,
  },
  {
    id: 5,
    day: 7,
    channel: "whatsapp",
    type: "offer",
    message: "Final offer with bonus incentive",
    isActive: true,
  },
];

const channelIcons = {
  whatsapp: MessageSquare,
  email: Mail,
  sms: Phone,
  call: Phone,
};

const typeColors = {
  reminder: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  value: "bg-green-500/10 text-green-500 border-green-500/30",
  scarcity: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  "social-proof": "bg-purple-500/10 text-purple-500 border-purple-500/30",
  offer: "bg-primary/10 text-primary border-primary/30",
};

export function FollowUpSequencer() {
  const [sequence, setSequence] = useState<SequenceStep[]>(mockSequence);
  const [isRunning, setIsRunning] = useState(false);

  const toggleStep = (id: number) => {
    setSequence((prev) =>
      prev.map((step) =>
        step.id === id ? { ...step, isActive: !step.isActive } : step
      )
    );
  };

  const deleteStep = (id: number) => {
    setSequence((prev) => prev.filter((step) => step.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Follow-Up Sequencer</h2>
          <p className="text-muted-foreground">
            Automated multi-channel follow-up campaigns
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
          <Button
            variant={isRunning ? "secondary" : "default"}
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Pause Sequence
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Sequence
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sequence Timeline */}
        <div className="lg:col-span-2 space-y-3">
          {sequence.map((step, index) => {
            const ChannelIcon = channelIcons[step.channel];
            return (
              <Card
                key={step.id}
                className={cn(
                  "transition-all",
                  !step.isActive && "opacity-50"
                )}
              >
                <CardContent className="py-4">
                  <div className="flex items-center gap-4">
                    <div className="cursor-grab text-muted-foreground hover:text-foreground">
                      <GripVertical className="h-5 w-5" />
                    </div>

                    {/* Day indicator */}
                    <div className="flex flex-col items-center min-w-[60px]">
                      <div className="text-2xl font-bold text-primary">
                        Day {step.day}
                      </div>
                      {index < sequence.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-2" />
                      )}
                    </div>

                    {/* Channel */}
                    <div
                      className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center",
                        step.channel === "whatsapp" && "bg-green-500/20",
                        step.channel === "email" && "bg-blue-500/20",
                        step.channel === "sms" && "bg-purple-500/20"
                      )}
                    >
                      <ChannelIcon
                        className={cn(
                          "h-5 w-5",
                          step.channel === "whatsapp" && "text-green-500",
                          step.channel === "email" && "text-blue-500",
                          step.channel === "sms" && "text-purple-500"
                        )}
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={cn("text-xs capitalize", typeColors[step.type])}
                        >
                          {step.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground capitalize">
                          via {step.channel}
                        </span>
                      </div>
                      <p className="text-sm">{step.message}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={step.isActive}
                        onCheckedChange={() => toggleStep(step.id)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteStep(step.id)}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Sequence Stats */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Sequence Performance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-green-500">67%</p>
                  <p className="text-xs text-muted-foreground">Open Rate</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">34%</p>
                  <p className="text-xs text-muted-foreground">Reply Rate</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-500">23%</p>
                  <p className="text-xs text-muted-foreground">Conversion</p>
                </div>
                <div className="text-center p-3 bg-background/50 rounded-lg">
                  <p className="text-2xl font-bold">₹4.2L</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">AI Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-start gap-2">
                  <Gift className="h-4 w-4 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Add bonus offer</p>
                    <p className="text-xs text-muted-foreground">
                      Include exclusive offer on Day 5 for 18% higher conversion
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Optimal timing</p>
                    <p className="text-xs text-muted-foreground">
                      Send WhatsApp at 10:30 AM for 23% better open rates
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Gap detected</p>
                    <p className="text-xs text-muted-foreground">
                      Consider adding a touchpoint between Day 3-5
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
