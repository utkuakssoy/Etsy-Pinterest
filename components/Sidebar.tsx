"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Başla", icon: LayoutDashboard },
  { href: "/products", label: "Ürünler", icon: Package },
  { href: "/generate", label: "SEO Oluştur", icon: Sparkles },
  { href: "/analytics", label: "Sonuçlar", icon: BarChart3 },
  { href: "/settings", label: "Ayarlar", icon: Settings }
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-neutral-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center gap-3 px-5">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-neutral-950 text-sm font-bold text-white">P</div>
          <div>
            <p className="text-base font-semibold leading-none">PinPilot</p>
            <p className="mt-1 text-xs text-neutral-500">Etsy ürününden pin hazırla</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-visible md:pb-0">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950",
                  active && "bg-neutral-950 text-white hover:bg-neutral-900 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
