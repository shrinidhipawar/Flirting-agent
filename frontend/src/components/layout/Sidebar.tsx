import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  BarChart3,
  Settings,
  Zap,
  Globe,
  ChevronLeft,
  ChevronRight,
  Phone,
  Megaphone,
  Database,
  Target,
  Star,
  Headphones,
  Bot,
  Shield,
  Crown,
  LogIn,
  LogOut,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: string;
  isRoute?: boolean;
  requiresAdmin?: boolean;
  requiresSuperAdmin?: boolean;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Phone, label: "WhatsApp AI", href: "/whatsapp", isRoute: true },
  { icon: Megaphone, label: "AI Ads", href: "/ads", isRoute: true },
  { icon: Database, label: "CRM Hub", href: "/crm", isRoute: true },
  { icon: Sparkles, label: "AI Content", href: "/content", isRoute: true },
  { icon: Target, label: "Sales Closer", href: "/sales", isRoute: true },
  { icon: Star, label: "Influencer AI", href: "/influencer", isRoute: true },
  { icon: Headphones, label: "Support Bot", href: "/support", isRoute: true },
  { icon: Bot, label: "Agent Builder", href: "/agents", badge: "New", isRoute: true },
  { icon: Calendar, label: "Content Calendar", href: "/calendar", isRoute: true },
  { icon: Globe, label: "Platforms", href: "/platforms", isRoute: true },
  { icon: BarChart3, label: "Analytics", href: "/analytics", isRoute: true },
  { icon: Settings, label: "Settings", href: "/settings", isRoute: true },
];

const adminItems: NavItem[] = [
  { icon: Shield, label: "Admin Panel", href: "/admin", isRoute: true, requiresAdmin: true },
  { icon: Crown, label: "Super Admin", href: "/superadmin", isRoute: true, requiresSuperAdmin: true },
];

interface SidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
}

export function Sidebar({ 
  activeSection = "", 
  onSectionChange, 
  isOpen, 
  onClose,
  isCollapsed: controlledCollapsed,
  onCollapsedChange 
}: SidebarProps) {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const collapsed = controlledCollapsed ?? internalCollapsed;
  const setCollapsed = (value: boolean) => {
    setInternalCollapsed(value);
    onCollapsedChange?.(value);
  };
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isSuperAdmin, signOut, loading } = useAuth();
  const isMobile = useIsMobile();

  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile && onClose) {
      onClose();
    }
  }, [location.pathname, isMobile, onClose]);

  const handleNavClick = (item: NavItem) => {
    if (item.isRoute || item.href === "/") {
      navigate(item.href);
    } else if (onSectionChange) {
      onSectionChange(item.href.replace("#", ""));
    }
    if (isMobile && onClose) {
      onClose();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const isActive = (item: NavItem) => {
    if (item.isRoute || item.href === "/") {
      return location.pathname === item.href;
    }
    return activeSection === item.href.replace("#", "");
  };

  const filteredAdminItems = adminItems.filter(item => {
    if (item.requiresSuperAdmin) return isSuperAdmin;
    if (item.requiresAdmin) return isAdmin;
    return true;
  });

  // Mobile sidebar overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity duration-300",
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
        
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 h-screen w-72 bg-sidebar border-r border-sidebar-border transition-transform duration-300",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold gradient-text">SocialAI</h1>
                <p className="text-xs text-muted-foreground">2035 Edition</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {navItems.map((item) => {
              const active = isActive(item);
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary glow-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs text-secondary">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Admin Section */}
            {filteredAdminItems.length > 0 && (
              <>
                <div className="mt-4 mb-2 px-4">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
                </div>
                {filteredAdminItems.map((item) => {
                  const active = isActive(item);
                  return (
                    <button
                      key={item.href}
                      onClick={() => handleNavClick(item)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                        active
                          ? "bg-primary/10 text-primary glow-primary"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                      <span className="flex-1 text-left">{item.label}</span>
                    </button>
                  );
                })}
              </>
            )}
          </nav>

          {/* User Section */}
          <div className="absolute bottom-4 left-4 right-4">
            {!loading && (
              <>
                {user ? (
                  <div className="glass rounded-xl p-4 gradient-border space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-start"
                      onClick={handleSignOut}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    onClick={() => navigate('/auth')}
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </Button>
                )}
              </>
            )}
          </div>
        </aside>
      </>
    );
  }

  // Desktop sidebar
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <h1 className="text-lg font-bold gradient-text">SocialAI</h1>
              <p className="text-xs text-muted-foreground">2035 Edition</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
        {navItems.map((item) => {
          const active = isActive(item);
          return (
            <button
              key={item.href}
              onClick={() => handleNavClick(item)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                active
                  ? "bg-primary/10 text-primary glow-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
              {!collapsed && (
                <span className="animate-fade-in flex-1 text-left">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span className="rounded-full bg-secondary/20 px-2 py-0.5 text-xs text-secondary">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Admin Section */}
        {filteredAdminItems.length > 0 && (
          <>
            {!collapsed && (
              <div className="mt-4 mb-2 px-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Admin</span>
              </div>
            )}
            {filteredAdminItems.map((item) => {
              const active = isActive(item);
              return (
                <button
                  key={item.href}
                  onClick={() => handleNavClick(item)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-primary/10 text-primary glow-primary"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", active && "text-primary")} />
                  {!collapsed && (
                    <span className="animate-fade-in flex-1 text-left">{item.label}</span>
                  )}
                </button>
              );
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <div className="absolute bottom-4 left-4 right-4">
        {!loading && (
          <>
            {user ? (
              <div className="glass rounded-xl p-4 gradient-border space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  {!collapsed && (
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'User'}
                      </p>
                    </div>
                  )}
                </div>
                {!collapsed && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={() => navigate('/auth')}
              >
                {collapsed ? <LogIn className="h-4 w-4" /> : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </aside>
  );
}
