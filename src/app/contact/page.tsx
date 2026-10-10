"use client";

import React, { useState, useEffect } from "react";
import { getWhatsAppUrl } from "@/lib/utils";
import { MessageCircle, Instagram, Mail, Phone, MapPin, Send, CheckCircle2, HelpCircle } from "lucide-react";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>({
    whatsappNumber: "8779884225",
    instagram: "@wandermate.traversee",
    email: "wandermate@wt.in",
    phone: "+91 8779884225",
    address: "Mumbai / Himachal / Guwahati, India",
  });

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {});
  }, []);

  const waUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    "Hi Wandermate Traverse! I have a question about upcoming expeditions."
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hi Wandermate Traverse! My name is ${name} (${phone}). ${message}`;
    const targetUrl = getWhatsAppUrl(settings.whatsappNumber, text);
    window.open(targetUrl, "_blank");
    setSent(true);
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
          Get In Touch
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          Talk To Our Expedition Leads
        </h1>
        <p className="text-sm text-slate-400 leading-relaxed font-light">
          Have queries about batch dates, gear recommendations, fitness requirements, or customized corporate trails? We reply instantly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CONTACT CARDS (1 COL) */}
        <div className="space-y-4">
          {/* WhatsApp Card */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-2xl glass-card border border-emerald-500/30 hover:border-emerald-400 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-semibold block">
                  Fastest Response
                </span>
                <h3 className="text-base font-bold text-white">WhatsApp Chat</h3>
                <p className="text-xs text-slate-400">{settings.whatsappNumber || "8779884225"}</p>
              </div>
            </div>
          </a>

          {/* Instagram Card */}
          <a
            href="https://instagram.com/wandermate.traversee"
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 rounded-2xl glass-card border border-slate-800 hover:border-brand-500/50 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Community & Stories
                </span>
                <h3 className="text-base font-bold text-white">Instagram</h3>
                <p className="text-xs text-slate-400">{settings.instagram || "@wandermate.traversee"}</p>
              </div>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={`mailto:${settings.email || "wandermate@wt.in"}`}
            className="block p-6 rounded-2xl glass-card border border-slate-800 hover:border-slate-700 transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  Email Inquiries
                </span>
                <h3 className="text-base font-bold text-white">Email Us</h3>
                <p className="text-xs text-slate-400">{settings.email || "wandermate@wt.in"}</p>
              </div>
            </div>
          </a>

          {/* Address */}
          <div className="p-6 rounded-2xl glass-card border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-semibold uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-brand-400" />
              <span>Basecamps & Hubs</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-light">
              {settings.address || "Mumbai HQ & Seasonal Basecamps in Manali, Kaza, Shillong."}
            </p>
          </div>
        </div>

        {/* INTERACTIVE FORM (2 COLS) */}
        <div className="lg:col-span-2">
          <div className="p-6 sm:p-10 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display">
                Send Direct Message
              </h3>
              <p className="text-xs text-slate-400">
                Fill in your details below and click submit to instantly initiate a conversation with our expedition lead.
              </p>
            </div>

            {sent && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Thank you! WhatsApp window opened with your inquiry details.</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Diya Sen"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400">WhatsApp Phone Number *</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400">How can we assist you? *</label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="I would like to know more about the Meghalaya trek batch in November..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-xl shadow-brand-500/25 transition-all duration-200 hover:scale-[1.01]"
              >
                <span>Send to Captain on WhatsApp</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
