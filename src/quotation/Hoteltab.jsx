// import React, { useState, useEffect } from "react";
// import { Hotel, Search, Info, Plus } from "lucide-react";
// import { Label, Input, Select, SectionCard, RemoveBtn, IncludeToggle, AIBanner, FieldGrid, RichText } from "./ui";
// import { ROOM_TYPES, MEAL_PLANS } from "./constants";

// export default function HotelTab({ onDataChange }) {
//   const [included, setIncluded] = useState(true);
//   const [title,    setTitle]    = useState("Hotel Details");
//   const [amount,   setAmount]   = useState("");
//   const [notes,    setNotes]    = useState("");
//   const [hotels,   setHotels]   = useState([newHotel()]);

//   function newHotel() {
//     return {
//       id: Date.now() + Math.random(),
//       name: "", city: "", checkIn: "", checkOut: "",
//       roomType: "", mealPlan: "", refundable: true,
//     };
//   }

//   // ── Har state change pe parent ko data do ────────────────
//   useEffect(() => {
//     onDataChange?.({ included, title, amount, notes, hotels });
//   }, [included, title, amount, notes, hotels]);

//   // ── Helpers ───────────────────────────────────────────────
//   const addHotel    = () => setHotels(p => [...p, newHotel()]);
//   const removeHotel = (id) => setHotels(p => p.filter(h => h.id !== id));
//   const updateHotel = (id, k, v) =>
//     setHotels(p => p.map(h => h.id === id ? { ...h, [k]: v } : h));

//   return (
//     <div className="space-y-5">

//       {/* ── Settings ── */}
//       <SectionCard title="Hotel Settings" icon={Hotel}>
//         <div className="space-y-5">
//           <IncludeToggle
//             included={included}
//             onChange={() => setIncluded(p => !p)}
//             label="Include Hotels in Quotation"
//           />
//           {included && (
//             <>
//               <AIBanner text="AI can suggest hotels based on destination, budget, and traveler preferences." />
//               <FieldGrid cols={2}>
//                 <div>
//                   <Label>Section Title</Label>
//                   <Input
//                     value={title}
//                     onChange={e => setTitle(e.target.value)}
//                     placeholder="e.g. Hotel Details"
//                   />
//                 </div>
//                 <div>
//                   <Label>Amount (₹)</Label>
//                   <Input
//                     type="number"
//                     value={amount}
//                     onChange={e => setAmount(e.target.value)}
//                     placeholder="0.00"
//                   />
//                 </div>
//               </FieldGrid>
//               <div>
//                 <Label>Hotel Notes</Label>
//                 <RichText
//                   value={notes}
//                   onChange={setNotes}
//                   placeholder="Add notes about hotel selection, policies, etc."
//                   rows={4}
//                 />
//               </div>
//             </>
//           )}
//         </div>
//       </SectionCard>

//       {/* ── Hotel Cards ── */}
//       {included && hotels.map((h, hi) => (
//         <SectionCard
//           key={h.id}
//           title={hi === 0 ? "Default Hotel Option" : `Hotel Option ${hi + 1}`}
//           icon={Hotel}
//           headerRight={
//             <div className="flex items-center gap-2">
//               <span
//                 className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all
//                   ${h.refundable
//                     ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//                     : "bg-rose-50 text-rose-600 border-rose-200"}`}
//                 onClick={() => updateHotel(h.id, "refundable", !h.refundable)}
//               >
//                 {h.refundable ? "Refundable" : "Non-Refundable"}
//               </span>
//               {hotels.length > 1 && (
//                 <RemoveBtn onClick={() => removeHotel(h.id)} />
//               )}
//             </div>
//           }
//         >
//           <div className="space-y-4">
//             <FieldGrid cols={2}>
//               <div>
//                 <Label required>Hotel Name</Label>
//                 <div className="relative">
//                   <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
//                   <Input
//                     className="pl-9"
//                     value={h.name}
//                     onChange={e => updateHotel(h.id, "name", e.target.value)}
//                     placeholder="Search hotel name..."
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label required>City</Label>
//                 <Input
//                   value={h.city}
//                   onChange={e => updateHotel(h.id, "city", e.target.value)}
//                   placeholder="e.g. Kathmandu"
//                 />
//               </div>
//             </FieldGrid>

//             <FieldGrid cols={4}>
//               <div>
//                 <Label required>Check-In</Label>
//                 <Input
//                   type="date"
//                   value={h.checkIn}
//                   onChange={e => updateHotel(h.id, "checkIn", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label required>Check-Out</Label>
//                 <Input
//                   type="date"
//                   value={h.checkOut}
//                   onChange={e => updateHotel(h.id, "checkOut", e.target.value)}
//                 />
//               </div>
//               <div>
//                 <Label>Room Type</Label>
//                 <Select
//                   options={ROOM_TYPES}
//                   value={h.roomType}
//                   onChange={e => updateHotel(h.id, "roomType", e.target.value)}
//                   placeholder="Select room"
//                 />
//               </div>
//               <div>
//                 <Label>Meal Plan</Label>
//                 <Select
//                   options={MEAL_PLANS}
//                   value={h.mealPlan}
//                   onChange={e => updateHotel(h.id, "mealPlan", e.target.value)}
//                   placeholder="Select plan"
//                 />
//               </div>
//             </FieldGrid>

//             <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium flex items-center gap-2">
//               <Info size={13} /> Nights will be auto-calculated from Check-In and Check-Out dates.
//             </div>
//           </div>
//         </SectionCard>
//       ))}

//       {/* ── Add Hotel button ── */}
//       {included && (
//         <button
//           onClick={addHotel}
//           type="button"
//           className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-blue-400
//             hover:bg-blue-50/40 text-slate-500 hover:text-blue-600 text-sm font-bold
//             rounded-2xl transition-all flex items-center justify-center gap-2"
//         >
//           <Plus size={16} strokeWidth={2.5} /> Add Hotel Option
//         </button>
//       )}

//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import { Hotel, Search, Info, Plus, IndianRupee } from "lucide-react";
import { Label, Input, Select, SectionCard, RemoveBtn, IncludeToggle, AIBanner, FieldGrid, RichText } from "./ui";
import { ROOM_TYPES, MEAL_PLANS } from "./constants";

function calcNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut) - new Date(checkIn);
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
}

export default function HotelTab({ onDataChange }) {
  const [included, setIncluded] = useState(true);
  const [title,    setTitle]    = useState("Hotel Details");
  const [notes,    setNotes]    = useState("");
  const [hotels,   setHotels]   = useState([newHotel()]);

  function newHotel() {
    return {
      id: Date.now() + Math.random(),
      name: "", city: "", checkIn: "", checkOut: "",
      roomType: "", mealPlan: "", refundable: true,
      pricePerRoom: 0, rooms: 1,
    };
  }

  // ── Auto price ────────────────────────────────────────────
  const hotelTotals = hotels.map(h => {
    const nights = calcNights(h.checkIn, h.checkOut);
    return Number(h.pricePerRoom) * Number(h.rooms) * nights || 0;
  });
  const hotelTotal = hotelTotals.reduce((a, b) => a + b, 0);

  // ── Parent ko data do ─────────────────────────────────────
  useEffect(() => {
    onDataChange?.({ included, title, notes, hotels, amount: hotelTotal });
  }, [included, title, notes, hotels, hotelTotal]);

  // ── Helpers ───────────────────────────────────────────────
  const addHotel    = () => setHotels(p => [...p, newHotel()]);
  const removeHotel = (id) => setHotels(p => p.filter(h => h.id !== id));
  const updateHotel = (id, k, v) =>
    setHotels(p => p.map(h => h.id === id ? { ...h, [k]: v } : h));

  return (
    <div className="space-y-5">

      {/* ── Settings ── */}
      <SectionCard title="Hotel Settings" icon={Hotel}>
        <div className="space-y-5">
          <IncludeToggle included={included} onChange={() => setIncluded(p => !p)} label="Include Hotels in Quotation" />
          {included && (
            <>
              <AIBanner text="AI can suggest hotels based on destination, budget, and traveler preferences." />
              <div><Label>Section Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Hotel Details" /></div>
              <div><Label>Hotel Notes</Label><RichText value={notes} onChange={setNotes} placeholder="Add notes about hotel selection, policies, etc." rows={3} /></div>
            </>
          )}
        </div>
      </SectionCard>

      {/* ── Hotel Cards ── */}
      {included && hotels.map((h, hi) => {
        const nights     = calcNights(h.checkIn, h.checkOut);
        const thisTotal  = hotelTotals[hi];

        return (
          <SectionCard key={h.id}
            title={hi === 0 ? "Default Hotel Option" : `Hotel Option ${hi + 1}`}
            icon={Hotel}
            headerRight={
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer transition-all
                    ${h.refundable ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}
                  onClick={() => updateHotel(h.id, "refundable", !h.refundable)}>
                  {h.refundable ? "Refundable" : "Non-Refundable"}
                </span>
                {hotels.length > 1 && <RemoveBtn onClick={() => removeHotel(h.id)} />}
              </div>
            }>
            <div className="space-y-4">

              <FieldGrid cols={2}>
                <div>
                  <Label required>Hotel Name</Label>
                  <div className="relative">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    <Input className="pl-9" value={h.name} onChange={e => updateHotel(h.id, "name", e.target.value)} placeholder="Search hotel name..." />
                  </div>
                </div>
                <div><Label required>City</Label><Input value={h.city} onChange={e => updateHotel(h.id, "city", e.target.value)} placeholder="e.g. Kathmandu" /></div>
              </FieldGrid>

              <FieldGrid cols={4}>
                <div><Label required>Check-In</Label><Input type="date" value={h.checkIn} onChange={e => updateHotel(h.id, "checkIn", e.target.value)} /></div>
                <div><Label required>Check-Out</Label><Input type="date" value={h.checkOut} onChange={e => updateHotel(h.id, "checkOut", e.target.value)} /></div>
                <div><Label>Room Type</Label><Select options={ROOM_TYPES} value={h.roomType} onChange={e => updateHotel(h.id, "roomType", e.target.value)} placeholder="Select room" /></div>
                <div><Label>Meal Plan</Label><Select options={MEAL_PLANS} value={h.mealPlan} onChange={e => updateHotel(h.id, "mealPlan", e.target.value)} placeholder="Select plan" /></div>
              </FieldGrid>

              {/* ── Price Box ── */}
              <div className="grid grid-cols-4 gap-3 p-4 rounded-2xl bg-violet-50 border border-violet-100">
                <div>
                  <Label>Price / Room (₹)</Label>
                  <Input type="number" min={0} value={h.pricePerRoom}
                    onChange={e => updateHotel(h.id, "pricePerRoom", e.target.value)} placeholder="0" />
                </div>
                <div>
                  <Label>Rooms</Label>
                  <Input type="number" min={1} value={h.rooms}
                    onChange={e => updateHotel(h.id, "rooms", e.target.value)} placeholder="1" />
                </div>
                <div>
                  <Label>Nights</Label>
                  <div className="h-10 flex items-center justify-center bg-white border border-violet-200 rounded-xl text-sm font-extrabold text-violet-700">
                    {nights > 0 ? `${nights}N` : "—"}
                  </div>
                </div>
                <div>
                  <Label>Hotel Total</Label>
                  <div className="h-10 flex items-center justify-center bg-violet-600 rounded-xl text-sm font-extrabold text-white">
                    ₹{thisTotal.toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-700 font-medium flex items-center gap-2">
                <Info size={13} /> Nights auto-calculated · Total = Price × Rooms × Nights
              </div>
            </div>
          </SectionCard>
        );
      })}

      {/* ── Hotel Total Box ── */}
      {included && (
        <>
          <button onClick={addHotel} type="button"
            className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-violet-400 hover:bg-violet-50/40 text-slate-500 hover:text-violet-600 text-sm font-bold rounded-2xl transition-all flex items-center justify-center gap-2">
            <Plus size={16} strokeWidth={2.5} /> Add Hotel Option
          </button>

          <div className="flex items-center justify-between p-4 rounded-2xl"
            style={{ background: "linear-gradient(135deg,#7C3AED,#4C1D95)" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <IndianRupee size={18} className="text-white" />
              </div>
              <div>
                <p className="text-[10px] text-violet-200 font-semibold uppercase tracking-wider">Hotel Total</p>
                <p className="text-[11px] text-violet-300">{hotels.length} option{hotels.length > 1 ? "s" : ""}</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">
              ₹{hotelTotal.toLocaleString("en-IN")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}