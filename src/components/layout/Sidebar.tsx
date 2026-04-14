import { Link, useLocation } from "@tanstack/react-router";
import { Package, Settings, LogOut } from "lucide-react";
import logo from "@/assets/logo-white.png";
import { cn } from "@/lib/utils";
import type { AuthContext } from "@/hooks/useAuth";

const navigation = [
  { name: "Voorraad", href: "/voorraad" as const, icon: Package },
];

const bottomNavigation = [
  { name: "Instellingen", href: "/instellingen" as const, icon: Settings },
];

interface SidebarProps {
  auth: AuthContext;
}

export function Sidebar({ auth }: SidebarProps) {
  const location = useLocation();

  const handleSignOut = async () => {
    await auth.signOut();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center justify-center border-b border-sidebar-border px-4">
          <img src={logo} alt="Logo" className="h-24 w-auto" loading="eager" />
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto sidebar-scroll">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                to={item.href as any}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border px-3 py-4">
          {bottomNavigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href as any}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-accent-foreground mt-1 cursor-pointer"
          >
            <LogOut className="h-5 w-5" />
            Uitloggen
          </button>
        </div>
      </div>
    </aside>
  );
}
