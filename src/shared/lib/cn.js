// src/shared/lib/cn.js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge conditional class lists and de-dupe Tailwind conflicts (generic helper, not shadcn). */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
