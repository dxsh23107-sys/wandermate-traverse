"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  Sparkles,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react";

export default function NewTripPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("Trek");
  const [duration, setDuration] = useState("6 Days / 5 Nights");
  const [price, setPrice] = useState<number>(18999);
  const [originalPrice, setOriginalPrice] = useState<number>(22999);
  const [startingLocation, setStartingLocation] = useState("");
  const [endingLocation, setEndingLocation] = useState("");
  const [availableSeats, setAvailableSeats] = useState<number>(12);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80");
  const [status, setStatus] = useState("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [importantInfo, setImportantInfo] = useState("Please carry thermal inners, waterproof trekking shoes, and a valid photo ID.");

  // Arrays
  const [dates, setDates] = useState<string[]>(["15 Oct 2026", "02 Nov 2026", "20 Nov 2026"]);
  const [newDateInput, setNewDateInput] = useState("");

  const [gallery, setGallery] = useState<string[]>([
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
  ]);
  const [newGalleryInput, setNewGalleryInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>([
    "Stargaze at high-altitude basecamps under zero light pollution",
    "Expert native mountain guides and certified trek leads",
    "Cozy boutique homestays with hot regional meals"
  ]);
  const [newHighlightInput, setNewHighlightInput] = useState("");

  const [inclusions, setInclusions] = useState<string[]>([
    "Accommodation across all days in homestays / dome tents",
    "Nutritious Breakfast and Dinner daily",
    "Dedicated Tempo / 4x4 internal transportation",
    "Permits, entry fees, and oxygen safety backup"
  ]);
  const [newInclusionInput, setNewInclusionInput] = useState("");

  const [exclusions, setExclusions] = useState<string[]>([
    "Airfare / Train tickets to base location",
    "Lunches and personal cafe expenses",
    "Personal insurance"
  ]);
  const [newExclusionInput, setNewExclusionInput] = useState("");

  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([
    {
      question: "What is the fitness level required?",
      answer: "Basic endurance. Daily walks of 4-5 hours at comfortable pacing."
    }
  ]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  const [itinerary, setItinerary] = useState<Array<{ day: number; title: string; description: string; meals: string; stay: string }>>([
    {
      day: 1,
      title: "Arrival and Acclimatization Walk",
      description: "Meet the cohort at the starting basecamp. Orientation briefing and evening campfire dinner.",
      meals: "Dinner",
      stay: "Mountain Lodge / Camps"
    },
    {
      day: 2,
      title: "Ascent to Hidden Ridge",
      description: "Begin the trek through pine forests and cross glacial streams to reach the panoramic alpine ridge.",
      meals: "Breakfast, Dinner",
      stay: "Alpine Dome Tents"
    }
  ]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: "cover" | "gallery") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.url) {
        if (target === "cover") {
          setCoverImage(data.url);
        } else {
          setGallery([...gallery, data.url]);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDay,
        title: `Day ${nextDay} Trail`,
        description: "Trail exploration and mountain views.",
        meals: "Breakfast, Dinner",
        stay: "Cozy Homestay"
      }
    ]);
  };

  const handleRemoveItineraryDay = (index: number) => {
    const updated = itinerary.filter((_, i) => i !== index).map((item, idx) => ({
      ...item,
      day: idx + 1,
    }));
    setItinerary(updated);
  };

  const handleSaveTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          destination,
          category,
          duration,
          price: Number(price),
          originalPrice: Number(originalPrice),
          startingLocation: startingLocation || destination,
          endingLocation: endingLocation || destination,
          availableSeats: Number(availableSeats),
          dates,
          shortDescription,
          fullDescription,
          coverImage,
          gallery,
          highlights,
          inclusions,
          exclusions,
          faqs,
          importantInfo,
          status,
          featured,
          itinerary,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create trip");
      }

      router.push("/admin/trips");
    } catch (err: any) {
      setError(err.message || "Failed to save trip");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <AdminNavbar title="Create New Travel Package" />

      <main className="p-8 max-w-5xl space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trips</span>
          </button>
          <span className="text-xs text-brand-400 font-bold uppercase tracking-wider">
            Step-by-step Package Editor
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSaveTrip} className="space-y-8">
          
          {/* 1. BASIC INFORMATION */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              1. Basic Package Details
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300">Package Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Zanskar Frozen River Chadar Expedition — 8 Days"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Destination *</label>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Ladakh, Himalayas"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Trek">Trek</option>
                  <option value="Expedition">Expedition</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Backpacking">Backpacking</option>
                  <option value="Weekend">Weekend</option>
                  <option value="Wildlife">Wildlife</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Duration *</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 7 Days / 6 Nights"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Starting Price (₹) *</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Original Price (₹)</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Available Seats</label>
                <input
                  type="number"
                  value={availableSeats}
                  onChange={(e) => setAvailableSeats(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Starting Point</label>
                <input
                  type="text"
                  value={startingLocation}
                  onChange={(e) => setStartingLocation(e.target.value)}
                  placeholder="e.g. Leh / Shimla"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="featuredCheck"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="featuredCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Feature on Homepage Hero & Top Grids
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-300 font-semibold">Publish Status:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white"
                >
                  <option value="ACTIVE">Published (Live)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 2. DATES & BATCHES */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              2. Upcoming Batch Dates
            </h3>

            <div className="flex flex-wrap gap-2">
              {dates.map((d, i) => (
                <span key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-brand-300 font-medium">
                  <span>{d}</span>
                  <button
                    type="button"
                    onClick={() => setDates(dates.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newDateInput}
                onChange={(e) => setNewDateInput(e.target.value)}
                placeholder="e.g. 15 Nov 2026 or 05 Dec 2026"
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={() => {
                  if (newDateInput.trim()) {
                    setDates([...dates, newDateInput.trim()]);
                    setNewDateInput("");
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400 hover:bg-brand-300"
              >
                Add Batch Date
              </button>
            </div>
          </div>

          {/* 3. DESCRIPTIONS & IMAGERY */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              3. Descriptions & Media
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300">Short Summary (For Cards & Search)</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Short teaser description..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300">Full Expedition Story</label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                placeholder="Complete comprehensive trip description..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-300">Cover Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
                <label className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Local File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "cover")}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 4. DAY-BY-DAY ITINERARY BUILDER */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                4. Day-by-Day Itinerary ({itinerary.length} Days)
              </h3>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-dark-950 bg-brand-400 hover:bg-brand-300"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Day</span>
              </button>
            </div>

            <div className="space-y-4">
              {itinerary.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-bold text-xs text-brand-400 uppercase">Day {item.day}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveItineraryDay(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[idx].title = e.target.value;
                        setItinerary(updated);
                      }}
                      placeholder="Day Title (e.g. Drive from Shimla to Kalpa)"
                      className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.meals}
                      onChange={(e) => {
                        const updated = [...itinerary];
                        updated[idx].meals = e.target.value;
                        setItinerary(updated);
                      }}
                      placeholder="Meals (e.g. Breakfast, Dinner)"
                      className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) => {
                      const updated = [...itinerary];
                      updated[idx].description = e.target.value;
                      setItinerary(updated);
                    }}
                    placeholder="Day activity description..."
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 5. HIGHLIGHTS, INCLUSIONS & EXCLUSIONS */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              5. Highlights & Inclusions
            </h3>

            {/* Highlights */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Highlights List</label>
              <ul className="space-y-1.5">
                {highlights.map((h, i) => (
                  <li key={i} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-200">
                    <span>• {h}</span>
                    <button
                      type="button"
                      onClick={() => setHighlights(highlights.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newHighlightInput}
                  onChange={(e) => setNewHighlightInput(e.target.value)}
                  placeholder="Add new highlight point..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newHighlightInput.trim()) {
                      setHighlights([...highlights, newHighlightInput.trim()]);
                      setNewHighlightInput("");
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Inclusions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-emerald-400">Inclusions List</label>
              <ul className="space-y-1.5">
                {inclusions.map((inc, i) => (
                  <li key={i} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-200">
                    <span>✓ {inc}</span>
                    <button
                      type="button"
                      onClick={() => setInclusions(inclusions.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newInclusionInput}
                  onChange={(e) => setNewInclusionInput(e.target.value)}
                  placeholder="Add inclusion (e.g. 5 nights homestay stay)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newInclusionInput.trim()) {
                      setInclusions([...inclusions, newInclusionInput.trim()]);
                      setNewInclusionInput("");
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-emerald-400"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Exclusions */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-red-400">Exclusions List</label>
              <ul className="space-y-1.5">
                {exclusions.map((exc, i) => (
                  <li key={i} className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs text-slate-200">
                    <span>✕ {exc}</span>
                    <button
                      type="button"
                      onClick={() => setExclusions(exclusions.filter((_, idx) => idx !== i))}
                      className="text-slate-500 hover:text-red-400"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newExclusionInput}
                  onChange={(e) => setNewExclusionInput(e.target.value)}
                  placeholder="Add exclusion (e.g. personal shopping)..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newExclusionInput.trim()) {
                      setExclusions([...exclusions, newExclusionInput.trim()]);
                      setNewExclusionInput("");
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-red-400"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 shadow-xl shadow-brand-500/30 transition-all duration-200 disabled:opacity-50"
            >
              {submitting ? "Publishing Package..." : "Publish Trip to Website"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
