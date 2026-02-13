import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain,
  AlertTriangle,
  ThumbsUp,
  DollarSign,
  Clock,
  User,
  Target,
  Zap,
  Loader2,
} from "lucide-react";

interface LeadData {
  name: string;
  score: number;
  intent: string;
  urgency: "high" | "medium" | "low";
  budget: string;
  objections: string[];
  emotionalSignals: string[];
  conversionProbability: number;
  recommendedAction: string;
}

const mockLeadAnalysis: LeadData = {
  name: "Rajesh Kumar",
  score: 87,
  intent: "High purchase intent - actively comparing solutions",
  urgency: "high",
  budget: "₹50,000 - ₹1,00,000",
  objections: [
    "Price concerns - comparing with competitors",
    "Wants to see ROI proof before committing",
    "Decision involves team approval",
  ],
  emotionalSignals: [
    "Frustrated with current solution",
    "Excited about automation features",
    "Time-pressured to make a decision",
  ],
  conversionProbability: 78,
  recommendedAction: "Offer case study + limited-time pilot program",
};

export function LeadAnalysis() {
  const [leadMessage, setLeadMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<LeadData | null>(null);

  const handleAnalyze = async () => {
    if (!leadMessage.trim()) return;
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setAnalysis(mockLeadAnalysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Lead Intelligence</h2>
        <p className="text-muted-foreground">
          AI-powered lead analysis and conversion scoring
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              Analyze Lead Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <textarea
              value={leadMessage}
              onChange={(e) => setLeadMessage(e.target.value)}
              placeholder="Paste the lead's message here...

Example: 'Hi, I saw your ad about the CRM software. We're a team of 15 and currently using spreadsheets. The pricing seems a bit high compared to others. Can you tell me more about what makes yours different?'"
              className="w-full h-40 rounded-xl bg-muted border border-border px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !leadMessage.trim()}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Analyzing Lead...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analyze Lead
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis ? (
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Lead Analysis</CardTitle>
                <Badge
                  variant={analysis.score >= 80 ? "default" : "secondary"}
                  className="text-xs"
                >
                  Score: {analysis.score}/100
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{analysis.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        analysis.urgency === "high"
                          ? "destructive"
                          : analysis.urgency === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {analysis.urgency} urgency
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {analysis.budget}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Conversion Probability
                </p>
                <div className="flex items-center gap-3">
                  <Progress value={analysis.conversionProbability} className="flex-1" />
                  <span className="text-sm font-bold text-primary">
                    {analysis.conversionProbability}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2">Intent</p>
                <p className="text-sm bg-green-500/10 text-green-600 p-2 rounded-lg">
                  <Target className="h-4 w-4 inline mr-2" />
                  {analysis.intent}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="flex items-center justify-center min-h-[300px]">
            <div className="text-center space-y-2">
              <Brain className="h-12 w-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">
                Paste a lead message to analyze
              </p>
            </div>
          </Card>
        )}
      </div>

      {/* Detailed Analysis */}
      {analysis && (
        <div className="grid gap-4 md:grid-cols-3">
          {/* Objections */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-500" />
                Objections Detected
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.objections.map((obj, i) => (
                <div
                  key={i}
                  className="text-sm p-2 bg-orange-500/10 rounded-lg border-l-2 border-orange-500"
                >
                  {obj}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emotional Signals */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-blue-500" />
                Emotional Signals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {analysis.emotionalSignals.map((signal, i) => (
                <div
                  key={i}
                  className="text-sm p-2 bg-blue-500/10 rounded-lg border-l-2 border-blue-500"
                >
                  {signal}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommended Action */}
          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                Recommended Action
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium mb-4">
                {analysis.recommendedAction}
              </p>
              <Button className="w-full" size="sm">
                Generate Closing Script
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
