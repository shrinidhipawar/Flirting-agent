import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotificationProvider } from "@/hooks/useNotifications";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import FlirtingAgentMockup from "./pages/FlirtingAgentMockup";
import { NotificationFeed } from "./components/NotificationFeed"; // Import the feed
import WhatsAppAssistant from "./pages/WhatsAppAssistant";
import AdsCreator from "./pages/AdsCreator";
import CRMHub from "./pages/CRMHub";
import ContentGenerator from "./pages/ContentGenerator";
import SalesCloser from "./pages/SalesCloser";
import InfluencerEngine from "./pages/InfluencerEngine";
import SupportBot from "./pages/SupportBot";
import AgentBuilder from "./pages/AgentBuilder";
import Calendar from "./pages/Calendar";
import Platforms from "./pages/Platforms";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <NotificationProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* Global Notification Feed for User ID 1 (Ghost User) */}
            <NotificationFeed userId={1} />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<FlirtingAgentMockup />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/superadmin" element={<SuperAdminDashboard />} />
              <Route path="/whatsapp" element={<WhatsAppAssistant />} />
              <Route path="/ads" element={<AdsCreator />} />
              <Route path="/crm" element={<CRMHub />} />
              <Route path="/content" element={<ContentGenerator />} />
              <Route path="/sales" element={<SalesCloser />} />
              <Route path="/influencer" element={<InfluencerEngine />} />
              <Route path="/support" element={<SupportBot />} />
              <Route path="/agents" element={<AgentBuilder />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/platforms" element={<Platforms />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </NotificationProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
