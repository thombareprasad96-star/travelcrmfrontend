import API from "@shared/api/http";

const unwrap = (response) =>
  response?.data && typeof response.data === "object" && "data" in response.data
    ? response.data.data
    : response?.data;

const dashboardService = {
  getAnalytics({ period = "month", from, to } = {}) {
    const params = { period };
    if (period === "custom" && from && to) {
      params.from = from;
      params.to = to;
    }
    return API.get("/dashboard/analytics", { params }).then(unwrap);
  },
};

export default dashboardService;
