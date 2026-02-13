import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  User,
  Palette,
  Target,
  Sparkles,
  Check,
  ChevronRight,
  Instagram,
  Youtube,
  Music2,
  Twitter,
  Loader2,
} from "lucide-react";

const niches = [
  "Lifestyle", "Tech", "Fashion", "Fitness", "Travel", "Food",
  "Business", "Education", "Gaming", "Beauty", "Finance", "Parenting",
];

const platforms = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "tiktok", label: "TikTok", icon: Music2 },
  { id: "twitter", label: "X (Twitter)", icon: Twitter },
];

const tones = [
  { id: "casual", label: "Casual & Fun", emoji: "😄" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "inspirational", label: "Inspirational", emoji: "✨" },
  { id: "edgy", label: "Edgy & Bold", emoji: "🔥" },
  { id: "educational", label: "Educational", emoji: "📚" },
];

const visualStyles = [
  { id: "minimal", label: "Minimal & Clean" },
  { id: "colorful", label: "Bright & Colorful" },
  { id: "dark", label: "Dark & Moody" },
  { id: "vintage", label: "Vintage Aesthetic" },
  { id: "luxury", label: "Luxury & Premium" },
];

export function InfluencerProfile() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("");
  const [followers, setFollowers] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const togglePlatform = (id: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const steps = [
    { number: 1, title: "Identity", icon: User },
    { number: 2, title: "Platforms", icon: Target },
    { number: 3, title: "Style", icon: Palette },
    { number: 4, title: "Goals", icon: Sparkles },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Influencer Profile</h2>
        <p className="text-muted-foreground">
          Build your AI-powered influencer brand identity
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.number} className="flex items-center">
            <div
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full",
                step === s.number
                  ? "bg-primary text-primary-foreground"
                  : step > s.number
                  ? "bg-green-500/20 text-green-500"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {step > s.number ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span className="text-sm hidden sm:inline">{s.title}</span>
            </div>
            {i < steps.length - 1 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Creator Name / Handle</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="@yourhandle or Creator Name"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Primary Niche</label>
                <div className="flex flex-wrap gap-2">
                  {niches.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => setSelectedNiche(niche)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm transition-all",
                        selectedNiche === niche
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {niche}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select all platforms you're active on
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map((platform) => (
                  <button
                    key={platform.id}
                    onClick={() => togglePlatform(platform.id)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-xl transition-all border-2",
                      selectedPlatforms.includes(platform.id)
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted hover:border-border"
                    )}
                  >
                    <platform.icon className="h-8 w-8" />
                    <span className="font-medium">{platform.label}</span>
                    {selectedPlatforms.includes(platform.id) && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="text-sm font-medium">Content Tone & Personality</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {tones.map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setSelectedTone(tone.id)}
                      className={cn(
                        "p-4 rounded-xl text-center transition-all border-2",
                        selectedTone === tone.id
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted hover:border-border"
                      )}
                    >
                      <span className="text-2xl block mb-2">{tone.emoji}</span>
                      <span className="text-sm">{tone.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-sm font-medium">Visual Style</label>
                <div className="flex flex-wrap gap-2">
                  {visualStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm transition-all",
                        selectedStyle === style.id
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {style.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Follower Count</label>
                  <Input
                    value={followers}
                    onChange={(e) => setFollowers(e.target.value)}
                    placeholder="e.g., 10,000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Monthly Goal</label>
                  <Input
                    value={monthlyGoal}
                    onChange={(e) => setMonthlyGoal(e.target.value)}
                    placeholder="e.g., 50,000 followers or ₹5L revenue"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Bio / About You</label>
                <textarea
                  placeholder="Tell us about your content style, what makes you unique, and your aspirations..."
                  className="w-full h-32 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setStep((prev) => Math.max(1, prev - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step < 4 ? (
              <Button onClick={() => setStep((prev) => Math.min(4, prev + 1))}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button 
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={async () => {
                  setIsCreating(true);
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  setIsCreating(false);
                  toast.success("Influencer profile created successfully!", {
                    description: "Your AI-powered brand identity is ready to use.",
                  });
                }}
                disabled={isCreating}
              >
                {isCreating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isCreating ? "Creating..." : "Create Influencer Profile"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile Preview */}
      {(name || selectedNiche || selectedPlatforms.length > 0) && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Profile Preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {name && <Badge variant="secondary">{name}</Badge>}
              {selectedNiche && <Badge variant="outline">{selectedNiche}</Badge>}
              {selectedPlatforms.map((p) => (
                <Badge key={p} variant="outline" className="capitalize">
                  {p}
                </Badge>
              ))}
              {selectedTone && (
                <Badge variant="outline" className="capitalize">
                  {tones.find((t) => t.id === selectedTone)?.label}
                </Badge>
              )}
              {selectedStyle && (
                <Badge variant="outline" className="capitalize">
                  {visualStyles.find((s) => s.id === selectedStyle)?.label}
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
