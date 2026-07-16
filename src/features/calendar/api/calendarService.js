// features/calendar/api/calendarService.js
// ─────────────────────────────────────────────────────────────
// Unified calendar service — maps to Spring Boot /api/calendar.
// BARE-DTO responses (no ApiResponse envelope) → resolve to res.data.
// ─────────────────────────────────────────────────────────────
import API from "@shared/api/http";

const calendarService = {
  // GET /api/calendar?from=&to=&categories=&assignee=&mine=
  //   from/to  : ISO-8601 instants bounding the visible window
  //   categories: comma-separated CalendarSource names (TASK,REMINDER,TRIP,PAYMENT_DUE,FLIGHT,HOTEL_CHECKIN,VISA)
  //   assignee : a user publicId; mine=true restricts to the caller's own tasks/reminders
  // → List<CalendarEvent>: { id, source, category, title, subtitle, start, end, allDay,
  //                          priority, status, amount, referenceType, referencePublicId, assigneeName, editable }
  events: async ({ from, to, categories, assignee, mine } = {}) => {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    if (categories) params.categories = categories;
    if (assignee) params.assignee = assignee;
    if (mine) params.mine = true;
    return (await API.get("/calendar", { params })).data;
  },

  // GET /api/calendar/summary?date=YYYY-MM-DD  (CRM_FULL)
  // → { date, todaysFollowups, activeTrips, paymentsDueAmount, paymentsDueCount, flightsToday,
  //     hotelCheckinsToday, visaToday, newLeadsToday, revenueThisMonth, todaysSchedule[],
  //     paymentDueSummary{ totalOverdue, overdueCount, dueToday, dueTodayCount },
  //     tripsStartingToday[], flightDepartures[], hotelCheckins[], visaAppointments[] }
  summary: async (date) =>
    (await API.get("/calendar/summary", { params: date ? { date } : {} })).data,
};

export default calendarService;