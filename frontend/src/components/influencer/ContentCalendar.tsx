import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Video,
  Image,
  FileText,
  Sparkles,
  Clock,
  TrendingUp,
  RefreshCw,
  Loader2,
  Copy,
  Check,
} from "lucide-react";

interface ContentItem {
  id: number;
  day: number;
  type: "reel" | "post" | "story" | "carousel";
  title: string;
  time: string;
  platform: string;
  viralScore: number;
}

const generateMockCalendar = (): ContentItem[] => {
  const titles = [
    "Morning routine hacks that changed my life",
    "Behind the scenes poll",
    "5 productivity tools I can't live without",
    "POV: When your side hustle becomes main income",
    "Value bomb thread on personal branding",
    "Reply to comment: How I started from zero",
    "My content creation setup (budget edition)",
    "Weekend Q&A session",
    "Top 3 mistakes new creators make",
    "How I plan my content week",
  ];
  const types: ContentItem["type"][] = ["reel", "post", "story", "carousel"];
  const platforms = ["Instagram", "TikTok", "Twitter", "YouTube"];
  const times = ["9:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "7:00 PM"];

  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    day: (i % 7) + 1,
    type: types[Math.floor(Math.random() * types.length)],
    title: titles[Math.floor(Math.random() * titles.length)],
    time: times[Math.floor(Math.random() * times.length)],
    platform: platforms[Math.floor(Math.random() * platforms.length)],
    viralScore: Math.floor(Math.random() * 20) + 75,
  }));
};

const typeIcons = {
  reel: Video,
  post: FileText,
  story: Image,
  carousel: Image,
};

const typeColors = {
  reel: "bg-pink-500/10 text-pink-500 border-pink-500/30",
  post: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  story: "bg-orange-500/10 text-orange-500 border-orange-500/30",
  carousel: "bg-purple-500/10 text-purple-500 border-purple-500/30",
};

export function ContentCalendar() {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [calendarData, setCalendarData] = useState<ContentItem[]>(generateMockCalendar());
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [scriptDialogOpen, setScriptDialogOpen] = useState(false);
  const [currentScript, setCurrentScript] = useState<string>("");
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [copied, setCopied] = useState(false);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const getContentForDay = (day: number) => {
    return calendarData.filter((item) => item.day === day);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setCalendarData(generateMockCalendar());
    setIsRegenerating(false);
    toast.success("Content calendar regenerated with AI-optimized suggestions!");
  };

  const handleAutoSchedule = async () => {
    setIsScheduling(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsScheduling(false);
    toast.success("All content has been auto-scheduled for optimal posting times!");
  };

  const handleViewScript = async (item: ContentItem) => {
    setCurrentItem(item);
    setScriptDialogOpen(true);
    setIsGeneratingScript(true);
    setCurrentScript("");

    try {
      const { data, error } = await supabase.functions.invoke("generate-content-script", {
        body: {
          title: item.title,
          type: item.type,
          platform: item.platform,
          time: item.time,
        },
      });

      if (error) throw error;

      if (data?.script) {
        setCurrentScript(data.script);
      } else {
        throw new Error("No script generated");
      }
    } catch (error) {
      console.error("Error generating script:", error);
      toast.error("Failed to generate script. Please try again.");
      setScriptDialogOpen(false);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleCopyScript = async () => {
    await navigator.clipboard.writeText(currentScript);
    setCopied(true);
    toast.success("Script copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">30-Day Content Calendar</h2>
          <p className="text-muted-foreground">
            AI-generated content plan optimized for growth
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRegenerate} disabled={isRegenerating}>
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Regenerate
          </Button>
          <Button size="sm" onClick={handleAutoSchedule} disabled={isScheduling}>
            {isScheduling ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Auto-Schedule
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek((prev) => Math.max(1, prev - 1))}
          disabled={currentWeek === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium">
          Week {currentWeek} of 4 • December 2035
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeek((prev) => Math.min(4, prev + 1))}
          disabled={currentWeek === 4}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, index) => {
          const dayNum = index + 1;
          const content = getContentForDay(dayNum);
          const isSelected = selectedDay === dayNum;

          return (
            <div
              key={day}
              onClick={() => setSelectedDay(isSelected ? null : dayNum)}
              className={cn(
                "rounded-xl p-3 cursor-pointer transition-all min-h-[140px]",
                isSelected
                  ? "ring-2 ring-primary bg-primary/5"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{day}</span>
                <span className="text-xs text-muted-foreground">{dayNum}</span>
              </div>
              <div className="space-y-2">
                {content.slice(0, 2).map((item) => {
                  const Icon = typeIcons[item.type];
                  return (
                    <div
                      key={item.id}
                      className={cn(
                        "text-xs p-2 rounded-lg border",
                        typeColors[item.type]
                      )}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Icon className="h-3 w-3" />
                        <span className="capitalize">{item.type}</span>
                      </div>
                      <p className="truncate">{item.title}</p>
                    </div>
                  );
                })}
                {content.length > 2 && (
                  <p className="text-xs text-muted-foreground text-center">
                    +{content.length - 2} more
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Day {selectedDay} Content Plan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {getContentForDay(selectedDay).map((item) => {
              const Icon = typeIcons[item.type];
              return (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center",
                      typeColors[item.type]
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {item.type}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {item.platform}
                      </Badge>
                    </div>
                    <p className="font-medium">{item.title}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-500" />
                        {item.viralScore}% viral potential
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleViewScript(item)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    View Script
                  </Button>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Week Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-primary">8</p>
            <p className="text-sm text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-pink-500">3</p>
            <p className="text-sm text-muted-foreground">Reels</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-500">86%</p>
            <p className="text-sm text-muted-foreground">Avg Viral Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-orange-500">+12K</p>
            <p className="text-sm text-muted-foreground">Predicted Growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Script Dialog */}
      <Dialog open={scriptDialogOpen} onOpenChange={setScriptDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Generated Script
            </DialogTitle>
            {currentItem && (
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="capitalize">{currentItem.type}</Badge>
                <Badge variant="secondary">{currentItem.platform}</Badge>
                <span className="text-sm text-muted-foreground">{currentItem.time}</span>
              </div>
            )}
          </DialogHeader>
          
          {isGeneratingScript ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating your content script...</p>
            </div>
          ) : (
            <>
              <ScrollArea className="h-[400px] rounded-lg border bg-muted/30 p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {currentScript}
                </div>
              </ScrollArea>
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={handleCopyScript}>
                  {copied ? (
                    <Check className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Script"}
                </Button>
                <Button onClick={() => setScriptDialogOpen(false)}>
                  Done
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
