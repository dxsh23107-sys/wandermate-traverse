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

          <Link href={`/trips/${trip.slug || trip.id}`}>
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
            href={`/trips/${trip.slug || trip.id}`}
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
