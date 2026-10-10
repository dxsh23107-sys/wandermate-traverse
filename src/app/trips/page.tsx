"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import TripCard from "@/components/public/TripCard";
import { Search, Filter, Compass, SlidersHorizontal, ArrowUpDown } from "lucide-react";

function TripsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const initialSearch = searchParams.get("search") || "";

  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [sortBy, setSortBy] = useState("featured");

  const categories = ["All", "Trek", "Expedition", "Cultural", "Backpacking", "Weekend"];

  useEffect(() => {
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (data?.trips) setTrips(data.trips);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const filteredTrips = trips.filter((trip) => {
    const matchCategory =
      selectedCategory === "All" ||
      trip.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchSearch =
      searchTerm.trim() === "" ||
      trip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());

    return matchCategory && matchSearch;
  });

  const sortedTrips = [...filteredTrips].sort((a, b) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header Banner */}
      <div className="space-y-3 max-w-3xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
          Traverse Expeditions & Packages
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display">
          All Travel Packages
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-light">
          Handcrafted high-altitude expeditions, living root bridge rainforest hikes, and offbeat backpacking adventures with small intimate groups.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 glass-panel p-4 sm:p-6 rounded-2xl border border-slate-800">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center">
          {/* Search bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="w-4 h-4 text-brand-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by destination, trek, state..."
              className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Latest Added</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${isSelected
                    ? "bg-brand-500 text-dark-950 shadow-md shadow-brand-500/25 font-bold"
                    : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                  }`}
              >
                {cat === "All" ? "All Categories" : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{sortedTrips.length}</strong> available expeditions
        </span>
        {(searchTerm || selectedCategory !== "All") && (
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
            className="text-brand-400 hover:underline"
          >
            Reset all filters
          </button>
        )}
      </div>

      {/* Trips Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-96 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
          ))}
        </div>
      ) : sortedTrips.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl space-y-4">
          <Compass className="w-12 h-12 text-brand-400 mx-auto" />
          <h3 className="text-xl font-bold text-white">No matching expeditions found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            We couldn&apos;t find any trips matching your filters. Try clearing your search term or exploring another category.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchTerm("");
            }}
            className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-brand-400 hover:bg-brand-300 transition-colors"
          >
            Show All Expeditions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-400">Loading expeditions...</div>}>
      <TripsContent />
    </Suspense>
  );
}
