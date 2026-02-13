import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

export interface Notification {
  id: string;
  type: "message" | "ticket" | "escalation" | "call" | "system";
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  priority?: "low" | "medium" | "high" | "urgent";
  data?: Record<string, unknown>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  soundEnabled: boolean;
  addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  toggleSound: () => void;
  playSound: (type: Notification["type"]) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Audio URLs (using base64 encoded simple beeps for reliability)
const createBeepSound = (frequency: number, duration: number): string => {
  const sampleRate = 44100;
  const samples = sampleRate * duration;
  const buffer = new Float32Array(samples);
  
  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    buffer[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-3 * t);
  }
  
  // Convert to 16-bit PCM
  const pcm = new Int16Array(samples);
  for (let i = 0; i < samples; i++) {
    pcm[i] = Math.max(-32768, Math.min(32767, buffer[i] * 32767));
  }
  
  // Create WAV file
  const wavHeader = new ArrayBuffer(44);
  const view = new DataView(wavHeader);
  
  // RIFF header
  view.setUint32(0, 0x52494646, false); // "RIFF"
  view.setUint32(4, 36 + pcm.byteLength, true);
  view.setUint32(8, 0x57415645, false); // "WAVE"
  
  // fmt chunk
  view.setUint32(12, 0x666d7420, false); // "fmt "
  view.setUint32(16, 16, true); // chunk size
  view.setUint16(20, 1, true); // audio format (PCM)
  view.setUint16(22, 1, true); // num channels
  view.setUint32(24, sampleRate, true); // sample rate
  view.setUint32(28, sampleRate * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  
  // data chunk
  view.setUint32(36, 0x64617461, false); // "data"
  view.setUint32(40, pcm.byteLength, true);
  
  const wavArray = new Uint8Array(wavHeader.byteLength + pcm.byteLength);
  wavArray.set(new Uint8Array(wavHeader), 0);
  wavArray.set(new Uint8Array(pcm.buffer), 44);
  
  const blob = new Blob([wavArray], { type: "audio/wav" });
  return URL.createObjectURL(blob);
};

// Pre-generate audio URLs for different notification types
const audioUrls: Record<string, string> = {};

const initAudio = () => {
  if (Object.keys(audioUrls).length === 0) {
    audioUrls.message = createBeepSound(800, 0.15);
    audioUrls.ticket = createBeepSound(600, 0.2);
    audioUrls.escalation = createBeepSound(1000, 0.3);
    audioUrls.call = createBeepSound(440, 0.5);
    audioUrls.system = createBeepSound(500, 0.1);
  }
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    initAudio();
  }, []);

  const playSound = useCallback((type: Notification["type"]) => {
    if (!soundEnabled) return;
    
    try {
      const audio = new Audio(audioUrls[type] || audioUrls.system);
      audio.volume = 0.5;
      audio.play().catch(err => console.log("Audio play failed:", err));
    } catch (error) {
      console.log("Sound playback error:", error);
    }
  }, [soundEnabled]);

  const addNotification = useCallback((notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50 notifications
    
    // Play sound
    playSound(notification.type);
    
    // Show toast
    toast({
      title: notification.title,
      description: notification.description,
      variant: notification.priority === "urgent" || notification.type === "escalation" ? "destructive" : "default",
    });
  }, [playSound, toast]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      soundEnabled,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      toggleSound,
      playSound,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
