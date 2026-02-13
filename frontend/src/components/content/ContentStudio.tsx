import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  FileText,
  Image,
  Video,
  Mail,
  Mic,
  Globe,
  Wand2,
  Loader2,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  Hash,
  MessageSquare,
} from "lucide-react";

const contentFormats = [
  { id: "social", label: "Social Post", icon: MessageSquare },
  { id: "blog", label: "Blog Article", icon: FileText },
  { id: "email", label: "Email", icon: Mail },
  { id: "video", label: "Video Script", icon: Video },
  { id: "podcast", label: "Podcast", icon: Mic },
  { id: "landing", label: "Landing Page", icon: Globe },
];

const toneOptions = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "premium", label: "Premium" },
  { id: "playful", label: "Playful" },
  { id: "urgent", label: "Urgent" },
];

const mockGeneratedContent = {
  main: `🚀 The Future of Business is Here

In 2035, successful companies aren't just using AI – they're powered by it.

Here's what sets industry leaders apart:

✅ Automated customer journeys that convert 24/7
✅ Predictive analytics that see opportunities before competitors
✅ Personalized experiences at scale (no, really at SCALE)
✅ AI assistants handling 90% of routine tasks

The result? Teams focused on strategy while AI handles execution.

Ready to transform your business? The technology exists today.

The only question is: Will you lead or follow?

#AIBusiness #FutureOfWork #Automation2035 #TechLeadership`,
  variations: [
    "🌟 Stop working IN your business. Start letting AI work FOR your business.",
    "💡 2035 Business Reality: Your competitors' AI never sleeps. Does yours?",
    "🔥 Hot take: Companies without AI automation in 2035 are like businesses without websites in 2010.",
  ],
  hashtags: [
    "#AIBusiness",
    "#FutureOfWork",
    "#Automation2035",
    "#TechLeadership",
    "#DigitalTransformation",
    "#AIAssistant",
    "#BusinessGrowth",
    "#Innovation",
  ],
  cta: [
    "Start your free AI audit today →",
    "Book a demo – see the future in action",
    "Join 10,000+ businesses already automating",
  ],
  seoKeywords: [
    "AI business automation",
    "future of work 2035",
    "AI customer service",
    "business automation tools",
    "AI marketing platform",
  ],
  imagePrompts: [
    "Futuristic office with holographic AI interfaces, professionals collaborating, neon blue accents, 4K photorealistic",
    "Abstract visualization of AI neural networks connecting business elements, gradient purple and blue, minimalist",
    "Robot and human hands shaking in business partnership, modern office background, cinematic lighting",
  ],
  videoPrompts: [
    "Opening: Drone shot of modern cityscape transitioning to sleek office interior. Cut to: Hands typing, screens showing AI analytics. Voiceover: 'The future of business...'",
    "Montage of busy professionals overwhelmed, then smiling as AI takes over tasks. Split screen showing before/after productivity.",
  ],
};

export function ContentStudio() {
  const [selectedFormat, setSelectedFormat] = useState("social");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<typeof mockGeneratedContent | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 2500));
    setGeneratedContent(mockGeneratedContent);
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Content Studio</h2>
        <p className="text-muted-foreground">
          Generate high-converting content across all formats
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Format Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Content Format</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                {contentFormats.map((format) => (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-lg transition-all",
                      selectedFormat === format.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  >
                    <format.icon className="h-5 w-5" />
                    <span className="text-xs">{format.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tone Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Brand Tone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm transition-all",
                      selectedTone === tone.id
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {tone.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Prompt Input */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Describe Your Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., Create a compelling post about our new AI automation features for tech-savvy entrepreneurs who want to scale their business..."
                className="w-full h-32 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              />
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Generating Content...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="space-y-4">
          {generatedContent ? (
            <Tabs defaultValue="content" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="variations">Variations</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="visuals">Visuals</TabsTrigger>
                <TabsTrigger value="cta">CTAs</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        Generated Content
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={handleGenerate}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {generatedContent.main}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Hash className="h-4 w-4 text-primary" />
                      Hashtags
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variations">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Alternative Versions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedContent.variations.map((variation, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted rounded-lg flex items-start justify-between gap-3"
                      >
                        <p className="text-sm">{variation}</p>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="seo">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">SEO Keywords</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {generatedContent.seoKeywords.map((keyword, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <span className="text-sm">{keyword}</span>
                          <Badge variant="outline">High Volume</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="visuals" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Image className="h-4 w-4 text-primary" />
                      Image Prompts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedContent.imagePrompts.map((prompt, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted rounded-lg flex items-start justify-between gap-3"
                      >
                        <p className="text-sm italic">{prompt}</p>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Video className="h-4 w-4 text-primary" />
                      Video Scripts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedContent.videoPrompts.map((prompt, i) => (
                      <div
                        key={i}
                        className="p-4 bg-muted rounded-lg flex items-start justify-between gap-3"
                      >
                        <p className="text-sm">{prompt}</p>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cta">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Call-to-Action Suggestions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {generatedContent.cta.map((cta, i) => (
                      <div
                        key={i}
                        className="p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{cta}</span>
                        <Button variant="ghost" size="sm">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="h-full min-h-[400px] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">No content generated yet</p>
                  <p className="text-sm text-muted-foreground">
                    Describe your content idea and click generate
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
