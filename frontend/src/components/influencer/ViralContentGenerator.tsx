import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Video,
  Copy,
  RefreshCw,
  Zap,
  TrendingUp,
  Image,
  Loader2,
  Heart,
  MessageSquare,
} from "lucide-react";

const mockViralIdeas = [
  {
    id: 1,
    title: "POV: Your future self thanking you for starting today",
    format: "Reel",
    viralScore: 96,
    hook: "You in 2026 watching this reel...",
    trending: true,
  },
  {
    id: 2,
    title: "The 5-4-3-2-1 rule that changed my productivity",
    format: "Carousel",
    viralScore: 89,
    hook: "Stop scrolling. This will save you 3 hours daily.",
    trending: false,
  },
  {
    id: 3,
    title: "Reply to: 'You're lucky to be successful'",
    format: "Reel",
    viralScore: 94,
    hook: "Lucky? Let me show you my 4 AM alarm...",
    trending: true,
  },
  {
    id: 4,
    title: "Things I stopped doing after 30 (and my income tripled)",
    format: "Carousel",
    viralScore: 91,
    hook: "Slide 1: Saying yes to everything",
    trending: false,
  },
  {
    id: 5,
    title: "My exact morning routine (no BS version)",
    format: "Reel",
    viralScore: 87,
    hook: "Here's what actually happens, not the aesthetic version",
    trending: true,
  },
];

const mockScript = `🎬 REEL SCRIPT: "POV: Your future self thanking you for starting today"

📱 FORMAT: Vertical Reel (9:16)
⏱️ DURATION: 30-45 seconds
🎵 AUDIO: Trending motivational sound

---

HOOK (0-3s):
[Text on screen: "You in 2026 watching this reel..."]
[Look at camera with a knowing smile]

SCENE 1 (3-10s):
[Show yourself working late / gym / learning]
VO: "Remember when you almost didn't start?"

SCENE 2 (10-20s):
[Quick cuts of progress moments]
VO: "Remember when you thought it was too late?"

SCENE 3 (20-30s):
[Show current success markers - studio, team, results]
VO: "Thank you for not listening to the doubts."

CTA (30-35s):
[Text on screen: "Start today. Your future self is watching."]
[Point at camera]

---

📝 CAPTION:
Your future self is already proud of you for starting. 🚀

The only difference between you and where you want to be is time + consistency.

Save this for the days you want to quit.

#motivation #growthmindset #futureself #startnow #successmindset`;

const mockThumbnail = `🖼️ THUMBNAIL PROMPT:

Style: Cinematic, split-screen effect
Left side: Person in casual clothes looking tired (past)
Right side: Same person in success setting, confident (future)
Arrow or timeline connecting both sides
Text overlay: "START TODAY"
Color grading: Left side desaturated, right side warm/golden
Mood: Aspirational, motivational

---

AI Image Prompt:
"Split screen photo, left side showing tired young entrepreneur at desk at night, 
right side showing same person in modern office celebrating, warm golden lighting, 
cinematic photography, motivational poster style, 4K quality"`;

export function ViralContentGenerator() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<number | null>(null);
  const [showScript, setShowScript] = useState(false);

  const handleGenerateScript = async (id: number) => {
    setSelectedIdea(id);
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setShowScript(true);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Viral Content Generator</h2>
          <p className="text-muted-foreground">
            AI-powered content ideas with scripts and thumbnails
          </p>
        </div>
        <Button>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate 50 Ideas
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Ideas List */}
        <div className="space-y-4">
          <h3 className="font-medium">Top Viral Ideas</h3>
          {mockViralIdeas.map((idea) => (
            <Card
              key={idea.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg",
                selectedIdea === idea.id && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedIdea(idea.id)}
            >
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {idea.format}
                      </Badge>
                      {idea.trending && (
                        <Badge className="bg-pink-500/10 text-pink-500 border-pink-500/30 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium mb-2">{idea.title}</p>
                    <p className="text-sm text-muted-foreground italic">
                      Hook: "{idea.hook}"
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-500">
                      <Zap className="h-4 w-4" />
                      <span className="font-bold">{idea.viralScore}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Viral Score</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleGenerateScript(idea.id);
                    }}
                    disabled={isGenerating && selectedIdea === idea.id}
                  >
                    {isGenerating && selectedIdea === idea.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Video className="h-4 w-4 mr-2" />
                        Get Script
                      </>
                    )}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Script & Thumbnail Output */}
        <div className="space-y-4">
          {showScript ? (
            <Tabs defaultValue="script" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="script">
                  <Video className="h-4 w-4 mr-2" />
                  Script
                </TabsTrigger>
                <TabsTrigger value="thumbnail">
                  <Image className="h-4 w-4 mr-2" />
                  Thumbnail
                </TabsTrigger>
              </TabsList>

              <TabsContent value="script">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Generated Script</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap font-sans bg-muted p-4 rounded-lg max-h-[500px] overflow-y-auto">
                      {mockScript}
                    </pre>
                    <div className="flex gap-2 mt-4">
                      <Button className="flex-1">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Generate Caption
                      </Button>
                      <Button variant="outline">Edit Script</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="thumbnail">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Thumbnail Prompt</CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm whitespace-pre-wrap font-sans bg-muted p-4 rounded-lg">
                      {mockThumbnail}
                    </pre>
                    <Button className="w-full mt-4">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Thumbnail with AI
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Video className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">Select an idea to generate</p>
                  <p className="text-sm text-muted-foreground">
                    Click "Get Script" on any idea to generate full content
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
