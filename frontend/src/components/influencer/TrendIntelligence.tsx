import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Music2,
  Hash,
  Users,
  Zap,
  ExternalLink,
  Play,
  Clock,
} from "lucide-react";

const trendingAudios = [
  { id: 1, name: "Monkeys Spinning Monkeys", uses: "2.4M", growth: "+340%", platform: "TikTok" },
  { id: 2, name: "Calm Down - Rema", uses: "1.8M", growth: "+180%", platform: "Instagram" },
  { id: 3, name: "Aesthetic Vibes", uses: "980K", growth: "+220%", platform: "TikTok" },
  { id: 4, name: "Motivation Speech Mix", uses: "650K", growth: "+150%", platform: "Instagram" },
];

const trendingTopics = [
  { topic: "AI side hustles", volume: "High", sentiment: "Positive", opportunity: 95 },
  { topic: "Quiet luxury lifestyle", volume: "Rising", sentiment: "Positive", opportunity: 88 },
  { topic: "Work from anywhere", volume: "High", sentiment: "Mixed", opportunity: 82 },
  { topic: "Digital minimalism", volume: "Rising", sentiment: "Positive", opportunity: 79 },
  { topic: "Content creator economy", volume: "High", sentiment: "Positive", opportunity: 91 },
];

const trendingHashtags = [
  { tag: "#growthmindset", posts: "45M", engagement: "4.2%", trend: "up" },
  { tag: "#sidehustle2035", posts: "12M", engagement: "5.8%", trend: "up" },
  { tag: "#contentcreator", posts: "89M", engagement: "3.1%", trend: "stable" },
  { tag: "#worksmarter", posts: "23M", engagement: "4.7%", trend: "up" },
  { tag: "#successhabits", posts: "34M", engagement: "3.9%", trend: "up" },
];

const competitorInsights = [
  { name: "@techbro_jay", followers: "1.2M", avgLikes: "45K", postFreq: "2/day", niche: "Tech" },
  { name: "@hustlequeen", followers: "890K", avgLikes: "32K", postFreq: "3/day", niche: "Business" },
  { name: "@mindset.daily", followers: "2.1M", avgLikes: "78K", postFreq: "1/day", niche: "Motivation" },
];

export function TrendIntelligence() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Trend Intelligence</h2>
        <p className="text-muted-foreground">
          Real-time trends, audios, and competitor analysis
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Trending Audios */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Music2 className="h-4 w-4 text-pink-500" />
              Trending Audios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingAudios.map((audio) => (
              <div
                key={audio.id}
                className="flex items-center gap-4 p-3 bg-muted rounded-lg"
              >
                <Button variant="ghost" size="sm" className="h-10 w-10 rounded-full">
                  <Play className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <p className="font-medium text-sm">{audio.name}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{audio.uses} uses</span>
                    <span>•</span>
                    <span>{audio.platform}</span>
                  </div>
                </div>
                <Badge variant="secondary" className="text-green-500">
                  {audio.growth}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trending Hashtags */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-500" />
              Trending Hashtags
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {trendingHashtags.map((hashtag) => (
              <div
                key={hashtag.tag}
                className="flex items-center justify-between p-3 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium text-sm">{hashtag.tag}</p>
                  <p className="text-xs text-muted-foreground">{hashtag.posts} posts</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-500">{hashtag.engagement}</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
                {hashtag.trend === "up" && (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            Content Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trendingTopics.map((topic) => (
              <div
                key={topic.topic}
                className="p-4 bg-muted rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium">{topic.topic}</p>
                  <Badge
                    variant={topic.volume === "High" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {topic.volume}
                  </Badge>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Opportunity Score</span>
                    <span className="font-medium text-primary">{topic.opportunity}%</span>
                  </div>
                  <Progress value={topic.opportunity} />
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Generate Content
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Competitor Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4 text-orange-500" />
            Competitor Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Creator</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Followers</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Avg Likes</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Post Freq</th>
                  <th className="text-left py-3 text-sm font-medium text-muted-foreground">Niche</th>
                  <th className="text-right py-3 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {competitorInsights.map((competitor) => (
                  <tr key={competitor.name} className="border-b border-border/50">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/50 to-secondary/50" />
                        <span className="font-medium">{competitor.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-sm">{competitor.followers}</td>
                    <td className="py-4 text-sm">{competitor.avgLikes}</td>
                    <td className="py-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        {competitor.postFreq}
                      </div>
                    </td>
                    <td className="py-4">
                      <Badge variant="outline">{competitor.niche}</Badge>
                    </td>
                    <td className="py-4 text-right">
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
