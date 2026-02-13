import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BookOpen, Upload, FileText, Globe, Database, Search, Trash2, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface KnowledgeSource {
  id: string;
  name: string;
  type: "pdf" | "doc" | "url" | "spreadsheet" | "database";
  status: "indexed" | "processing" | "error";
  chunks: number;
  lastUpdated: string;
  progress?: number;
}

const mockSources: KnowledgeSource[] = [
  { id: "1", name: "Product Catalog 2035.pdf", type: "pdf", status: "indexed", chunks: 234, lastUpdated: "2 hours ago" },
  { id: "2", name: "Customer Support SOP.docx", type: "doc", status: "indexed", chunks: 156, lastUpdated: "1 day ago" },
  { id: "3", name: "Pricing Sheet Q4.xlsx", type: "spreadsheet", status: "indexed", chunks: 45, lastUpdated: "3 days ago" },
  { id: "4", name: "https://docs.company.com", type: "url", status: "processing", chunks: 0, lastUpdated: "Processing...", progress: 45 },
  { id: "5", name: "FAQ Database", type: "database", status: "indexed", chunks: 892, lastUpdated: "5 min ago" },
];

export function KnowledgeManager() {
  const [sources, setSources] = useState<KnowledgeSource[]>(mockSources);
  const [searchQuery, setSearchQuery] = useState("");
  const [testQuery, setTestQuery] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showUrlDialog, setShowUrlDialog] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [showDbDialog, setShowDbDialog] = useState(false);
  const [dbConnection, setDbConnection] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="h-4 w-4 text-red-400" />;
      case "doc": return <FileText className="h-4 w-4 text-blue-400" />;
      case "url": return <Globe className="h-4 w-4 text-green-400" />;
      case "spreadsheet": return <FileText className="h-4 w-4 text-emerald-400" />;
      case "database": return <Database className="h-4 w-4 text-purple-400" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "indexed":
        return <Badge className="bg-green-500/20 text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Indexed</Badge>;
      case "processing":
        return <Badge className="bg-yellow-500/20 text-yellow-400"><Clock className="h-3 w-3 mr-1 animate-spin" />Processing</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400"><AlertCircle className="h-3 w-3 mr-1" />Error</Badge>;
      default:
        return null;
    }
  };

  const totalChunks = sources.reduce((acc, s) => acc + s.chunks, 0);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const fileType = file.name.endsWith('.pdf') ? 'pdf' : 
                      file.name.endsWith('.docx') || file.name.endsWith('.doc') ? 'doc' :
                      file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? 'spreadsheet' : 'doc';
      
      const newSource: KnowledgeSource = {
        id: Date.now().toString() + Math.random(),
        name: file.name,
        type: fileType,
        status: "processing",
        chunks: 0,
        lastUpdated: "Processing...",
        progress: 0,
      };
      
      setSources(prev => [...prev, newSource]);
      toast.info(`Uploading ${file.name}...`);
      
      // Simulate processing
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setSources(prev => prev.map(s => 
          s.id === newSource.id 
            ? { ...s, progress } 
            : s
        ));
        
        if (progress >= 100) {
          clearInterval(interval);
          setSources(prev => prev.map(s => 
            s.id === newSource.id 
              ? { ...s, status: "indexed", chunks: Math.floor(Math.random() * 200) + 50, lastUpdated: "Just now", progress: undefined } 
              : s
          ));
          toast.success(`${file.name} indexed successfully!`);
        }
      }, 300);
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addUrl = () => {
    if (!newUrl.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      name: newUrl,
      type: "url",
      status: "processing",
      chunks: 0,
      lastUpdated: "Processing...",
      progress: 0,
    };
    
    setSources(prev => [...prev, newSource]);
    setShowUrlDialog(false);
    setNewUrl("");
    toast.info("Crawling URL...");
    
    // Simulate processing
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setSources(prev => prev.map(s => 
        s.id === newSource.id 
          ? { ...s, progress } 
          : s
      ));
      
      if (progress >= 100) {
        clearInterval(interval);
        setSources(prev => prev.map(s => 
          s.id === newSource.id 
            ? { ...s, status: "indexed", chunks: Math.floor(Math.random() * 500) + 100, lastUpdated: "Just now", progress: undefined } 
            : s
        ));
        toast.success("URL indexed successfully!");
      }
    }, 200);
  };

  const connectDatabase = () => {
    if (!dbConnection.trim()) {
      toast.error("Please enter a connection string");
      return;
    }
    
    const newSource: KnowledgeSource = {
      id: Date.now().toString(),
      name: "Connected Database",
      type: "database",
      status: "processing",
      chunks: 0,
      lastUpdated: "Connecting...",
    };
    
    setSources(prev => [...prev, newSource]);
    setShowDbDialog(false);
    setDbConnection("");
    toast.info("Connecting to database...");
    
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === newSource.id 
          ? { ...s, status: "indexed", chunks: Math.floor(Math.random() * 1000) + 200, lastUpdated: "Just now" } 
          : s
      ));
      toast.success("Database connected and indexed!");
    }, 2000);
  };

  const deleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
    toast.success("Source removed");
  };

  const refreshSource = (id: string) => {
    setSources(prev => prev.map(s => 
      s.id === id 
        ? { ...s, status: "processing", lastUpdated: "Refreshing..." } 
        : s
    ));
    toast.info("Refreshing source...");
    
    setTimeout(() => {
      setSources(prev => prev.map(s => 
        s.id === id 
          ? { ...s, status: "indexed", lastUpdated: "Just now", chunks: s.chunks + Math.floor(Math.random() * 20) } 
          : s
      ));
      toast.success("Source refreshed!");
    }, 1500);
  };

  const syncAll = () => {
    toast.info("Syncing all sources...");
    setSources(prev => prev.map(s => ({ ...s, status: "processing" as const, lastUpdated: "Syncing..." })));
    
    setTimeout(() => {
      setSources(prev => prev.map(s => ({ ...s, status: "indexed" as const, lastUpdated: "Just now" })));
      toast.success("All sources synced!");
    }, 2000);
  };

  const testRetrieval = () => {
    if (!testQuery.trim()) {
      toast.error("Please enter a test query");
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    setTimeout(() => {
      setTestResult(`Based on your knowledge base, I found relevant information from 3 sources:\n\n1. Product Catalog 2035.pdf (Chunk #45): "Our enterprise plan includes unlimited users..."\n\n2. Pricing Sheet Q4.xlsx (Chunk #12): "Enterprise tier: $499/month with annual discount..."\n\n3. FAQ Database (Chunk #234): "Enterprise customers receive 24/7 priority support..."\n\nConfidence: 94%`);
      setIsTesting(false);
      toast.success("Retrieval test complete!");
    }, 1500);
  };

  const filteredSources = sources.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input 
        type="file" 
        ref={fileInputRef}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.json"
        onChange={handleFileUpload}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.length}</p>
                <p className="text-xs text-muted-foreground">Sources</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <BookOpen className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalChunks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Chunks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.filter(s => s.status === "indexed").length}</p>
                <p className="text-xs text-muted-foreground">Indexed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/20">
                <Clock className="h-5 w-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{sources.filter(s => s.status === "processing").length}</p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="glass gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Add Knowledge Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="border-2 border-dashed border-border/50 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-1">Drop files here or click to upload</h3>
            <p className="text-sm text-muted-foreground mb-4">
              PDF, DOCX, XLSX, TXT, JSON supported (Max 50MB)
            </p>
            <div className="flex justify-center gap-3" onClick={(e) => e.stopPropagation()}>
              <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                <FileText className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
              <Dialog open={showUrlDialog} onOpenChange={setShowUrlDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Globe className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add URL Source</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Website URL</Label>
                      <Input 
                        placeholder="https://docs.example.com"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                      />
                    </div>
                    <Button onClick={addUrl} className="w-full">
                      Crawl & Index
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={showDbDialog} onOpenChange={setShowDbDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Connect DB
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Connect Database</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Connection String</Label>
                      <Input 
                        placeholder="postgresql://user:pass@host:5432/db"
                        value={dbConnection}
                        onChange={(e) => setDbConnection(e.target.value)}
                      />
                    </div>
                    <Button onClick={connectDatabase} className="w-full">
                      Connect & Sync
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sources List */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Knowledge Sources
            </span>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search sources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px] h-9 bg-background/50"
                />
              </div>
              <Button size="sm" variant="outline" onClick={syncAll}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Sync All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredSources.map(source => (
              <div key={source.id} className="flex items-center justify-between p-4 rounded-xl bg-background/50 border border-border/50 hover:border-primary/30 transition-all">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-background">
                    {getTypeIcon(source.type)}
                  </div>
                  <div>
                    <p className="font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {source.chunks > 0 ? `${source.chunks} chunks • ` : ""}{source.lastUpdated}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {getStatusBadge(source.status)}
                  {source.status === "processing" && source.progress !== undefined && (
                    <div className="w-24">
                      <Progress value={source.progress} className="h-1" />
                    </div>
                  )}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0"
                    onClick={() => refreshSource(source.id)}
                    disabled={source.status === "processing"}
                  >
                    <RefreshCw className={`h-4 w-4 ${source.status === "processing" ? "animate-spin" : ""}`} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 text-destructive"
                    onClick={() => deleteSource(source.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {filteredSources.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No sources found
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Retrieval */}
      <Card className="glass border-secondary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-secondary" />
            Test Knowledge Retrieval
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input 
              placeholder="Ask a question to test retrieval..."
              className="bg-background/50"
              value={testQuery}
              onChange={(e) => setTestQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && testRetrieval()}
            />
            <Button 
              className="bg-gradient-to-r from-primary to-secondary"
              onClick={testRetrieval}
              disabled={isTesting}
            >
              {isTesting ? "Testing..." : "Test"}
            </Button>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-background/30 border border-border/50">
            {testResult ? (
              <pre className="text-sm whitespace-pre-wrap">{testResult}</pre>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter a question to test how the agent retrieves information from your knowledge base.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}