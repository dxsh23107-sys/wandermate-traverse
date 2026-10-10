"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { formatINR, parseJsonSafe } from "@/lib/utils";
import {
  PlusCircle,
  Search,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      const res = await fetch("/api/trips?all=true");
      const data = await res.json();
      if (data?.trips) setTrips(data.trips);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleToggleFeatured = async (trip: any) => {
    try {
      await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !trip.featured }),
      });
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (trip: any) => {
    const nextStatus = trip.status === "ACTIVE" ? "DRAFT" : "ACTIVE";
    try {
      await fetch(`/api/trips/${trip.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTrip = async (id: string) => {
    try {
      await fetch(`/api/trips/${id}`, { method: "DELETE" });
      setDeleteConfirmId(null);
      fetchTrips();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = trips.filter((t) => {
    const matchesSearch =
      searchTerm === "" ||
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat =
      categoryFilter === "All" || t.category.toLowerCase() === categoryFilter.toLowerCase();

    const matchesStatus =
      statusFilter === "ALL" || t.status === statusFilter;

    return matchesSearch && matchesCat && matchesStatus;
  });

  return (
    <div>
      <AdminNavbar title="Trip & Expedition Management" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Header Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-display">All Travel Packages</h2>
            <p className="text-xs text-slate-400">
              Create, edit prices, update dates, itineraries, and publish packages to the customer website.
            </p>
          </div>

          <Link
            href="/admin/trips/new"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 hover:from-brand-300 shadow-md shadow-brand-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Package</span>
          </Link>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl glass-card border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by package name, destination..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Trek">Trek</option>
            <option value="Expedition">Expedition</option>
            <option value="Cultural">Cultural</option>
            <option value="Backpacking">Backpacking</option>
            <option value="Weekend">Weekend</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active (Published)</option>
            <option value="DRAFT">Draft (Hidden)</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>

        {/* Trips Table */}
        <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Package</th>
                  <th className="p-4">Category / Duration</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Seats</th>
                  <th className="p-4">Featured</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={trip.coverImage}
                          alt={trip.title}
                          className="w-12 h-12 rounded-lg object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0 max-w-[240px]">
                          <span className="font-bold text-white block truncate">{trip.title}</span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-brand-400" />
                            {trip.destination}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-white font-medium block">{trip.category}</span>
                      <span className="text-[11px] text-slate-400">{trip.duration}</span>
                    </td>
                    <td className="p-4 font-bold text-brand-400 text-sm">
                      {formatINR(trip.price)}
                    </td>
                    <td className="p-4 font-semibold text-slate-200">
                      {trip.availableSeats}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleFeatured(trip)}
                        className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors ${
                          trip.featured
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                            : "bg-slate-800 text-slate-400 hover:text-white"
                        }`}
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{trip.featured ? "Featured" : "Regular"}</span>
                      </button>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(trip)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                          trip.status === "ACTIVE"
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-500/40"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {trip.status === "ACTIVE" ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/trips/${trip.slug || trip.id}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                          title="View Live Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/trips/${trip.id}/edit`}
                          className="p-2 rounded-lg bg-brand-500/20 hover:bg-brand-500 text-brand-400 hover:text-dark-950 transition-colors"
                          title="Edit Package"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => setDeleteConfirmId(trip.id)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900 text-red-400 hover:text-white transition-colors"
                          title="Delete Package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredTrips.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No packages found matching your query.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="p-6 rounded-2xl glass-panel bg-dark-900 border border-red-500/40 max-w-sm w-full space-y-4 text-center">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
              <h3 className="text-base font-bold text-white">Delete Travel Package?</h3>
              <p className="text-xs text-slate-300">
                Are you sure you want to delete this trip? This action will remove it from the customer website.
              </p>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteTrip(deleteConfirmId)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
