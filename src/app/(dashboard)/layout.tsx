"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { AppProvider, useApp } from "@/lib/context/app-context";
import { PeriodFilterBar } from "@/components/filters/period-filter";
import {
  LayoutDashboard,
  ReceiptText,
  PiggyBank,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ReceiptText,
  },
  {
    name: "Investments",
    href: "/investments",
    icon: PiggyBank,
  },
  {
    name: "Reports",
    href: "/reports",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const { profile } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUserEmail(user.email || null);
      }
    }
    loadUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-primary/20">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/60 backdrop-blur-md shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-border/70 gap-3">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src="/brand/logo-icon.svg"
              alt="Minty Logo"
              width={32}
              height={32}
              priority
            />
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-foreground tracking-tight">Minty</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                {profile.currency_code}
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* User Card & Sign Out */}
        <div className="p-4 border-t border-border/70 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs uppercase">
              {profile.display_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">
                {profile.display_name || "Personal Ledger"}
              </p>
              <p className="text-[11px] text-muted-foreground truncate">
                {userEmail || "Local Session"}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-xs text-muted-foreground hover:text-destructive gap-1.5 px-2.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/70 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="md:hidden flex items-center gap-2">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src="/brand/logo-icon.svg"
                  alt="Minty Logo"
                  width={28}
                  height={28}
                />
                <span className="font-bold text-base text-foreground tracking-tight">Minty</span>
              </Link>
            </div>

            {/* Global Period Filter Component */}
            <PeriodFilterBar />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary text-[11px] font-semibold text-muted-foreground border border-border">
              <span>{profile.currency_symbol}</span>
              <span>·</span>
              <span>{profile.number_format === "lakh_crore" ? "Lakh/Crore" : "Million"}</span>
            </div>

            <ThemeToggle />

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </header>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 space-y-3">
            <div className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium",
                      isActive
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between">
              <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                {userEmail || "Signed In"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs text-destructive hover:bg-destructive/10"
              >
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-md flex items-center justify-around py-2 px-2 shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground")} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AppProvider>
      <DashboardShell>{children}</DashboardShell>
    </AppProvider>
  );
}
