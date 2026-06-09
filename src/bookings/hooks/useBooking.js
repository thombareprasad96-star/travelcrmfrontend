import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import bookingService from "../../services/bookingService";
import { normalizeBooking } from "../utils";

const DEFAULT_STATS = { total: 0, confirmed: 0, revenue: 0, net: 0, refunds: 0, profit: 0 };
const DEFAULT_PAGE_SUMMARY = { totalCharges: 0, netProfit: 0, gstCollected: 0, tcsCollected: 0 };

/**
 * Encapsulates all server state for the Bookings feature:
 *  - paginated booking list
 *  - global stats
 *  - per-page tax/profit summary
 *  - pagination controls
 *  - delete (single & bulk)
 *  - CSV export
 */
export function useBookings() {
  const [data, setData]               = useState([]);
  const [stats, setStats]             = useState(DEFAULT_STATS);
  const [pageSummary, setPageSummary] = useState(DEFAULT_PAGE_SUMMARY);
  const [loading, setLoading]         = useState(true);

  // Server-side pagination
  const [pageIndex, setPageIndex]     = useState(0);
  const [pageSize, setPageSize]       = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);

  // ── Fetchers ───────────────────────────────────────────────────────────────

  const fetchBookings = useCallback(async (page = 0, size = 10) => {
    setLoading(true);
    try {
      const res  = await bookingService.getAll(page, size, "createdAt", "desc");
      const body = res.data; // { success, message, data: [...], pagination: {...} }

      const rawList    = Array.isArray(body.data) ? body.data : [];
      const pagination = body.pagination ?? {};

      setData(rawList.map(normalizeBooking));
      setTotalElements(pagination.totalElements ?? rawList.length);
      setTotalPages(pagination.totalPages ?? 1);
    } catch (err) {
      toast.error("Failed to load bookings.", {
        description: err?.response?.data?.message || "Please check your connection.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await bookingService.getStats();
      const s   = res.data?.data ?? res.data;
      setStats({
        total:     s.total        ?? 0,
        confirmed: s.confirmed    ?? 0,
        revenue:   s.totalRevenue ?? 0,
        net:       s.netRevenue   ?? 0,
        refunds:   s.totalRefunds ?? 0,
        profit:    s.netProfit    ?? 0,
      });
    } catch {
      // stats are non-critical; silently ignore
    }
  }, []);

  const fetchPageSummary = useCallback(async (page, size) => {
    try {
      const res = await bookingService.getPageSummary(page, size);
      const s   = res.data?.data ?? res.data;
      setPageSummary({
        totalCharges: s.totalCharges ?? 0,
        netProfit:    s.netProfit    ?? 0,
        gstCollected: s.gstCollected ?? 0,
        tcsCollected: s.tcsCollected ?? 0,
      });
    } catch {
      // non-critical
    }
  }, []);

  // ── Side effects ───────────────────────────────────────────────────────────

  useEffect(() => {
    fetchBookings(0, pageSize);
    fetchStats();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchPageSummary(pageIndex, pageSize);
  }, [pageIndex, pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Actions ────────────────────────────────────────────────────────────────

  const goToPage = useCallback(async (p) => {
    setPageIndex(p);
    await fetchBookings(p, pageSize);
  }, [pageSize, fetchBookings]);

  const changePageSize = useCallback(async (size) => {
    setPageSize(size);
    setPageIndex(0);
    await fetchBookings(0, size);
  }, [fetchBookings]);

  const refresh = useCallback(async () => {
    setPageIndex(0);
    await fetchBookings(0, pageSize);
    await fetchStats();
    toast.success("Bookings refreshed.");
  }, [pageSize, fetchBookings, fetchStats]);

  const deleteOne = useCallback(async (id) => {
    try {
      await bookingService.delete(id);
      toast.success("Booking deleted successfully.", {
        description: `Booking #${id} has been removed.`,
      });
      await fetchBookings(pageIndex, pageSize);
      await fetchStats();
    } catch (err) {
      toast.error("Failed to delete booking.", {
        description: err?.response?.data?.message || "Please try again.",
      });
    }
  }, [pageIndex, pageSize, fetchBookings, fetchStats]);

  const deleteBulk = useCallback(async (ids) => {
    try {
      await Promise.all(ids.map(id => bookingService.delete(id)));
      toast.success(`${ids.length} booking(s) deleted.`);
      await fetchBookings(pageIndex, pageSize);
      await fetchStats();
    } catch (err) {
      toast.error("Some deletions failed.", {
        description: err?.response?.data?.message || "Please try again.",
      });
    }
  }, [pageIndex, pageSize, fetchBookings, fetchStats]);

  const exportCSV = useCallback(async () => {
    try {
      const res = await bookingService.exportCSV();
      const url = URL.createObjectURL(new Blob([res.data], { type: "text/csv" }));
      const a   = document.createElement("a");
      a.href = url;
      a.download = "bookings.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully!");
    } catch (err) {
      toast.error("Export failed.", {
        description: err?.response?.data?.message || "Please try again.",
      });
    }
  }, []);

  return {
    // data
    data,
    stats,
    pageSummary,
    loading,
    // pagination
    pageIndex,
    pageSize,
    totalElements,
    totalPages,
    // actions
    goToPage,
    changePageSize,
    refresh,
    deleteOne,
    deleteBulk,
    exportCSV,
  };
}