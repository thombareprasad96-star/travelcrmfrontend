/**
 * Build a WhatsApp click-to-chat link (https://wa.me/<number>) from a raw phone string.
 *
 *   "+91 91234 50004"  → "https://wa.me/919123450004"  (international + prefix kept)
 *   "8888403981"       → "https://wa.me/918888403981"  (bare 10-digit → default +91 India)
 *   null / "" / no digits → null  (caller should render a plain placeholder, not a link)
 *
 * @param {string|null|undefined} phone
 * @returns {string|null}
 */
export function formatToWhatsAppLink(phone) {
  if (!phone) return null;
  const raw = String(phone).trim();
  if (!raw) return null;

  const hasIntlPrefix = raw.startsWith('+');
  const digits = raw.replace(/\D/g, '');   // strip spaces, dashes, parens, the leading +
  if (!digits) return null;

  // A bare 10-digit Indian mobile gets the 91 country code; anything with an explicit
  // + prefix (or already country-coded) is used as-is.
  const normalized = (!hasIntlPrefix && digits.length === 10) ? `91${digits}` : digits;
  return `https://wa.me/${normalized}`;
}