const fs = require('fs');
const path = require('path');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log('Created:', filePath);
}

// 1. src/components/public/Navbar.tsx
writeFile('src/components/public/Navbar.tsx', `
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X, MessageCircle, ArrowRight } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("8779884225");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  // Do not render public navbar on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Expeditions & Trips", href: "/trips" },
    { name: "Our Story", href: "/about" },
    { name: "Contact & FAQ", href: "/contact" },
  ];

  const handleWhatsAppDirect = () => {
    const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
    const phone = cleaned.startsWith("91") && cleaned.length > 10 ? cleaned : \`91\${cleaned}\`;
    window.open(\`https://wa.me/\${phone}?text=Hi%20Wandermate%20Traverse!%20I'd%20like%20to%20know%20more%20about%20upcoming%20trips.\`, "_blank");
  };

  return (
    <header
      className={\`fixed top-0 left-0 right-0 z-50 transition-all duration-300 \${
        scrolled
          ? "glass-nav py-3.5 shadow-2xl backdrop-blur-md"
          : "bg-gradient-to-b from-dark-950/90 via-dark-950/40 to-transparent py-5"
      }\`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform duration-300 border border-brand-400/30">
              <Compass className="w-6 h-6 text-white group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <div>
              <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                WANDERMATE <span className="text-brand-400 font-serif italic text-lg font-normal">Traverse</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-earth-300 font-medium -mt-1">
                Less Talk. More Traverse.
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={\`text-sm font-medium transition-colors relative py-1 \${
                    isActive
                      ? "text-brand-400"
                      : "text-slate-300 hover:text-white"
                  }\`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3.5">
            <button
              onClick={handleWhatsAppDirect}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 hover:bg-emerald-900/40 hover:border-emerald-400 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp</span>
            </button>

            <Link
              href="/booking"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-md shadow-brand-500/25 transition-all duration-300 hover:scale-[1.02]"
            >
              <span>Book Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-900/60 border border-slate-800 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-nav border-t border-slate-800/80 px-4 pt-4 pb-6 mt-3 space-y-4 bg-dark-950/95">
          <div className="space-y-1.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={\`block px-3 py-2.5 rounded-lg text-base font-medium \${
                    isActive
                      ? "bg-brand-500/10 text-brand-400 font-semibold"
                      : "text-slate-300 hover:bg-slate-900/60 hover:text-white"
                  }\`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-800/60 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleWhatsAppDirect();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp</span>
            </button>

            <Link
              href="/booking"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-lg shadow-brand-500/20"
            >
              <span>Book a Trip</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
`);

// 2. src/components/public/Footer.tsx
writeFile('src/components/public/Footer.tsx', `
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Instagram, MessageCircle, Mail, Phone, MapPin, ArrowUpRight, Heart } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
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
      .catch(() => {});
  }, []);

  // Do not render public footer on admin pages
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = (settings.whatsappNumber || "8779884225").replace(/[^0-9]/g, "");
  const waUrl = \`https://wa.me/\${cleanPhone.startsWith("91") && cleanPhone.length > 10 ? cleanPhone : \`91\${cleanPhone}\`}?text=Hi%20Wandermate%20Traverse!\`;

  return (
    <footer className="bg-dark-950 border-t border-slate-800/80 text-slate-400 pt-16 pb-12 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-brand-500/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/60">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 group inline-block">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg shadow-brand-500/20 border border-brand-400/30">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  {settings.brandName || "WANDERMATE"}{" "}
                  <span className="text-brand-400 font-serif italic text-lg font-normal">Traverse</span>
                </span>
                <span className="block text-[10px] uppercase tracking-widest text-earth-300 font-medium">
                  {settings.tagline || "Less Talk. More Traverse."}
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Curating raw high-altitude Himalayan treks, offbeat rainforest explorations, living root bridges, and soulful community backpacking across India and Southeast Asia.
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
                href={\`mailto:\${settings.email || "wandermate@wt.in"}\`}
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
                <a href={\`mailto:\${settings.email || "wandermate@wt.in"}\`} className="hover:text-white transition-colors">
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
`);

// 3. src/components/public/FloatingWhatsApp.tsx
writeFile('src/components/public/FloatingWhatsApp.tsx', `
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("8779884225");
  const [currentTripTitle, setCurrentTripTitle] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  // Do not render inside admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    // Fetch current settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Check if on /trips/[id] page and extract trip title if available
    if (pathname.startsWith("/trips/") && pathname !== "/trips") {
      const slugOrId = pathname.replace("/trips/", "");
      fetch(\`/api/trips/\${slugOrId}\`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.trip?.title) {
            setCurrentTripTitle(data.trip.title);
          }
        })
        .catch(() => {});
    } else {
      setCurrentTripTitle(null);
    }
  }, [pathname]);

  const defaultMessage = currentTripTitle
    ? \`Hi Wandermate Traverse! I'm interested in the \${currentTripTitle} trip. Please share more details.\`
    : "Hi Wandermate Traverse! I'd like to enquire about your upcoming expeditions and treks.";

  const handleSendMessage = () => {
    const textToSend = customMsg.trim() || defaultMessage;
    const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
    const phone = cleaned.startsWith("91") && cleaned.length > 10 ? cleaned : \`91\${cleaned}\`;
    const url = \`https://wa.me/\${phone}?text=\${encodeURIComponent(textToSend)}\`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl glass-panel bg-dark-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 p-4 animate-in fade-in slide-in-from-bottom-5 duration-200 text-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-dark-900 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                  Wandermate Traverse
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Expedition Lead Online • Replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="py-4 space-y-2.5">
            <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed text-slate-200 border border-slate-700/50">
              <p className="font-medium text-white mb-1">Hey adventurer! 👋</p>
              {currentTripTitle ? (
                <p>
                  Looking to join our upcoming batch for{" "}
                  <span className="text-brand-400 font-semibold">{currentTripTitle}</span>? Ask us anything about dates, fitness level, or booking your seat!
                </p>
              ) : (
                <p>
                  Welcome to Wandermate Traverse! Less talk, more traverse. Need recommendations for your next offbeat mountain expedition or secret beach trail?
                </p>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setCustomMsg("Can you share the upcoming batch dates & itinerary PDF?")}
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
              >
                📅 Upcoming Dates & PDF
              </button>
              <button
                onClick={() => setCustomMsg("Is this trip beginner friendly for solo travelers?")}
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
              >
                🎒 Solo Traveler Info
              </button>
            </div>
          </div>

          {/* Input & Send */}
          <div className="space-y-2">
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={defaultMessage}
              className="w-full text-xs bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 transition-all duration-200"
            >
              <span>Start WhatsApp Chat</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 border border-emerald-400/40"
        aria-label="Open WhatsApp Chat"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-400 rounded-full border-2 border-emerald-600 animate-ping" />
        </div>
        <span className="hidden sm:inline font-medium">Chat with us</span>
      </button>
    </div>
  );
}
`);

// 4. src/components/public/TripCard.tsx
writeFile('src/components/public/TripCard.tsx', `
"use client";

import React from "react";
import Link from "next/link";
import { formatINR, parseJsonSafe } from "@/lib/utils";
import { MapPin, Clock, Users, Calendar, ArrowRight, Sparkles } from "lucide-react";

interface TripCardProps {
  trip: {
    id: string;
    slug: string;
    title: string;
    destination: string;
    category: string;
    duration: string;
    price: number;
    originalPrice?: number | null;
    availableSeats: number;
    dates: string;
    shortDescription: string;
    coverImage: string;
    featured: boolean;
  };
}

export default function TripCard({ trip }: TripCardProps) {
  const datesArray = parseJsonSafe<string[]>(trip.dates, []);
  const nextDate = datesArray.length > 0 ? datesArray[0] : null;

  return (
    <div className="group relative rounded-2xl glass-card overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-950/30 flex flex-col justify-between">
      {/* Top Image Container */}
      <div className="relative h-64 w-full overflow-hidden bg-dark-900">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"}
          alt={trip.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/20 to-transparent" />

        {/* Badges on Top */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-dark-950/80 backdrop-blur-md text-brand-400 border border-brand-500/30 shadow-md">
            {trip.category}
          </span>
          {trip.featured && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-brand-500 text-white shadow-lg shadow-brand-500/30">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Seats left warning badge */}
        {trip.availableSeats <= 8 && (
          <div className="absolute bottom-3.5 right-3.5 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-950/80 backdrop-blur-md text-red-300 border border-red-500/30 animate-pulse">
              Only {trip.availableSeats} Seats Left
            </span>
          </div>
        )}

        {/* Duration badge */}
        <div className="absolute bottom-3.5 left-3.5 pointer-events-none">
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-dark-950/80 backdrop-blur-md text-slate-200 border border-slate-700/50">
            <Clock className="w-3.5 h-3.5 text-brand-400" />
            {trip.duration}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-earth-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span className="truncate">{trip.destination}</span>
          </div>

          <Link href={\`/trips/\${trip.slug || trip.id}\`}>
            <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors line-clamp-1">
              {trip.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {trip.shortDescription}
          </p>
        </div>

        {/* Date badge */}
        {nextDate && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-1 border-t border-slate-800/60">
            <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>Next Batch: <strong className="text-slate-200">{nextDate}</strong></span>
          </div>
        )}

        {/* Bottom Price & CTA */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <div>
            <span className="block text-[10px] uppercase tracking-wider text-slate-400">Starting From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-brand-400">
                {formatINR(trip.price)}
              </span>
              {trip.originalPrice && trip.originalPrice > trip.price && (
                <span className="text-xs text-slate-500 line-through">
                  {formatINR(trip.originalPrice)}
                </span>
              )}
            </div>
          </div>

          <Link
            href={\`/trips/\${trip.slug || trip.id}\`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 group-hover:bg-brand-500 group-hover:text-dark-950 transition-all duration-300"
          >
            <span>View</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
`);

console.log('Public components written!');

