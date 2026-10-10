"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { parseJsonSafe } from "@/lib/utils";
import {
  Plus,
  Trash2,
  Upload,
  ArrowLeft,
  Check,
  Sparkles,
  MapPin,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [category, setCategory] = useState("Trek");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [originalPrice, setOriginalPrice] = useState<number>(0);
  const [startingLocation, setStartingLocation] = useState("");
  const [endingLocation, setEndingLocation] = useState("");
  const [availableSeats, setAvailableSeats] = useState<number>(12);
  const [shortDescription, setShortDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [featured, setFeatured] = useState(false);
  const [importantInfo, setImportantInfo] = useState("");

  const [dates, setDates] = useState<string[]>([]);
  const [newDateInput, setNewDateInput] = useState("");

  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlightInput, setNewHighlightInput] = useState("");

  const [inclusions, setInclusions] = useState<string[]>([]);
  const [newInclusionInput, setNewInclusionInput] = useState("");

  const [exclusions, setExclusions] = useState<string[]>([]);
  const [newExclusionInput, setNewExclusionInput] = useState("");

  const [itinerary, setItinerary] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/trips/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.trip) {
          const t = data.trip;
          setTitle(t.title);
          setDestination(t.destination);
          setCategory(t.category);
          setDuration(t.duration);
          setPrice(t.price);
          setOriginalPrice(t.originalPrice || 0);
          setStartingLocation(t.startingLocation || "");
          setEndingLocation(t.endingLocation || "");
          setAvailableSeats(t.availableSeats || 12);
          setShortDescription(t.shortDescription || "");
          setFullDescription(t.fullDescription || "");
          setCoverImage(t.coverImage || "");
          setStatus(t.status || "ACTIVE");
          setFeatured(Boolean(t.featured));
          setImportantInfo(t.importantInfo || "");

          setDates(parseJsonSafe<string[]>(t.dates, []));
          setHighlights(parseJsonSafe<string[]>(t.highlights, []));
          setInclusions(parseJsonSafe<string[]>(t.inclusions, []));
          setExclusions(parseJsonSafe<string[]>(t.exclusions, []));
          setItinerary(t.itinerary || []);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddItineraryDay = () => {
    const nextDay = itinerary.length + 1;
    setItinerary([
      ...itinerary,
      {
        day: nextDay,
        title: `Day ${nextDay}`,
        description: "",
        meals: "Breakfast, Dinner",
        stay: "Camp / Homestay"
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

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch(`/api/trips/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          destination,
          category,
          duration,
          price: Number(price),
          originalPrice: Number(originalPrice),
          startingLocation,
          endingLocation,
          availableSeats: Number(availableSeats),
          dates,
          shortDescription,
          fullDescription,
          coverImage,
          highlights,
          inclusions,
          exclusions,
          importantInfo,
          status,
          featured,
          itinerary,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to update trip");
      }

      router.push("/admin/trips");
    } catch (err: any) {
      setError(err.message || "Failed to update trip");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <AdminNavbar title="Edit Travel Package" />
        <main className="p-8 max-w-5xl space-y-4">
          <div className="h-64 rounded-3xl bg-slate-900/60 animate-pulse" />
        </main>
      </div>
    );
  }

  return (
    <div>
      <AdminNavbar title={`Edit: ${title}`} />

      <main className="p-8 max-w-5xl space-y-8 pb-32">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Trips</span>
          </button>
          <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
            Live Package Editing
          </span>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdateTrip} className="space-y-8">
          
          {/* BASIC INFO */}
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
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs text-slate-300">Price (₹) *</label>
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
                <label className="block text-xs text-slate-300">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option value="ACTIVE">Published (Live)</option>
                  <option value="DRAFT">Draft (Hidden)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
              <input
                type="checkbox"
                id="editFeaturedCheck"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-brand-500 rounded bg-slate-900 border-slate-700 cursor-pointer"
              />
              <label htmlFor="editFeaturedCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                Mark as Featured Expedition
              </label>
            </div>
          </div>

          {/* DATES */}
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
                placeholder="e.g. 15 Nov 2026"
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
                className="px-4 py-2 rounded-xl text-xs font-semibold text-dark-950 bg-brand-400"
              >
                Add Date
              </button>
            </div>
          </div>

          {/* DESCRIPTIONS & MEDIA */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white font-display border-b border-slate-800 pb-3">
              3. Descriptions & Media
            </h3>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300">Short Summary</label>
              <textarea
                rows={2}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs text-slate-300">Full Expedition Story</label>
              <textarea
                rows={4}
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-300">Cover Image URL</label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white"
              />
            </div>
          </div>

          {/* ITINERARY */}
          <div className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-display">
                4. Day-by-Day Itinerary ({itinerary.length} Days)
              </h3>
              <button
                type="button"
                onClick={handleAddItineraryDay}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-dark-950 bg-brand-400"
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
                      className="bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={item.meals || ""}
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
                    className="w-full bg-dark-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* SUBMIT BUTTON */}
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
              className="px-8 py-3.5 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 shadow-xl shadow-brand-500/30 transition-all duration-200"
            >
              {submitting ? "Updating Package..." : "Save All Changes"}
            </button>
          </div>

        </form>
      </main>
    </div>
  );
}
