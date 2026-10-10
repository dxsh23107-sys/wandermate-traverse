"use client";

import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Save, CheckCircle2, FileEdit } from "lucide-react";

export default function AdminContentPage() {
  const [content, setContent] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "whyUs" | "cta" | "footer">("hero");

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) setContent(data.content);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSaveSection = async (sectionKey: string, sectionData: any) => {
    try {
      await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ section: sectionKey, content: sectionData }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const hero = content.hero || {};
  const about = content.about || {};
  const cta = content.cta || {};
  const footer = content.footer || {};

  return (
    <div>
      <AdminNavbar title="Website Content CMS" />

      <main className="p-8 space-y-6 max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Manage Web Copy & Stories</h2>
            <p className="text-xs text-slate-400">
              Edit homepage hero text, mission, values, and banner text without modifying code.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Saved & Live!</span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {(["hero", "about", "cta", "footer"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-brand-500 text-dark-950 font-bold"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              {tab.toUpperCase()} Section
            </button>
          ))}
        </div>

        {/* HERO TAB */}
        {activeTab === "hero" && (
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Homepage Hero</h3>
            
            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Badge Text</label>
              <input
                type="text"
                value={hero.badge || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, badge: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Main Heading</label>
              <input
                type="text"
                value={hero.title || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Subtitle</label>
              <textarea
                rows={3}
                value={hero.subtitle || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, subtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Hero Cover Image URL</label>
              <input
                type="text"
                value={hero.coverImage || ""}
                onChange={(e) => setContent({ ...content, hero: { ...hero, coverImage: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <button
              onClick={() => handleSaveSection("hero", hero)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-md"
            >
              Save Hero Copy
            </button>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === "about" && (
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">About Page Narrative</h3>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Ethos Tagline</label>
              <input
                type="text"
                value={about.tagline || ""}
                onChange={(e) => setContent({ ...content, about: { ...about, tagline: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Title</label>
              <input
                type="text"
                value={about.title || ""}
                onChange={(e) => setContent({ ...content, about: { ...about, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Full Brand Story</label>
              <textarea
                rows={5}
                value={about.story || ""}
                onChange={(e) => setContent({ ...content, about: { ...about, story: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Mission</label>
                <textarea
                  rows={3}
                  value={about.mission || ""}
                  onChange={(e) => setContent({ ...content, about: { ...about, mission: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs text-slate-400">Vision</label>
                <textarea
                  rows={3}
                  value={about.vision || ""}
                  onChange={(e) => setContent({ ...content, about: { ...about, vision: e.target.value } })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <button
              onClick={() => handleSaveSection("about", about)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-md"
            >
              Save About Story
            </button>
          </div>
        )}

        {/* CTA TAB */}
        {activeTab === "cta" && (
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">CTA Banner Copy</h3>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Banner Heading</label>
              <input
                type="text"
                value={cta.title || ""}
                onChange={(e) => setContent({ ...content, cta: { ...cta, title: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Subtitle</label>
              <textarea
                rows={3}
                value={cta.subtitle || ""}
                onChange={(e) => setContent({ ...content, cta: { ...cta, subtitle: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <button
              onClick={() => handleSaveSection("cta", cta)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-md"
            >
              Save CTA Section
            </button>
          </div>
        )}

        {/* FOOTER TAB */}
        {activeTab === "footer" && (
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Footer Copy</h3>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Footer Bio Description</label>
              <textarea
                rows={3}
                value={footer.description || ""}
                onChange={(e) => setContent({ ...content, footer: { ...footer, description: e.target.value } })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white"
              />
            </div>

            <button
              onClick={() => handleSaveSection("footer", footer)}
              className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-md"
            >
              Save Footer
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
