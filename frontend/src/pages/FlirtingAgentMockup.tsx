import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { endpoints, api } from "@/lib/api";
import { Input } from "@/components/ui/input";

// --- Types ---
interface User {
  id: number;
  name: string;
  segment: string;
  churn_risk_score: number;
  last_active_at: string;
  inactive_days: number;
  last_message?: {
    content: string;
    tone: string;
    timestamp: string;
  };
}

const FlirtingAgentMockup = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // --- 1. Fetch Users ---
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await api.get(endpoints.users);
      setUsers(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // --- 2. Trigger Engagement (THE FLIRTING AGENT) ---
  const handleTriggerEngagement = async () => {
    toast({ title: "Cycling...", description: "Agent is checking for inactive users..." });
    try {
      const res = await api.post(endpoints.triggerEngagement, {});
      toast({
        title: "Cycle Complete",
        description: `Agent sent ${res.messages_sent} messages!`,
      });
      // Refresh user list to show new messages
      fetchUsers();
    } catch (error) {
      toast({ title: "Error", description: "Agent failed to run", variant: "destructive" });
    }
  };

  // --- 3. Simulate User Activity ---
  const handleUserActivity = async (user: User) => {
    try {
      await api.post(endpoints.logActivity(user.id), {});
      toast({ title: "Activity Logged", description: `${user.name} opened the app!` });
      fetchUsers(); // Refresh list to see updated timestamp
    } catch (error) {
      toast({ title: "Error", description: "Failed to log activity", variant: "destructive" });
    }
  };

  // --- 4. Send Utility Reminder ---
  const handleSendUtility = async (user: User, reminderType: string = "appointment") => {
    try {
      let contextData = {};

      // Set context data based on reminder type
      switch (reminderType) {
        case "appointment":
          contextData = { date: "Tomorrow", time: "10:00 AM" };
          break;
        case "payment_due":
          contextData = { amount: "1,299", date: "Feb 15, 2026" };
          break;
        case "subscription_expiry":
          contextData = { date: "Feb 28, 2026" };
          break;
        case "cart_abandonment":
          contextData = {};
          break;
      }

      await api.post(endpoints.sendReminder, {
        user_id: user.id,
        reminder_type: reminderType,
        context_data: contextData
      });
      toast({ title: "Reminder Sent", description: `${reminderType} reminder sent to ${user.name}` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send reminder" });
    }
  };

  // --- 5. Send Broadcast ---
  const handleSendBroadcast = async (broadcastType: string) => {
    try {
      let contextData = {};

      // Set context data based on broadcast type
      if (broadcastType === "maintenance") {
        contextData = { date: "Feb 15, 2026", start_time: "2:00 AM", end_time: "4:00 AM" };
      } else if (broadcastType === "feature_release") {
        contextData = { feature_name: "AI Chat Assistant" };
      }

      await api.post(endpoints.broadcast, {
        broadcast_type: broadcastType,
        context_data: contextData
      });
      toast({ title: "Broadcast Sent", description: `${broadcastType} broadcast sent to all users!` });
    } catch (error) {
      toast({ title: "Error", description: "Failed to send broadcast" });
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 bg-slate-900 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-white">Flirting Agent Dashboard</h1>
          <p className="text-slate-400 mt-2">Monitor user engagement and trigger AI logic.</p>
        </div>
        <Button
          size="lg"
          onClick={handleTriggerEngagement}
          className="bg-purple-600 hover:bg-purple-700 text-white animate-pulse"
        >
          ❤️ Run Flirting Cycle
        </Button>
      </div>

      {/* NOTIFICATION TESTING SECTION */}
      <Card className="border-2 border-indigo-500 bg-gradient-to-br from-slate-800 to-slate-900">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white">
            🔔 Notification Testing Center
          </CardTitle>
          <CardDescription className="text-slate-300">
            Trigger different types of notifications to test the bell icon and toast system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Broadcasts Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-400">📢 Broadcasts (All Users)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="bg-blue-900/30 border-blue-500 hover:bg-blue-800/50 text-blue-200"
                onClick={() => handleSendBroadcast("system_update")}
              >
                🔄 System Update
              </Button>
              <Button
                variant="outline"
                className="bg-orange-900/30 border-orange-500 hover:bg-orange-800/50 text-orange-200"
                onClick={() => handleSendBroadcast("policy_update")}
              >
                📋 Policy Update
              </Button>
              <Button
                variant="outline"
                className="bg-red-900/30 border-red-500 hover:bg-red-800/50 text-red-200"
                onClick={() => handleSendBroadcast("maintenance")}
              >
                🔧 Maintenance
              </Button>
              <Button
                variant="outline"
                className="bg-green-900/30 border-green-500 hover:bg-green-800/50 text-green-200"
                onClick={() => handleSendBroadcast("feature_release")}
              >
                ✨ New Feature
              </Button>
            </div>
          </div>

          {/* Reminders Section */}
          <div>
            <h3 className="font-semibold text-lg mb-3 text-purple-400">⏰ Reminders (Ghost User)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                className="bg-purple-900/30 border-purple-500 hover:bg-purple-800/50 text-purple-200"
                onClick={() => {
                  const ghostUser = users.find(u => u.id === 1);
                  if (ghostUser) handleSendUtility(ghostUser, "appointment");
                }}
              >
                📅 Appointment
              </Button>
              <Button
                variant="outline"
                className="bg-yellow-900/30 border-yellow-500 hover:bg-yellow-800/50 text-yellow-200"
                onClick={() => {
                  const ghostUser = users.find(u => u.id === 1);
                  if (ghostUser) handleSendUtility(ghostUser, "payment_due");
                }}
              >
                💰 Payment Due
              </Button>
              <Button
                variant="outline"
                className="bg-pink-900/30 border-pink-500 hover:bg-pink-800/50 text-pink-200"
                onClick={() => {
                  const ghostUser = users.find(u => u.id === 1);
                  if (ghostUser) handleSendUtility(ghostUser, "subscription_expiry");
                }}
              >
                📆 Subscription
              </Button>
              <Button
                variant="outline"
                className="bg-teal-900/30 border-teal-500 hover:bg-teal-800/50 text-teal-200"
                onClick={() => {
                  const ghostUser = users.find(u => u.id === 1);
                  if (ghostUser) handleSendUtility(ghostUser, "cart_abandonment");
                }}
              >
                🛒 Cart Reminder
              </Button>
            </div>
          </div>

          <div className="text-sm text-slate-300 bg-slate-800 p-3 rounded border border-slate-600">
            💡 <strong>Tip:</strong> After clicking a button, check the bell icon (🔔) in the top-right of the homepage to see notifications appear!
          </div>
        </CardContent>
      </Card>

      {/* USER LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-all border-slate-700 bg-slate-800">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl text-white">{user.name}</CardTitle>
                  <CardDescription className="text-slate-400">
                    Segment: <span className="font-semibold text-blue-400">{user.segment}</span>
                  </CardDescription>
                </div>
                {user.churn_risk_score > 0.7 && (
                  <span className="bg-red-900/50 text-red-300 px-2 py-1 rounded text-xs font-bold">High Risk</span>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Inactive Days */}
              <div className="text-sm">
                <span className="text-slate-400">Inactive: </span>
                <span className={`font-semibold ${user.inactive_days > 3 ? 'text-red-400' : user.inactive_days > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {user.inactive_days} days
                </span>
              </div>

              {/* Churn Risk */}
              <div className="text-sm">
                <span className="text-slate-400">Churn Risk: </span>
                <span className={`font-semibold ${user.churn_risk_score > 0.7 ? 'text-red-400' : user.churn_risk_score > 0.4 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {(user.churn_risk_score * 100).toFixed(0)}%
                </span>
              </div>

              {/* Last Message - THE KEY PERSONALIZATION DISPLAY */}
              {user.last_message ? (
                <div className="bg-slate-700/50 p-3 rounded border border-slate-600 space-y-2">
                  <div className="text-xs text-slate-400 font-semibold">Last Message:</div>
                  <div className="text-sm text-white italic">"{user.last_message.content}"</div>
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-1 rounded font-semibold ${user.last_message.tone === 'playful' ? 'bg-purple-900/50 text-purple-300' :
                      user.last_message.tone === 'warm' ? 'bg-orange-900/50 text-orange-300' :
                        'bg-blue-900/50 text-blue-300'
                      }`}>
                      Tone: {user.last_message.tone}
                    </span>
                    <span className="text-slate-500">
                      {new Date(user.last_message.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-700/30 p-3 rounded border border-slate-600 text-center">
                  <span className="text-xs text-slate-500">No messages sent yet</span>
                </div>
              )}

              {/* Last Active */}
              <div className="text-xs text-slate-400">
                Last Active: {new Date(user.last_active_at + "Z").toLocaleString()}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-green-400 border-green-700 hover:bg-green-900/30"
                  onClick={() => handleUserActivity(user)}
                >
                  📱 Simulate Login
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-slate-300 border-slate-600 hover:bg-slate-700"
                  onClick={() => handleSendUtility(user)}
                >
                  🔔 Send Utility
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

    </div>
  );
};

export default FlirtingAgentMockup;
