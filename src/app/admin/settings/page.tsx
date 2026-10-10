"use client";

import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Save, CheckCircle2, MessageCircle, Instagram, Mail, Phone, MapPin } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>({
    brandName: "Wandermate Traverse",
    tagline: "Less Talk. More Traverse.",
    whatsappNumber: "8779884225",
    instagram: "@wandermate.traversee",
    email: "wandermate@wt.in",
    phone: "+91 8779884225",
    address: "Mumbai / Himachal / Guwahati, India",
    currencySymbol: "₹",
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const [uploadingLogo, setUploadingLogo] = useState(false);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.url) {
        setSettings((prev: any) => ({ ...prev, logoUrl: data.url }));
      }
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setUploadingLogo(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Platform & Contact Settings" />

      <main className="p-8 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white font-display">System Configuration</h2>
            <p className="text-xs text-slate-400">
              Update brand logo, WhatsApp enquiry number, Instagram handle, and business details across the entire platform.
            </p>
          </div>
          {saved && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Settings Saved Live!</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-8 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-6">
          {/* Brand Identity & Logo */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Brand Identity & Logo
            </h3>

            {/* Logo Upload Box */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <label className="block text-xs font-semibold text-slate-300">
                Website Logo
              </label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {settings.logoUrl ? (
                  <div className="relative p-2 rounded-xl bg-dark-900 border border-slate-700 flex items-center justify-center h-16 w-36 overflow-hidden">
                    <img
                      src={settings.logoUrl}
                      alt="Brand Logo Preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="h-16 w-36 rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-[10px] text-slate-500 bg-slate-900/50">
                    <span>No Custom Logo</span>
                    <span className="text-[9px] text-slate-600">(Using default icon)</span>
                  </div>
                )}

                <div className="space-y-2 flex-1 w-full">
                  <div className="flex items-center gap-3">
                    <label className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-400 hover:bg-brand-300 text-dark-950 cursor-pointer transition-colors shadow-md shadow-brand-400/20">
                      {uploadingLogo ? "Uploading..." : "Upload New Logo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        disabled={uploadingLogo}
                      />
                    </label>
                    {settings.logoUrl && (
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, logoUrl: "" })}
                        className="px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-colors"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={settings.logoUrl || ""}
                    onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
                    placeholder="Or paste Logo Image URL (e.g. /uploads/... or https://...)"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">Brand Name</label>
                <input
                  type="text"
                  value={settings.brandName || ""}
                  onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400">Tagline</label>
                <input
                  type="text"
                  value={settings.tagline || ""}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-2">
              Contact & Social Channels
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Enquiry Number *</span>
                </label>
                <input
                  type="text"
                  value={settings.whatsappNumber || ""}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  placeholder="8779884225"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-emerald-500 font-mono"
                  required
                />
                <span className="text-[10px] text-slate-500 block">
                  This number receives all WhatsApp inquiries, floating chat messages, and booking alerts.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400 flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5 text-brand-400" />
                  <span>Instagram Handle</span>
                </label>
                <input
                  type="text"
                  value={settings.instagram || ""}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  placeholder="@wandermate.traversee"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Contact Email</span>
                </label>
                <input
                  type="email"
                  value={settings.email || ""}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  placeholder="wandermate@wt.in"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>Display Phone</span>
                </label>
                <input
                  type="text"
                  value={settings.phone || ""}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  placeholder="+91 8779884225"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="block text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Basecamps / Office Address</span>
              </label>
              <input
                type="text"
                value={settings.address || ""}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 shadow-xl shadow-brand-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {saving ? "Updating Settings..." : "Save Settings"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
