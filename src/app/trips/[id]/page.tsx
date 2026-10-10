"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { formatINR, getWhatsAppUrl, parseJsonSafe } from "@/lib/utils";
import {
  Compass,
  MapPin,
  Clock,
  Users,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Shield,
  Utensils,
  Home,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Share2
} from "lucide-react";

export default function TripDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("8779884225");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeItineraryDay, setActiveItineraryDay] = useState<number | null>(1);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    fetch(`/api/trips/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Trip not found");
        return res.json();
      })
      .then((data) => {
        if (data?.trip) {
          setTrip(data.trip);
          const dates = parseJsonSafe<string[]>(data.trip.dates, []);
          if (dates.length > 0) setSelectedDate(dates[0]);
        }
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => { });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 max-w-5xl mx-auto px-4 space-y-6">
        <div className="h-96 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800" />
        <div className="h-20 rounded-2xl bg-slate-900/40 animate-pulse" />
        <div className="h-64 rounded-2xl bg-slate-900/40 animate-pulse" />
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
        <Compass className="w-12 h-12 text-brand-400 animate-spin-slow" />
        <h2 className="text-2xl font-bold text-white">Expedition Not Found</h2>
        <p className="text-sm text-slate-400 max-w-md">
          The requested trip package does not exist or may have been archived.
        </p>
        <Link
          href="/trips"
          className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-brand-400 hover:bg-brand-300 transition-colors"
        >
          Browse All Trips
        </Link>
      </div>
    );
  }

  const datesArray = parseJsonSafe<string[]>(trip.dates, []);
  const galleryArray = parseJsonSafe<string[]>(trip.gallery, []);
  const highlightsArray = parseJsonSafe<string[]>(trip.highlights, []);
  const inclusionsArray = parseJsonSafe<string[]>(trip.inclusions, []);
  const exclusionsArray = parseJsonSafe<string[]>(trip.exclusions, []);
  const faqsArray = parseJsonSafe<Array<{ question: string; answer: string }>>(trip.faqs, []);

  const whatsappMessage = `Hi Wandermate Traverse! I'm interested in the ${trip.title} (${trip.duration}) trip. Please share more details.`;
  const whatsappUrl = getWhatsAppUrl(whatsappNumber, whatsappMessage);

  return (
    <div className="min-h-screen pt-24 pb-32 space-y-12">
      {/* 1. CINEMATIC HERO BANNER */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[65vh] min-h-[440px] max-h-[600px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl">
          <img
            src={trip.coverImage || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1800&q=80"}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/20" />

          {/* Top Bar inside Hero */}
          <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
            <Link
              href="/trips"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-dark-950/80 backdrop-blur-md border border-slate-700 hover:border-brand-400 hover:text-brand-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Trips</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-500 text-dark-950 shadow-lg">
                {trip.category}
              </span>
              {trip.featured && (
                <span className="hidden sm:inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-dark-950/80 text-amber-300 border border-amber-400/40 backdrop-blur-md">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Featured
                </span>
              )}
            </div>
          </div>

          {/* Bottom Title & Details in Hero */}
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 sm:right-10 z-10 space-y-3 max-w-4xl">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-300 font-medium">
              <MapPin className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{trip.destination}</span>
              <span className="text-slate-500">•</span>
              <Clock className="w-4 h-4 text-brand-400 shrink-0" />
              <span>{trip.duration}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white font-display leading-tight">
              {trip.title}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 max-w-3xl font-light">
              {trip.shortDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT 2 COLUMNS: TRIP DETAILS */}
          <div className="lg:col-span-2 space-y-12">

            {/* Quick Stats Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl glass-card border border-slate-800 text-center">
              <div className="p-2 border-r border-slate-800 last:border-0">
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Duration</span>
                <strong className="text-sm sm:text-base text-white font-semibold">{trip.duration}</strong>
              </div>
              <div className="p-2 border-r border-slate-800 last:border-0">
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Starting Point</span>
                <strong className="text-sm sm:text-base text-white font-semibold truncate block">{trip.startingLocation}</strong>
              </div>
              <div className="p-2 border-r border-slate-800 last:border-0">
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Batch Size</span>
                <strong className="text-sm sm:text-base text-white font-semibold">10-12 Wanderers</strong>
              </div>
              <div className="p-2">
                <span className="block text-[11px] text-slate-400 uppercase tracking-wider">Seats Left</span>
                <strong className="text-sm sm:text-base text-amber-400 font-semibold">{trip.availableSeats} Available</strong>
              </div>
            </div>

            {/* Overview / Full Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                <Compass className="w-6 h-6 text-brand-400" />
                <span>Expedition Overview</span>
              </h2>
              <div className="p-6 rounded-2xl glass-card border border-slate-800 text-slate-300 text-sm sm:text-base leading-relaxed space-y-4 font-light">
                <p>{trip.fullDescription || trip.shortDescription}</p>
              </div>
            </section>

            {/* Key Highlights */}
            {highlightsArray.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-400" />
                  <span>Key Highlights</span>
                </h2>
                <div className="p-6 rounded-2xl glass-card border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {highlightsArray.map((highlight, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-500/20 text-brand-400 flex items-center justify-center shrink-0 mt-0.5 border border-brand-500/40">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs sm:text-sm text-slate-200 leading-snug">{highlight}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Day-by-Day Itinerary */}
            {trip.itinerary && trip.itinerary.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-brand-400" />
                    <span>Day-by-Day Itinerary</span>
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {trip.itinerary.length} Days Detailed Plan
                  </span>
                </div>

                <div className="space-y-3">
                  {trip.itinerary.map((item: any) => {
                    const isExpanded = activeItineraryDay === item.day;
                    return (
                      <div
                        key={item.id}
                        className={`rounded-2xl glass-card border transition-all duration-200 overflow-hidden ${isExpanded ? "border-brand-500/50 bg-slate-900/80" : "border-slate-800"
                          }`}
                      >
                        <button
                          onClick={() => setActiveItineraryDay(isExpanded ? null : item.day)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="w-9 h-9 rounded-xl bg-brand-500/15 border border-brand-500/30 text-brand-400 font-bold text-xs flex items-center justify-center shrink-0 font-display">
                              D{item.day}
                            </span>
                            <div>
                              <span className="text-[11px] text-brand-400 uppercase tracking-widest block font-semibold">
                                Day {item.day}
                              </span>
                              <h4 className="text-sm sm:text-base font-bold text-white">
                                {item.title}
                              </h4>
                            </div>
                          </div>
                          <div className="p-1 text-slate-400">
                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-1 space-y-4 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60 font-light">
                            <p>{item.description}</p>

                            {(item.meals || item.stay) && (
                              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                                {item.meals && (
                                  <div className="flex items-center gap-1.5 text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                                    <Utensils className="w-3.5 h-3.5" />
                                    <span>Meals: <strong className="font-semibold text-slate-200">{item.meals}</strong></span>
                                  </div>
                                )}
                                {item.stay && (
                                  <div className="flex items-center gap-1.5 text-amber-400 bg-amber-950/40 px-3 py-1.5 rounded-lg border border-amber-500/20">
                                    <Home className="w-3.5 h-3.5" />
                                    <span>Stay: <strong className="font-semibold text-slate-200">{item.stay}</strong></span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Inclusions & Exclusions */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white font-display">
                What&apos;s Included & Excluded
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Inclusions */}
                <div className="p-6 rounded-2xl glass-card border border-emerald-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm uppercase tracking-wider">
                    <Check className="w-5 h-5" />
                    <span>Inclusions</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {inclusionsArray.map((inc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Exclusions */}
                <div className="p-6 rounded-2xl glass-card border border-red-500/20 space-y-4">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm uppercase tracking-wider">
                    <X className="w-5 h-5" />
                    <span>Exclusions</span>
                  </div>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    {exclusionsArray.map((exc, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-2" />
                        <span>{exc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            {/* Photo Gallery Grid */}
            {galleryArray.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white font-display">
                  Expedition Gallery
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {galleryArray.map((imgUrl, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedPhoto(imgUrl)}
                      className="group relative h-36 rounded-xl overflow-hidden glass-card cursor-pointer border border-slate-800"
                    >
                      <img
                        src={imgUrl}
                        alt={`${trip.title} Photo ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FAQs Accordion */}
            {faqsArray.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-bold text-white font-display flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-brand-400" />
                  <span>Frequently Asked Questions</span>
                </h2>
                <div className="space-y-3">
                  {faqsArray.map((faq, i) => {
                    const isOpen = activeFaq === i;
                    return (
                      <div
                        key={i}
                        className="rounded-2xl glass-card border border-slate-800 overflow-hidden"
                      >
                        <button
                          onClick={() => setActiveFaq(isOpen ? null : i)}
                          className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left"
                        >
                          <span className="text-xs sm:text-sm font-bold text-white">
                            {faq.question}
                          </span>
                          <div className="text-slate-400 shrink-0">
                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </div>
                        </button>
                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 font-light">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Important Info */}
            {trip.importantInfo && (
              <section className="p-6 rounded-2xl glass-card border border-amber-500/30 bg-amber-950/10 space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                  <AlertCircle className="w-5 h-5" />
                  <span>Important Traveler Notes</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                  {trip.importantInfo}
                </p>
              </section>
            )}

          </div>

          {/* RIGHT 1 COLUMN: DESKTOP BOOKING CARD */}
          <div className="space-y-6">
            <div className="sticky top-28 p-6 rounded-3xl glass-panel border border-brand-500/30 bg-dark-900/90 shadow-2xl space-y-6">

              {/* Price Display */}
              <div className="space-y-1 pb-4 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider text-slate-400">Expedition Price</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-brand-400">
                    {formatINR(trip.price)}
                  </span>
                  {trip.originalPrice && trip.originalPrice > trip.price && (
                    <span className="text-sm text-slate-500 line-through">
                      {formatINR(trip.originalPrice)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">/ person</span>
                </div>
                <span className="text-[11px] text-emerald-400 font-medium block">
                  ✓ Includes Stays, Meals, Transport & Permits
                </span>
              </div>

              {/* Upcoming Batch Selector */}
              {datesArray.length > 0 && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Select Upcoming Batch
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                  >
                    {datesArray.map((d, idx) => (
                      <option key={idx} value={d}>
                        Batch {idx + 1}: {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <Link
                  href={`/booking?tripId=${trip.id}&date=${encodeURIComponent(selectedDate)}`}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-xl shadow-brand-500/25 transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Book This Trip</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-xs sm:text-sm font-semibold text-emerald-400 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire on WhatsApp</span>
                </a>
              </div>

              {/* Guarantees list */}
              <div className="pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-brand-400" />
                  <span>100% Certified Native Captains</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-brand-400" />
                  <span>Small Intimate Cohorts (Max 12)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-brand-400" />
                  <span>Free Date Change Support</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 3. STICKY BOTTOM BAR (Mobile and Tablet) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-4 glass-nav bg-dark-950/95 border-t border-slate-800 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Price</span>
          <span className="text-lg font-extrabold text-brand-400">
            {formatINR(trip.price)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-500/40"
            aria-label="Enquire via WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <Link
            href={`/booking?tripId=${trip.id}&date=${encodeURIComponent(selectedDate)}`}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-lg shadow-brand-500/25"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden">
            <img src={selectedPhoto} alt="Gallery view" className="w-full h-full object-contain" />
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark-950/80 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
