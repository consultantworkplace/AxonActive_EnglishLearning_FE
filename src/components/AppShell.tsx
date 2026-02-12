"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/missions", label: "Missions" },
  { href: "/planner", label: "Weekly Planner" },
  { href: "/analytics", label: "Analytics" },
  { href: "/feedback", label: "Feedback" },
  { href: "/vocabulary", label: "Vocabulary" },
  { href: "/focus", label: "Focus Mode" },
  { href: "/guide", label: "Guide" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full bg-accent" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-wide">
                English Missions
              </span>
              <span className="text-xs text-zinc-500">
                Discipline, XP, and streaks
              </span>
            </div>
          </div>
          <nav className="hidden gap-3 text-sm md:flex">
            {navItems.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1 transition-colors",
                    active
                      ? "bg-accent text-white"
                      : "text-zinc-600 hover:bg-zinc-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

