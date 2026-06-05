import { useState } from "react";
import {
  FiPlus,
  FiTrash2,
  FiMapPin,
  FiMap,
  FiMoon,
  FiX,
  FiGlobe,
  FiImage,
  FiCheckCircle,
} from "react-icons/fi";
import { MdRoute } from "react-icons/md";

const DESTINATIONS = [
  "Rajasthan", "Kerala", "Goa", "Himachal Pradesh", "Uttarakhand",
  "Kashmir", "Andaman & Nicobar", "Northeast India",
  "Nepal", "Bhutan", "Sri Lanka", "Maldives",
  "Thailand", "Bali (Indonesia)", "Singapore", "Malaysia",
  "Dubai (UAE)", "Europe", "Japan", "USA",
];

const CITIES = {
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Jaisalmer", "Pushkar"],
  "Kerala": ["Munnar", "Alleppey", "Kochi", "Thekkady", "Kovalam"],
  "Goa": ["North Goa", "South Goa", "Panjim"],
  "Himachal Pradesh": ["Shimla", "Manali", "Dharamshala", "Spiti"],
  "Uttarakhand": ["Rishikesh", "Nainital", "Mussoorie", "Dehradun"],
  "Kashmir": ["Srinagar", "Gulmarg", "Pahalgam", "Sonamarg"],
  "Nepal": ["Kathmandu", "Pokhara", "Chitwan", "Nagarkot"],
  "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Pattaya", "Krabi"],
  "Bali (Indonesia)": ["Kuta", "Ubud", "Seminyak", "Nusa Dua", "Canggu"],
  "Dubai (UAE)": ["Downtown Dubai", "Dubai Marina", "Deira", "Jumeirah"],
};

export default function ItinerarySection({ itinerary, onAdd, onRemove, onUpdate }) {
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [destinationForm, setDestinationForm] = useState({
    country: "",
    international: false,
    destinationName: "",
    cities: [],
    image: null,
  });
  const [cityInput, setCityInput] = useState("");
  const [destinations, setDestinations] = useState(DESTINATIONS);
  const [citiesData, setCitiesData] = useState(CITIES);

  const [showCityModal, setShowCityModal] = useState(false);
  const [cityDestination, setCityDestination] = useState("");
  const [newCity, setNewCity] = useState("");

  const handleAddDestination = () => {
    if (!destinationForm.destinationName.trim()) return;
    const destinationName = destinationForm.destinationName.trim();
    if (!destinations.includes(destinationName)) {
      setDestinations([...destinations, destinationName]);
      setCitiesData({ ...citiesData, [destinationName]: [...destinationForm.cities] });
    }
    setDestinationForm({ country: "", international: false, destinationName: "", cities: [], image: null });
    setCityInput("");
    setShowDestinationModal(false);
  };

  const handleAddCity = () => {
    if (!cityDestination || !newCity.trim()) return;
    setCitiesData({
      ...citiesData,
      [cityDestination]: [...(citiesData[cityDestination] || []), newCity],
    });
    setNewCity("");
    setCityDestination("");
    setShowCityModal(false);
  };

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
          const cities = citiesData[row.destination] || [];
          return (
            <div key={row.id} className="bg-slate-50 rounded-xl border border-slate-200 p-4 group transition-all hover:border-indigo-200 hover:bg-indigo-50/30">
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
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <FiMap className="w-3 h-3 text-indigo-400" /> Destination
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowDestinationModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      <FiPlus /> Add
                    </button>
                  </div>
                  <div className="relative">
                    <select
                      value={row.destination}
                      onChange={(e) => onUpdate(row.id, "destination", e.target.value)}
                      className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none appearance-none transition-all"
                    >
                      <option value="">Select destination</option>
                      {destinations.map((d) => <option key={d}>{d}</option>)}
                    </select>
                    <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* City */}
                <div className="sm:col-span-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center gap-1 text-xs font-semibold text-slate-500">
                      <FiMapPin className="w-3 h-3 text-indigo-400" /> City
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCityModal(true)}
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      <FiPlus /> Add
                    </button>
                  </div>
                  {cities.length > 0 ? (
                    <div className="relative">
                      <select
                        value={row.city}
                        onChange={(e) => onUpdate(row.id, "city", e.target.value)}
                        className="w-full pl-3 pr-7 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none appearance-none transition-all"
                      >
                        <option value="">Select city</option>
                        {cities.map((c) => <option key={c}>{c}</option>)}
                      </select>
                      <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={row.city}
                      onChange={(e) => onUpdate(row.id, "city", e.target.value)}
                      placeholder="Enter city name"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 outline-none transition-all placeholder-slate-400"
                    />
                  )}
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

      {/* ============================================
          PREMIUM DESTINATION MODAL
      ============================================ */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setShowDestinationModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiGlobe size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">Add New Destination</h2>
                  <p className="text-indigo-100 text-sm font-medium">Create a new travel destination with its cities.</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 bg-gray-50/50 flex-1">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">

                {/* Country + International */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                    <div className="relative flex-1">
                      <select
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-700 font-medium appearance-none transition-all"
                        value={destinationForm.country}
                        onChange={(e) => setDestinationForm({ ...destinationForm, country: e.target.value })}
                      >
                        <option value="">Select Country</option>
                        <option>India</option>
                        <option>Nepal</option>
                        <option>Bhutan</option>
                        <option>Thailand</option>
                        <option>Indonesia</option>
                        <option>UAE</option>
                        <option>Singapore</option>
                        <option>Malaysia</option>
                      </select>
                      <FiGlobe size={16} className="absolute left-3.5 top-3 text-gray-400" />
                      <svg className="absolute right-3 top-3 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none shrink-0">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={destinationForm.international}
                          onChange={(e) => setDestinationForm({ ...destinationForm, international: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-checked:bg-indigo-600 rounded-full transition-colors" />
                        <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
                      </div>
                      <span className="text-sm font-semibold text-gray-600">International</span>
                    </label>
                  </div>
                </div>

                {/* Destination Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Destination Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Kerala, Rajasthan, Bali"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-900 font-medium transition-all placeholder-gray-400"
                      value={destinationForm.destinationName}
                      onChange={(e) => setDestinationForm({ ...destinationForm, destinationName: e.target.value })}
                    />
                    <FiMapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Cities */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Cities <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a city name and click Add"
                      className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-900 font-medium transition-all placeholder-gray-400"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && cityInput.trim()) {
                          e.preventDefault();
                          setDestinationForm({ ...destinationForm, cities: [...destinationForm.cities, cityInput.trim()] });
                          setCityInput("");
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!cityInput.trim()) return;
                        setDestinationForm({ ...destinationForm, cities: [...destinationForm.cities, cityInput.trim()] });
                        setCityInput("");
                      }}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                    >
                      <FiPlus size={16} /> Add
                    </button>
                  </div>
                  {destinationForm.cities.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {destinationForm.cities.map((city, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 rounded-full text-xs font-semibold"
                        >
                          <FiMapPin size={11} />
                          {city}
                          <button
                            type="button"
                            onClick={() => setDestinationForm({ ...destinationForm, cities: destinationForm.cities.filter((_, idx) => idx !== i) })}
                            className="text-indigo-400 hover:text-indigo-700 ml-0.5 transition-colors"
                          >
                            <FiX size={11} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination Image */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Destination Image
                    <span className="ml-1.5 text-xs font-medium text-gray-400">(optional)</span>
                  </label>
                  <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50 rounded-xl p-6 cursor-pointer transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 group-hover:bg-indigo-200 flex items-center justify-center transition-colors">
                      <FiImage size={20} className="text-indigo-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-indigo-600">
                        {destinationForm.image ? destinationForm.image.name : "Click to upload"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or JPEG supported</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setDestinationForm({ ...destinationForm, image: e.target.files[0] })}
                    />
                  </label>
                </div>

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowDestinationModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddDestination}
                className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 flex items-center gap-2"
              >
                <FiCheckCircle size={16} />
                Create Destination
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================
          PREMIUM CITY MODAL
      ============================================ */}
      {showCityModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">

            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative flex-shrink-0">
              <button
                onClick={() => setShowCityModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors"
              >
                <FiX size={20} />
              </button>
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <FiMapPin size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-tight">Add New City</h2>
                  <p className="text-blue-100 text-sm font-medium">Add a city to an existing destination.</p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-6 bg-gray-50/50 flex-1">
              <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm space-y-5">

                {/* Select Destination */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    Destination <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={cityDestination}
                      onChange={(e) => setCityDestination(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-700 font-medium appearance-none transition-all"
                    >
                      <option value="">Select Destination</option>
                      {destinations.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <FiMap size={16} className="absolute left-3.5 top-3 text-gray-400" />
                    <svg className="absolute right-3 top-3 w-3 h-3 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {/* City Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    City Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="e.g. Sydney, Jaipur, Bangkok"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAddCity()}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm text-gray-900 font-medium transition-all placeholder-gray-400"
                    />
                    <FiMapPin size={16} className="absolute left-3.5 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Preview badge */}
                {cityDestination && newCity && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <FiCheckCircle size={15} className="text-blue-500 shrink-0" />
                    <p className="text-xs font-medium text-blue-700">
                      <span className="font-bold">{newCity}</span> will be added under <span className="font-bold">{cityDestination}</span>
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => setShowCityModal(false)}
                className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddCity}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <FiCheckCircle size={16} />
                Save City
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}