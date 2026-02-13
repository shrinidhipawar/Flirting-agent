import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DollarSign,
  TrendingUp,
  Gift,
  Users,
  ShoppingBag,
  Mail,
  Star,
  ExternalLink,
  Sparkles,
  Copy,
} from "lucide-react";

const revenueStreams = [
  { id: 1, name: "Brand Deals", current: 45000, potential: 150000, icon: Gift },
  { id: 2, name: "Affiliate Marketing", current: 12000, potential: 50000, icon: ShoppingBag },
  { id: 3, name: "Digital Products", current: 8000, potential: 80000, icon: Star },
  { id: 4, name: "Community/Memberships", current: 3000, potential: 40000, icon: Users },
];

const brandOpportunities = [
  {
    id: 1,
    brand: "TechFlow App",
    category: "Productivity",
    offer: "₹50K - ₹1L",
    match: 95,
    type: "Sponsored Post",
  },
  {
    id: 2,
    brand: "ZenFocus",
    category: "Wellness",
    offer: "₹30K - ₹60K",
    match: 88,
    type: "Brand Ambassador",
  },
  {
    id: 3,
    brand: "CreatorKit Pro",
    category: "Creator Tools",
    offer: "₹40K + Commission",
    match: 92,
    type: "Affiliate",
  },
  {
    id: 4,
    brand: "MindSpace Academy",
    category: "Education",
    offer: "₹25K - ₹50K",
    match: 85,
    type: "Collaboration",
  },
];

const mockPitchEmail = `Subject: Partnership Opportunity - [Your Name] x [Brand Name]

Hi [Brand Contact],

I'm [Your Name], a content creator with [X followers] passionate about [niche]. I've been a genuine fan of [Brand Name] and love how you're [specific brand value].

Why this partnership makes sense:
• My audience of [X followers] aligns perfectly with your target demographic
• Average engagement rate of [X%] (industry average: 3%)
• Previous brand partnerships have driven [specific results]

I'd love to explore:
✅ Sponsored content (Reels/Stories/Posts)
✅ Long-term brand ambassador role
✅ Affiliate partnership with exclusive code

My content style focuses on [style], which matches [Brand's] aesthetic perfectly.

Would you be open to a quick 15-minute call this week?

Looking forward to creating something amazing together!

Best,
[Your Name]
[Social handles]
[Media kit link]`;

export function MonetizationHub() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Monetization Hub</h2>
        <p className="text-muted-foreground">
          Revenue streams, brand deals, and growth strategies
        </p>
      </div>

      {/* Revenue Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Monthly</p>
                <p className="text-2xl font-bold">₹68,000</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Monthly</p>
                <p className="text-2xl font-bold">₹3.2L</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Brand Inquiries</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Mail className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Deals</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Gift className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Streams */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Revenue Streams
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {revenueStreams.map((stream) => {
              const percentage = (stream.current / stream.potential) * 100;
              return (
                <div key={stream.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center">
                        <stream.icon className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium">{stream.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{stream.current.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        of ₹{stream.potential.toLocaleString()} potential
                      </p>
                    </div>
                  </div>
                  <Progress value={percentage} />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Brand Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Gift className="h-4 w-4 text-orange-500" />
              Brand Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {brandOpportunities.map((brand) => (
              <div
                key={brand.id}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center font-bold text-sm">
                    {brand.brand.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{brand.brand}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {brand.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {brand.type}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-500">{brand.offer}</p>
                  <p className="text-xs text-muted-foreground">{brand.match}% match</p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Opportunities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Pitch Generator */}
      <Card className="bg-gradient-to-br from-primary/5 to-secondary/5 border-primary/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              AI Brand Pitch Generator
            </CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4" />
              </Button>
              <Button size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Send Pitch
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap font-sans bg-background/50 p-4 rounded-lg max-h-[300px] overflow-y-auto">
            {mockPitchEmail}
          </pre>
          <div className="flex gap-2 mt-4">
            <Button variant="outline" className="flex-1">
              Customize for TechFlow App
            </Button>
            <Button variant="outline" className="flex-1">
              Generate for Different Brand
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Monetization Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">6-Month Monetization Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {[
                { month: "Month 1-2", goal: "Launch digital product (ebook/course)", target: "₹50K" },
                { month: "Month 3", goal: "Secure 2 brand deals", target: "₹1L" },
                { month: "Month 4", goal: "Start affiliate program", target: "₹30K/mo passive" },
                { month: "Month 5-6", goal: "Launch community membership", target: "₹40K/mo recurring" },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-4 pl-8">
                  <div className="absolute left-2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  <div className="flex-1 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-primary">{step.month}</span>
                      <Badge variant="secondary">{step.target}</Badge>
                    </div>
                    <p className="text-sm">{step.goal}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
