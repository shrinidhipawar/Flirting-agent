import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, Star, Download, Eye, Heart, Upload, Plus, Trash2,
  TrendingUp, Users, Headphones, Globe, Zap, FileText, Bot,
  Sparkles, Store, User, Clock, CheckCircle, Edit, LogIn
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
interface MarketplaceTemplate {
  id: string;
  user_id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  capabilities: string[];
  tone: string;
  system_prompt: string;
  use_cases: string[];
  is_public: boolean;
  is_featured: boolean;
  downloads: number;
  created_at: string;
  average_rating?: number;
  is_favorited?: boolean;
}

const categories = [
  { id: "all", label: "All", icon: Sparkles },
  { id: "sales", label: "Sales", icon: TrendingUp },
  { id: "support", label: "Support", icon: Headphones },
  { id: "hr", label: "HR", icon: Users },
  { id: "marketing", label: "Marketing", icon: Globe },
  { id: "operations", label: "Operations", icon: Zap },
  { id: "finance", label: "Finance", icon: FileText },
  { id: "custom", label: "Custom", icon: Bot },
];

const iconOptions = ["🤖", "💼", "🎧", "👥", "📢", "⚙️", "💰", "🔧", "🎯", "🌱", "🚀", "💡", "🔥", "⭐", "🎨"];

// Default templates when database is empty
const defaultTemplates: MarketplaceTemplate[] = [
  {
    id: "default-sales",
    user_id: "system",
    name: "Sales Pro Agent",
    description: "Enterprise sales assistant that qualifies leads, handles objections, and books demos.",
    category: "sales",
    icon: "💼",
    capabilities: ["Lead Qualification", "Email Outreach", "Demo Scheduling"],
    tone: "Professional",
    system_prompt: "You are Sales Pro, an expert AI sales assistant...",
    use_cases: ["B2B Sales", "SaaS Companies"],
    is_public: true,
    is_featured: true,
    downloads: 1250,
    created_at: new Date().toISOString(),
    average_rating: 4.8,
  },
  {
    id: "default-support",
    user_id: "system",
    name: "Support Genius",
    description: "24/7 customer support agent that resolves tickets and delights customers.",
    category: "support",
    icon: "🎧",
    capabilities: ["Ticket Resolution", "FAQ Handling", "Escalation"],
    tone: "Friendly",
    system_prompt: "You are Support Genius, a world-class customer support AI...",
    use_cases: ["Help Desk", "Technical Support"],
    is_public: true,
    is_featured: true,
    downloads: 2100,
    created_at: new Date().toISOString(),
    average_rating: 4.9,
  },
  {
    id: "default-hr",
    user_id: "system",
    name: "HR Buddy",
    description: "Employee assistant for HR queries, onboarding, and policy questions.",
    category: "hr",
    icon: "👥",
    capabilities: ["Onboarding", "Leave Management", "Policy Q&A"],
    tone: "Warm & Supportive",
    system_prompt: "You are HR Buddy, a friendly HR assistant...",
    use_cases: ["Employee Onboarding", "HR Queries"],
    is_public: true,
    is_featured: false,
    downloads: 890,
    created_at: new Date().toISOString(),
    average_rating: 4.7,
  },
];

interface AgentMarketplaceProps {
  onUseTemplate?: (template: MarketplaceTemplate) => void;
}

export function AgentMarketplace({ onUseTemplate }: AgentMarketplaceProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [templates, setTemplates] = useState<MarketplaceTemplate[]>(defaultTemplates);
  const [myTemplates, setMyTemplates] = useState<MarketplaceTemplate[]>([]);
  const [favorites, setFavorites] = useState<MarketplaceTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState<MarketplaceTemplate | null>(null);
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const [activeTab, setActiveTab] = useState("browse");

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    category: "custom",
    icon: "🤖",
    capabilities: "",
    tone: "Professional",
    system_prompt: "",
    use_cases: "",
    is_public: true,
  });

  useEffect(() => {
    fetchTemplates();
    if (user) {
      fetchMyTemplates(user.id);
      fetchFavorites(user.id);
    }
  }, [user]);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('is_public', true)
        .order('downloads', { ascending: false });

      if (error) throw error;
      
      if (data && data.length > 0) {
        // Get ratings for each template
        const templatesWithRatings = await Promise.all(
          data.map(async (template) => {
            const { data: ratingData } = await supabase
              .rpc('get_template_rating', { p_template_id: template.id });
            return { ...template, average_rating: ratingData || 0 };
          })
        );
        setTemplates(templatesWithRatings);
      } else {
        // Use default templates if database is empty
        setTemplates(defaultTemplates);
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      // Fallback to defaults on error
      setTemplates(defaultTemplates);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTemplates = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('agent_templates')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyTemplates(data || []);
    } catch (error) {
      console.error('Error fetching my templates:', error);
    }
  };

  const fetchFavorites = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('template_favorites')
        .select('template_id')
        .eq('user_id', userId);

      if (error) throw error;
      
      if (data && data.length > 0) {
        const templateIds = data.map(f => f.template_id);
        const { data: favTemplates } = await supabase
          .from('agent_templates')
          .select('*')
          .in('id', templateIds);
        
        setFavorites(favTemplates || []);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const publishTemplate = async () => {
    if (!user) {
      toast.error("Please sign in to publish templates");
      return;
    }

    if (!newTemplate.name.trim() || !newTemplate.description.trim() || !newTemplate.system_prompt.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const { error } = await supabase
        .from('agent_templates')
        .insert({
          user_id: user.id,
          name: newTemplate.name,
          description: newTemplate.description,
          category: newTemplate.category as any,
          icon: newTemplate.icon,
          capabilities: newTemplate.capabilities.split(',').map(c => c.trim()).filter(Boolean),
          tone: newTemplate.tone,
          system_prompt: newTemplate.system_prompt,
          use_cases: newTemplate.use_cases.split(',').map(u => u.trim()).filter(Boolean),
          is_public: newTemplate.is_public,
        });

      if (error) throw error;

      toast.success("Template published successfully!");
      setShowPublishDialog(false);
      setNewTemplate({
        name: "",
        description: "",
        category: "custom",
        icon: "🤖",
        capabilities: "",
        tone: "Professional",
        system_prompt: "",
        use_cases: "",
        is_public: true,
      });
      fetchTemplates();
      fetchMyTemplates(user.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to publish template");
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      const { error } = await supabase
        .from('agent_templates')
        .delete()
        .eq('id', templateId);

      if (error) throw error;

      toast.success("Template deleted");
      if (user) {
        fetchMyTemplates(user.id);
      }
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete template");
    }
  };

  const toggleFavorite = async (templateId: string) => {
    if (!user) {
      toast.error("Please sign in to favorite templates");
      return;
    }

    const isFavorited = favorites.some(f => f.id === templateId);

    try {
      if (isFavorited) {
        await supabase
          .from('template_favorites')
          .delete()
          .eq('template_id', templateId)
          .eq('user_id', user.id);
        toast.success("Removed from favorites");
      } else {
        await supabase
          .from('template_favorites')
          .insert({ template_id: templateId, user_id: user.id });
        toast.success("Added to favorites");
      }
      fetchFavorites(user.id);
    } catch (error: any) {
      toast.error(error.message || "Failed to update favorites");
    }
  };

  const useTemplate = async (template: MarketplaceTemplate) => {
    try {
      // Only increment for non-default templates
      if (!template.id.startsWith('default-')) {
        await supabase.rpc('increment_template_downloads', { template_id: template.id });
      }
      
      if (onUseTemplate) {
        onUseTemplate(template);
      }
      toast.success(`Template "${template.name}" applied!`, {
        description: "Your agent is now configured with this template.",
      });
      setPreviewTemplate(null);
    } catch (error) {
      console.error('Error:', error);
      // Still apply the template even if increment fails
      if (onUseTemplate) {
        onUseTemplate(template);
      }
      toast.success(`Template "${template.name}" applied!`);
      setPreviewTemplate(null);
    }
  };

  const rateTemplate = async (templateId: string, rating: number) => {
    if (!user) {
      toast.error("Please sign in to rate templates");
      return;
    }

    try {
      const { error } = await supabase
        .from('template_ratings')
        .upsert({ 
          template_id: templateId, 
          user_id: user.id, 
          rating 
        }, { 
          onConflict: 'template_id,user_id' 
        });

      if (error) throw error;

      toast.success(`Rated ${rating} stars`);
      fetchTemplates();
    } catch (error: any) {
      toast.error(error.message || "Failed to rate template");
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  const TemplateCard = ({ template, showActions = false }: { template: MarketplaceTemplate; showActions?: boolean }) => (
    <Card className="glass hover:border-primary/30 transition-all cursor-pointer">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <span className="text-2xl">{template.icon}</span>
          <div className="flex items-center gap-2">
            {template.average_rating !== undefined && template.average_rating > 0 && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs font-medium">{template.average_rating.toFixed(1)}</span>
              </div>
            )}
            {user && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite(template.id);
                }}
              >
                <Heart className={`h-4 w-4 ${favorites.some(f => f.id === template.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            )}
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
            {showActions && (
              <Button size="sm" variant="ghost" className="text-destructive" onClick={(e) => {
                e.stopPropagation();
                deleteTemplate(template.id);
              }}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" onClick={(e) => {
              e.stopPropagation();
              useTemplate(template);
            }}>
              Use
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass gradient-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-primary to-secondary">
                <Store className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Agent Marketplace</h2>
                <p className="text-muted-foreground">Discover and share AI agent templates</p>
              </div>
            </div>
            {user ? (
              <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-primary to-secondary">
                    <Upload className="h-4 w-4 mr-2" />
                    Publish Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Publish Agent Template</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="space-y-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Template Name *</Label>
                          <Input 
                            placeholder="My Amazing Agent"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Category</Label>
                          <Select 
                            value={newTemplate.category}
                            onValueChange={(v) => setNewTemplate({...newTemplate, category: v})}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sales">Sales</SelectItem>
                              <SelectItem value="support">Support</SelectItem>
                              <SelectItem value="hr">HR</SelectItem>
                              <SelectItem value="marketing">Marketing</SelectItem>
                              <SelectItem value="operations">Operations</SelectItem>
                              <SelectItem value="finance">Finance</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Icon</Label>
                        <div className="flex flex-wrap gap-2">
                          {iconOptions.map((icon) => (
                            <Button
                              key={icon}
                              variant={newTemplate.icon === icon ? "default" : "outline"}
                              size="sm"
                              className="text-xl h-10 w-10 p-0"
                              onClick={() => setNewTemplate({...newTemplate, icon})}
                            >
                              {icon}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea 
                          placeholder="Describe what this agent does..."
                          value={newTemplate.description}
                          onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Tone</Label>
                          <Input 
                            placeholder="Professional & Friendly"
                            value={newTemplate.tone}
                            onChange={(e) => setNewTemplate({...newTemplate, tone: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Capabilities (comma-separated)</Label>
                          <Input 
                            placeholder="Email, CRM, Analytics"
                            value={newTemplate.capabilities}
                            onChange={(e) => setNewTemplate({...newTemplate, capabilities: e.target.value})}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Use Cases (comma-separated)</Label>
                        <Input 
                          placeholder="Lead Generation, Customer Support"
                          value={newTemplate.use_cases}
                          onChange={(e) => setNewTemplate({...newTemplate, use_cases: e.target.value})}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>System Prompt *</Label>
                        <Textarea 
                          placeholder="You are an AI agent that..."
                          className="min-h-[150px]"
                          value={newTemplate.system_prompt}
                          onChange={(e) => setNewTemplate({...newTemplate, system_prompt: e.target.value})}
                        />
                      </div>

                      <Button onClick={publishTemplate} className="w-full">
                        <Upload className="h-4 w-4 mr-2" />
                        Publish to Marketplace
                      </Button>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            ) : (
              <Button 
                className="bg-gradient-to-r from-primary to-secondary"
                onClick={() => navigate('/auth')}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Sign In to Publish
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Browse
          </TabsTrigger>
          <TabsTrigger value="my-templates" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            My Templates
          </TabsTrigger>
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Favorites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          {/* Search and Filters */}
          <Card className="glass">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search marketplace..."
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
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Card key={i} className="glass animate-pulse">
                  <CardContent className="p-5 h-48" />
                </Card>
              ))}
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates found</p>
              <p className="text-sm mt-2">Be the first to publish a template!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="my-templates" className="space-y-6">
          {!user ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Sign in to view your templates</h3>
                <p className="text-muted-foreground mb-4">Create and manage your published templates</p>
              </CardContent>
            </Card>
          ) : myTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myTemplates.map(template => (
                <TemplateCard key={template.id} template={template} showActions />
              ))}
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Plus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No templates yet</h3>
                <p className="text-muted-foreground mb-4">Publish your first agent template to the marketplace</p>
                <Button onClick={() => setShowPublishDialog(true)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Publish Template
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="favorites" className="space-y-6">
          {!user ? (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Sign in to view favorites</h3>
                <p className="text-muted-foreground">Save your favorite templates for quick access</p>
              </CardContent>
            </Card>
          ) : favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          ) : (
            <Card className="glass">
              <CardContent className="p-12 text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                <p className="text-muted-foreground">Browse the marketplace and save templates you like</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

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
                <div className="flex items-center gap-4 flex-wrap">
                  <Badge className={getCategoryColor(previewTemplate.category)}>
                    {previewTemplate.category}
                  </Badge>
                  {previewTemplate.average_rating !== undefined && previewTemplate.average_rating > 0 && (
                    <div className="flex items-center gap-1 text-yellow-400">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{previewTemplate.average_rating.toFixed(1)}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Download className="h-4 w-4" />
                    {previewTemplate.downloads.toLocaleString()} uses
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(previewTemplate.created_at).toLocaleDateString()}
                  </div>
                </div>

                <p className="text-muted-foreground">{previewTemplate.description}</p>

                {user && (
                  <div>
                    <h4 className="font-medium mb-2">Rate this template</h4>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Button
                          key={star}
                          size="sm"
                          variant="ghost"
                          onClick={() => rateTemplate(previewTemplate.id, star)}
                        >
                          <Star className="h-5 w-5 text-yellow-400" />
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {previewTemplate.capabilities.length > 0 && (
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
                )}

                <div>
                  <h4 className="font-medium mb-2">Tone: {previewTemplate.tone}</h4>
                </div>

                {previewTemplate.use_cases.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      Use Cases
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {previewTemplate.use_cases.map((uc, i) => (
                        <Badge key={i} variant="secondary">{uc}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    System Prompt
                  </h4>
                  <pre className="text-xs text-muted-foreground bg-background/50 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap max-h-[200px] overflow-y-auto">
                    {previewTemplate.system_prompt}
                  </pre>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    onClick={() => useTemplate(previewTemplate)}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Use This Template
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => toggleFavorite(previewTemplate.id)}
                  >
                    <Heart className={`h-4 w-4 mr-2 ${favorites.some(f => f.id === previewTemplate.id) ? "fill-red-500 text-red-500" : ""}`} />
                    {favorites.some(f => f.id === previewTemplate.id) ? "Favorited" : "Favorite"}
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