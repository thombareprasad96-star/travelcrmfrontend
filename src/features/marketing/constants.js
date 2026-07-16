// src/features/marketing/constants.js
// Static UI helpers for the Marketing module. The *field catalog* and *merge tags*
// are fetched from the backend (GET /marketing/segments/fields, /marketing/merge-tags)
// so the query builder stays data-driven; these are only labels/option lists the UI
// needs regardless. All enum wire values are UPPERCASE names (see the contract).

export const CHANNELS = [
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "EMAIL", label: "Email" },
];

export const CAMPAIGN_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "SENDING", label: "Sending" },
  { value: "SENT", label: "Sent" },
  { value: "FAILED", label: "Failed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export const DRIP_STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "ACTIVE", label: "Active" },
  { value: "PAUSED", label: "Paused" },
];

export const MATCH_TYPES = [
  { value: "ALL", label: "Match ALL conditions (AND)" },
  { value: "ANY", label: "Match ANY condition (OR)" },
];

// Human labels for the condition operators (wire values are the keys).
export const OPERATOR_LABELS = {
  EQUALS: "is",
  NOT_EQUALS: "is not",
  IN: "is any of",
  NOT_IN: "is none of",
  CONTAINS: "contains",
  GREATER_THAN: "is after / greater than",
  LESS_THAN: "is before / less than",
  BETWEEN: "is between",
  IS_SET: "is set",
  IS_NOT_SET: "is not set",
};

// Operators that take NO value input.
export const NO_VALUE_OPERATORS = new Set(["IS_SET", "IS_NOT_SET"]);
// Operators whose value is a list (multi-select).
export const MULTI_VALUE_OPERATORS = new Set(["IN", "NOT_IN"]);

export const AUTOMATION_META = {
  BIRTHDAY: { label: "Birthday", icon: "🎂", blurb: "Wish customers on their birthday." },
  ANNIVERSARY: { label: "Anniversary", icon: "💍", blurb: "Celebrate customer anniversaries." },
};

export const MONTHS = [
  { value: 1, label: "January" }, { value: 2, label: "February" }, { value: 3, label: "March" },
  { value: 4, label: "April" }, { value: 5, label: "May" }, { value: 6, label: "June" },
  { value: 7, label: "July" }, { value: 8, label: "August" }, { value: 9, label: "September" },
  { value: 10, label: "October" }, { value: 11, label: "November" }, { value: 12, label: "December" },
];