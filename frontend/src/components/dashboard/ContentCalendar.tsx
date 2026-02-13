import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Instagram, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

const platformIcons: Record<string, React.ElementType> = {
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
};

const platformColors: Record<string, string> = {
  instagram: "bg-pink-500/20 text-pink-400",
  facebook: "bg-blue-500/20 text-blue-400",
  twitter: "bg-sky-500/20 text-sky-400",
  linkedin: "bg-blue-600/20 text-blue-400",
  youtube: "bg-red-500/20 text-red-400",
};

interface ScheduledPost {
  id: string;
  platform: string;
  time: string;
  title: string;
}

const mockSchedule: Record<number, ScheduledPost[]> = {
  5: [
    { id: "1", platform: "instagram", time: "09:00", title: "Product Launch Carousel" },
    { id: "2", platform: "twitter", time: "12:00", title: "Industry News Thread" },
  ],
  8: [
    { id: "3", platform: "linkedin", time: "10:00", title: "Case Study Post" },
  ],
  12: [
    { id: "4", platform: "youtube", time: "14:00", title: "Tutorial Video" },
    { id: "5", platform: "instagram", time: "18:00", title: "Behind the Scenes Reel" },
    { id: "6", platform: "facebook", time: "20:00", title: "Community Poll" },
  ],
  15: [
    { id: "7", platform: "twitter", time: "11:00", title: "Weekly Tips Thread" },
  ],
  18: [
    { id: "8", platform: "instagram", time: "09:00", title: "Testimonial Story" },
    { id: "9", platform: "linkedin", time: "15:00", title: "Team Spotlight" },
  ],
  22: [
    { id: "10", platform: "youtube", time: "16:00", title: "Q&A Session" },
  ],
  25: [
    { id: "11", platform: "instagram", time: "10:00", title: "Product Feature Reel" },
    { id: "12", platform: "facebook", time: "14:00", title: "Live Stream Announcement" },
  ],
};

export function ContentCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold">Content Calendar</h2>
          <p className="text-sm text-muted-foreground">
            {currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Days header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-xs text-muted-foreground font-medium py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-2">
        {emptyDays.map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const posts = mockSchedule[day] || [];
          const todayCheck = isToday(day);
          
          return (
            <div
              key={day}
              className={cn(
                "aspect-square rounded-xl border border-border/50 p-1.5 transition-all hover:border-primary/50 cursor-pointer group",
                todayCheck && "border-primary bg-primary/5",
                posts.length > 0 && "bg-muted/30"
              )}
            >
              <div className={cn(
                "text-xs font-medium mb-1",
                todayCheck ? "text-primary" : "text-muted-foreground"
              )}>
                {day}
              </div>
              <div className="flex flex-wrap gap-0.5">
                {posts.slice(0, 3).map((post) => {
                  const Icon = platformIcons[post.platform];
                  return (
                    <div
                      key={post.id}
                      className={cn(
                        "h-4 w-4 rounded flex items-center justify-center",
                        platformColors[post.platform]
                      )}
                    >
                      <Icon className="h-2.5 w-2.5" />
                    </div>
                  );
                })}
                {posts.length > 3 && (
                  <div className="h-4 w-4 rounded bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    +{posts.length - 3}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
