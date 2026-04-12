import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Smartphone, Search, ArrowLeft, Clock, Wifi, WifiOff } from "lucide-react";

export default function FindMyPhone() {
  const [mode, setMode] = useState("login");
  const [imei, setImei] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!imei.trim() && !email.trim() && !phone.trim()) {
      setError("Please enter at least one: Device ID, email, or phone number.");
      setLoading(false);
      return;
    }

    const response = await base44.functions.invoke("findMyPhoneLogin", {
      imei: imei.trim() || undefined,
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
    });

    setLoading(false);

    if (response.data.success) {
      setDevices(response.data.devices);
      setMode("tracking");
    } else {
      setError(response.data.error || "No device found. Please verify your details.");
    }
  };

  const openMap = (device) => {
    window.open(
      `https://www.google.com/maps?q=${device.last_latitude},${device.last_longitude}`,
      "_blank"
    );
  };

  const formatTime = (ts) => {
    if (!ts) return null;
    const d = new Date(ts);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return d.toLocaleDateString();
  };

  const getDeviceLabel = (device) => {
    const name = device.device_name || "Unknown Device";
    // Don't show raw UA strings
    if (name.includes("Windows NT") || name.includes("AppleWebKit")) {
      return device.platform === "ios" ? "iPhone / iPad" : "Android Phone";
    }
    return name;
  };

  if (mode === "login") {
    return (
      <div className="min-h-screen bg-[#0A0A0F] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-red-600/30">
              <Smartphone size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Find My Device</h1>
            <p className="text-[#666] text-sm">Enter any one field to locate your device</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <Field
              label="Device ID / IMEI"
              value={imei}
              onChange={setImei}
              placeholder="e.g. PR-XXXXX-XXXXX-XXXXX"
              type="text"
              mono
            />
            <div className="flex items-center gap-3 text-[#333] text-xs uppercase tracking-widest">
              <div className="flex-1 h-px bg-white/5" />OR<div className="flex-1 h-px bg-white/5" />
            </div>
            <Field
              label="Email Address"
              value={email}
              onChange={setEmail}
              placeholder="registered@email.com"
              type="email"
            />
            <div className="flex items-center gap-3 text-[#333] text-xs uppercase tracking-widest">
              <div className="flex-1 h-px bg-white/5" />OR<div className="flex-1 h-px bg-white/5" />
            </div>
            <Field
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              placeholder="e.g. 0821234567"
              type="tel"
            />

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-2xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              <Search size={16} />
              {loading ? "Searching..." : "Find My Device"}
            </button>
          </form>

          <p className="text-center text-[#444] text-xs mt-6">
            Your device must be registered with Panic Ring
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-md mx-auto px-4 py-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => { setMode("login"); setDevices([]); setError(""); }}
            className="w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-bold">My Devices</h1>
            <p className="text-[#555] text-xs">{devices.length} device{devices.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-16">
            <Smartphone size={48} className="mx-auto text-[#333] mb-4" />
            <p className="text-[#666]">No devices found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {devices.map((device, i) => {
              const hasLocation = device.last_latitude != null && device.last_longitude != null;
              const timeAgo = formatTime(device.last_location_update);
              const label = getDeviceLabel(device);

              return (
                <div key={device.id || i} className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${hasLocation ? "bg-green-500/15 text-green-400" : "bg-white/5 text-[#555]"}`}>
                        <Smartphone size={18} />
                      </div>
                      <div>
                        <p className="text-white font-semibold text-sm">{label}</p>
                        <p className="text-[#555] text-xs capitalize mt-0.5">
                          {device.platform?.replace("_", " ")} • {device.device_type}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {device.is_lost && (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-0.5 rounded-full font-medium">Lost</span>
                      )}
                      <div className="flex items-center gap-1">
                        {hasLocation
                          ? <Wifi size={12} className="text-green-400" />
                          : <WifiOff size={12} className="text-[#555]" />}
                        <span className={`text-xs ${hasLocation ? "text-green-400" : "text-[#555]"}`}>
                          {hasLocation ? "Tracking" : "Offline"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {device.device_id && (
                    <p className="text-[#444] text-[10px] font-mono mb-3 truncate">ID: {device.device_id}</p>
                  )}

                  {hasLocation ? (
                    <div className="space-y-3">
                      <div className="bg-white/[0.03] rounded-xl p-3 flex items-start gap-2">
                        <MapPin size={14} className="text-red-400 shrink-0 mt-0.5" />
                        <div>
                          {device.last_address && (
                            <p className="text-white text-xs font-medium mb-0.5">{device.last_address}</p>
                          )}
                          <p className="text-[#666] text-[10px] font-mono">
                            {device.last_latitude.toFixed(5)}, {device.last_longitude.toFixed(5)}
                          </p>
                          {device.last_accuracy && (
                            <p className="text-[10px] mt-0.5" style={{color: device.last_accuracy < 20 ? '#4ade80' : device.last_accuracy < 50 ? '#facc15' : '#f87171'}}>
                              ±{Math.round(device.last_accuracy)}m accuracy
                            </p>
                          )}
                          {timeAgo && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Clock size={10} className="text-[#555]" />
                              <span className="text-[#555] text-[10px]">Last seen {timeAgo}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openMap(device)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <MapPin size={14} /> Open in Google Maps
                      </button>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                      <p className="text-amber-400 text-xs font-medium mb-1">📍 Location Not Available</p>
                      <p className="text-[#666] text-xs leading-relaxed">
                        This device is registered but hasn't shared its location. Ask the owner to open Panic Ring and enable location sharing.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type, mono }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4 focus-within:border-red-500/40 transition-colors">
      <label className="text-[10px] uppercase tracking-widest text-[#555] block mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent text-white placeholder-[#333] focus:outline-none text-sm ${mono ? "font-mono" : ""}`}
      />
    </div>
  );
}