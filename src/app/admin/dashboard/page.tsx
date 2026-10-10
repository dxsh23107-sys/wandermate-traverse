"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { formatINR } from "@/lib/utils";
import {
  Map,
  CalendarCheck2,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Eye,
  Edit,
  Sparkles,
  ExternalLink
} from "lucide-react";

export default function AdminDashboardPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [tripsRes, bookingsRes] = await Promise.all([
        fetch("/api/trips?all=true"),
        fetch("/api/bookings"),
      ]);
      const tripsData = await tripsRes.json();
      const bookingsData = await bookingsRes.json();

      if (tripsData?.trips) setTrips(tripsData.trips);
      if (bookingsData?.bookings) setBookings(bookingsData.bookings);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalTrips = trips.length;
  const activeTrips = trips.filter((t) => t.status === "ACTIVE").length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter((b) => b.status === "PENDING").length;
  const confirmedBookings = bookings.filter((b) => b.status === "CONFIRMED").length;
  const totalCustomers = new Set(bookings.map((b) => b.email)).size;
  const totalRevenue = bookings
    .filter((b) => b.status === "CONFIRMED" || b.status === "COMPLETED")
    .reduce((acc, b) => acc + (b.totalPrice || 0), 0);

  const handleUpdateStatus = async (bookingId: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar title="Executive Dashboard Overview" />

      <main className="p-8 space-y-8 max-w-7xl">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: Total Trips */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Packages</span>
              <div className="w-8 h-8 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center">
                <Map className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{totalTrips}</span>
              <span className="text-xs text-emerald-400 font-semibold">{activeTrips} Active</span>
            </div>
          </div>

          {/* Card 2: Total Bookings */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{totalBookings}</span>
              <span className="text-xs text-amber-400 font-semibold">{pendingBookings} Pending</span>
            </div>
          </div>

          {/* Card 3: Confirmed Travelers */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Bookings</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white font-display">{confirmedBookings}</span>
              <span className="text-xs text-slate-400">{totalCustomers} Unique Clients</span>
            </div>
          </div>

          {/* Card 4: Estimated Revenue */}
          <div className="p-5 rounded-2xl glass-card border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Confirmed Pipeline</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-brand-400 font-display">
                {formatINR(totalRevenue)}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
          <div className="space-y-0.5">
            <h3 className="text-sm font-bold text-white">Trip Management Actions</h3>
            <p className="text-xs text-slate-400">Add or edit package dates, itineraries, and rates.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/trips/new"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-md shadow-brand-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Trip</span>
            </Link>
            <Link
              href="/admin/bookings"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Manage Bookings
            </Link>
          </div>
        </div>

        {/* Recent Bookings Feed */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">Recent Customer Bookings</h2>
            <Link href="/admin/bookings" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              <span>View All ({bookings.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider border-b border-slate-800 text-[11px]">
                  <tr>
                    <th className="p-4">Booking ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Trip</th>
                    <th className="p-4">Travelers / Date</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-400">{b.bookingId}</td>
                      <td className="p-4">
                        <div className="font-semibold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.phone}</div>
                      </td>
                      <td className="p-4 font-medium text-white truncate max-w-[200px]">{b.tripTitle}</td>
                      <td className="p-4">
                        <div>{b.travelers} Traveler(s)</div>
                        <div className="text-[11px] text-slate-400">{b.date}</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400">{formatINR(b.totalPrice)}</td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                              : b.status === "PENDING"
                              ? "bg-amber-950 text-amber-300 border border-amber-500/40"
                              : b.status === "CANCELLED"
                              ? "bg-red-950 text-red-300 border border-red-500/40"
                              : "bg-blue-950 text-blue-300 border border-blue-500/40"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-brand-500 cursor-pointer"
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        No bookings received yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Current Active Trips Table */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white font-display">Published Travel Packages</h2>
            <Link href="/admin/trips" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              <span>Manage All Trips ({trips.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {trips.slice(0, 6).map((trip) => (
              <div key={trip.id} className="p-4 rounded-2xl glass-card border border-slate-800 space-y-3 flex flex-col justify-between">
                <div className="flex gap-3">
                  <img
                    src={trip.coverImage}
                    alt={trip.title}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-700"
                  />
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-brand-400 tracking-wider block">
                      {trip.category}
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">{trip.title}</h4>
                    <div className="text-xs text-slate-400 font-semibold">{formatINR(trip.price)}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Seats: <strong className="text-slate-200">{trip.availableSeats}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/trips/${trip.slug || trip.id}`}
                      target="_blank"
                      className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      title="View public page"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/admin/trips/${trip.id}/edit`}
                      className="p-1.5 rounded-lg bg-brand-500/20 text-brand-400 hover:bg-brand-500 hover:text-dark-950 transition-colors"
                      title="Edit trip"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
