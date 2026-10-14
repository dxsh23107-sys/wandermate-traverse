"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Compass,
  LayoutDashboard,
  Map,
  PlusCircle,
  CalendarCheck2,
  Image as ImageIcon,
  FileEdit,
  Settings,
  LogOut,
  ExternalLink
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Trips", href: "/admin/trips", icon: Map },
    { label: "Add Trip", href: "/admin/trips/new", icon: PlusCircle },
    { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck2 },
    { label: "Gallery", href: "/admin/gallery", icon: ImageIcon },
    { label: "Website Content", href: "/admin/content", icon: FileEdit },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-dark-900 border-r border-slate-800 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      {/* Brand Header */}
      <div className="p-6 space-y-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          {settings?.logoUrl ? (
            <div className="h-10 w-auto max-w-[120px] flex items-center">
              <img
                src={settings.logoUrl}
                alt={settings?.brandName || "Logo"}
                className="h-10 w-auto object-contain rounded-lg"
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
              <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform" />
            </div>
          )}
          <div>
            <span className="font-display text-sm font-bold tracking-tight text-white block">
              {settings?.brandName ? settings.brandName : "WANDERMATE"}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-brand-400 font-bold -mt-0.5 block">
              Admin Portal
            </span>
          </div>
        </Link>

        {/* Navigation items */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-brand-500 text-dark-950 shadow-md shadow-brand-500/20 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-dark-950" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </span>
          <span className="text-[10px] bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">Live</span>
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}
