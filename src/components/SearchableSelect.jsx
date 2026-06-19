import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiSearch } from "react-icons/fi";

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  loading,
  icon: Icon,
  searchable = true,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openUpward, setOpenUpward] = useState(false);
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const selectedLabel = options.find((o) => o.value === value)?.label || "";
  const filteredOptions = searchable
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const panelHeight = 300; // approx panel height
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      setOpenUpward(spaceBelow < panelHeight && spaceAbove > spaceBelow);
    }
    setIsOpen((o) => !o);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {Icon && (
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none z-10" />
      )}
      <button
        ref={buttonRef}
        type="button"
        disabled={loading}
        onClick={handleToggle}
        className={`w-full ${Icon ? "pl-9" : "pl-3"} pr-8 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-left text-slate-700
          focus:border-teal-400 focus:ring-2 focus:ring-teal-50 outline-none transition-all cursor-pointer truncate`}
      >
        {loading ? "Loading..." : selectedLabel || placeholder}
      </button>
      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />

      {isOpen && !loading && (
        <div
          className={`absolute z-20 w-full bg-white border border-slate-200 rounded-xl shadow-lg max-h-64 overflow-hidden flex flex-col ${
            openUpward ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {searchable && (
            <div className="relative p-2 border-b border-slate-100 flex-shrink-0">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-7 pr-2 py-1.5 text-sm rounded-lg border border-slate-200 outline-none focus:border-teal-400"
              />
            </div>
          )}
          <ul className="overflow-y-auto flex-1 min-h-0">
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 text-sm text-slate-400">No matches</li>
            ) : (
              filteredOptions.map((o) => (
                <li
                  key={o.value}
                  onClick={() => { onChange(o.value); setIsOpen(false); setSearch(""); }}
                  className={`px-3 py-2 text-sm cursor-pointer hover:bg-teal-50 ${
                    o.value === value ? "bg-teal-50 text-teal-700 font-medium" : "text-slate-700"
                  }`}
                >
                  {o.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}