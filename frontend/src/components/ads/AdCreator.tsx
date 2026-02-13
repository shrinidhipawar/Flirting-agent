import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  Image,
  Video,
  Type,
  Target,
  DollarSign,
  Wand2,
  Loader2,
  Copy,
  RefreshCw,
  Check,
} from "lucide-react";

const platforms = [
  { id: "meta", label: "Meta Ads", icon: "📘", desc: "Facebook & Instagram" },
  { id: "google", label: "Google Ads", icon: "🔍", desc: "Search, Display, YouTube" },
  { id: "tiktok", label: "TikTok Ads", icon: "🎵", desc: "Short-form video" },
  { id: "linkedin", label: "LinkedIn Ads", icon: "💼", desc: "B2B professionals" },
];

const adFormats = [
  { id: "static", label: "Static Image", icon: Image },
  { id: "carousel", label: "Carousel", icon: Image },
  { id: "video", label: "Video Ad", icon: Video },
  { id: "story", label: "Story/Reel", icon: Video },
];

const objectives = [
  { id: "awareness", label: "Brand Awareness", desc: "Reach maximum people" },
  { id: "traffic", label: "Website Traffic", desc: "Drive clicks to site" },
  { id: "leads", label: "Lead Generation", desc: "Capture lead info" },
  { id: "sales", label: "Conversions/Sales", desc: "Drive purchases" },
];

export function AdCreator() {
  const [step, setStep] = useState(1);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["meta"]);
  const [selectedFormat, setSelectedFormat] = useState("static");
  const [selectedObjective, setSelectedObjective] = useState("leads");
  const [productDescription, setProductDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAd, setGeneratedAd] = useState<any>(null);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    
    setGeneratedAd({
      headline: "Transform Your Business with AI Automation",
      primaryText: "🚀 Stop wasting hours on repetitive tasks. Our AI-powered platform automates your workflow in minutes, not months.\n\n✅ 10x faster operations\n✅ 60% cost reduction\n✅ 24/7 intelligent automation\n\nJoin 10,000+ businesses already saving 20+ hours per week.",
      description: "Start your free trial today. No credit card required.",
      cta: "Start Free Trial",
      targeting: {
        age: "25-54",
        interests: ["Business automation", "SaaS", "Productivity", "Entrepreneurship"],
        locations: "USA, UK, Canada, Australia",
      },
      predictions: {
        cpc: "₹12-18",
        cpm: "₹180-250",
        ctr: "2.4-3.2%",
        roas: "4.2x",
      },
      budget: {
        daily: "₹5,000",
        weekly: "₹35,000",
        monthly: "₹1,50,000",
      },
    });
    setIsGenerating(false);
    setStep(4);
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-pink-500">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">AI Ad Creator</h2>
          <p className="text-sm text-muted-foreground">Generate high-converting ads in seconds</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                step >= s
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s ? <Check className="h-4 w-4" /> : s}
            </div>
            {s < 4 && (
              <div className={cn("flex-1 h-1 rounded-full", step > s ? "bg-gradient-to-r from-orange-500 to-pink-500" : "bg-muted")} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Platform Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="font-medium">Select Ad Platforms</h3>
          <div className="grid grid-cols-2 gap-3">
            {platforms.map((platform) => (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={cn(
                  "flex items-center gap-3 rounded-xl p-4 text-left transition-all",
                  selectedPlatforms.includes(platform.id)
                    ? "bg-orange-500/10 border border-orange-500"
                    : "bg-muted hover:bg-muted/80 border border-transparent"
                )}
              >
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <p className="font-medium">{platform.label}</p>
                  <p className="text-xs text-muted-foreground">{platform.desc}</p>
                </div>
              </button>
            ))}
          </div>
          <Button
            onClick={() => setStep(2)}
            disabled={selectedPlatforms.length === 0}
            className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
          >
            Continue
          </Button>
        </div>
      )}

      {/* Step 2: Format & Objective */}
      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Ad Format</h3>
            <div className="grid grid-cols-4 gap-2">
              {adFormats.map((format) => (
                <button
                  key={format.id}
                  onClick={() => setSelectedFormat(format.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 transition-all",
                    selectedFormat === format.id
                      ? "bg-orange-500/10 border border-orange-500"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  )}
                >
                  <format.icon className="h-6 w-6" />
                  <span className="text-xs">{format.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-3">Campaign Objective</h3>
            <div className="grid grid-cols-2 gap-2">
              {objectives.map((obj) => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedObjective(obj.id)}
                  className={cn(
                    "flex flex-col items-start rounded-xl p-4 transition-all",
                    selectedObjective === obj.id
                      ? "bg-orange-500/10 border border-orange-500"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  )}
                >
                  <span className="font-medium">{obj.label}</span>
                  <span className="text-xs text-muted-foreground">{obj.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Product Description */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="font-medium">Describe Your Product/Service</h3>
          <textarea
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            placeholder="E.g., We offer an AI-powered business automation platform that helps companies automate repetitive tasks, reduce costs by 60%, and scale operations effortlessly..."
            className="w-full h-32 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !productDescription.trim()}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Ad
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Generated Ad */}
      {step === 4 && generatedAd && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Generated Ad Creative</h3>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setStep(3)}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Ad Preview */}
          <div className="rounded-xl bg-muted/50 border border-border p-4">
            <div className="space-y-3">
              <div>
                <span className="text-xs text-orange-400">Headline</span>
                <p className="font-semibold">{generatedAd.headline}</p>
              </div>
              <div>
                <span className="text-xs text-orange-400">Primary Text</span>
                <p className="text-sm whitespace-pre-wrap">{generatedAd.primaryText}</p>
              </div>
              <div>
                <span className="text-xs text-orange-400">Description</span>
                <p className="text-sm">{generatedAd.description}</p>
              </div>
              <div className="inline-block">
                <span className="text-xs text-orange-400 block mb-1">CTA</span>
                <span className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                  {generatedAd.cta}
                </span>
              </div>
            </div>
          </div>

          {/* Predictions Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(generatedAd.predictions).map(([key, value]) => (
              <div key={key} className="rounded-xl bg-muted/50 p-3">
                <span className="text-xs text-muted-foreground uppercase">{key}</span>
                <p className="text-lg font-bold text-orange-400">{value as string}</p>
              </div>
            ))}
          </div>

          {/* Targeting */}
          <div className="rounded-xl bg-muted/50 border border-border p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-400" />
              Recommended Targeting
            </h4>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-xs text-muted-foreground">Age Range</span>
                <p>{generatedAd.targeting.age}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Locations</span>
                <p>{generatedAd.targeting.locations}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Interests</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {generatedAd.targeting.interests.slice(0, 2).map((i: string) => (
                    <span key={i} className="text-xs bg-muted px-2 py-0.5 rounded">{i}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Button onClick={() => setStep(1)} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90">
            Create Another Ad
          </Button>
        </div>
      )}
    </div>
  );
}
