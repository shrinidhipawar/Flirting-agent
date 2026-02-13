import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
  MessageSquare,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  customer: string;
  email: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  createdAt: string;
  responseTime: string;
  assignee: string;
  channel: string;
}

const initialTickets: Ticket[] = [
  {
    id: "TKT-001",
    customer: "Priya Sharma",
    email: "priya@example.com",
    subject: "Order not delivered - #ORD-4821",
    description: "My order hasn't arrived yet. It's been 5 days since the expected delivery date.",
    category: "Delivery",
    priority: "urgent",
    status: "in-progress",
    createdAt: "2 hours ago",
    responseTime: "5 mins",
    assignee: "AI Bot",
    channel: "WhatsApp",
  },
  {
    id: "TKT-002",
    customer: "Rahul Verma",
    email: "rahul@example.com",
    subject: "Plan upgrade inquiry",
    description: "I want to upgrade from basic to premium plan. What are the benefits?",
    category: "Billing",
    priority: "medium",
    status: "open",
    createdAt: "4 hours ago",
    responseTime: "12 mins",
    assignee: "AI Bot",
    channel: "Website",
  },
  {
    id: "TKT-003",
    customer: "Anita Patel",
    email: "anita@example.com",
    subject: "Refund request for damaged product",
    description: "The product I received was damaged. I need a full refund.",
    category: "Refund",
    priority: "high",
    status: "waiting",
    createdAt: "1 day ago",
    responseTime: "3 mins",
    assignee: "Support Team",
    channel: "Email",
  },
  {
    id: "TKT-004",
    customer: "Vikram Singh",
    email: "vikram@example.com",
    subject: "Password reset not working",
    description: "I'm not receiving the password reset email.",
    category: "Technical",
    priority: "low",
    status: "resolved",
    createdAt: "2 days ago",
    responseTime: "8 mins",
    assignee: "AI Bot",
    channel: "Chat",
  },
  {
    id: "TKT-005",
    customer: "Meera Joshi",
    email: "meera@example.com",
    subject: "Wrong item received",
    description: "I ordered a blue shirt but received a red one.",
    category: "Order Issue",
    priority: "high",
    status: "in-progress",
    createdAt: "5 hours ago",
    responseTime: "4 mins",
    assignee: "AI Bot",
    channel: "Instagram",
  },
];

const priorityColors = {
  low: "bg-gray-500/10 text-gray-500",
  medium: "bg-blue-500/10 text-blue-500",
  high: "bg-orange-500/10 text-orange-500",
  urgent: "bg-red-500/10 text-red-500",
};

const statusColors = {
  open: "bg-blue-500",
  "in-progress": "bg-yellow-500",
  waiting: "bg-purple-500",
  resolved: "bg-green-500",
  closed: "bg-gray-500",
};

const statusIcons = {
  open: Clock,
  "in-progress": ArrowUpRight,
  waiting: AlertTriangle,
  resolved: CheckCircle,
  closed: XCircle,
};

export function TicketManager() {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [newTicket, setNewTicket] = useState({
    customer: "",
    email: "",
    subject: "",
    description: "",
    category: "Delivery",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  });
  const { toast } = useToast();

  const statuses = ["all", "open", "in-progress", "waiting", "resolved"];

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTicket = () => {
    if (!newTicket.customer.trim() || !newTicket.subject.trim()) {
      toast({
        title: "Required Fields",
        description: "Please fill in customer name and subject",
        variant: "destructive",
      });
      return;
    }

    const ticket: Ticket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
      customer: newTicket.customer,
      email: newTicket.email,
      subject: newTicket.subject,
      description: newTicket.description,
      category: newTicket.category,
      priority: newTicket.priority,
      status: "open",
      createdAt: "Just now",
      responseTime: "-",
      assignee: "AI Bot",
      channel: "Manual",
    };

    setTickets(prev => [ticket, ...prev]);
    setIsCreateDialogOpen(false);
    setNewTicket({
      customer: "",
      email: "",
      subject: "",
      description: "",
      category: "Delivery",
      priority: "medium",
    });

    toast({
      title: "Ticket Created",
      description: `${ticket.id} has been created successfully`,
    });
  };

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsViewDialogOpen(true);
  };

  const handleUpdateStatus = (ticketId: string, newStatus: Ticket["status"]) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, status: newStatus } : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, status: newStatus } : null);
    }
    toast({
      title: "Status Updated",
      description: `Ticket status changed to ${newStatus}`,
    });
  };

  const handleUpdatePriority = (ticketId: string, newPriority: Ticket["priority"]) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, priority: newPriority } : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, priority: newPriority } : null);
    }
    toast({
      title: "Priority Updated",
      description: `Ticket priority changed to ${newPriority}`,
    });
  };

  const handleAssign = (ticketId: string, assignee: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId ? { ...t, assignee } : t
    ));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket(prev => prev ? { ...prev, assignee } : null);
    }
    toast({
      title: "Ticket Assigned",
      description: `Ticket assigned to ${assignee}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Ticket Manager</h2>
          <p className="text-muted-foreground">
            Manage and resolve customer support tickets
          </p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statuses.slice(1).map((status) => {
          const count = tickets.filter((t) => t.status === status).length;
          const StatusIcon = statusIcons[status as keyof typeof statusIcons];
          return (
            <Card
              key={status}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                selectedStatus === status && "ring-2 ring-primary"
              )}
              onClick={() => setSelectedStatus(status)}
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-sm text-muted-foreground capitalize">{status.replace("-", " ")}</p>
                  </div>
                  <div
                    className={cn(
                      "h-10 w-10 rounded-full flex items-center justify-center",
                      `${statusColors[status as keyof typeof statusColors]}/20`
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        statusColors[status as keyof typeof statusColors].replace("bg-", "text-")
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Card
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedStatus === "all" && "ring-2 ring-primary"
          )}
          onClick={() => setSelectedStatus("all")}
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tickets.length}</p>
                <p className="text-sm text-muted-foreground">All Tickets</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tickets by ID, subject, or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Tickets Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left py-4 px-4 text-sm font-medium">Ticket</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Customer</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Category</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Priority</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Assignee</th>
                  <th className="text-left py-4 px-4 text-sm font-medium">Response</th>
                  <th className="text-right py-4 px-4 text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((ticket) => {
                  const StatusIcon = statusIcons[ticket.status];
                  return (
                    <tr key={ticket.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-medium text-sm">{ticket.id}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {ticket.subject}
                          </p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{ticket.customer}</p>
                            <p className="text-xs text-muted-foreground">{ticket.channel}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline">{ticket.category}</Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={priorityColors[ticket.priority]}>
                          {ticket.priority}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "h-2 w-2 rounded-full",
                              statusColors[ticket.status]
                            )}
                          />
                          <span className="text-sm capitalize">{ticket.status.replace("-", " ")}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm">{ticket.assignee}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-green-500">{ticket.responseTime}</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Create Ticket Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Customer Name *</label>
                <Input
                  value={newTicket.customer}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, customer: e.target.value }))}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={newTicket.email}
                  onChange={(e) => setNewTicket(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@example.com"
                  type="email"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject *</label>
              <Input
                value={newTicket.subject}
                onChange={(e) => setNewTicket(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief description of the issue"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={newTicket.description}
                onChange={(e) => setNewTicket(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the issue..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={newTicket.category}
                  onValueChange={(value) => setNewTicket(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Billing">Billing</SelectItem>
                    <SelectItem value="Refund">Refund</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Order Issue">Order Issue</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={newTicket.priority}
                  onValueChange={(value: "low" | "medium" | "high" | "urgent") => 
                    setNewTicket(prev => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTicket}>Create Ticket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>{selectedTicket?.id}</span>
              <Badge className={priorityColors[selectedTicket?.priority || "medium"]}>
                {selectedTicket?.priority}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6 py-4">
              <div>
                <h3 className="font-medium text-lg">{selectedTicket.subject}</h3>
                <p className="text-sm text-muted-foreground mt-1">{selectedTicket.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">{selectedTicket.customer}</p>
                  <p className="text-xs text-muted-foreground">{selectedTicket.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Channel</p>
                  <p className="font-medium">{selectedTicket.channel}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{selectedTicket.category}</Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="font-medium">{selectedTicket.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={selectedTicket.status}
                    onValueChange={(value: Ticket["status"]) => 
                      handleUpdateStatus(selectedTicket.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="waiting">Waiting</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <Select
                    value={selectedTicket.priority}
                    onValueChange={(value: Ticket["priority"]) => 
                      handleUpdatePriority(selectedTicket.id, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Assignee</label>
                  <Select
                    value={selectedTicket.assignee}
                    onValueChange={(value) => handleAssign(selectedTicket.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AI Bot">AI Bot</SelectItem>
                      <SelectItem value="Support Team">Support Team</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Close
            </Button>
            {selectedTicket?.status !== "resolved" && selectedTicket?.status !== "closed" && (
              <Button 
                onClick={() => handleUpdateStatus(selectedTicket?.id || "", "resolved")}
                className="bg-green-500 hover:bg-green-600"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Resolved
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
