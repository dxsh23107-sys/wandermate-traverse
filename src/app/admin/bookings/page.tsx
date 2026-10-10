"use client";

import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { formatINR, getWhatsAppUrl } from "@/lib/utils";
import {
  CalendarCheck2,
  Search,
  MessageCircle,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      if (data?.bookings) setBookings(data.bookings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      await fetch(`/api/bookings/${id}`, { method: "DELETE" });
      setSelectedBooking(null);
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      searchTerm === "" ||
      b.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.tripTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || b.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <AdminNavbar title="Customer Bookings & Inquiries" />

      <main className="p-8 space-y-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-white font-display">Manage Travel Bookings</h2>
            <p className="text-xs text-slate-400">
              Track customer reservations, update statuses, view traveler requests, and open WhatsApp chat.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-2xl glass-card border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking ID, customer name, email, phone..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="ALL">All Statuses ({bookings.length})</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Bookings Table */}
        <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-4">Booking ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Expedition</th>
                  <th className="p-4">Travelers / Batch</th>
                  <th className="p-4">Total Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredBookings.map((b) => {
                  const customerWaMsg = `Hi ${b.customerName}! Wandermate Traverse captain here regarding your booking (${b.bookingId}) for ${b.tripTitle}.`;
                  const customerWaUrl = getWhatsAppUrl(b.phone, customerWaMsg);

                  return (
                    <tr key={b.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-mono font-bold text-brand-400">
                        {b.bookingId}
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{b.customerName}</div>
                        <div className="text-[11px] text-slate-400">{b.email}</div>
                        <div className="text-[11px] text-slate-400">{b.phone}</div>
                      </td>
                      <td className="p-4 font-semibold text-white truncate max-w-[220px]">
                        {b.tripTitle}
                      </td>
                      <td className="p-4">
                        <div>{b.travelers} Traveler(s)</div>
                        <div className="text-[11px] text-brand-300 font-medium">{b.date}</div>
                      </td>
                      <td className="p-4 font-bold text-emerald-400 text-sm">
                        {formatINR(b.totalPrice)}
                      </td>
                      <td className="p-4">
                        <select
                          value={b.status}
                          onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border cursor-pointer ${
                            b.status === "CONFIRMED"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-500/40"
                              : b.status === "PENDING"
                              ? "bg-amber-950 text-amber-300 border-amber-500/40"
                              : b.status === "CANCELLED"
                              ? "bg-red-950 text-red-300 border-red-500/40"
                              : "bg-blue-950 text-blue-300 border-blue-500/40"
                          }`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="COMPLETED">Completed</option>
                          <option value="CANCELLED">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={customerWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900 border border-emerald-500/30"
                            title="Chat on WhatsApp"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                            title="View Full Booking Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredBookings.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      No bookings match your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Details Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="p-6 sm:p-8 rounded-3xl glass-panel bg-dark-900 border border-slate-800 max-w-lg w-full space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Reservation Details
                  </span>
                  <h3 className="text-lg font-bold text-white font-mono text-brand-400">
                    {selectedBooking.bookingId}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div>
                  <span className="text-slate-500 block text-xs">Customer Name:</span>
                  <strong className="text-white text-base">{selectedBooking.customerName}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-xs">Email:</span>
                    <span className="text-slate-200">{selectedBooking.email}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Phone:</span>
                    <span className="text-slate-200">{selectedBooking.phone}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Trip Package:</span>
                  <strong className="text-white">{selectedBooking.tripTitle}</strong>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500 block text-xs">Travel Date:</span>
                    <span className="text-brand-300 font-semibold">{selectedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs">Travelers:</span>
                    <span className="text-white">{selectedBooking.travelers} Person(s)</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-500 block text-xs">Total Amount:</span>
                  <strong className="text-emerald-400 text-base">{formatINR(selectedBooking.totalPrice)}</strong>
                </div>
                {selectedBooking.specialRequests && (
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-slate-500 text-xs font-semibold block">Special Requests / Notes:</span>
                    <p className="text-xs text-slate-300 leading-relaxed font-light">{selectedBooking.specialRequests}</p>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block text-xs">Submitted At:</span>
                  <span className="text-slate-400 text-xs">{new Date(selectedBooking.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-800">
                <a
                  href={getWhatsAppUrl(selectedBooking.phone, `Hi ${selectedBooking.customerName}! Wandermate Traverse captain here regarding your booking ${selectedBooking.bookingId}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
