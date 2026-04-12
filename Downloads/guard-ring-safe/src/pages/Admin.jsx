import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { AlertTriangle, Users, Activity, Shield, CheckCircle, RefreshCw, MapPin, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, subDays, startOfDay } from "date-fns";
import { formatDistanceToNow } from "date-fns";

export default function Admin() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
  });

  const { data: allAlerts = [], isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['adminAlerts'],
    queryFn: () => base44.entities.Alert.list('-created_date', 100),
    enabled: user?.role === 'admin',
    staleTime: 15000,
    refetchInterval: 30000,
  });

  const { mutate: resolveAlert } = useMutation({
    mutationFn: (id) => base44.entities.Alert.update(id, { status: 'resolved', resolved_at: new Date().toISOString() }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminAlerts'] }),
  });

  if (isLoading || !user) return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24 animate-pulse">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="h-7 w-48 bg-white/5 rounded-xl mb-2" />
            <div className="h-3 w-64 bg-white/5 rounded-lg" />
          </div>
          <div className="w-9 h-9 bg-white/5 rounded-xl" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl" />)}
        </div>
        <div className="h-48 bg-white/5 rounded-2xl mb-6" />
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-white/5 rounded-xl" />)}
        </div>
      </div>
    </div>
  );

  if (user?.role !== 'admin') return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center text-center px-4">
      <div>
        <Shield size={48} className="text-[#333] mx-auto mb-4" />
        <p className="text-white font-bold text-lg mb-2">Admin Access Only</p>
        <p className="text-[#555] text-sm">You don't have permission to view this page.</p>
      </div>
    </div>
  );

  const activeAlerts = allAlerts.filter(a => a.status === 'active');
  const resolvedAlerts = allAlerts.filter(a => a.status === 'resolved');
  const uniqueUsers = [...new Set(allAlerts.map(a => a.owner_email))];
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString() : '—';

  // Build last-7-days chart data
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const day = startOfDay(subDays(new Date(), 6 - i));
    const next = startOfDay(subDays(new Date(), 5 - i));
    const count = allAlerts.filter(a => {
      const d = new Date(a.created_date);
      return d >= day && d < next;
    }).length;
    return { day: format(day, 'EEE'), count };
  });

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-[#666] text-sm mt-1">Auto-refreshes every 30s · Last: {lastUpdated}</p>
          </div>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['adminAlerts'] })}
            className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <RefreshCw size={15} className="text-[#666]" />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total Alerts", value: allAlerts.length, icon: Activity, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { label: "Active Now", value: activeAlerts.length, icon: AlertTriangle, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
            { label: "Resolved", value: resolvedAlerts.length, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
            { label: "Users", value: uniqueUsers.length, icon: Users, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          ].map(s => (
            <div key={s.label} className={`border rounded-2xl p-4 ${s.bg}`}>
              <s.icon size={16} className={s.color} />
              <p className="text-3xl font-bold text-white mt-2">{s.value}</p>
              <p className="text-[#666] text-xs mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Alerts over time chart */}
        <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-teal-400" />
            <h2 className="text-white text-sm font-semibold">Alerts — Last 7 Days</h2>
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <defs>
                <linearGradient id="alertGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#555' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 8, fontSize: 12 }} />
              <Area type="monotone" dataKey="count" stroke="#ef4444" strokeWidth={2} fill="url(#alertGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Registered Users */}
        {uniqueUsers.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Users size={14} className="text-purple-400" />
              <h2 className="text-white text-sm font-semibold">Registered Users ({uniqueUsers.length})</h2>
            </div>
            <div className="space-y-2">
              {uniqueUsers.slice(0, 8).map(email => (
                <div key={email} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-purple-500/15 border border-purple-500/20 flex items-center justify-center text-purple-400 text-xs font-bold flex-shrink-0">
                    {email?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-[#888] text-xs truncate">{email}</span>
                  <span className="ml-auto text-[#444] text-[10px]">{allAlerts.filter(a => a.owner_email === email).length} alerts</span>
                </div>
              ))}
              {uniqueUsers.length > 8 && <p className="text-[#444] text-xs text-center pt-1">+{uniqueUsers.length - 8} more</p>}
            </div>
          </div>
        )}

        {/* Active Alerts Priority */}
        {activeAlerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle size={14} /> Active Emergencies ({activeAlerts.length})
            </h2>
            <div className="space-y-3">
              {activeAlerts.map(a => (
                <div key={a.id} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white text-sm font-semibold">{a.owner_email}</p>
                      <p className="text-[#888] text-xs mt-0.5">{a.message?.slice(0, 60)}</p>
                    </div>
                    <button onClick={() => resolveAlert(a.id)} className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-xl hover:bg-emerald-500/30 transition-colors">
                      Resolve
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-3 text-[#555] text-xs">
                    {a.address && <span className="flex items-center gap-1"><MapPin size={10} /> {a.address.slice(0, 40)}</span>}
                    <span>🕐 {formatDistanceToNow(new Date(a.created_date), { addSuffix: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Alerts Feed */}
        <h2 className="text-[#666] text-xs uppercase tracking-widest mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {allAlerts.slice(0, 20).map(a => (
            <div key={a.id} className="bg-white/[0.02] border border-white/[0.06] rounded-xl px-4 py-3 flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.status === 'active' ? 'bg-red-500' : a.status === 'resolved' ? 'bg-emerald-500' : 'bg-[#444]'}`} />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{a.owner_email}</p>
                <p className="text-[#555] text-xs">{formatDistanceToNow(new Date(a.created_date), { addSuffix: true })}</p>
              </div>
              <span className={`text-xs capitalize ${a.status === 'active' ? 'text-red-400' : a.status === 'resolved' ? 'text-emerald-400' : 'text-[#666]'}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}