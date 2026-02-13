import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, Star, Download, Eye, Zap, Users, Headphones, TrendingUp, 
  ShoppingCart, Calendar, FileText, Globe, Bot, MessageSquare, 
  Mail, Database, Shield, Clock, CheckCircle, Sparkles
} from "lucide-react";
import { toast } from "sonner";

interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: "sales" | "support" | "hr" | "marketing" | "operations" | "finance";
  icon: string;
  rating: number;
  downloads: number;
  capabilities: string[];
  tone: string;
  systemPrompt: string;
  useCases: string[];
  featured?: boolean;
}

const templates: AgentTemplate[] = [
  {
    id: "sales-pro",
    name: "Sales Pro Agent",
    description: "Enterprise sales assistant that qualifies leads, handles objections, and books demos.",
    category: "sales",
    icon: "💼",
    rating: 4.9,
    downloads: 12500,
    capabilities: ["Lead Qualification", "Email Outreach", "Demo Scheduling", "CRM Updates"],
    tone: "Professional & Persuasive",
    systemPrompt: `You are Sales Pro, an expert AI sales assistant. Your mission is to qualify leads, handle objections professionally, and guide prospects towards booking demos.

## Personality
- Confident but not pushy
- Solution-focused
- Empathetic to customer pain points

## Capabilities
- Qualify leads based on BANT criteria
- Handle common objections with proven responses
- Schedule demos and follow-ups
- Update CRM with conversation insights

## Guidelines
- Always ask qualifying questions early
- Focus on value, not features
- Use social proof when relevant
- Escalate to human for complex negotiations`,
    useCases: ["B2B Sales", "SaaS Companies", "Enterprise Deals"],
    featured: true,
  },
  {
    id: "support-genius",
    name: "Support Genius",
    description: "24/7 customer support agent that resolves tickets, troubleshoots issues, and delights customers.",
    category: "support",
    icon: "🎧",
    rating: 4.8,
    downloads: 18200,
    capabilities: ["Ticket Resolution", "Troubleshooting", "FAQ Handling", "Escalation"],
    tone: "Friendly & Helpful",
    systemPrompt: `You are Support Genius, a world-class customer support AI. Your goal is to resolve issues quickly while ensuring customer satisfaction.

## Personality
- Patient and understanding
- Clear and concise
- Proactive in offering solutions

## Capabilities
- Answer FAQs instantly
- Troubleshoot common issues step-by-step
- Create and update support tickets
- Escalate complex issues to human agents

## Guidelines
- Acknowledge the customer's frustration first
- Provide step-by-step solutions
- Confirm resolution before closing
- Always offer additional help`,
    useCases: ["Help Desk", "Technical Support", "Customer Service"],
    featured: true,
  },
  {
    id: "hr-buddy",
    name: "HR Buddy",
    description: "Employee assistant for HR queries, onboarding, leave management, and policy questions.",
    category: "hr",
    icon: "👥",
    rating: 4.7,
    downloads: 8900,
    capabilities: ["Onboarding", "Leave Management", "Policy Q&A", "Benefits Info"],
    tone: "Warm & Supportive",
    systemPrompt: `You are HR Buddy, a friendly HR assistant helping employees with all their HR-related questions and requests.

## Personality
- Approachable and warm
- Confidential and trustworthy
- Efficient and organized

## Capabilities
- Guide new employees through onboarding
- Process leave requests
- Answer policy and benefits questions
- Direct employees to appropriate resources

## Guidelines
- Maintain strict confidentiality
- Be inclusive and unbiased
- Escalate sensitive matters to HR team
- Provide accurate policy information`,
    useCases: ["Employee Onboarding", "Leave Requests", "Policy Questions"],
  },
  {
    id: "marketing-maven",
    name: "Marketing Maven",
    description: "Creative marketing assistant for campaign ideas, content creation, and analytics insights.",
    category: "marketing",
    icon: "📢",
    rating: 4.6,
    downloads: 6700,
    capabilities: ["Content Ideas", "Campaign Planning", "Analytics", "Social Media"],
    tone: "Creative & Energetic",
    systemPrompt: `You are Marketing Maven, a creative marketing AI that helps generate ideas, plan campaigns, and analyze performance.

## Personality
- Creative and innovative
- Data-driven
- Trend-aware

## Capabilities
- Generate content ideas and copy
- Plan marketing campaigns
- Analyze campaign performance
- Suggest optimization strategies

## Guidelines
- Stay on brand
- Use data to support recommendations
- Consider target audience in all suggestions
- Balance creativity with conversion goals`,
    useCases: ["Content Marketing", "Campaign Planning", "Social Media"],
  },
  {
    id: "ops-commander",
    name: "Ops Commander",
    description: "Operations assistant for workflow automation, process optimization, and team coordination.",
    category: "operations",
    icon: "⚙️",
    rating: 4.5,
    downloads: 5400,
    capabilities: ["Workflow Automation", "Process Tracking", "Team Coordination", "Reporting"],
    tone: "Efficient & Direct",
    systemPrompt: `You are Ops Commander, an operations AI focused on efficiency, automation, and process improvement.

## Personality
- Systematic and organized
- Results-oriented
- Clear communicator

## Capabilities
- Automate repetitive workflows
- Track process metrics
- Coordinate cross-team tasks
- Generate operational reports

## Guidelines
- Prioritize efficiency
- Document all processes
- Identify bottlenecks proactively
- Suggest process improvements`,
    useCases: ["Process Automation", "Team Coordination", "Reporting"],
  },
  {
    id: "finance-advisor",
    name: "Finance Advisor",
    description: "Financial assistant for expense tracking, budget analysis, and financial reporting.",
    category: "finance",
    icon: "💰",
    rating: 4.7,
    downloads: 4200,
    capabilities: ["Expense Tracking", "Budget Analysis", "Financial Reports", "Forecasting"],
    tone: "Professional & Precise",
    systemPrompt: `You are Finance Advisor, a meticulous financial AI assistant helping with expense management and financial analysis.

## Personality
- Detail-oriented
- Accurate and precise
- Compliance-aware

## Capabilities
- Track and categorize expenses
- Analyze budgets vs actuals
- Generate financial reports
- Provide forecasting insights

## Guidelines
- Double-check all calculations
- Maintain audit trails
- Flag anomalies immediately
- Follow compliance requirements`,
    useCases: ["Expense Management", "Budget Planning", "Financial Analysis"],
  },
  {
    id: "lead-nurture",
    name: "Lead Nurture Bot",
    description: "Automated lead nurturing with personalized follow-ups and engagement scoring.",
    category: "sales",
    icon: "🌱",
    rating: 4.6,
    downloads: 7800,
    capabilities: ["Lead Scoring", "Email Sequences", "Engagement Tracking", "Personalization"],
    tone: "Personable & Persistent",
    systemPrompt: `You are Lead Nurture Bot, an AI focused on building relationships with leads through personalized, timely follow-ups.

## Personality
- Patient and persistent
- Personable
- Value-focused

## Capabilities
- Score leads based on engagement
- Send personalized follow-up sequences
- Track lead interactions
- Identify ready-to-buy signals

## Guidelines
- Never be pushy
- Add value in every interaction
- Personalize based on behavior
- Hand off hot leads promptly`,
    useCases: ["Lead Nurturing", "Email Marketing", "Sales Pipeline"],
  },
  {
    id: "tech-support",
    name: "Tech Support Wizard",
    description: "Technical support specialist for troubleshooting, bug reports, and technical documentation.",
    category: "support",
    icon: "🔧",
    rating: 4.8,
    downloads: 9100,
    capabilities: ["Troubleshooting", "Bug Reports", "Documentation", "Escalation"],
    tone: "Technical & Patient",
    systemPrompt: `You are Tech Support Wizard, a technical support AI expert at diagnosing and resolving technical issues.

## Personality
- Technically proficient
- Patient with all skill levels
- Systematic problem-solver

## Capabilities
- Diagnose technical issues
- Provide step-by-step solutions
- Create bug reports
- Access technical documentation

## Guidelines
- Gather system info first
- Explain in appropriate technical level
- Document solutions for knowledge base
- Escalate when needed`,
    useCases: ["Technical Support", "Bug Tracking", "Product Help"],
  },
  {
    id: "recruiter-ai",
    name: "Recruiter AI",
    description: "Recruitment assistant for candidate screening, interview scheduling, and talent pipeline.",
    category: "hr",
    icon: "🎯",
    rating: 4.5,
    downloads: 5600,
    capabilities: ["Resume Screening", "Interview Scheduling", "Candidate Communication", "Pipeline Management"],
    tone: "Professional & Welcoming",
    systemPrompt: `You are Recruiter AI, a talent acquisition assistant helping to find and engage the best candidates.

## Personality
- Professional and welcoming
- Fair and unbiased
- Efficient communicator

## Capabilities
- Screen resumes against job requirements
- Schedule interviews
- Communicate with candidates
- Manage talent pipeline

## Guidelines
- Be inclusive and unbiased
- Respond to candidates promptly
- Maintain confidentiality
- Provide great candidate experience`,
    useCases: ["Recruitment", "Talent Acquisition", "Interview Management"],
  },
];

const categories = [
  { id: "all", label: "All Templates", icon: Sparkles },
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "support", label: "Support", icon: Headphones },
  { id: "hr", label: "HR", icon: Users },
  { id: "marketing", label: "Marketing", icon: Globe },
  { id: "operations", label: "Operations", icon: Zap },
  { id: "finance", label: "Finance", icon: FileText },
];

interface TemplateGalleryProps {
  onUseTemplate?: (template: AgentTemplate) => void;
}

export function TemplateGallery({ onUseTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<AgentTemplate | null>(null);

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredTemplates = templates.filter(t => t.featured);

  const handleUseTemplate = (template: AgentTemplate) => {
    if (onUseTemplate) {
      onUseTemplate(template);
    }
    toast.success(`Template "${template.name}" applied!`, {
      description: "Your agent is now configured with this template.",
    });
    setPreviewTemplate(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "sales": return "bg-blue-500/20 text-blue-400";
      case "support": return "bg-green-500/20 text-green-400";
      case "hr": return "bg-purple-500/20 text-purple-400";
      case "marketing": return "bg-orange-500/20 text-orange-400";
      case "operations": return "bg-cyan-500/20 text-cyan-400";
      case "finance": return "bg-yellow-500/20 text-yellow-400";
      default: return "bg-muted/20 text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Featured Templates */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            Featured Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featuredTemplates.map(template => (
              <div 
                key={template.id}
                className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                onClick={() => setPreviewTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{template.icon}</span>
                    <div>
                      <h3 className="font-bold text-lg">{template.name}</h3>
                      <Badge className={getCategoryColor(template.category)}>
                        {template.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{template.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-3">{template.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Download className="h-3 w-3" />
                    {template.downloads.toLocaleString()} uses
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {template.capabilities.slice(0, 2).map((cap, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {cap}
                      </Badge>
                    ))}
                    {template.capabilities.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{template.capabilities.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card className="glass">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background/50"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <cat.icon className="h-4 w-4 mr-1" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Template Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map(template => (
          <Card 
            key={template.id} 
            className="glass hover:border-primary/30 transition-all cursor-pointer"
            onClick={() => setPreviewTemplate(template)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{template.icon}</span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star className="h-3 w-3 fill-current" />
                  <span className="text-xs font-medium">{template.rating}</span>
                </div>
              </div>
              <h3 className="font-semibold">{template.name}</h3>
              <Badge className={`mt-1 ${getCategoryColor(template.category)}`}>
                {template.category}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                {template.description}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Download className="h-3 w-3" />
                  {template.downloads.toLocaleString()}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={(e) => {
                    e.stopPropagation();
                    setPreviewTemplate(template);
                  }}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={(e) => {
                    e.stopPropagation();
                    handleUseTemplate(template);
                  }}>
                    Use
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No templates found matching your criteria</p>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span className="text-2xl">{previewTemplate?.icon}</span>
              {previewTemplate?.name}
            </DialogTitle>
          </DialogHeader>
          {previewTemplate && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 pr-4">
                <div className="flex items-center gap-4">
                  <Badge className={getCategoryColor(previewTemplate.category)}>
                    {previewTemplate.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{previewTemplate.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {previewTemplate.downloads.toLocaleString()} uses
                  </div>
                </div>

                <p className="text-muted-foreground">{previewTemplate.description}</p>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Zap className="h-4 w-4 text-primary" />
                    Capabilities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.capabilities.map((cap, i) => (
                      <Badge key={i} variant="outline">{cap}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-secondary" />
                    Tone: {previewTemplate.tone}
                  </h4>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    Use Cases
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {previewTemplate.useCases.map((uc, i) => (
                      <Badge key={i} variant="secondary">{uc}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    System Prompt Preview
                  </h4>
                  <pre className="text-xs text-muted-foreground bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {previewTemplate.systemPrompt}
                  </pre>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    onClick={() => handleUseTemplate(previewTemplate)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}