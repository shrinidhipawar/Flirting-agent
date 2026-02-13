import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Building2,
  Palette,
  Target,
  Sparkles,
  Check,
} from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  {
    id: 1,
    title: "Welcome to SocialAI 2035",
    subtitle: "Let's set up your AI-powered social media engine",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Tell us about your business",
    subtitle: "This helps us personalize your content strategy",
    icon: Building2,
  },
  {
    id: 3,
    title: "Define your brand",
    subtitle: "Set your visual identity and tone of voice",
    icon: Palette,
  },
  {
    id: 4,
    title: "Set your goals",
    subtitle: "What do you want to achieve with social media?",
    icon: Target,
  },
];

const industries = [
  "Technology", "E-commerce", "Healthcare", "Finance", "Education",
  "Real Estate", "Food & Beverage", "Fashion", "Travel", "Other"
];

const tones = [
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual & Friendly", emoji: "😊" },
  { id: "bold", label: "Bold & Edgy", emoji: "🔥" },
  { id: "inspiring", label: "Inspiring", emoji: "✨" },
  { id: "witty", label: "Witty & Humorous", emoji: "😄" },
];

const goals = [
  "Increase brand awareness",
  "Drive website traffic",
  "Generate leads",
  "Boost engagement",
  "Build community",
  "Increase sales",
];

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [businessName, setBusinessName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("");
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const toggleGoal = (goal: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg mx-4 glass rounded-3xl p-8 animate-slide-up">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-all",
                step.id <= currentStep ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary">
              <CurrentIcon className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">{steps[currentStep - 1].title}</h2>
          <p className="text-muted-foreground">{steps[currentStep - 1].subtitle}</p>
        </div>

        {/* Content */}
        <div className="mb-8">
          {currentStep === 1 && (
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                SocialAI automates your entire social media lifecycle — from strategy
                to content creation, scheduling, engagement, and analytics.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  "AI Content Generation",
                  "Auto Scheduling",
                  "Smart Analytics",
                  "Engagement Bot",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 p-3"
                  >
                    <Check className="h-4 w-4 text-primary" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Industry
                </label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm transition-all",
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
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Brand Tone of Voice
              </label>
              <div className="grid gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                      tone === t.id
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted hover:bg-muted/80 border border-transparent"
                    )}
                  >
                    <span className="text-2xl">{t.emoji}</span>
                    <span className="font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <label className="text-sm text-muted-foreground mb-2 block">
                Select your goals (choose multiple)
              </label>
              <div className="grid gap-2">
                {goals.map((goal) => (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                      selectedGoals.includes(goal)
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted hover:bg-muted/80 border border-transparent"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border transition-all",
                        selectedGoals.includes(goal)
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      )}
                    >
                      {selectedGoals.includes(goal) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <span className="font-medium">{goal}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button variant="outline" onClick={handleBack} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          <Button variant="glow" onClick={handleNext} className="flex-1">
            {currentStep === 4 ? "Get Started" : "Continue"}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
