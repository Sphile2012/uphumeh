import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, Search, RefreshCw, Phone, Mail, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_ICONS = {
  pending: Clock,
  confirmed: CheckCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

function LoginScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center bg-card border border-border/50 rounded-3xl p-10 max-w-sm w-full shadow-xl">
        <p className="text-5xl mb-4">💅</p>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Bloom Skills &amp; Beauty Admin</h2>
        <p className="text-muted-foreground text-sm mb-6">Please log in to access the admin dashboard.</p>
        <Button
          className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={() => base44.auth.redirectToLogin(window.location.pathname)}
        >
          Log In
        </Button>
      </div>
    </div>
  );
}

function NotAuthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-4xl mb-4">🚫</p>
        <h2 className="font-heading text-2xl font-bold text-foreground mb-2">Not Authorized</h2>
        <p className="text-muted-foreground">This page is only accessible to the salon owner.</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBookings = async () => {
    setLoading(true);
    const data = await base44.entities.Booking.list("-preferred_date", 200);
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (booking, newStatus) => {
    setUpdating(booking.id);
    await base44.entities.Booking.update(booking.id, { status: newStatus });
    setBookings(prev => prev.map(b => b.id === booking.id ? { ...b, status: newStatus } : b));
    // Send notification email to client on confirm/cancel
    if ((newStatus === "confirmed" || newStatus === "cancelled") && booking.client_email) {
      await base44.functions.invoke("notifyStatusChange", { booking: { ...booking, status: newStatus } });
    }
    showToast(`Booking ${newStatus} ✓`);
    setUpdating(null);
  };

  const filtered = bookings.filter(b => {
    const matchSearch =
      b.client_name?.toLowerCase().includes(search.toLowerCase()) ||
      b.client_phone?.includes(search) ||
      b.service_detail?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    cancelled: bookings.filter(b => b.status === "cancelled").length,
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-2xl shadow-xl text-sm font-medium text-white transition-all ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">Bookings Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1 italic">Bloom Skills &amp; Beauty</p>
          </div>
          <Button variant="outline" onClick={fetchBookings} className="rounded-xl gap-2 self-start sm:self-auto">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Pending", count: counts.pending, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200" },
            { label: "Confirmed", count: counts.confirmed, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
            { label: "Completed", count: counts.completed, color: "text-green-600", bg: "bg-green-50 border-green-200" },
            { label: "Cancelled", count: counts.cancelled, color: "text-red-600", bg: "bg-red-50 border-red-200" },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-2xl border p-4 ${stat.bg}`}>
              <p className={`font-heading text-2xl font-black ${stat.color}`}>{stat.count}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone or service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl h-11"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-44 rounded-xl h-11">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All ({counts.all})</SelectItem>
              <SelectItem value="pending">Pending ({counts.pending})</SelectItem>
              <SelectItem value="confirmed">Confirmed ({counts.confirmed})</SelectItem>
              <SelectItem value="completed">Completed ({counts.completed})</SelectItem>
              <SelectItem value="cancelled">Cancelled ({counts.cancelled})</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading bookings...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-medium">No bookings found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((b, i) => {
              const StatusIcon = STATUS_ICONS[b.status] || Clock;
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    {/* Client info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-foreground text-sm">{b.client_name}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[b.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {b.status}
                        </span>
                        {b.price > 0 && (
                          <span className="font-heading text-sm font-black text-primary ml-auto">R{b.price}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3 h-3 shrink-0" />
                          <a href={`tel:${b.client_phone}`} className="hover:text-primary">{b.client_phone}</a>
                        </span>
                        {b.client_email && (
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span className="truncate">{b.client_email}</span>
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 shrink-0" />
                          {b.preferred_date} @ {b.preferred_time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          💅 <span className="truncate">{b.service_detail}</span>
                        </span>
                      </div>

                      {b.notes && (
                        <p className="mt-2 text-xs italic text-muted-foreground bg-secondary/40 rounded-lg px-3 py-1.5">
                          "{b.notes}"
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 shrink-0">
                      {b.status === "pending" && (
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => updateStatus(b, "confirmed")}
                          disabled={updating === b.id}
                        >
                          {updating === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "✓ Confirm"}
                        </Button>
                      )}
                      {(b.status === "pending" || b.status === "confirmed") && (
                        <Button
                          size="sm"
                          className="rounded-xl text-xs h-8 bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => updateStatus(b, "completed")}
                          disabled={updating === b.id}
                        >
                          {updating === b.id ? <Loader2 className="w-3 h-3 animate-spin" /> : "Complete"}
                        </Button>
                      )}
                      {b.status !== "cancelled" && b.status !== "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl text-xs h-8 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => updateStatus(b, "cancelled")}
                          disabled={updating === b.id}
                        >
                          Cancel
                        </Button>
                      )}
                      <a
                        href={`https://wa.me/${b.client_phone?.replace(/\D/g, '').replace(/^0/, '27')}?text=${encodeURIComponent(`Hi ${b.client_name}! 🌸 Your booking for ${b.service_detail} on ${b.preferred_date} at ${b.preferred_time} is confirmed. See you at Bloom Skills &amp; Beauty! 💅`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm" variant="outline" className="rounded-xl text-xs h-8 border-green-300 text-green-700 hover:bg-green-50">
                          💬 WhatsApp
                        </Button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { user, isLoadingAuth } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;
  if (user.role !== "admin") return <NotAuthorized />;

  return <Dashboard />;
}