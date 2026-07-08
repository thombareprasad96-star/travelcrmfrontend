import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiMap,
  FiMoon,
} from "react-icons/fi";
import { MdRoute } from "react-icons/md";
import { geographyService } from "@shared/api/geographyService";

/**
 * Travel itinerary builder.
 *
 * A travel company works with a fixed handful of destinations, so there is NO
 * country pre-filter here — every tenant user (admin + agents) sees all the
 * tenant's destinations directly. Each stop is a Destination → City cascade
 * driven entirely by the real geography API (no hardcoded/fallback data):
 *   Destination → geographyService.getAllDestinations()      (all tenant destinations)
 *   City        → geographyService.getCitiesByDestination(destinationId)
 *
 * The parent (CreateLead) stores each row as { id, destination, city, nights }
 * where destination/city are NAME strings (the lead payload shape). The selected
 */
export default function ItinerarySection({ itinerary, onAdd, onRemove, onUpdate }) {
  const [destinations, setDestinations] = useState([]);
  const [loadingDestinations, setLoadingDestinations] = useState(false);

  // Per-row city cascade state, keyed by row.id:
  // { destinationId, cityId, cities:[], loadingCity }
  const [rowGeo, setRowGeoState] = useState({});

  const setRowGeo = (rowId, patch) =>
    setRowGeoState((prev) => ({ ...prev, [rowId]: { ...prev[rowId], ...patch } }));

  // Load all tenant destinations once on mount.
  useEffect(() => {
    (async () => {
      setLoadingDestinations(true);
      try {
        setDestinations(await geographyService.getAllDestinations());
      } catch {
        setDestinations([]);
      } finally {
        setLoadingDestinations(false);
      }
    })();
  }, []);

  console.log(destinations)
  // ── Cascade handlers ────────────────────────────────────────
  const handleDestinationChange = async (rowId, destinationId) => {
    const dest = destinations.find((d) => String(d.id) === String(destinationId));
    onUpdate(rowId, "destination", dest?.name ?? "");
    onUpdate(rowId, "city", "");
    setRowGeo(rowId, {
      destinationId,
      cityId: "",
      cities: [],
      loadingCity: !!destinationId,
    });
    if (!destinationId) return;
    try {
      const cities = await geographyService.getCitiesByDestination(destinationId);
      setRowGeo(rowId, { cities, loadingCity: false });
    } catch {
      setRowGeo(rowId, { cities: [], loadingCity: false });
    }
  };

  const handleCityChange = (rowId, cityId) => {
    const city = rowGeo[rowId]?.cities?.find((c) => String(c.id) === String(cityId));
    onUpdate(rowId, "city", city?.name ?? "");
    setRowGeo(rowId, { cityId });
  };

  const chevron = (
    <svg
      className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
            <MdRoute className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="text-white font-bold text-base">Travel Itinerary</h2>
            <p className="text-indigo-100 text-xs">Add destinations and nights for each stop</p>
          </div>
        </div>
        <div className="bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full">
          {itinerary.length} Stop{itinerary.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="p-6 space-y-3">
        {itinerary.length === 0 && (
          <div className="text-center py-8 text-slate-400">
            <MdRoute className="w-10 h-10 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No destinations added yet</p>
            <p className="text-xs mt-1">Click "Add Destination" to start building the itinerary</p>
          </div>
        )}

        {itinerary.map((row, index) => {
          const geo = rowGeo[row.id] || {};
          const hasDestination = !!geo.destinationId;
          return (
            <div
              key={row.id}
              className="bg-slate-50 rounded-xl border border-slate-200 p-4 group transition-all hover:border-indigo-200 hover:bg-indigo-50/30"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </div>
                  <span className="text-xs font-semibold text-slate-500">Destination {index + 1}</span>
                </div>
                {itinerary.length > 1 && (
                  <button
                    type="button"
                    onClick={() => onRemove(row.id)}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 flex items-center justify-center transition-all"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Destination */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1.5">
                    <FiMap className="w-3 h-3 text-indigo-400" /> Destination
                  </label>
                  <div className="relative">
                    <select
                      value={geo.destinationId || ""}
                      onChange={(e) => handleDestinationChange(row.id, e.target.value)}
                      disabled={loadingDestinations}
                      className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none appearance-none transition-all disabled:opacity-60"
                    >
                      <option value="">
                        {loadingDestinations
                          ? "Loading…"
                          : destinations.length === 0
                          ? "No destinations"
                          : "Select destination"}
                      </option>
                      {destinations.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                    {chevron}
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1.5">
                    <FiMapPin className="w-3 h-3 text-indigo-400" /> City
                  </label>
                  <div className="relative">
                    <select
                      value={geo.cityId || ""}
                      onChange={(e) => handleCityChange(row.id, e.target.value)}
                      disabled={!hasDestination || geo.loadingCity}
                      className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none appearance-none transition-all disabled:opacity-60"
                    >
                      <option value="">
                        {!hasDestination
                          ? "Select destination first"
                          : geo.loadingCity
                          ? "Loading…"
                          : (geo.cities || []).length === 0
                          ? "No cities"
                          : "Select city"}
                      </option>
                      {(geo.cities || []).map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    {chevron}
                  </div>
                </div>

                {/* Nights */}
                <div>
                  <label className="flex items-center gap-1 text-xs font-semibold text-slate-500 mb-1.5">
                    <FiMoon className="w-3 h-3 text-indigo-400" /> Nights
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onUpdate(row.id, "nights", Math.max(1, (row.nights || 1) - 1))}
                      className="w-8 h-9 rounded-lg bg-slate-200 hover:bg-indigo-200 text-slate-600 font-bold text-sm transition-all"
                    >−</button>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={row.nights || 1}
                      onChange={(e) => onUpdate(row.id, "nights", parseInt(e.target.value) || 1)}
                      className="flex-1 text-center px-2 py-2 rounded-lg border border-slate-200 bg-white text-sm font-semibold text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => onUpdate(row.id, "nights", Math.min(30, (row.nights || 1) + 1))}
                      className="w-8 h-9 rounded-lg bg-slate-200 hover:bg-indigo-200 text-slate-600 font-bold text-sm transition-all"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {itinerary.length > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-50 rounded-xl border border-indigo-100">
            <span className="text-sm text-slate-600 font-medium">Total Duration</span>
            <span className="text-sm font-bold text-indigo-700">
              {itinerary.reduce((sum, r) => sum + (r.nights || 1), 0)} Nights /{" "}
              {itinerary.reduce((sum, r) => sum + (r.nights || 1), 0) + 1} Days
            </span>
          </div>
        )}

        <button
          type="button"
          onClick={onAdd}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 text-indigo-600 font-semibold text-sm flex items-center justify-center gap-2 transition-all group"
        >
          <div className="w-5 h-5 rounded-full bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-all">
            <FiPlus className="w-3.5 h-3.5" />
          </div>
          Add Destination
        </button>
      </div>
    </div>
  );
}