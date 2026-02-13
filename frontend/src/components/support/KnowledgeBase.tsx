import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Search,
  Plus,
  Book,
  FileText,
  HelpCircle,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  TrendingUp,
  Loader2,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Article {
  id: number;
  title: string;
  category: string;
  content: string;
  views: number;
  helpful: number;
  lastUpdated: string;
  status: "published" | "draft";
}

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  usageCount: number;
}

const initialArticles: Article[] = [
  { id: 1, title: "How to track your order", category: "Orders", content: "You can track your order by logging into your account...", views: 2450, helpful: 89, lastUpdated: "2 days ago", status: "published" },
  { id: 2, title: "Refund and return policy", category: "Refunds", content: "Our refund policy allows returns within 30 days...", views: 1890, helpful: 92, lastUpdated: "1 week ago", status: "published" },
  { id: 3, title: "Payment methods accepted", category: "Billing", content: "We accept all major credit cards, UPI, and net banking...", views: 1230, helpful: 85, lastUpdated: "3 days ago", status: "published" },
  { id: 4, title: "How to change your password", category: "Account", content: "To change your password, go to Settings > Security...", views: 980, helpful: 94, lastUpdated: "5 days ago", status: "published" },
  { id: 5, title: "Shipping times and delivery", category: "Delivery", content: "Standard delivery takes 3-5 business days...", views: 1560, helpful: 78, lastUpdated: "1 day ago", status: "published" },
];

const initialFAQs: FAQ[] = [
  { id: 1, question: "Where is my order?", answer: "You can track your order by logging into your account and clicking on 'My Orders'. You'll see real-time tracking updates there.", category: "Orders", usageCount: 1245 },
  { id: 2, question: "How do I get a refund?", answer: "To request a refund, go to 'My Orders', select the order, and click 'Request Refund'. Refunds are processed within 5-7 business days.", category: "Refunds", usageCount: 892 },
  { id: 3, question: "Can I change my delivery address?", answer: "Yes, you can change your delivery address before the order is shipped. Go to 'My Orders' and click 'Edit Address'.", category: "Delivery", usageCount: 567 },
  { id: 4, question: "What payment methods do you accept?", answer: "We accept credit/debit cards, UPI, net banking, and popular wallets like Paytm and PhonePe.", category: "Billing", usageCount: 445 },
];

const categories = ["All", "Orders", "Refunds", "Billing", "Delivery", "Account", "Technical"];

export function KnowledgeBase() {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [faqs, setFAQs] = useState<FAQ[]>(initialFAQs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"articles" | "faqs">("articles");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Article | FAQ | null>(null);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [newItemContent, setNewItemContent] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Orders");
  const { toast } = useToast();

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAIGenerate = async () => {
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke("generate-support-reply", {
        body: { 
          customerMessage: "Generate a helpful FAQ about common customer questions",
          customerName: "System",
          intent: "FAQ Generation",
          sentiment: "neutral",
          businessContext: {
            companyName: "SocialAI",
            industry: "Technology",
            tone: "helpful"
          }
        }
      });

      if (error) throw error;

      const newFAQ: FAQ = {
        id: Date.now(),
        question: "How do I contact customer support?",
        answer: data.reply || "You can contact our support team via email at support@example.com, through live chat on our website, or call us at 1800-XXX-XXXX.",
        category: "Account",
        usageCount: 0
      };

      setFAQs(prev => [...prev, newFAQ]);
      setActiveTab("faqs");
      
      toast({
        title: "FAQ Generated",
        description: "AI has created a new FAQ entry",
      });
    } catch (error) {
      console.error("Error generating FAQ:", error);
      // Fallback to mock generation
      const newFAQ: FAQ = {
        id: Date.now(),
        question: "How do I contact customer support?",
        answer: "You can contact our support team via email at support@example.com, through live chat on our website, or call us at 1800-XXX-XXXX. Our support hours are 9 AM - 9 PM IST.",
        category: "Account",
        usageCount: 0
      };
      setFAQs(prev => [...prev, newFAQ]);
      setActiveTab("faqs");
      
      toast({
        title: "FAQ Generated",
        description: "New FAQ entry has been created",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddArticle = () => {
    setNewItemTitle("");
    setNewItemContent("");
    setNewItemCategory("Orders");
    setIsAddDialogOpen(true);
  };

  const handleSaveNewItem = () => {
    if (!newItemTitle.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a title",
        variant: "destructive",
      });
      return;
    }

    if (activeTab === "articles") {
      const newArticle: Article = {
        id: Date.now(),
        title: newItemTitle,
        content: newItemContent,
        category: newItemCategory,
        views: 0,
        helpful: 0,
        lastUpdated: "Just now",
        status: "draft"
      };
      setArticles(prev => [...prev, newArticle]);
    } else {
      const newFAQ: FAQ = {
        id: Date.now(),
        question: newItemTitle,
        answer: newItemContent,
        category: newItemCategory,
        usageCount: 0
      };
      setFAQs(prev => [...prev, newFAQ]);
    }

    setIsAddDialogOpen(false);
    toast({
      title: activeTab === "articles" ? "Article Created" : "FAQ Created",
      description: `"${newItemTitle}" has been added`,
    });
  };

  const handleEdit = (item: Article | FAQ) => {
    setEditingItem(item);
    if ('title' in item) {
      setNewItemTitle(item.title);
      setNewItemContent(item.content);
    } else {
      setNewItemTitle(item.question);
      setNewItemContent(item.answer);
    }
    setNewItemCategory(item.category);
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;

    if (activeTab === "articles" && 'title' in editingItem) {
      setArticles(prev => prev.map(a => 
        a.id === editingItem.id 
          ? { ...a, title: newItemTitle, content: newItemContent, category: newItemCategory, lastUpdated: "Just now" }
          : a
      ));
    } else if ('question' in editingItem) {
      setFAQs(prev => prev.map(f => 
        f.id === editingItem.id 
          ? { ...f, question: newItemTitle, answer: newItemContent, category: newItemCategory }
          : f
      ));
    }

    setIsEditDialogOpen(false);
    setEditingItem(null);
    toast({
      title: "Changes Saved",
      description: "Your changes have been saved successfully",
    });
  };

  const handleDeleteArticle = (id: number) => {
    const article = articles.find(a => a.id === id);
    setArticles(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Article Deleted",
      description: `"${article?.title}" has been removed`,
      variant: "destructive",
    });
  };

  const handleDeleteFAQ = (id: number) => {
    const faq = faqs.find(f => f.id === id);
    setFAQs(prev => prev.filter(f => f.id !== id));
    toast({
      title: "FAQ Deleted",
      description: `"${faq?.question}" has been removed`,
      variant: "destructive",
    });
  };

  const handlePublish = (id: number) => {
    setArticles(prev => prev.map(a => 
      a.id === id ? { ...a, status: a.status === "published" ? "draft" : "published" } : a
    ));
    const article = articles.find(a => a.id === id);
    toast({
      title: article?.status === "published" ? "Unpublished" : "Published",
      description: `"${article?.title}" is now ${article?.status === "published" ? "a draft" : "live"}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Knowledge Base</h2>
          <p className="text-muted-foreground">
            Manage FAQs and help articles for AI responses
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleAIGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            AI Generate
          </Button>
          <Button onClick={handleAddArticle}>
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "articles" ? "Add Article" : "Add FAQ"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{articles.length}</p>
                <p className="text-sm text-muted-foreground">Articles</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <HelpCircle className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{faqs.length}</p>
                <p className="text-sm text-muted-foreground">FAQs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <Eye className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(articles.reduce((a, b) => a + b.views, 0) / 1000).toFixed(1)}K</p>
                <p className="text-sm text-muted-foreground">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round(articles.reduce((a, b) => a + b.helpful, 0) / articles.length)}%</p>
                <p className="text-sm text-muted-foreground">Helpful Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-muted rounded-lg w-fit">
        <Button
          variant={activeTab === "articles" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("articles")}
        >
          <FileText className="h-4 w-4 mr-2" />
          Articles
        </Button>
        <Button
          variant={activeTab === "faqs" ? "default" : "ghost"}
          size="sm"
          onClick={() => setActiveTab("faqs")}
        >
          <HelpCircle className="h-4 w-4 mr-2" />
          FAQs
        </Button>
      </div>

      {/* Search and Categories */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm transition-all",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "articles" ? (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Book className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{article.title}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Badge variant="outline">{article.category}</Badge>
                        <span>{article.views} views</span>
                        <span>{article.helpful}% helpful</span>
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={article.status === "published" ? "default" : "secondary"}
                      className="cursor-pointer"
                      onClick={() => handlePublish(article.id)}
                    >
                      {article.status}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(article)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id} className="hover:shadow-md transition-shadow">
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <HelpCircle className="h-4 w-4 text-primary" />
                      <p className="font-medium">{faq.question}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {faq.answer}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <Badge variant="outline">{faq.category}</Badge>
                      <span>Used {faq.usageCount} times by AI</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEdit(faq)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDeleteFAQ(faq.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {activeTab === "articles" ? "Add New Article" : "Add New FAQ"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {activeTab === "articles" ? "Title" : "Question"}
              </label>
              <Input
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder={activeTab === "articles" ? "Article title..." : "Enter question..."}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {activeTab === "articles" ? "Content" : "Answer"}
              </label>
              <Textarea
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                placeholder={activeTab === "articles" ? "Article content..." : "Enter answer..."}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.filter(c => c !== "All").map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewItemCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      newItemCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewItem}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {activeTab === "articles" ? "Article" : "FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {activeTab === "articles" ? "Title" : "Question"}
              </label>
              <Input
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {activeTab === "articles" ? "Content" : "Answer"}
              </label>
              <Textarea
                value={newItemContent}
                onChange={(e) => setNewItemContent(e.target.value)}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Category</label>
              <div className="flex gap-2 flex-wrap">
                {categories.filter(c => c !== "All").map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNewItemCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-sm transition-all",
                      newItemCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
