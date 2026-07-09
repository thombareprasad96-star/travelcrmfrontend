// src/features/portal/constants/portalFeatures.js
// The "Coming Soon" teaser features. Keys MUST match backend PortalFeatureKey.
import { CreditCard, MapPin, Camera, Gift, WifiOff } from "lucide-react";

export const COMING_SOON = {
  PAY_ONLINE: {
    key: "PAY_ONLINE",
    title: "Pay Online",
    tagline: "UPI & cards with instant receipts",
    icon: CreditCard,
  },
  LIVE_TRACKING: {
    key: "LIVE_TRACKING",
    title: "Live Cab Tracking",
    tagline: "See your driver on the map in real time",
    icon: MapPin,
  },
  TRIP_MEMORIES: {
    key: "TRIP_MEMORIES",
    title: "Trip Memories",
    tagline: "All your trip photos in one beautiful gallery",
    icon: Camera,
  },
  REFER_EARN: {
    key: "REFER_EARN",
    title: "Refer & Earn",
    tagline: "Invite friends, earn credits on your next trip",
    icon: Gift,
  },
  OFFLINE_MODE: {
    key: "OFFLINE_MODE",
    title: "Offline Itinerary",
    tagline: "Your full plan works even without network in the hills",
    icon: WifiOff,
  },
};

export const COMING_SOON_LIST = Object.values(COMING_SOON);