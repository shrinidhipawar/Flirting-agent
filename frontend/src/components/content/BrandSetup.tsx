import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Building2,
  Palette,
  Users,
  Target,
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";

const toneOptions = [
  { id: "professional", label: "Professional", description: "Formal, authoritative, trust-building" },
  { id: "friendly", label: "Friendly", description: "Warm, approachable, conversational" },
  { id: "premium", label: "Premium", description: "Luxurious, exclusive, sophisticated" },
  { id: "playful", label: "Playful", description: "Fun, energetic, youthful" },
  { id: "bold", label: "Bold", description: "Confident, disruptive, provocative" },
];

const industries = [
  "Technology", "E-commerce", "Healthcare", "Finance", "Education",
  "Real Estate", "Marketing", "SaaS", "Consulting", "Retail",
];

const goals = [
  { id: "awareness", label: "Brand Awareness", icon: "🎯" },
  { id: "engagement", label: "Engagement", icon: "💬" },
  { id: "leads", label: "Lead Generation", icon: "📈" },
  { id: "sales", label: "Direct Sales", icon: "💰" },
  { id: "loyalty", label: "Customer Loyalty", icon: "❤️" },
];

export function BrandSetup() {
  const [step, setStep] = useState(1);
  const [brandName, setBrandName] = useState("");
  const [industry, setIndustry] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [targetAudience, setTargetAudience] = useState("");

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId)
        ? prev.filter((g) => g !== goalId)
        : [...prev, goalId]
    );
  };

  const steps = [
    { number: 1, title: "Brand Info", icon: Building2 },
    { number: 2, title: "Brand Voice", icon: Palette },
    { number: 3, title: "Audience", icon: Users },
    { number: 4, title: "Goals", icon: Target },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Brand Setup</h2>
        <p className="text-muted-foreground">
          Configure your brand for AI-powered content generation
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

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Name</label>
                <Input
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Enter your brand name"
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm transition-all",
                        industry === ind
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-muted/80"
                      )}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand Description</label>
                <textarea
                  placeholder="Briefly describe what your brand does and its unique value proposition..."
                  className="w-full h-24 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Select the tone that best represents your brand voice
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {toneOptions.map((tone) => (
                  <button
                    key={tone.id}
                    onClick={() => setSelectedTone(tone.id)}
                    className={cn(
                      "p-4 rounded-xl text-left transition-all border-2",
                      selectedTone === tone.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted hover:border-border"
                    )}
                  >
                    <p className="font-medium">{tone.label}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tone.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <textarea
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="Describe your ideal customer (age, interests, pain points, aspirations)..."
                  className="w-full h-32 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">AI Suggestion</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on your industry, your audience likely includes: tech-savvy professionals aged 25-45,
                  seeking efficiency and growth, active on LinkedIn and Twitter.
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                What are your primary content goals? (Select all that apply)
              </p>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "p-4 rounded-xl text-left transition-all border-2 flex items-center gap-3",
                      selectedGoals.includes(goal.id)
                        ? "border-primary bg-primary/5"
                        : "border-transparent bg-muted hover:border-border"
                    )}
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-medium">{goal.label}</span>
                    {selectedGoals.includes(goal.id) && (
                      <Check className="h-4 w-4 text-primary ml-auto" />
                    )}
                  </button>
                ))}
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
              <Button className="bg-gradient-to-r from-primary to-secondary">
                <Sparkles className="h-4 w-4 mr-2" />
                Save Brand Profile
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Brand Summary */}
      {(brandName || industry || selectedTone) && (
        <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Brand Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {brandName && <Badge variant="secondary">{brandName}</Badge>}
              {industry && <Badge variant="outline">{industry}</Badge>}
              {selectedTone && (
                <Badge variant="outline" className="capitalize">
                  {selectedTone} Tone
                </Badge>
              )}
              {selectedGoals.map((g) => (
                <Badge key={g} variant="outline" className="capitalize">
                  {goals.find((goal) => goal.id === g)?.label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
