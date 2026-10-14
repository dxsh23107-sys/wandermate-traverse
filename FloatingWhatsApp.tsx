"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("8779884225");
  const [currentTripTitle, setCurrentTripTitle] = useState<string | null>(null);
  const [customMsg, setCustomMsg] = useState("");

  useEffect(() => {
    // Fetch current settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings?.whatsappNumber) {
          setWhatsappNumber(data.settings.whatsappNumber);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Check if on /trips/[id] page and extract trip title if available
    if (pathname.startsWith("/trips/") && pathname !== "/trips") {
      const slugOrId = pathname.replace("/trips/", "");
      fetch(`/api/trips/${slugOrId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.trip?.title) {
            setCurrentTripTitle(data.trip.title);
          }
        })
        .catch(() => {});
    } else {
      setCurrentTripTitle(null);
    }
  }, [pathname]);

  // Do not render inside admin portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const defaultMessage = currentTripTitle
    ? `Hi Wandermate Traverse! I'm interested in the ${currentTripTitle} trip. Please share more details.`
    : "Hi Wandermate Traverse! I'd like to enquire about your upcoming expeditions and treks.";

  const handleSendMessage = () => {
    const textToSend = customMsg.trim() || defaultMessage;
    const cleaned = whatsappNumber.replace(/[^0-9]/g, "");
    const phone = cleaned.startsWith("91") && cleaned.length > 10 ? cleaned : `91${cleaned}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Pop-up Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-2xl glass-panel bg-dark-900/95 border border-emerald-500/30 shadow-2xl shadow-emerald-950/50 p-4 animate-in fade-in slide-in-from-bottom-5 duration-200 text-slate-200">
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white shadow-md">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-dark-900 rounded-full animate-pulse" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-white flex items-center gap-1.5">
                  Wandermate Traverse
                  <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                </h4>
                <p className="text-[11px] text-emerald-400 font-medium">
                  Expedition Lead Online • Replies instantly
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Close Chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="py-4 space-y-2.5">
            <div className="bg-slate-800/80 rounded-2xl rounded-tl-sm p-3 text-xs leading-relaxed text-slate-200 border border-slate-700/50">
              <p className="font-medium text-white mb-1">Hey adventurer! 👋</p>
              {currentTripTitle ? (
                <p>
                  Looking to join our upcoming batch for{" "}
                  <span className="text-brand-400 font-semibold">{currentTripTitle}</span>? Ask us anything about dates, fitness level, or booking your seat!
                </p>
              ) : (
                <p>
                  Welcome to Wandermate Traverse! Less talk, more traverse. Need recommendations for your next offbeat mountain expedition or secret beach trail?
                </p>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button
                onClick={() => setCustomMsg("Can you share the upcoming batch dates & itinerary PDF?")}
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
              >
                📅 Upcoming Dates & PDF
              </button>
              <button
                onClick={() => setCustomMsg("Is this trip beginner friendly for solo travelers?")}
                className="text-[11px] bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-700 transition-colors"
              >
                🎒 Solo Traveler Info
              </button>
            </div>
          </div>

          {/* Input & Send */}
          <div className="space-y-2">
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder={defaultMessage}
              className="w-full text-xs bg-slate-950/80 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 resize-none"
            />
            <button
              onClick={handleSendMessage}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 transition-all duration-200"
            >
              <span>Start WhatsApp Chat</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-950/60 transition-all duration-300 hover:scale-105 border border-emerald-400/40"
        aria-label="Open WhatsApp Chat"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-white text-emerald-600 group-hover:rotate-12 transition-transform duration-300" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-400 rounded-full border-2 border-emerald-600 animate-ping" />
        </div>
        <span className="hidden sm:inline font-medium">Chat with us</span>
      </button>
    </div>
  );
}
