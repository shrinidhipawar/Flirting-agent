import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  User,
  Building2,
  Mail,
  Phone,
  Globe,
  Calendar,
  Target,
  TrendingUp,
  FileText,
  MessageSquare,
  Clock,
  DollarSign,
} from "lucide-react";

interface LeadDetailsProps {
  conversationId: string;
}

export function LeadDetails({ conversationId }: LeadDetailsProps) {
  return (
    <div className="flex flex-col h-full border-l border-border overflow-y-auto">
      {/* Lead Header */}
      <div className="p-6 border-b border-border text-center">
        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white text-2xl font-bold mb-4">
          PS
        </div>
        <h3 className="text-xl font-semibold">Priya Sharma</h3>
        <p className="text-muted-foreground text-sm">Product Manager at TechCorp</p>
        
        {/* Lead Score */}
        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Lead Score</span>
            <span className="text-2xl font-bold text-emerald-400">85%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" />
          </div>
          <p className="text-xs text-emerald-400 mt-2">High conversion probability</p>
        </div>
      </div>

      {/* Lead Info */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Contact Info</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">priya.sharma@techcorp.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">TechCorp Pvt Ltd</span>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">www.techcorp.com</span>
          </div>
        </div>
      </div>

      {/* Deal Info */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Deal Information</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Expected Value</span>
            </div>
            <span className="text-sm font-medium">₹4,50,000</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Interest</span>
            </div>
            <span className="text-sm font-medium">Enterprise Plan</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Timeline</span>
            </div>
            <span className="text-sm font-medium">This Quarter</span>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">AI Insights</h4>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs text-primary mb-1">🎯 Next Best Action</p>
            <p className="text-sm">Send pricing proposal with 10% early-bird discount</p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-xs text-amber-400 mb-1">⚡ Urgency Detected</p>
            <p className="text-sm">Lead mentioned "urgent need" - prioritize follow-up</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-xs text-emerald-400 mb-1">📊 Buying Signal</p>
            <p className="text-sm">Asked for pricing details - high purchase intent</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4">
        <h4 className="text-sm font-medium mb-3 text-muted-foreground">Quick Actions</h4>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" className="justify-start">
            <FileText className="h-4 w-4 mr-2" />
            Proposal
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <MessageSquare className="h-4 w-4 mr-2" />
            Follow-up
          </Button>
          <Button variant="outline" size="sm" className="justify-start">
            <TrendingUp className="h-4 w-4 mr-2" />
            Add to CRM
          </Button>
        </div>
      </div>
    </div>
  );
}
