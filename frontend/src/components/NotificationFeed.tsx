import { useEffect, useState, useRef } from "react";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { useNotifications } from "@/hooks/useNotifications";
import { MessageSquareHeart, Bell, Megaphone } from "lucide-react";

interface Message {
    id: number;
    content: string;
    type: "client_engagement_brand" | "user_utility_system";
    sent_at: string;
}

export function NotificationFeed({ userId }: { userId: number }) {
    const { toast } = useToast();
    const { addNotification } = useNotifications();
    const [lastMessageId, setLastMessageId] = useState<number | null>(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages: Message[] = await api.get(endpoints.userMessages(userId));

                // Handle empty state (e.g., fresh DB or cleared DB)
                if (messages.length === 0) {
                    if (lastMessageId !== null) {
                        setLastMessageId(null);
                    }
                    isFirstLoad.current = false;
                    return;
                }

                // Sort by ID to ensure we handle order correctly
                const sortedMsgs = messages.sort((a, b) => a.id - b.id);
                const latestId = sortedMsgs[sortedMsgs.length - 1].id;

                // DETECT DB RESET (IDs rolled back)
                if (lastMessageId !== null && latestId < lastMessageId) {
                    setLastMessageId(null);
                    return;
                }

                // If this is the very first load, just set the baseline (don't spam old notifications)
                if (isFirstLoad.current) {
                    setLastMessageId(latestId);
                    isFirstLoad.current = false;
                    return;
                }

                // If we have a new ID that is greater than our last seen ID OR we are recovering from a reset (null)
                if (lastMessageId === null || latestId > lastMessageId) {
                    // Find all NEW messages
                    const newMessages = lastMessageId === null
                        ? sortedMsgs
                        : sortedMsgs.filter(m => m.id > lastMessageId);

                    newMessages.forEach(msg => {
                        // FIRE THE NOTIFICATION (both toast AND bell icon)!
                        showNotification(msg);
                    });

                    setLastMessageId(latestId);
                }
            } catch (error) {
                console.error("Polling error:", error);
            }
        };

        // Poll every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [userId, lastMessageId]); // Re-run if userId or lastMessageId changes

    const showNotification = (msg: Message) => {
        // 1. FLIRTING MESSAGES (Brand)
        if (msg.type === "client_engagement_brand") {
            // Add to notification center (bell icon)
            addNotification({
                type: "message",
                title: "New Engagement! 🚀",
                description: msg.content,
                priority: "medium",
            });

            // Also show toast
            toast({
                title: "New Engagement! 🚀",
                description: msg.content,
                className: "bg-purple-100 border-purple-400 border-l-4 text-purple-900",
                action: <MessageSquareHeart className="h-8 w-8 text-purple-600" />,
                duration: 5000,
            });
        }
        // 2. UTILITY & BROADCASTS
        else {
            const isBroadcast = msg.content.toLowerCase().includes("system") || msg.content.toLowerCase().includes("policy");

            // Add to notification center (bell icon)
            addNotification({
                type: isBroadcast ? "system" : "message",
                title: isBroadcast ? "System Update" : "Reminder",
                description: msg.content,
                priority: isBroadcast ? "high" : "medium",
            });

            // Also show toast
            toast({
                title: isBroadcast ? "System Update" : "Reminder",
                description: msg.content,
                className: isBroadcast
                    ? "bg-blue-100 border-blue-400 border-l-4 text-blue-900"
                    : "bg-green-100 border-green-400 border-l-4 text-green-900",
                action: isBroadcast
                    ? <Megaphone className="h-6 w-6 text-blue-600" />
                    : <Bell className="h-6 w-6 text-green-600" />,
                duration: 5000,
            });
        }
    };

    return null; // This component is invisible, it just triggers toasts and adds to notification center
}
