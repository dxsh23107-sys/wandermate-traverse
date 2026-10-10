"use client";

import React, { useState, useEffect } from "react";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Plus, Trash2, Upload, Sparkles, Image as ImageIcon } from "lucide-react";

export default function AdminGalleryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Mountains");
  const [imageUrl, setImageUrl] = useState("");
  const [featured, setFeatured] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery");
      const data = await res.json();
      if (data?.images) setImages(data.images);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (data?.url) setImageUrl(data.url);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl || !title) return;
    setSubmitting(true);

    try {
      await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, imageUrl, featured }),
      });
      setTitle("");
      setImageUrl("");
      fetchGallery();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
      fetchGallery();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <AdminNavbar title="Photo & Gallery Management" />

      <main className="p-8 space-y-8 max-w-7xl">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white font-display">Visual Assets CMS</h2>
          <p className="text-xs text-slate-400">
            Upload and organize photos that appear on the homepage gallery and travel showcases.
          </p>
        </div>

        {/* Add Photo Card */}
        <form onSubmit={handleAddPhoto} className="p-6 rounded-3xl glass-panel bg-dark-900/90 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white font-display flex items-center gap-2">
            <Plus className="w-4 h-4 text-brand-400" />
            <span>Add New Gallery Photo</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Photo Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Spiti Key Gompa Sunrise"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
              >
                <option value="Mountains">Mountains</option>
                <option value="Caves & Waterfalls">Caves & Waterfalls</option>
                <option value="Culture & Deserts">Culture & Deserts</option>
                <option value="Backpacking">Backpacking</option>
                <option value="Expeditions">Expeditions</option>
                <option value="General">General</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs text-slate-400">Image URL or Local Upload</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
                  required
                />
                <label className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white cursor-pointer" title="Upload local image">
                  <Upload className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-dark-950 bg-gradient-to-r from-brand-400 to-amber-500 hover:from-brand-300 shadow-md shadow-brand-500/20"
          >
            {submitting ? "Adding Photo..." : "Add to Gallery"}
          </button>
        </form>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => (
            <div key={img.id} className="group relative h-52 rounded-2xl overflow-hidden glass-card border border-slate-800 flex flex-col justify-between p-3">
              <img src={img.imageUrl} alt={img.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />

              <div className="relative z-10 flex justify-between items-center">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-dark-950/80 text-brand-300 backdrop-blur-md">
                  {img.category}
                </span>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="p-1.5 rounded-lg bg-red-950/80 text-red-400 hover:text-white backdrop-blur-md transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="relative z-10">
                <h4 className="text-xs font-bold text-white truncate drop-shadow-md">{img.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
