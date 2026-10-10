"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Compass, Sparkles, ShieldCheck, Users, Heart, ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [content, setContent] = useState<any>({});

  useEffect(() => {
    fetch("/api/content")
      .then((res) => res.json())
      .then((data) => {
        if (data?.content?.about) setContent(data.content.about);
      })
      .catch(() => { });
  }, []);

  const storyData = content || {
    tagline: "The Wandermate Ethos",
    title: "Born from the Raw Desire to Wander Beyond the Itinerary",
    story: "Wandermate Traverse isn't about crowded tourist buses or checklist travel. We build deep, soulful, small-group expeditions where travelers become lifelong friends. From waking up under milky way skies in Spiti to dipping into crystalline natural pools in Meghalaya, we curate adventures that challenge your limits and nourish your spirit.",
    mission: "To inspire fearless exploration by creating authentic, eco-conscious, and community-led journeys that respect local cultures and wild habitats.",
    vision: "To become the leading offbeat experiential travel platform for conscious adventurers across India and the globe.",
    values: [
      { title: "No Superficial Tourism", desc: "We skip tourist traps to immerse in raw local culture and untouched wilderness." },
      { title: "Intimate Cohorts", desc: "Capped at 10-14 travelers so every experience feels personal, safe, and collaborative." },
      { title: "Local First", desc: "We empower indigenous mountain guides, homestay owners, and tribal communities." },
      { title: "Leave No Trace", desc: "Strict zero-single-use-plastic policies across all our trekking expeditions." },
    ],
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
  };

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
          {storyData.tagline || "The Wandermate Ethos"}
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display leading-tight">
          {storyData.title || "Born from the Raw Desire to Wander Beyond the Itinerary"}
        </h1>
      </section>

      {/* Image Banner */}
      <div className="relative h-80 sm:h-[450px] rounded-3xl overflow-hidden glass-panel border border-slate-800">
        <img
          src={storyData.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"}
          alt="Wandermate Story"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
      </div>

      {/* Story Narrative */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed font-light">
          <h2 className="text-2xl font-bold text-white font-display">
            Why Wandermate Traverse Was Created
          </h2>
          <p>{storyData.story}</p>
          <p>
            Every trail we lead has been scouted multiple times on foot by our founding captains. We sleep in the same homestays, break bread with the same villagers, and understand the fragile mountain ecology before we ever invite our community.
          </p>
        </div>

        <div className="p-8 rounded-3xl glass-card border border-brand-500/30 space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-brand-400" />
              <span>Our Core Mission</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {storyData.mission}
            </p>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-400" />
              <span>Our Vision</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
              {storyData.vision}
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars / Values */}
      <section className="space-y-8" id="why-us">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-bold text-white font-display">
            Our Non-Negotiable Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(storyData.values || []).map((val: any, idx: number) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-slate-800 space-y-3"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-white">{val.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-light">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership & Core Team Section */}
      <section className="space-y-10" id="leadership-team">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-400">
            Behind The Journeys
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Meet the Core Team
          </h2>
          <p className="text-sm text-slate-400">
            The passionate minds orchestrating unforgettable offbeat expeditions and community traverses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Harshil Prajapati */}
          <div className="group relative rounded-3xl p-7 glass-card border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-600 via-brand-500 to-amber-400 p-[2px] shadow-lg shadow-brand-500/20">
                <div className="w-full h-full rounded-2xl bg-dark-950 flex items-center justify-center text-2xl font-bold text-brand-400 font-display">
                  HP
                </div>
              </div>
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-brand-500 text-dark-950 shadow-md">
                CEO
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display group-hover:text-brand-400 transition-colors">
                Harshil Prajapati
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-brand-400">
                Founder & CEO
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Steering the vision, curated route scouting, and mountain ethos of Wandermate Traverse.
            </p>
          </div>

          {/* Gautam Wadhwa */}
          <div className="group relative rounded-3xl p-7 glass-card border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-emerald-400 p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-2xl bg-dark-950 flex items-center justify-center text-2xl font-bold text-cyan-400 font-display">
                  GW
                </div>
              </div>
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-cyan-400 text-dark-950 shadow-md">
                Marketing
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display group-hover:text-cyan-400 transition-colors">
                Gautam Wadhwa
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Social Media & Marketing Head
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Spearheading community storytelling, creative brand media, and travel enthusiast outreach.
            </p>
          </div>

          {/* Rashi Gosrani */}
          <div className="group relative rounded-3xl p-7 glass-card border border-slate-800/80 hover:border-brand-500/40 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-rose-400 p-[2px] shadow-lg shadow-pink-500/20">
                <div className="w-full h-full rounded-2xl bg-dark-950 flex items-center justify-center text-2xl font-bold text-pink-400 font-display">
                  RG
                </div>
              </div>
              <span className="absolute -bottom-2 -right-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-pink-400 text-dark-950 shadow-md">
                Ops
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white font-display group-hover:text-pink-400 transition-colors">
                Rashi Gosrani
              </h3>
              <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                Operation Head
              </p>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-light">
              Managing seamless expedition logistics, mountain safety, captain coordination, and on-ground execution.
            </p>
          </div>
        </div>
      </section>

      {/* Ready to join banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel text-center space-y-4 border border-slate-800">
        <h3 className="text-2xl font-bold text-white font-display">
          Ready to Traverse With Us?
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Find your next offbeat mountain or rainforest expedition today.
        </p>
        <Link
          href="/trips"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 shadow-lg shadow-brand-500/20"
        >
          <span>Explore All Trips</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
