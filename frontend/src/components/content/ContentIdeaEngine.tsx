import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  TrendingUp,
  Zap,
  RefreshCw,
  Copy,
  Sparkles,
  Target,
  BarChart3,
} from "lucide-react";

const mockIdeas = [
  {
    id: 1,
    title: "Behind-the-Scenes: Our AI Development Journey",
    format: "Reel",
    viralScore: 94,
    trend: "Rising",
    platforms: ["Instagram", "TikTok"],
    hook: "You won't believe what our AI did at 3 AM...",
  },
  {
    id: 2,
    title: "5 Ways AI is Revolutionizing Small Business in 2035",
    format: "Carousel",
    viralScore: 87,
    trend: "Hot",
    platforms: ["LinkedIn", "Instagram"],
    hook: "Stop doing this manually. Here's why →",
  },
  {
    id: 3,
    title: "Customer Success Story: 10x Revenue in 30 Days",
    format: "Case Study",
    viralScore: 82,
    trend: "Steady",
    platforms: ["LinkedIn", "Blog"],
    hook: "How a small agency became an industry leader...",
  },
  {
    id: 4,
    title: "The Future of Work: AI Assistants You Need",
    format: "Blog Post",
    viralScore: 79,
    trend: "Rising",
    platforms: ["Blog", "Medium"],
    hook: "2035 called. Your workflow is outdated.",
  },
  {
    id: 5,
    title: "Quick Tips: Automate Your Sales in 60 Seconds",
    format: "Short Video",
    viralScore: 91,
    trend: "Hot",
    platforms: ["TikTok", "YouTube Shorts"],
    hook: "This one button saves 40 hours/week...",
  },
];

const categories = ["All", "Trending", "Evergreen", "Seasonal", "Viral Potential"];

export function ContentIdeaEngine() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsGenerating(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Idea Engine</h2>
          <p className="text-muted-foreground">
            Discover trending content ideas tailored to your brand
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate Ideas
            </>
          )}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-sm transition-all",
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {mockIdeas.map((idea) => (
          <Card
            key={idea.id}
            className="group hover:shadow-lg transition-all cursor-pointer border-border/50 hover:border-primary/50"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2">
                  {idea.format}
                </Badge>
                <div className="flex items-center gap-1">
                  <TrendingUp
                    className={cn(
                      "h-4 w-4",
                      idea.trend === "Hot"
                        ? "text-red-500"
                        : idea.trend === "Rising"
                        ? "text-green-500"
                        : "text-muted-foreground"
                    )}
                  />
                  <span className="text-xs text-muted-foreground">
                    {idea.trend}
                  </span>
                </div>
              </div>
              <CardTitle className="text-base leading-tight">
                {idea.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                <p className="text-sm text-muted-foreground italic">
                  "{idea.hook}"
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">
                    {idea.viralScore}% Viral Score
                  </span>
                </div>
                <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    style={{ width: `${idea.viralScore}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {idea.platforms.map((platform) => (
                  <Badge key={platform} variant="outline" className="text-xs">
                    {platform}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Target className="h-3 w-3 mr-1" />
                  Create
                </Button>
                <Button variant="ghost" size="sm">
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">AI Performance Insights</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">5</p>
              <p className="text-xs text-muted-foreground">Ideas Generated</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-green-500">87%</p>
              <p className="text-xs text-muted-foreground">Avg Viral Score</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-orange-500">3</p>
              <p className="text-xs text-muted-foreground">Trending Topics</p>
            </div>
            <div className="text-center p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">12</p>
              <p className="text-xs text-muted-foreground">Platform Matches</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
