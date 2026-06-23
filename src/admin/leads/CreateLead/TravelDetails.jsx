// import { useEffect } from "react";
// import {
//   FiCalendar, FiGlobe, FiMapPin, FiHome, FiUsers, FiChevronDown
// } from "react-icons/fi";
// import { MdChildCare, MdBabyChangingStation, MdHotel } from "react-icons/md";

// const COUNTRIES = [
//   "India", "Nepal", "Bhutan", "Sri Lanka", "Maldives", "Thailand",
//   "Dubai (UAE)", "Singapore", "Malaysia", "Indonesia", "Japan",
//   "Europe", "USA", "UK", "Australia",
// ];

// const CITIES_BY_COUNTRY = {
//   "India": ["Mumbai (BOM)", "Delhi (DEL)", "Bangalore (BLR)", "Chennai (MAA)", "Kolkata (CCU)", "Pune (PNQ)", "Hyderabad (HYD)", "Ahmedabad (AMD)"],
//   "Nepal": ["Kathmandu", "Pokhara", "Chitwan", "Lumbini"],
//   "Bhutan": ["Paro", "Thimphu", "Punakha"],
//   "Sri Lanka": ["Colombo", "Kandy", "Galle"],
//   "Maldives": ["Male", "Hulhumale"],
//   "Thailand": ["Bangkok", "Phuket", "Chiang Mai", "Pattaya"],
//   "Dubai (UAE)": ["Dubai", "Abu Dhabi", "Sharjah"],
//   "Singapore": ["Singapore City"],
//   "Malaysia": ["Kuala Lumpur", "Penang", "Langkawi"],
// };

// function NumberInput({ label, icon: Icon, value, onChange, min = 0, max = 20, color = "blue" }) {
//   const colorMap = {
//     blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", btn: "bg-blue-100 hover:bg-blue-200 text-blue-700" },
//     green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", btn: "bg-green-100 hover:bg-green-200 text-green-700" },
//     orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", btn: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
//     purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", btn: "bg-purple-100 hover:bg-purple-200 text-purple-700" },
//     rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", btn: "bg-rose-100 hover:bg-rose-200 text-rose-700" },
//   };
//   const c = colorMap[color];

//   return (
//     <div className={`${c.bg} rounded-xl p-3 border ${c.border}`}>
//       <div className="flex items-center gap-1.5 mb-2">
//         <Icon className={`w-3.5 h-3.5 ${c.text}`} />
//         <span className="text-xs font-semibold text-slate-600">{label}</span>
//       </div>
//       <div className="flex items-center gap-2">
//         <button
//           type="button"
//           onClick={() => onChange(Math.max(min, value - 1))}
//           className={`w-7 h-7 rounded-lg ${c.btn} font-bold text-sm transition-all flex items-center justify-center`}
//         >
//           −
//         </button>
//         <span className={`flex-1 text-center text-base font-bold ${c.text}`}>{value}</span>
//         <button
//           type="button"
//           onClick={() => onChange(Math.min(max, value + 1))}
//           className={`w-7 h-7 rounded-lg ${c.btn} font-bold text-sm transition-all flex items-center justify-center`}
//         >
//           +
//         </button>
//       </div>
//     </div>
//   );
// }

// export default function TravelDetails({ register, watch, setValue }) {
//   const rooms = watch("rooms") || 1;
//   const adults = watch("adults") || 2;
//   const children = watch("children") || 0;
//   const infants = watch("infants") || 0;
//   const extraBeds = watch("extraBeds") || 0;
//   const departCountry = watch("departCountry") || "";

//   const cities = CITIES_BY_COUNTRY[departCountry] || [];

//   useEffect(() => {
//     setValue("rooms", 1);
//     setValue("adults", 2);
//     setValue("children", 0);
//     setValue("infants", 0);
//     setValue("extraBeds", 0);
//   }, []);

//   const totalTravellers = adults + children + infants;

//   const summary = [
//     rooms > 0 && `${rooms} Room${rooms > 1 ? "s" : ""}`,
//     adults > 0 && `${adults} Adult${adults > 1 ? "s" : ""}`,
//     children > 0 && `${children} Child${children > 1 ? "ren" : ""}`,
//     infants > 0 && `${infants} Infant${infants > 1 ? "s" : ""}`,
//     extraBeds > 0 && `${extraBeds} Extra Bed${extraBeds > 1 ? "s" : ""}`,
//   ].filter(Boolean).join(" · ");

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
//       <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex items-center gap-3">
//         <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
//           <FiGlobe className="w-4 h-4 text-white" />
//         </div>
//         <div>
//           <h2 className="text-white font-bold text-base">Travel Details</h2>
//           <p className="text-teal-100 text-xs">Departure, dates & traveller information</p>
//         </div>
//       </div>

//       <div className="p-6 space-y-5">
//         {/* Travel Date */}
//         <div className="flex flex-col gap-1.5">
//           <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
//             <FiCalendar className="w-3.5 h-3.5 text-teal-500" />
//             Travel Date <span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
//             <input
//               type="date"
//               className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
//                 focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none transition-all"
//               {...register("travelDate")}
//             />
//           </div>
//         </div>

//         {/* Country + City */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div className="flex flex-col gap-1.5">
//             <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
//               <FiGlobe className="w-3.5 h-3.5 text-teal-500" />
//               Departing Country
//             </label>
//             <div className="relative">
//               <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//               <select
//                 className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
//                   focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none appearance-none transition-all cursor-pointer"
//                 {...register("departCountry")}
//               >
//                 <option value="">Select country</option>
//                 {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
//               </select>
//               <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//             </div>
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
//               <FiMapPin className="w-3.5 h-3.5 text-teal-500" />
//               Departing City
//             </label>
//             <div className="relative">
//               <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//               <select
//                 className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
//                   focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none appearance-none transition-all cursor-pointer"
//                 {...register("departCity")}
//               >
//                 <option value="">Select city</option>
//                 {cities.map((c) => <option key={c}>{c}</option>)}
//               </select>
//               <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
//             </div>
//           </div>
//         </div>

//         {/* Rooms + Adults */}
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//           <NumberInput label="Rooms" icon={FiHome} value={rooms} onChange={(v) => setValue("rooms", v)} min={1} color="blue" />
//           <NumberInput label="Adults" icon={FiUsers} value={adults} onChange={(v) => setValue("adults", v)} min={1} color="green" />
//           <NumberInput label="Children" icon={MdChildCare} value={children} onChange={(v) => setValue("children", v)} color="orange" />
//           <NumberInput label="Infants" icon={MdBabyChangingStation} value={infants} onChange={(v) => setValue("infants", v)} color="purple" />
//           <NumberInput label="Extra Beds" icon={MdHotel} value={extraBeds} onChange={(v) => setValue("extraBeds", v)} color="rose" />
//         </div>

//         {/* Summary */}
//         {totalTravellers > 0 && (
//           <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl px-4 py-3 border border-teal-100 flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
//               <FiUsers className="w-4 h-4 text-teal-600" />
//             </div>
//             <div>
//               <p className="text-xs text-slate-500 font-medium">Traveller Summary</p>
//               <p className="text-sm font-bold text-slate-700">{summary}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import { useEffect, useState } from "react";
import {
  FiCalendar, FiGlobe, FiMapPin, FiHome, FiUsers
} from "react-icons/fi";
import { MdChildCare, MdBabyChangingStation, MdHotel } from "react-icons/md";
import { geographyService } from "../../../services/geographyService";
import SearchableSelect from "../../../components/SearchableSelect";

function NumberInput({ label, icon: Icon, value, onChange, min = 0, max = 20, color = "blue" }) {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200", btn: "bg-blue-100 hover:bg-blue-200 text-blue-700" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200", btn: "bg-green-100 hover:bg-green-200 text-green-700" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", border: "border-orange-200", btn: "bg-orange-100 hover:bg-orange-200 text-orange-700" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", border: "border-purple-200", btn: "bg-purple-100 hover:bg-purple-200 text-purple-700" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", border: "border-rose-200", btn: "bg-rose-100 hover:bg-rose-200 text-rose-700" },
  };
  const c = colorMap[color];

  return (
    <div className={`${c.bg} rounded-xl p-3 border ${c.border}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className={`w-3.5 h-3.5 ${c.text}`} />
        <span className="text-xs font-semibold text-slate-600">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          className={`w-7 h-7 rounded-lg ${c.btn} font-bold text-sm transition-all flex items-center justify-center`}
        >
          −
        </button>
        <span className={`flex-1 text-center text-base font-bold ${c.text}`}>{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          className={`w-7 h-7 rounded-lg ${c.btn} font-bold text-sm transition-all flex items-center justify-center`}
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function TravelDetails({ register, watch, setValue }) {
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [error, setError] = useState(null);

  const rooms = watch("rooms") || 1;
  const adults = watch("adults") || 2;
  const children = watch("children") || 0;
  const infants = watch("infants") || 0;
  const extraBeds = watch("extraBeds") || 0;

  useEffect(() => {
    setValue("rooms", 1);
    setValue("adults", 2);
    setValue("children", 0);
    setValue("infants", 0);
    setValue("extraBeds", 0);
  }, []);

  useEffect(() => {
    geographyService.getCountries()
      .then(setCountries)
      .catch((err) => setError(err.message))
      .finally(() => setLoadingCountries(false));
  }, []);

  console.log(countries)

  const totalTravellers = adults + children + infants;

  const summary = [
    rooms > 0 && `${rooms} Room${rooms > 1 ? "s" : ""}`,
    adults > 0 && `${adults} Adult${adults > 1 ? "s" : ""}`,
    children > 0 && `${children} Child${children > 1 ? "ren" : ""}`,
    infants > 0 && `${infants} Infant${infants > 1 ? "s" : ""}`,
    extraBeds > 0 && `${extraBeds} Extra Bed${extraBeds > 1 ? "s" : ""}`,
  ].filter(Boolean).join(" · ");

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
          <FiGlobe className="w-4 h-4 text-white" />
        </div>
        <div>
          <h2 className="text-white font-bold text-base">Travel Details</h2>
          <p className="text-teal-100 text-xs">Departure, dates & traveller information</p>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Travel Date */}
        <div className="flex flex-col gap-1.5">
          <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <FiCalendar className="w-3.5 h-3.5 text-teal-500" />
            Travel Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="date"
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none transition-all"
              {...register("travelDate")}
            />
          </div>
        </div>

        {/* Country + City */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <FiGlobe className="w-3.5 h-3.5 text-teal-500" />
              Departing Country
            </label>
            <SearchableSelect
              options={countries}
              value={watch("departCountry")}
              onChange={(val) => setValue("departCountry", val, { shouldValidate: true })}
              placeholder="Select country"
              loading={loadingCountries}
              icon={FiGlobe}
              searchable={true}
            />
            {error && (
              <span className="text-xs text-red-500">Failed to load countries: {error}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
              <FiMapPin className="w-3.5 h-3.5 text-teal-500" />
              Departing City
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter departing city"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700
                  focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none transition-all"
                {...register("departCity")}
              />
            </div>
          </div>
        </div>

        {/* Rooms + Adults */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <NumberInput label="Rooms" icon={FiHome} value={rooms} onChange={(v) => setValue("rooms", v)} min={1} color="blue" />
          <NumberInput label="Adults" icon={FiUsers} value={adults} onChange={(v) => setValue("adults", v)} min={1} color="green" />
          <NumberInput label="Children" icon={MdChildCare} value={children} onChange={(v) => setValue("children", v)} color="orange" />
          <NumberInput label="Infants" icon={MdBabyChangingStation} value={infants} onChange={(v) => setValue("infants", v)} color="purple" />
          <NumberInput label="Extra Beds" icon={MdHotel} value={extraBeds} onChange={(v) => setValue("extraBeds", v)} color="rose" />
        </div>

        {/* Summary */}
        {totalTravellers > 0 && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-xl px-4 py-3 border border-teal-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center flex-shrink-0">
              <FiUsers className="w-4 h-4 text-teal-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">Traveller Summary</p>
              <p className="text-sm font-bold text-slate-700">{summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}