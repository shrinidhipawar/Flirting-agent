import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  BarChart3,
} from "lucide-react";

const stats = [
  { label: "Total Followers", value: "125.8K", change: "+12.5%", trend: "up", icon: Users },
  { label: "Total Reach", value: "2.4M", change: "+28.3%", trend: "up", icon: Eye },
  { label: "Engagement Rate", value: "6.8%", change: "+1.2%", trend: "up", icon: Heart },
  { label: "Avg. Comments", value: "342", change: "-5.1%", trend: "down", icon: MessageCircle },
];

const platformStats = [
  { platform: "Instagram", followers: "85.2K", engagement: "7.2%", growth: "+15.3%", posts: 24 },
  { platform: "TikTok", followers: "32.1K", engagement: "8.5%", growth: "+45.2%", posts: 18 },
  { platform: "YouTube", followers: "8.5K", engagement: "4.1%", growth: "+8.7%", posts: 4 },
];

const topContent = [
  { title: "Morning routine that changed my life", type: "Reel", views: "458K", likes: "32K", shares: "2.1K" },
  { title: "5 productivity hacks for creators", type: "Carousel", views: "312K", likes: "28K", shares: "1.8K" },
  { title: "How I went from 0 to 100K", type: "Video", views: "287K", likes: "24K", shares: "3.2K" },
];

export function InfluencerAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <p className="text-muted-foreground">
          Track your growth and engagement across all platforms
        </p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-muted-foreground" />
                <div className={`flex items-center gap-1 text-sm ${
                  stat.trend === "up" ? "text-green-500" : "text-red-500"
                }`}>
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {stat.change}
                </div>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platform Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Platform Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformStats.map((platform) => (
              <div
                key={platform.platform}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{platform.platform}</p>
                  <p className="text-sm text-muted-foreground">
                    {platform.posts} posts this month
                  </p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium">{platform.followers}</p>
                    <p className="text-muted-foreground">Followers</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">{platform.engagement}</p>
                    <p className="text-muted-foreground">Engagement</p>
                  </div>
                  <Badge variant="secondary" className="text-green-500">
                    {platform.growth}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Top Performing Content
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <div>
                    <p className="font-medium">{content.title}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {content.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-muted-foreground" />
                    {content.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="h-4 w-4 text-muted-foreground" />
                    {content.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                    {content.shares}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
