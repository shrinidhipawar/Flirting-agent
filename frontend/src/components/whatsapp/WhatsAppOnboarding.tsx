import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  X,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  Store,
  Palette,
  Target,
  Check,
  Sparkles,
} from "lucide-react";

interface WhatsAppOnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

const steps = [
  { id: 1, title: "Welcome to WhatsApp AI", subtitle: "Your 24/7 sales assistant", icon: MessageSquare },
  { id: 2, title: "Business Details", subtitle: "Tell us about your business", icon: Store },
  { id: 3, title: "Sales Style", subtitle: "How should AI represent you?", icon: Palette },
  { id: 4, title: "Goals & Targets", subtitle: "What do you want to achieve?", icon: Target },
];

const industries = [
  "E-commerce", "SaaS", "Consulting", "Real Estate", "Healthcare",
  "Education", "Finance", "Manufacturing", "Retail", "Other"
];

const tones = [
  { id: "professional", label: "Professional & Formal", emoji: "💼", desc: "Best for B2B, enterprise clients" },
  { id: "friendly", label: "Friendly & Approachable", emoji: "😊", desc: "Best for B2C, retail" },
  { id: "persuasive", label: "Persuasive & Dynamic", emoji: "🎯", desc: "Best for high-ticket sales" },
  { id: "consultative", label: "Consultative & Helpful", emoji: "🤝", desc: "Best for services, consulting" },
];

const goals = [
  { id: "leads", label: "Generate more leads", target: "100+ leads/month" },
  { id: "conversion", label: "Improve conversion rate", target: "40%+ conversion" },
  { id: "response", label: "Faster response time", target: "<1 min response" },
  { id: "support", label: "24/7 customer support", target: "Always available" },
  { id: "revenue", label: "Increase revenue", target: "2x revenue growth" },
];

export function WhatsAppOnboarding({ isOpen, onClose }: WhatsAppOnboardingProps) {
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

  const toggleGoal = (goalId: string) => {
    setSelectedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((g) => g !== goalId) : [...prev, goalId]
    );
  };

  const CurrentIcon = steps[currentStep - 1].icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg mx-4 glass rounded-3xl p-8 animate-slide-up">
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
                step.id <= currentStep ? "bg-emerald-500" : "bg-muted"
              )}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600">
              <CurrentIcon className="h-8 w-8 text-white" />
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
                Your AI-powered WhatsApp assistant will handle sales, support, and lead generation 24/7.
              </p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  "Auto Lead Capture",
                  "Smart Sales Pitches",
                  "Instant Responses",
                  "Meeting Scheduling",
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3">
                    <Check className="h-4 w-4 text-emerald-400" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Industry</label>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm transition-all",
                        industry === ind
                          ? "bg-emerald-500 text-white"
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
            <div className="space-y-3">
              {tones.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all",
                    tone === t.id
                      ? "bg-emerald-500/10 border border-emerald-500"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  )}
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div>
                    <p className="font-medium">{t.label}</p>
                    <p className="text-xs text-muted-foreground">{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-3">
              {goals.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={cn(
                    "w-full flex items-center justify-between rounded-xl px-4 py-3 text-left transition-all",
                    selectedGoals.includes(goal.id)
                      ? "bg-emerald-500/10 border border-emerald-500"
                      : "bg-muted hover:bg-muted/80 border border-transparent"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded border transition-all",
                        selectedGoals.includes(goal.id)
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-muted-foreground"
                      )}
                    >
                      {selectedGoals.includes(goal.id) && (
                        <Check className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="font-medium">{goal.label}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{goal.target}</span>
                </button>
              ))}
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
          <Button
            onClick={handleNext}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
          >
            {currentStep === 4 ? (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Launch AI Assistant
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
