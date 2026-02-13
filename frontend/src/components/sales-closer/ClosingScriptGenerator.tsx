import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MessageSquare,
  Copy,
  RefreshCw,
  Sparkles,
  Zap,
  Target,
  Heart,
  Trophy,
  Loader2,
} from "lucide-react";

const frameworks = [
  { id: "aida", label: "AIDA", description: "Attention → Interest → Desire → Action" },
  { id: "pas", label: "PAS", description: "Problem → Agitate → Solution" },
  { id: "spin", label: "SPIN", description: "Situation → Problem → Implication → Need" },
  { id: "challenger", label: "Challenger", description: "Teach → Tailor → Take Control" },
];

const tones = [
  { id: "friendly", label: "Friendly", icon: Heart },
  { id: "expert", label: "Expert", icon: Trophy },
  { id: "premium", label: "Premium", icon: Sparkles },
  { id: "authority", label: "Authority", icon: Zap },
];

const mockScripts = {
  primary: `Hey Rajesh! 👋

I totally understand the price comparison – you're doing exactly what a smart buyer should do!

Here's what makes us different: Our clients typically save 40+ hours/month on automation alone. For a team of 15, that's roughly ₹2L worth of time saved monthly.

🎯 Quick question: What's costing your team the most time right now with spreadsheets?

I'd love to show you a 15-min demo with real ROI numbers from a similar team. 

Plus, we have a pilot program running this month – 30 days full access, zero risk.

Want me to set it up? 🚀`,
  alternative1: `Hi Rajesh,

Thanks for reaching out! The fact that you're comparing solutions tells me you're serious about making the right investment.

Let me share something interesting: One of our clients (also a 15-person team) was in the exact same situation. They calculated their spreadsheet-related errors were costing them ₹50K/month in lost opportunities.

Here's what I can offer:
✅ A personalized demo showing exactly how we'd work for YOUR team
✅ Access to our ROI calculator
✅ A conversation with a similar business who made the switch

What matters most to you – saving time or reducing errors?`,
  alternative2: `Rajesh, great question!

I won't bore you with features lists – let's talk results.

Companies like yours see:
• 3x faster deal closing
• 60% less time on admin work
• Zero data entry errors

The "premium" pricing? It pays for itself in Week 2.

I have 2 slots open tomorrow for a quick 15-min call. Would 11 AM or 3 PM work better?

(Btw, if budget is the main concern, ask me about our startup program 😉)`,
};

export function ClosingScriptGenerator() {
  const [selectedFramework, setSelectedFramework] = useState("aida");
  const [selectedTone, setSelectedTone] = useState("friendly");
  const [isGenerating, setIsGenerating] = useState(false);
  const [scripts, setScripts] = useState<typeof mockScripts | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setScripts(mockScripts);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Closing Script Generator</h2>
        <p className="text-muted-foreground">
          AI-powered persuasion scripts using proven frameworks
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Settings Panel */}
        <div className="space-y-4">
          {/* Framework Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Sales Framework</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {frameworks.map((fw) => (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all",
                    selectedFramework === fw.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <p className="font-medium text-sm">{fw.label}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      selectedFramework === fw.id
                        ? "text-primary-foreground/80"
                        : "text-muted-foreground"
                    )}
                  >
                    {fw.description}
                  </p>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Tone Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Conversation Tone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {tones.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg transition-all",
                      selectedTone === tone.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <tone.icon className="h-4 w-4" />
                    <span className="text-sm">{tone.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="w-full"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Generating Scripts...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Closing Scripts
              </>
            )}
          </Button>
        </div>

        {/* Scripts Output */}
        <div className="lg:col-span-2">
          {scripts ? (
            <Tabs defaultValue="primary" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="primary">
                  <Target className="h-4 w-4 mr-2" />
                  Primary Script
                </TabsTrigger>
                <TabsTrigger value="alt1">Alternative 1</TabsTrigger>
                <TabsTrigger value="alt2">Alternative 2</TabsTrigger>
              </TabsList>

              <TabsContent value="primary">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="default">Recommended</Badge>
                        <Badge variant="outline">78% Success Rate</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleGenerate}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {scripts.primary}
                      </pre>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send via WhatsApp
                      </Button>
                      <Button variant="outline">Edit Script</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alt1">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Value-focused</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {scripts.alternative1}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="alt2">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">Direct Approach</Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-muted rounded-lg p-4">
                      <pre className="text-sm whitespace-pre-wrap font-sans">
                        {scripts.alternative2}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <MessageSquare className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No scripts generated yet</p>
                  <p className="text-sm text-muted-foreground">
                    Select a framework and tone, then click generate
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
