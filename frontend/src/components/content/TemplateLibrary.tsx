import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Search,
  Star,
  Copy,
  Heart,
  TrendingUp,
  FileText,
  Mail,
  MessageSquare,
  Video,
  Megaphone,
} from "lucide-react";

const categories = [
  { id: "all", label: "All Templates", icon: FileText },
  { id: "social", label: "Social Media", icon: MessageSquare },
  { id: "email", label: "Email", icon: Mail },
  { id: "video", label: "Video", icon: Video },
  { id: "ads", label: "Ad Copy", icon: Megaphone },
];

const templates = [
  {
    id: 1,
    name: "Hook-Story-Offer",
    category: "social",
    uses: 15420,
    rating: 4.9,
    isFavorite: true,
    description: "Classic viral framework: grab attention, tell story, make offer",
    framework: "🎣 HOOK: [Attention grabber]\n📖 STORY: [Relatable problem + transformation]\n💰 OFFER: [Clear CTA with value]",
  },
  {
    id: 2,
    name: "PAS (Problem-Agitate-Solution)",
    category: "email",
    uses: 12850,
    rating: 4.8,
    isFavorite: false,
    description: "Proven copywriting formula for high-converting emails",
    framework: "❌ PROBLEM: [Identify pain point]\n😰 AGITATE: [Make it worse]\n✅ SOLUTION: [Your product/service]",
  },
  {
    id: 3,
    name: "Before-After-Bridge",
    category: "ads",
    uses: 9870,
    rating: 4.7,
    isFavorite: true,
    description: "Show transformation from current state to desired outcome",
    framework: "😔 BEFORE: [Current struggle]\n🎉 AFTER: [Dream outcome]\n🌉 BRIDGE: [How to get there]",
  },
  {
    id: 4,
    name: "AIDA Framework",
    category: "ads",
    uses: 18500,
    rating: 4.9,
    isFavorite: false,
    description: "Attention, Interest, Desire, Action - timeless marketing classic",
    framework: "👀 ATTENTION: [Bold statement]\n🤔 INTEREST: [Curiosity hook]\n❤️ DESIRE: [Benefits & outcomes]\n🚀 ACTION: [Clear CTA]",
  },
  {
    id: 5,
    name: "Video Script - 60 Second",
    category: "video",
    uses: 7650,
    rating: 4.6,
    isFavorite: false,
    description: "Perfect for reels, TikToks, and YouTube Shorts",
    framework: "0-3s: Hook\n4-15s: Problem\n16-40s: Solution + proof\n41-55s: Benefits\n56-60s: CTA",
  },
  {
    id: 6,
    name: "Carousel Post Structure",
    category: "social",
    uses: 11200,
    rating: 4.8,
    isFavorite: true,
    description: "10-slide carousel optimized for maximum engagement",
    framework: "Slide 1: Hook headline\nSlide 2-3: Problem\nSlide 4-8: Solution steps\nSlide 9: Proof/testimonial\nSlide 10: CTA + save reminder",
  },
];

export function TemplateLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTemplate, setExpandedTemplate] = useState<number | null>(null);

  const filteredTemplates = templates.filter((template) => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Template Library</h2>
          <p className="text-muted-foreground">
            5000+ proven frameworks for any content type
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <TrendingUp className="h-3 w-3 mr-1" />
          5,000+ Templates
        </Badge>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all",
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-lg",
              expandedTemplate === template.id && "ring-2 ring-primary"
            )}
            onClick={() =>
              setExpandedTemplate(
                expandedTemplate === template.id ? null : template.id
              )
            }
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <Badge variant="outline" className="capitalize">
                  {template.category}
                </Badge>
                <button
                  className="text-muted-foreground hover:text-red-500 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      template.isFavorite && "fill-red-500 text-red-500"
                    )}
                  />
                </button>
              </div>
              <CardTitle className="text-base">{template.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{template.rating}</span>
                </div>
                <span className="text-muted-foreground">
                  {template.uses.toLocaleString()} uses
                </span>
              </div>

              {expandedTemplate === template.id && (
                <div className="pt-3 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Framework:</p>
                  <pre className="text-xs bg-muted p-3 rounded-lg whitespace-pre-wrap font-mono">
                    {template.framework}
                  </pre>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1">
                      Use Template
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
