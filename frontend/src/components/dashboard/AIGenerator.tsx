import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Image,
  Video,
  FileText,
  Hash,
  Wand2,
  Loader2,
  Copy,
  RefreshCw,
} from "lucide-react";

const contentTypes = [
  { id: "post", label: "Post", icon: FileText },
  { id: "carousel", label: "Carousel", icon: Image },
  { id: "reel", label: "Reel Script", icon: Video },
  { id: "caption", label: "Caption", icon: FileText },
  { id: "hashtags", label: "Hashtags", icon: Hash },
];

const platforms = [
  { id: "instagram", label: "Instagram", color: "from-pink-500 to-purple-500" },
  { id: "facebook", label: "Facebook", color: "from-blue-600 to-blue-400" },
  { id: "twitter", label: "X (Twitter)", color: "from-gray-700 to-gray-500" },
  { id: "linkedin", label: "LinkedIn", color: "from-blue-700 to-blue-500" },
  { id: "tiktok", label: "TikTok", color: "from-pink-500 to-cyan-500" },
];

export function AIGenerator() {
  const [selectedType, setSelectedType] = useState("post");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setGeneratedContent(`🚀 Exciting news! We're thrilled to announce our latest innovation that's set to transform how you connect with your audience.

✨ Key Highlights:
• Revolutionary AI-powered features
• Seamless cross-platform integration
• Real-time analytics & insights
• 10x faster content creation

Join thousands of forward-thinking brands already experiencing the future of social media automation.

🔗 Link in bio to learn more!

#Innovation #TechForward #SocialMediaMarketing #AI2035 #DigitalTransformation #GrowthHacking`);
    setIsGenerating(false);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">AI Content Generator</h2>
          <p className="text-sm text-muted-foreground">Create stunning content in seconds</p>
        </div>
      </div>

      {/* Content Type Selection */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Content Type</label>
        <div className="flex flex-wrap gap-2">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-all",
                selectedType === type.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Platform Selection */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
        <div className="flex flex-wrap gap-2">
          {platforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm transition-all",
                selectedPlatform === platform.id
                  ? `bg-gradient-to-r ${platform.color} text-white`
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-4">
        <label className="text-sm text-muted-foreground mb-2 block">Describe your content</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="E.g., Create an engaging post about our new AI-powered features for tech-savvy entrepreneurs..."
          className="w-full h-24 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
      </div>

      <Button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full"
        variant="glow"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Wand2 className="h-4 w-4" />
            Generate Content
          </>
        )}
      </Button>

      {/* Generated Content */}
      {generatedContent && (
        <div className="mt-6 rounded-xl bg-muted/50 border border-border p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-primary">Generated Content</span>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleGenerate}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm whitespace-pre-wrap">{generatedContent}</p>
        </div>
      )}
    </div>
  );
}
