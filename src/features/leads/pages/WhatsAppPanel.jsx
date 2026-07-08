// src/components/WhatsAppPanel/WhatsAppPanel.jsx
// ─────────────────────────────────────────────────────────────
// Right-side WhatsApp-style chat panel — slides in when a phone
// number is clicked anywhere in AllLeads.
//
// HOW TO USE in AllLeads.jsx:
//   1. Import this component + useState
//   2. Add state: const [waLead, setWaLead] = useState(null);
//   3. Pass setWaLead to PhoneLink (see bottom of this file)
//   4. Render: {waLead && <WhatsAppPanel lead={waLead} onClose={()=>setWaLead(null)}/>}
// ─────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { FiX, FiSend, FiPhone, FiSmile, FiChevronDown } from "react-icons/fi";
import { MdDoneAll } from "react-icons/md";

/* ─── QUICK REPLY TEMPLATES ──────────────────────────────────
   Customise these for your travel agency                       */
const QUICK_REPLIES = [
  { id:1, label:"Greeting",       text:"Hello {name}! 👋 I'm calling from TravelCRM. I hope you're doing well. I wanted to follow up on your travel inquiry."                                   },
  { id:2, label:"Quotation Ready",text:"Dear {name}, your travel quotation is ready! 🎉 Please let me know if you'd like to review the details or make any changes."                           },
  { id:3, label:"Follow Up",      text:"Hi {name}, just checking in on your travel plans! Have you had a chance to review the itinerary we shared? We'd love to help you finalize the details." },
  { id:4, label:"Payment Reminder",text:"Hello {name}, this is a friendly reminder that your payment is due. Please feel free to reach out if you have any questions about the booking."        },
  { id:5, label:"Trip Confirm",   text:"Great news {name}! 🌟 Your trip has been confirmed. We're excited to make your travel experience unforgettable!"                                         },
  { id:6, label:"Feedback",       text:"Hi {name}, we hope you had a wonderful trip! We'd love to hear your feedback. Your experience matters a lot to us. 🙏"                                  },
];

/* ─── HELPERS ────────────────────────────────────────────────── */
function cleanPhone(phone) {
  if (!phone) return "";
  const digits = String(phone).replace(/\D/g, "");
  // Add India country code if 10 digits
  if (digits.length === 10) return "91" + digits;
  return digits;
}

function timeNow() {
  return new Date().toLocaleTimeString("en-IN", { hour:"2-digit", minute:"2-digit", hour12:true });
}

function avatarColor(name) {
  const colors = [
    "from-blue-500 to-blue-600", "from-purple-500 to-purple-600",
    "from-teal-500 to-teal-600", "from-rose-500 to-rose-600",
    "from-amber-500 to-amber-600", "from-indigo-500 to-indigo-600",
  ];
  const idx = (name || "U").charCodeAt(0) % colors.length;
  return colors[idx];
}

function initials(name) {
  return (name || "?").trim().split(" ").map(w => w[0] || "").join("").slice(0,2).toUpperCase();
}

/* ─── SINGLE MESSAGE BUBBLE ──────────────────────────────────── */
function MsgBubble({ msg }) {
  const isSent = msg.from === "me";
  return (
    <div className={`flex ${isSent ? "justify-end" : "justify-start"} mb-1`}>
      <div
        className={`max-w-[78%] px-3 py-2 rounded-2xl text-sm leading-relaxed relative
          ${isSent
            ? "bg-[#dcf8c6] text-slate-800 rounded-br-sm"
            : "bg-white text-slate-800 rounded-bl-sm shadow-sm"}`}
        style={{ wordBreak:"break-word" }}>
        <p style={{ whiteSpace:"pre-wrap" }}>{msg.text}</p>
        <div className={`flex items-center gap-1 mt-0.5 ${isSent ? "justify-end" : "justify-start"}`}>
          <span className="text-[10px] text-slate-400">{msg.time}</span>
          {isSent && (
            msg.status === "read"
              ? <MdDoneAll className="w-3 h-3 text-blue-500"/>
              : <MdDoneAll className="w-3 h-3 text-slate-400"/>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PANEL COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function WhatsAppPanel({ lead, onClose }) {
  const [messages,  setMessages]  = useState([
    {
      id:1, from:"system", time: timeNow(),
      text: `Chat with ${lead?.customerName || lead?.name || "Lead"} (${lead?.phone || ""})\nMessages sent here will open WhatsApp Web. This panel keeps your chat history for this session.`,
    }
  ]);
  const [input,       setInput]       = useState("");
  const [showQuick,   setShowQuick]   = useState(false);
  const [showEmoji,   setShowEmoji]   = useState(false);
  const [sending,     setSending]     = useState(false);
  const endRef  = useRef(null);
  const inputRef = useRef(null);

  const phone    = cleanPhone(lead?.phone);
  const name     = lead?.customerName || lead?.name || "Lead";
  const waBase   = `https://wa.me/${phone}`;

  // Auto scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [messages]);

  // Focus input on open
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 300);
  }, []);

  // Replace {name} placeholder
  const fillTemplate = (text) => text.replace(/\{name\}/g, name.split(" ")[0]);

  /* Send message — opens WhatsApp Web with prefilled text */
  const sendMsg = async (text) => {
    if (!text.trim()) return;
    setSending(true);

    const newMsg = {
      id:     Date.now(),
      from:   "me",
      text:   text.trim(),
      time:   timeNow(),
      status: "sent",
    };
    setMessages(p => [...p, newMsg]);
    setInput("");

    // Open WhatsApp Web with the message
    const waUrl = `${waBase}?text=${encodeURIComponent(text.trim())}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");

    // Simulate delivered tick after 1s
    setTimeout(() => {
      setMessages(p => p.map(m => m.id === newMsg.id ? { ...m, status:"delivered" } : m));
      setSending(false);
    }, 1000);
  };

  const handleSend = () => sendMsg(input);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const applyQuick = (tpl) => {
    setInput(fillTemplate(tpl.text));
    setShowQuick(false);
    inputRef.current?.focus();
  };

  /* Simple emoji picker */
  const EMOJIS = ["😊","👋","✅","🎉","🙏","✈️","🌟","💳","📋","🗺️","🏨","🚗","📞","💬","❤️","👍"];

  /* ─── RENDER ───────────────────────────────────────────────── */
  return (
    <>
      {/* Backdrop — click to close */}
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-white shadow-2xl"
        style={{
          width: "clamp(340px, 38vw, 460px)",
          animation: "slideInRight .28s cubic-bezier(.4,0,.2,1) both",
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* ── HEADER ── */}
        <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3 flex-shrink-0">
          {/* Avatar */}
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${avatarColor(name)}
            flex items-center justify-center text-white font-extrabold text-sm flex-shrink-0`}>
            {initials(name)}
          </div>

          {/* Lead info */}
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm truncate">{name}</p>
            <div className="flex items-center gap-2">
              <FaWhatsapp className="w-3 h-3 text-green-300 flex-shrink-0"/>
              <p className="text-green-300 text-xs truncate">{lead?.phone}</p>
              {lead?.leadStage && (
                <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full font-semibold truncate">
                  {lead.leadStage}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Call on WhatsApp */}
            <a href={waBase} target="_blank" rel="noopener noreferrer"
              title="Call via WhatsApp"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <FiPhone className="w-4 h-4 text-white"/>
            </a>
            {/* Close */}
            <button onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all">
              <FiX className="w-4 h-4 text-white"/>
            </button>
          </div>
        </div>

        {/* Lead details strip */}
        {(lead?.leadStage || lead?.budget || lead?.travelDate) && (
          <div className="bg-[#075e54]/10 border-b border-[#075e54]/10 px-4 py-2 flex items-center gap-4 flex-shrink-0 flex-wrap">
            {lead?.leadStage  && <span className="text-[11px] text-slate-600 font-semibold">📍 {lead.leadStage}</span>}
            {lead?.budget     && <span className="text-[11px] text-slate-600 font-semibold">💰 ₹{Number(lead.budget).toLocaleString("en-IN")}</span>}
            {lead?.travelDate && <span className="text-[11px] text-slate-600 font-semibold">✈️ {new Date(lead.travelDate).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</span>}
          </div>
        )}

        {/* ── QUICK REPLIES BAR ── */}
        <div className="border-b border-slate-100 flex-shrink-0">
          <button
            onClick={() => setShowQuick(v => !v)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
            <span className="flex items-center gap-2">
              <FaWhatsapp className="w-3.5 h-3.5 text-green-500"/>
              Quick Replies
            </span>
            <FiChevronDown className={`w-3.5 h-3.5 transition-transform ${showQuick ? "rotate-180" : ""}`}/>
          </button>
          {showQuick && (
            <div className="px-3 pb-3 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {QUICK_REPLIES.map(tpl => (
                <button key={tpl.id}
                  onClick={() => applyQuick(tpl)}
                  className="text-[11px] font-semibold px-2.5 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 transition-all">
                  {tpl.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── MESSAGES AREA ── */}
        <div
          className="flex-1 overflow-y-auto px-4 py-3"
          style={{ background:"#e5ddd5 url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='28' fill='none' stroke='%23c5b9a8' stroke-width='.3'/%3E%3C/svg%3E\")" }}>

          {messages.map(msg => (
            msg.from === "system" ? (
              <div key={msg.id} className="flex justify-center mb-3">
                <div className="bg-[#fffde7] text-slate-500 text-[11px] px-3 py-1.5 rounded-lg shadow-sm max-w-[85%] text-center leading-relaxed">
                  {msg.text}
                </div>
              </div>
            ) : (
              <MsgBubble key={msg.id} msg={msg}/>
            )
          ))}
          <div ref={endRef}/>
        </div>

        {/* ── EMOJI PICKER ── */}
        {showEmoji && (
          <div className="border-t border-slate-100 px-3 py-2 flex flex-wrap gap-2 bg-white flex-shrink-0">
            {EMOJIS.map(e => (
              <button key={e}
                onClick={() => { setInput(p => p + e); setShowEmoji(false); inputRef.current?.focus(); }}
                className="text-xl hover:scale-125 transition-transform">
                {e}
              </button>
            ))}
          </div>
        )}

        {/* ── INPUT AREA ── */}
        <div className="bg-[#f0f0f0] px-3 py-2 flex items-end gap-2 flex-shrink-0 border-t border-slate-200">
          {/* Emoji button */}
          <button
            onClick={() => setShowEmoji(v => !v)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all flex-shrink-0 mb-0.5
              ${showEmoji ? "bg-green-100 text-green-600" : "hover:bg-slate-200 text-slate-500"}`}>
            <FiSmile className="w-5 h-5"/>
          </button>

          {/* Textarea */}
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            rows={1}
            className="flex-1 bg-white rounded-2xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400
              outline-none resize-none border-0 shadow-sm leading-relaxed"
            style={{ maxHeight:120, overflowY:"auto" }}
            onInput={e => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all flex-shrink-0
              ${input.trim()
                ? "bg-[#075e54] hover:bg-[#064c44] shadow-md"
                : "bg-slate-300 cursor-not-allowed"}`}>
            <FiSend className="w-4 h-4 text-white"/>
          </button>
        </div>

        {/* ── FOOTER — open in WhatsApp Web ── */}
        <div className="bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <p className="text-[10px] text-slate-400">
            Messages open WhatsApp Web for actual delivery
          </p>
          <a href={waBase} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[11px] font-bold text-green-600 hover:text-green-700 transition-colors">
            <FaWhatsapp className="w-3.5 h-3.5"/>
            Open Chat
          </a>
        </div>
      </div>
    </>
  );
}