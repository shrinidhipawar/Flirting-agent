import { Search, Plus, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";

interface HeaderProps {
  onNewContent: () => void;
  onMenuClick?: () => void;
}

export function Header({ onNewContent, onMenuClick }: HeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8 gap-4">
      <div className="flex items-center gap-4">
        {/* Mobile menu button */}
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Good morning, <span className="gradient-text">Creator</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Here's what's happening with your social presence today
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Search */}
        <div className="relative hidden lg:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-64 rounded-xl bg-muted border border-border pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Notifications */}
        <NotificationCenter />

        {/* New Content Button */}
        <Button variant="glow" onClick={onNewContent} className="hidden sm:flex">
          <Plus className="h-4 w-4 mr-2" />
          New Content
        </Button>
        <Button variant="glow" onClick={onNewContent} size="icon" className="sm:hidden">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
