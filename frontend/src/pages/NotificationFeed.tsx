import { useEffect, useState, useRef } from "react";
import { api, endpoints } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquareHeart, Bell, Megaphone } from "lucide-react";

interface Message {
    id: number;
    content: string;
    type: "client_engagement_brand" | "user_utility_system";
    sent_at: string;
}

export function NotificationFeed({ userId }: { userId: number }) {
    const { toast } = useToast();
    const [lastMessageId, setLastMessageId] = useState<number | null>(null);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages: Message[] = await api.get(endpoints.userMessages(userId));

                if (messages.length === 0) return;

                // Sort by ID to ensure we handle order correctly
                const sortedMsgs = messages.sort((a, b) => a.id - b.id);
                const latestId = sortedMsgs[sortedMsgs.length - 1].id;

                // If this is the very first load, just set the baseline (don't spam old notifications)
                if (isFirstLoad.current) {
                    setLastMessageId(latestId);
                    isFirstLoad.current = false;
                    return;
                }

                // If we have a new ID that is greater than our last seen ID
                if (lastMessageId !== null && latestId > lastMessageId) {
                    // Find all NEW messages
                    const newMessages = sortedMsgs.filter(m => m.id > lastMessageId);

                    newMessages.forEach(msg => {
                        // FIRE THE TOAST!
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
            toast({
                title: "Hey You! 😉", // Playful Title
                description: msg.content,
                className: "bg-purple-50 border-purple-200 border-l-4",
                action: <MessageSquareHeart className="h-8 w-8 text-purple-600" />,
                duration: 5000,
            });
        }
        // 2. UTILITY & BROADCASTS
        else {
            const isBroadcast = msg.content.toLowerCase().includes("system") || msg.content.toLowerCase().includes("policy");

            toast({
                title: isBroadcast ? "System Update" : "Reminder",
                description: msg.content,
                className: isBroadcast ? "bg-blue-50 border-blue-200" : "bg-green-50 border-green-200",
                action: isBroadcast ? <Megaphone className="h-6 w-6 text-blue-600" /> : <Bell className="h-6 w-6 text-green-600" />,
                duration: 5000,
            });
        }
    };

    return null; // This component is invisible, it just triggers toasts
}
