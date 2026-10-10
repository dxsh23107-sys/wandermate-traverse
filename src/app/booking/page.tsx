"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatINR, getWhatsAppUrl, parseJsonSafe } from "@/lib/utils";
import {
  Compass,
  CheckCircle2,
  MessageCircle,
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from "lucide-react";

function BookingContent() {
  const searchParams = useSearchParams();
  const preselectedTripId = searchParams.get("tripId");
  const preselectedDate = searchParams.get("date");

  const [trips, setTrips] = useState<any[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [selectedTripId, setSelectedTripId] = useState(preselectedTripId || "");
  const [selectedDate, setSelectedDate] = useState(preselectedDate || "");
  const [travelers, setTravelers] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("8779884225");

  useEffect(() => {
    fetch("/api/trips")
      .then((res) => res.json())
      .then((data) => {
        if (data?.trips) {
          setTrips(data.trips);
          if (!selectedTripId && data.trips.length > 0) {
            setSelectedTripId(data.trips[0].id);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoadingTrips(false));

    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  const selectedTrip = trips.find((t) => t.id === selectedTripId) || (trips.length > 0 ? trips[0] : null);
  const datesList = selectedTrip ? parseJsonSafe<string[]>(selectedTrip.dates, []) : [];

  useEffect(() => {
    if (datesList.length > 0 && !selectedDate) {
      setSelectedDate(datesList[0]);
    }
  }, [selectedTripId, datesList]);

  const pricePerPerson = selectedTrip ? selectedTrip.price : 0;
  const totalPrice = pricePerPerson * travelers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!customerName || !email || !phone || !selectedDate) {
      setError("Please fill in all required fields (Name, Email, WhatsApp Phone, Date).");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: selectedTrip?.id,
          tripTitle: selectedTrip?.title,
          customerName,
          email,
          phone,
          travelers: Number(travelers),
          date: selectedDate,
          specialRequests,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to create booking");
      }

      setBookingSuccess(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // SUCCESS CONFIRMATION SCREEN
  if (bookingSuccess) {
    const booking = bookingSuccess.booking;
    const confirmWaMessage = `Hi Wandermate Traverse! I have submitted a booking for ${booking.tripTitle} (Booking ID: ${booking.bookingId}) for ${booking.travelers} traveler(s) on ${booking.date}. Please share payment and confirmation details.`;
    const confirmWaUrl = getWhatsAppUrl(whatsappNumber, confirmWaMessage);

    return (
      <div className="min-h-screen pt-32 pb-20 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-12 rounded-3xl glass-panel bg-dark-900/95 border border-emerald-500/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Booking Request Received!
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display">
              You&apos;re Ready to Traverse!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
              Your booking reservation has been successfully registered in our expedition system.
            </p>
          </div>

          {/* Booking Summary Box */}
          <div className="p-6 rounded-2xl bg-dark-950/80 border border-slate-800 text-left space-y-3 max-w-lg mx-auto text-xs sm:text-sm">
            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
              <span className="text-slate-400">Booking ID:</span>
              <strong className="text-brand-400 font-mono text-base">{booking.bookingId}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Expedition:</span>
              <strong className="text-white truncate max-w-[200px]">{booking.tripTitle}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Travel Date:</span>
              <strong className="text-white">{booking.date}</strong>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Traveler(s):</span>
              <strong className="text-white">{booking.travelers} Person(s)</strong>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-800 text-sm">
              <span className="text-slate-300 font-semibold">Total Amount:</span>
              <strong className="text-emerald-400 text-base">{formatINR(booking.totalPrice)}</strong>
            </div>
          </div>

          {/* WhatsApp Direct Confirmation Button */}
          <div className="pt-4 space-y-3 max-w-lg mx-auto">
            <a
              href={confirmWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-950/50 transition-all duration-200 hover:scale-[1.02]"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Confirm on WhatsApp with Captain</span>
            </a>

            <Link
              href="/trips"
              className="inline-block text-xs text-slate-400 hover:text-white transition-colors pt-2"
            >
              ← Browse other expeditions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
          Fast Reservation
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-display">
          Book Your Expedition Seat
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-light">
          Reserve your spot with our intimate 10-12 traveler cohorts. Zero hidden charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FORM (2 COLS) */}
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 shadow-xl space-y-6"
          >
            {error && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
                {error}
              </div>
            )}

            {/* Trip Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select Expedition *
              </label>
              <select
                value={selectedTripId}
                onChange={(e) => setSelectedTripId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                required
              >
                {trips.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} — ({formatINR(t.price)})
                  </option>
                ))}
              </select>
            </div>

            {/* Date & Travelers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Preferred Date / Batch *
                </label>
                {datesList.length > 0 ? (
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                    required
                  >
                    {datesList.map((d, i) => (
                      <option key={i} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                    required
                  />
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Number of Travelers *
                </label>
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={travelers}
                  onChange={(e) => setTravelers(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            {/* Personal Details */}
            <div className="space-y-4 pt-2 border-t border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Primary Contact Details
              </h3>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Aarav Mehta"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs text-slate-400">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="aarav@gmail.com"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs text-slate-400">WhatsApp Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs text-slate-400">Special Requests / Dietary Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Vegetarian/Jain meal request, solo tent preference, etc."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 via-brand-500 to-amber-500 hover:from-brand-300 hover:to-amber-400 shadow-xl shadow-brand-500/25 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50"
            >
              <span>{submitting ? "Reserving Seat..." : "Submit Booking Request"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* SUMMARY CARD (1 COL) */}
        <div>
          <div className="sticky top-28 p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Booking Summary
            </h3>

            {selectedTrip ? (
              <div className="space-y-4">
                <div className="relative h-32 rounded-xl overflow-hidden">
                  <img
                    src={selectedTrip.coverImage}
                    alt={selectedTrip.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-dark-950/30" />
                  <div className="absolute bottom-2 left-2 right-2 text-xs font-bold text-white truncate drop-shadow-md">
                    {selectedTrip.title}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Price per traveler:</span>
                    <strong className="text-white">{formatINR(selectedTrip.price)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Travelers:</span>
                    <strong className="text-white">× {travelers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Permits & Stays:</span>
                    <span className="text-emerald-400">Included</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Total Price:</span>
                  <span className="text-2xl font-extrabold text-brand-400">{formatINR(totalPrice)}</span>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Please select a trip above to view summary.</p>
            )}

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-brand-300 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Risk Reservation</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                After submission, our lead captain reaches out via WhatsApp with day-by-day packing advice and booking confirmation.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-32 text-center text-slate-400">Loading booking portal...</div>}>
      <BookingContent />
    </Suspense>
  );
}
