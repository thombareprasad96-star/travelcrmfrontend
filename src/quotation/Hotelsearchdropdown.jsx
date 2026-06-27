import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Search, Star, MapPin, ChevronDown } from "lucide-react";
import { hotelService } from "../services/HotelService";

/**
 * HotelSearchDropdown — nepaltoursandtravels.com style
 *
 * FIX: Dropdown ALWAYS downward khulta hai (upward kabhi nahi → card ke neeche
 * chhupne ka issue khatam). Agar neeche jagah kam ho, panel ki height
 * automatically shrink ho jaati hai with internal scroll.
 * Portal + fixed positioning + max z-index.
 */
export default function HotelSearchDropdown({ value, onSelect, placeholder = "Type to search hotels..." }) {
  const [open,      setOpen]      = useState(false);
  const [search,    setSearch]    = useState("");
  const [allHotels, setAllHotels] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [pos,       setPos]       = useState(null); // {left, width, top, maxH}

  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const panelRef  = useRef(null);

  const MAX_PANEL_H = 300;
  const MIN_PANEL_H = 160;

  // ── Load hotels ──
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res  = await hotelService.getAllHotels();
        const raw  = res.data?.data ?? res.data;
        const list = Array.isArray(raw) ? raw
          : Array.isArray(raw?.content) ? raw.content : [];
        setAllHotels(list);
      } catch (err) {
        console.error("Hotel load error:", err);
        setAllHotels([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ── Position — ALWAYS downward, height adjust to available space ──
  const calcPos = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const r = btn.getBoundingClientRect();

    const GAP    = 4;
    const MARGIN = 12; // viewport bottom se thoda gap
    const spaceBelow = window.innerHeight - r.bottom - GAP - MARGIN;

    // Panel hamesha button ke neeche; height = available space (capped)
    const maxH = Math.max(MIN_PANEL_H, Math.min(MAX_PANEL_H, spaceBelow));

    setPos({
      left:  r.left,
      width: r.width,
      top:   r.bottom + GAP,  // button ke neeche (viewport-relative)
      maxH,
    });
  }, []);

  useLayoutEffect(() => {
    if (open) calcPos();
  }, [open, calcPos]);

  // ── Scroll/resize pe recalc ──
  useEffect(() => {
    if (!open) return;
    const handler = () => calcPos();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, calcPos]);

  // ── Auto-focus ──
  useEffect(() => {
    if (open && searchRef.current) {
      const t = setTimeout(() => searchRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [open]);

  // ── Outside click ──
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        panelRef.current  && !panelRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // ── Helpers ──
  const getImage = (h) =>
    h.imagePath || h.imageUrl || h.image || h.photo || h.coverImage
    || h.hotelImage || h.imageURL || h.img
    || (Array.isArray(h.images) && h.images[0]) || null;
  const getCity = (h) =>
    h.city || h.destinationName || h.cityName || h.location || "";
  const starLabel = (h) => h.stars ? ` (${h.stars} Star)` : "";

  // ── Filter ──
  const term = search.trim().toLowerCase();
  const filtered = term
    ? allHotels.filter(h => {
        const name = (h.name || "").toLowerCase();
        const city = getCity(h).toLowerCase();
        return name.includes(term) || city.includes(term);
      })
    : allHotels;

  const handleToggle = () => { setOpen(p => !p); setSearch(""); };

  const handlePick = (hotel) => {
    setOpen(false);
    setSearch("");
    onSelect?.({ ...hotel, _image: getImage(hotel), _city: getCity(hotel) });
  };

  // ── Portal dropdown ──
  const panel = (open && !loading && pos) ? createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left:   `${pos.left}px`,
        top:    `${pos.top}px`,
        width:  `${pos.width}px`,
        maxHeight: `${pos.maxH}px`,
        zIndex: 2147483647,
      }}
      className="bg-white border border-slate-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">

      {/* Search box */}
      <div className="relative p-2 border-b border-slate-100 flex-shrink-0 bg-white">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          ref={searchRef}
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search hotel name or city..."
          className="w-full pl-8 pr-2 py-2 text-sm rounded-lg border border-slate-200
            outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20"
        />
      </div>

      {/* List */}
      <ul className="overflow-y-auto flex-1 min-h-0">
        {filtered.length === 0 ? (
          <li className="px-3 py-4 text-sm text-slate-400 text-center">
            {allHotels.length === 0 ? "No hotels found in master" : "No matching hotels"}
          </li>
        ) : (
          filtered.map((h, idx) => {
            const img  = getImage(h);
            const city = getCity(h);
            const sel  = h.name === value;
            return (
              <li
                key={h.publicId || h.hotelId || h.id || idx}
                onClick={() => handlePick(h)}
                className={`flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors border-b border-slate-50 last:border-0
                  ${sel ? "bg-violet-50" : "hover:bg-violet-50/60"}`}>
                {img ? (
                  <img src={img} alt={h.name}
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }}
                    className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-slate-200" />
                ) : null}
                <div style={{ display: img ? "none" : "flex" }}
                  className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-violet-200 items-center justify-center flex-shrink-0 text-base">
                  🏨
                </div>
                <div className="min-w-0 flex-1">
                  <span className={`text-sm truncate block ${sel ? "text-violet-700 font-semibold" : "text-slate-700 font-medium"}`}>
                    {h.name}{starLabel(h)}
                  </span>
                  {city && (
                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                      <MapPin size={9} className="text-rose-400 flex-shrink-0" />
                      <span className="truncate">{city}</span>
                    </div>
                  )}
                </div>
                {h.stars > 0 && (
                  <span className="flex items-center gap-0.5 flex-shrink-0">
                    {Array.from({ length: h.stars }).map((_, k) => (
                      <Star key={k} size={9} className="fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                )}
              </li>
            );
          })
        )}
      </ul>
    </div>,
    document.body
  ) : null;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        disabled={loading}
        className="w-full flex items-center justify-between gap-2 pl-3 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white
          text-sm text-left focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-400
          transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:border-slate-300">
        <span className={`truncate ${value ? "text-slate-700 font-medium" : "text-slate-400"}`}>
          {loading ? "Loading hotels..." : (value || placeholder)}
        </span>
        <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {panel}
    </div>
  );
}