"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TripCard from "@/components/public/TripCard";
import { formatINR, getWhatsAppUrl } from "@/lib/utils";
import {
  Compass,
  ArrowRight,
  MessageCircle,
  Search,
  Sparkles,
  ShieldCheck,
  Users,
  MapPin,
  Mountain,
  Trees,
  Sun,
  Flame,
  Globe,
  ChevronRight,
  CheckCircle2
} from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [settings, setSettings] = useState<any>({
    whatsappNumber: "8779884225",
    tagline: "Less Talk. More Traverse.",
  });
  const [content, setContent] = useState<any>({});
  const [gallery, setGallery] = useState<any[]>([]);
  const [activeGalleryModal, setActiveGalleryModal] = useState<string | null>(null);

  useEffect(() => {
    // Fetch trips
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (data?.trips) setTrips(data.trips);
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Fetch settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {});

    // Fetch CMS content
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content) setContent(data.content);
      })
      .catch(() => {});

    // Fetch Gallery
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data) => {
        if (data?.images) setGallery(data.images);
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/trips?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/trips");
    }
  };

  const heroData = content?.hero || {
    badge: "Curated Raw Expeditions & Hidden Trails",
    title: "Less Talk. More Traverse.",
    subtitle: "Explore untouched Himalayan valleys, living root bridges, remote deserts, and soulful backpacking trails with community-driven wanderers.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80",
    stats: [
      { label: "Happy Wanderers", value: "2,400+" },
      { label: "Offbeat Trails", value: "35+" },
      { label: "Local Guides & Captains", value: "100%" },
      { label: "Community Rating", value: "4.9/5" },
    ],
  };

  const whyUsData = content?.whyUs?.features || [
    {
      icon: "Compass",
      title: "Unmapped Offbeat Routes",
      desc: "Carefully scouted trails away from tourist throngs, featuring secret waterfalls, alpine ridges, and ancient villages.",
    },
    {
      icon: "Users",
      title: "Curated Small Groups",
      desc: "Travel with like-minded creators, solo backpackers, and nature lovers. Strictly 10-12 travelers per batch.",
    },
    {
      icon: "ShieldCheck",
      title: "Certified Expedition Captains",
      desc: "Wilderness First Aid (WFA) certified trek leaders and native mountaineers leading every expedition.",
    },
    {
      icon: "Sparkles",
      title: "Authentic Stays & Meals",
      desc: "Warm wooden homestays, riverside dome tents, star-lit bonfires, and hot regional farm-to-table cuisine.",
    },
  ];

  const featuredTrips = trips.filter((t) => t.featured).slice(0, 6);
  const displayTrips = featuredTrips.length > 0 ? featuredTrips : trips.slice(0, 6);

  const waUrl = getWhatsAppUrl(
    settings.whatsappNumber,
    "Hi Wandermate Traverse! I'm interested in exploring your upcoming expeditions."
  );

  const destinations = [
    { name: "Himalayas & Spiti", icon: Mountain, count: "12+ Trails", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80", category: "Trek" },
    { name: "Northeast Rainforests", icon: Trees, count: "8+ Trails", image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80", category: "Trek" },
    { name: "Kashmir Alpine Lakes", icon: Compass, count: "5+ Trails", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80", category: "Trek" },
    { name: "Thar Royal Deserts", icon: Sun, count: "4+ Trails", image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80", category: "Cultural" },
    { name: "Western Ghats & Backwaters", icon: Flame, count: "6+ Trails", image: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80", category: "Backpacking" },
    { name: "Southeast Asia", icon: Globe, count: "4+ Trails", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80", category: "Expedition" },
  ];

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroData.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=80"}
            alt="Wandermate Traverse Hero"
            className="w-full h-full object-cover scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/40" />
          <div className="absolute inset-0 bg-hero-pattern pointer-events-none" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/15 border border-brand-400/30 backdrop-blur-md text-brand-300 text-xs font-semibold uppercase tracking-widest shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>{heroData.badge || "Curated Raw Expeditions & Hidden Trails"}</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.1]">
            <span className="block text-gradient">Less Talk.</span>
            <span className="block text-gradient-gold font-serif italic font-normal">More Traverse.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-light leading-relaxed">
            {heroData.subtitle || "Explore untouched Himalayan valleys, living root bridges, remote deserts, and soulful backpacking trails with community-driven wanderers."}
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-xl mx-auto flex items-center gap-2 p-2 rounded-2xl glass-panel bg-dark-900/80 border border-slate-700/80 shadow-2xl focus-within:border-brand-500/80 transition-all duration-300"
          >
            <div className="flex items-center gap-2.5 pl-3 flex-1 text-slate-400">
              <Search className="w-5 h-5 text-brand-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Where to next? (e.g. Spiti, Meghalaya, Kashmir...)"
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-md shadow-brand-500/20 transition-all duration-200 shrink-0"
            >
              Search
            </button>
          </form>

          {/* Dual CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/trips"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-xl shadow-brand-500/25 transition-all duration-300 hover:scale-105"
            >
              <span>Explore All Trips</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/40 transition-all duration-300 hover:scale-105 backdrop-blur-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enquire on WhatsApp</span>
            </a>
          </div>

          {/* Key Stats Bar */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-800/60">
            {(heroData.stats || []).map((stat: any, i: number) => (
              <div key={i} className="text-center p-2">
                <span className="block text-2xl sm:text-3xl font-extrabold text-brand-400 font-display">
                  {stat.value}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. EXPLORE DESTINATIONS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block mb-1">
              Curated Wilderness
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Explore By Region
            </h2>
          </div>
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-400 hover:text-brand-300 transition-colors"
          >
            <span>View all destinations</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {destinations.map((dest) => {
            const Icon = dest.icon;
            return (
              <Link
                key={dest.name}
                href={`/trips?category=${dest.category}`}
                className="group relative h-48 rounded-2xl overflow-hidden glass-card p-4 flex flex-col justify-between transition-all duration-300 hover:scale-105 hover:border-brand-500/50"
              >
                <img
                  src={dest.image}
                  alt={dest.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/20" />
                <div className="relative z-10 w-8 h-8 rounded-lg bg-dark-950/80 backdrop-blur-md flex items-center justify-center text-brand-400 border border-slate-700">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="relative z-10 space-y-0.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-brand-300 transition-colors leading-snug">
                    {dest.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">
                    {dest.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FEATURED TRIPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
                Handcrafted Journeys
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              Upcoming Featured Expeditions
            </h2>
          </div>
          <Link
            href="/trips"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-brand-400 bg-brand-500/10 border border-brand-500/30 hover:bg-brand-500/20 transition-colors"
          >
            <span>See All ({trips.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : displayTrips.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-2xl">
            <Compass className="w-12 h-12 text-brand-400 mx-auto mb-3 animate-spin-slow" />
            <h3 className="text-lg font-bold text-white">No trips currently listed</h3>
            <p className="text-sm text-slate-400">Check back soon as new seasonal batches are added daily.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        )}
      </section>

      {/* 4. WHY WANDERMATE TRAVERSE */}
      <section className="relative py-20 bg-dark-900/60 border-y border-slate-800/80 overflow-hidden">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-500/5 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
              The Wandermate Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
              {content?.whyUs?.title || "Why Traverse With Us?"}
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              {content?.whyUs?.subtitle || "Every detail engineered for unforgettable stories, spontaneous laughs, and ultimate safety."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyUsData.map((feature: any, idx: number) => {
              const icons: Record<string, any> = {
                Compass,
                Users,
                ShieldCheck,
                Sparkles,
              };
              const Icon = icons[feature.icon] || Compass;

              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl glass-card border border-slate-800 hover:border-brand-500/40 transition-all duration-300 space-y-4 group hover:bg-slate-900/60"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-400 group-hover:bg-brand-500 group-hover:text-dark-950 transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. TRAVEL GALLERY */}
      {gallery.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-400 block mb-1">
                Visual Stories
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
                Captured On The Trails
              </h2>
            </div>
            <a
              href="https://instagram.com/wandermate.traversee"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-300"
            >
              <span>Follow @wandermate.traversee on Instagram</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {gallery.map((img) => (
              <div
                key={img.id}
                onClick={() => setActiveGalleryModal(img.imageUrl)}
                className="group relative h-48 rounded-xl overflow-hidden cursor-pointer bg-dark-900 border border-slate-800"
              >
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-dark-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                  <span className="text-[11px] font-medium text-white truncate drop-shadow-md">
                    {img.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Image Modal Lightbox */}
      {activeGalleryModal && (
        <div
          onClick={() => setActiveGalleryModal(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <img
              src={activeGalleryModal}
              alt="Full Preview"
              className="w-full h-full object-contain"
            />
            <button
              onClick={() => setActiveGalleryModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-950/80 text-white hover:bg-brand-500 hover:text-dark-950 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* 6. BIG CTA BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative rounded-3xl overflow-hidden glass-panel bg-gradient-to-br from-dark-900 via-dark-850 to-brand-950/40 border border-brand-500/30 p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider">
            <span>{settings.tagline || "Less Talk. More Traverse."}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-display max-w-3xl mx-auto">
            {content?.cta?.title || "Ready to Escape the Ordinary & Explore Untamed Trails?"}
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-light">
            {content?.cta?.subtitle || "Spots are strictly limited to keep our cohorts intimate. Reserve your seat or talk directly with our expedition captains on WhatsApp."}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/booking"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-xl shadow-brand-500/30 transition-all duration-300 hover:scale-105"
            >
              <span>Book Your Journey</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-sm font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Talk to Captain on WhatsApp</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
