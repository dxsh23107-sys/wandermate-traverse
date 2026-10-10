"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User, ExternalLink, ShieldCheck, Clock } from "lucide-react";

export default function AdminNavbar({ title }: { title: string }) {
  const [time, setTime] = useState("");
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    }, 10000);

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data?.user) setAdminUser(data.user);
      })
      .catch(() => {});

    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-bold text-white font-display">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {time && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            <span>{time}</span>
          </div>
        )}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300 bg-brand-500/10 border border-brand-500/30 px-3 py-1.5 rounded-lg transition-colors"
        >
          <span>View Live Website</span>
          <ExternalLink className="w-3 h-3" />
        </Link>

        <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="hidden md:block">
            <span className="block text-white font-semibold text-xs leading-none">
              {adminUser?.name || "Wandermate Admin"}
            </span>
            <span className="text-[10px] text-slate-400 leading-none">
              {adminUser?.email || "wandermate@wt.in"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
