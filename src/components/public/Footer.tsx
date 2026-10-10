"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Instagram, MessageCircle, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const [footerContent, setFooterContent] = useState<any>({
    description: "Curating raw high-altitude Himalayan treks, offbeat rainforest explorations, living root bridges, and soulful community backpacking across India and Southeast Asia.",
  });
  const [settings, setSettings] = useState<any>({
    brandName: "Wandermate Traverse",
    tagline: "Less Talk. More Traverse.",
    whatsappNumber: "8779884225",
    instagram: "@wandermate.traversee",
    email: "wandermate@wt.in",
    phone: "+91 8779884225",
    address: "Mumbai & Himalayan Basecamps, India",
  });

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          setSettings(data.settings);
        }
      })
      .catch(() => { });

    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.footer) {
          setFooterContent(data.content.footer);
        }
      })
      .catch(() => { });
  }, []);

  // Do not render public footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = (settings.whatsappNumber || "8779884225").replace(/[^0-9]/g, "");
  const waUrl = `https://wa.me/${cleanPhone.startsWith("91") && cleanPhone.length > 10 ? cleanPhone : `91${cleanPhone}`}?text=Hi%20Wandermate%20Traverse!`;

  return (
    <footer className="bg-dark-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              {settings?.logoUrl ? (
                <div className="h-10 w-auto max-w-[160px] flex items-center">
                  <img
                    src={settings.logoUrl}
                    alt={settings?.brandName || "Wandermate Logo"}
                    className="h-10 w-auto object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
                  <Compass className="w-6 h-6 text-white" />
                </div>
              )}
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  {settings?.brandName ? settings.brandName : <>Wandermate <span className="text-brand-400 font-serif italic text-lg font-normal">Traverse</span></>}
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-earth-300 font-medium">
                  {settings.tagline || "Less Talk. More Traverse."}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {footerContent?.description || "Curating raw high-altitude Himalayan treks, offbeat rainforest explorations, living root bridges, and soulful community backpacking across India and Southeast Asia."}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/wandermate.traversee"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 hover:bg-emerald-950/40 hover:border-emerald-500/50 transition-all duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${settings.email || "wandermate@wt.in"}`}
                className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-brand-400 hover:border-brand-500/50 transition-all duration-200"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/trips" className="hover:text-brand-400 transition-colors flex items-center gap-1 group">
                  <span>All Expeditions</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link href="/trips?category=Trek" className="hover:text-brand-400 transition-colors">
                  Himalayan Treks
                </Link>
              </li>
              <li>
                <Link href="/trips?category=Expedition" className="hover:text-brand-400 transition-colors">
                  Road Expeditions
                </Link>
              </li>
              <li>
                <Link href="/trips?category=Cultural" className="hover:text-brand-400 transition-colors">
                  Desert & Heritage
                </Link>
              </li>
              <li>
                <Link href="/trips?category=Backpacking" className="hover:text-brand-400 transition-colors">
                  Backpacking Trails
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Wandermate
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-brand-400 transition-colors">
                  Our Story & Ethos
                </Link>
              </li>
              <li>
                <Link href="/about#why-us" className="hover:text-brand-400 transition-colors">
                  Why Traverse With Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-400 transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-brand-400 transition-colors">
                  Book A Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Get In Touch
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  WhatsApp: {settings.whatsappNumber || "8779884225"}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <a href="https://instagram.com/wandermate.traversee" target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 transition-colors">
                  {settings.instagram || "@wandermate.traversee"}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a href={`mailto:${settings.email || "wandermate@wt.in"}`} className="hover:text-white transition-colors">
                  {settings.email || "wandermate@wt.in"}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span>{settings.address || "Mumbai / Manali / Guwahati"}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {settings.brandName || "Wandermate Traverse"}. Less Talk. More Traverse. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Crafted for true wanderers</span>
            <Heart className="w-3.5 h-3.5 text-brand-500 inline fill-brand-500" />
          </div>
        </div>
      </div>
    </footer>
  );
}
