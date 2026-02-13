import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Bell,
  Volume2,
  VolumeX,
  MessageSquare,
  Ticket,
  AlertTriangle,
  Phone,
  Settings,
  Check,
  Trash2,
} from "lucide-react";
import { useNotifications, Notification } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

const notificationIcons = {
  message: MessageSquare,
  ticket: Ticket,
  escalation: AlertTriangle,
  call: Phone,
  system: Settings,
};

const notificationColors = {
  message: "text-green-500 bg-green-500/10",
  ticket: "text-blue-500 bg-blue-500/10",
  escalation: "text-red-500 bg-red-500/10",
  call: "text-cyan-500 bg-cyan-500/10",
  system: "text-purple-500 bg-purple-500/10",
};

function NotificationItem({
  notification,
  onRead
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = notificationIcons[notification.type];

  return (
    <button
      onClick={() => onRead(notification.id)}
      className={cn(
        "w-full p-3 text-left transition-all hover:bg-muted/50 border-b border-border/50",
        !notification.read && "bg-primary/5"
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn("p-2 rounded-lg shrink-0", notificationColors[notification.type])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className={cn(
              "text-sm font-medium",
              notification.read ? "text-muted-foreground" : "text-foreground"
            )}>
              {notification.title}
            </p>
            {!notification.read && (
              <div className="h-2 w-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 break-words">
            {notification.description}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
          </p>
        </div>
      </div>
    </button>
  );
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    soundEnabled,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    toggleSound
  } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-3 border-b border-border">
          <h3 className="font-semibold text-sm">Notifications</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors"
              title={soundEnabled ? "Mute sounds" : "Enable sounds"}
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-muted-foreground" />
              ) : (
                <VolumeX className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title="Mark all as read"
                >
                  <Check className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={clearNotifications}
                  className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </button>
              </>
            )}
          </div>
        </div>

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No notifications yet</p>
            </div>
          ) : (
            <div>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={markAsRead}
                />
              ))}
            </div>
          )}
        </ScrollArea>

        {unreadCount > 0 && (
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              className="w-full text-xs h-8"
              onClick={markAllAsRead}
            >
              Mark all as read
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
