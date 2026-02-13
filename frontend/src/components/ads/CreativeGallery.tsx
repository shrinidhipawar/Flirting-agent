import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, Heart, MessageCircle, Share, MoreHorizontal, TrendingUp, TrendingDown, Play } from "lucide-react";

interface Creative {
  id: string;
  name: string;
  type: "image" | "video" | "carousel";
  platform: string;
  status: "active" | "testing" | "paused";
  impressions: string;
  clicks: string;
  ctr: string;
  trend: "up" | "down";
  thumbnail: string;
}

const creatives: Creative[] = [
  {
    id: "1",
    name: "Summer Sale - Hero Image",
    type: "image",
    platform: "Meta",
    status: "active",
    impressions: "458K",
    clicks: "15.2K",
    ctr: "3.3%",
    trend: "up",
    thumbnail: "linear-gradient(135deg, #f97316, #ec4899)",
  },
  {
    id: "2",
    name: "Product Demo Video",
    type: "video",
    platform: "Meta",
    status: "active",
    impressions: "892K",
    clicks: "28.4K",
    ctr: "3.2%",
    trend: "up",
    thumbnail: "linear-gradient(135deg, #8b5cf6, #06b6d4)",
  },
  {
    id: "3",
    name: "Feature Carousel",
    type: "carousel",
    platform: "Meta",
    status: "testing",
    impressions: "124K",
    clicks: "3.8K",
    ctr: "3.1%",
    trend: "down",
    thumbnail: "linear-gradient(135deg, #10b981, #3b82f6)",
  },
  {
    id: "4",
    name: "UGC Testimonial",
    type: "video",
    platform: "TikTok",
    status: "active",
    impressions: "1.2M",
    clicks: "42.1K",
    ctr: "3.5%",
    trend: "up",
    thumbnail: "linear-gradient(135deg, #ef4444, #f97316)",
  },
  {
    id: "5",
    name: "Search Ad - Primary",
    type: "image",
    platform: "Google",
    status: "active",
    impressions: "320K",
    clicks: "9.6K",
    ctr: "3.0%",
    trend: "up",
    thumbnail: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
  },
  {
    id: "6",
    name: "LinkedIn Lead Gen",
    type: "image",
    platform: "LinkedIn",
    status: "paused",
    impressions: "85K",
    clicks: "2.1K",
    ctr: "2.5%",
    trend: "down",
    thumbnail: "linear-gradient(135deg, #0ea5e9, #6366f1)",
  },
];

const typeIcons = {
  image: "🖼️",
  video: "🎬",
  carousel: "📸",
};

const statusColors: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400",
  testing: "bg-amber-500/20 text-amber-400",
  paused: "bg-muted text-muted-foreground",
};

export function CreativeGallery() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Creative Library</h2>
          <p className="text-sm text-muted-foreground">Manage and analyze your ad creatives</p>
        </div>
        <Button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90">
          + New Creative
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {["All", "Images", "Videos", "Carousels"].map((filter, i) => (
          <button
            key={filter}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all",
              i === 0
                ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Creative Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creatives.map((creative, index) => (
          <div
            key={creative.id}
            className="glass rounded-xl overflow-hidden group animate-slide-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Thumbnail */}
            <div
              className="aspect-video relative flex items-center justify-center"
              style={{ background: creative.thumbnail }}
            >
              <span className="text-4xl">{typeIcons[creative.type]}</span>
              {creative.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-12 w-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="h-5 w-5 text-black ml-0.5" fill="currentColor" />
                  </div>
                </div>
              )}
              <span className={cn("absolute top-2 right-2 text-xs px-2 py-1 rounded-full", statusColors[creative.status])}>
                {creative.status}
              </span>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium text-sm">{creative.name}</h3>
                  <p className="text-xs text-muted-foreground">{creative.platform}</p>
                </div>
                <button className="p-1 hover:bg-muted rounded">
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                </button>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Impr.</p>
                  <p className="text-sm font-medium">{creative.impressions}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Clicks</p>
                  <p className="text-sm font-medium">{creative.clicks}</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-sm font-medium text-orange-400">{creative.ctr}</p>
                    {creative.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
