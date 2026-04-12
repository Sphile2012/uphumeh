import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Bluetooth, Shield, Bell, MapPin, Phone, Zap, Crown, LogOut, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import SubscriptionPanel from "@/components/settings/SubscriptionPanel";
import DevicePanel from "@/components/settings/DevicePanel";
import DeviceInfoPanel from "@/components/settings/DeviceInfoPanel";

export default function Settings() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me(),
    staleTime: 300000,
  });

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['safetyProfile', user?.email],
    queryFn: () => base44.entities.SafetyProfile.filter({ owner_email: user.email }),
    enabled: !!user?.email,
    staleTime: 30000,
  });

  const rawProfile = profileData?.[0];
  const profileId = rawProfile?.id;
  const defaultProfile = {
    custom_alert_message: 'I need help! Please contact me immediately.',
    auto_call_911: false, device_connected: false, device_name: '',
    subscription_plan: 'basic', location_sharing: true, safe_zones_alerts: true, crime_alerts: false,
  };
  const [localProfile, setLocalProfile] = useState(null);
  const setProfile = setLocalProfile;
  const profile = localProfile ?? rawProfile ?? defaultProfile;

  const [savedKey, setSavedKey] = useState(null);

  const { mutate: save, isPending: saving } = useMutation({
    mutationFn: async (updates) => {
      const merged = { ...profile, ...updates };
      setLocalProfile(merged);
      if (profileId) {
        await base44.entities.SafetyProfile.update(profileId, updates);
      } else {
        await base44.entities.SafetyProfile.create({ ...merged, owner_email: user.email });
      }
      return Object.keys(updates)[0];
    },
    onSuccess: (key) => {
      queryClient.invalidateQueries({ queryKey: ['safetyProfile', user?.email] });
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 1800);
    },
  });

  const toggle = (key) => save({ [key]: !profile[key] });


  if (isLoading || !user) return <div className="min-h-screen bg-[#0A0A0F]" />;

  const Toggle = ({ label, desc, field, icon: Icon, iconColor }) => (
    <div className="flex items-center justify-between py-4 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${iconColor}`}>
          <Icon size={16} className="opacity-80" />
        </div>
        <div>
          <p className="text-white text-sm font-medium">{label}</p>
          <p className="text-[#555] text-xs">{desc}</p>
        </div>
      </div>
      <button onClick={() => toggle(field)} className={`w-11 h-6 rounded-full transition-colors relative ${profile[field] ? "bg-red-600" : "bg-white/10"}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${profile[field] ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <div className="max-w-md mx-auto px-4 pt-6 pb-24">
        {/* User Profile Header */}
        <div className="flex items-center gap-4 mb-8 bg-white/[0.03] border border-white/[0.07] rounded-3xl p-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-900/80 to-red-600/40 border border-red-500/20 flex items-center justify-center text-xl font-bold">
            {user?.full_name?.charAt(0) || "U"}
          </div>
          <div className="flex-1">
            <p className="text-white font-bold">{user?.full_name}</p>
            <p className="text-[#666] text-sm">{user?.email}</p>
            <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-xs font-medium
              ${profile.subscription_plan === 'premium' ? 'bg-amber-500/15 text-amber-400' : 'bg-white/5 text-[#666]'}`}>
              <Crown size={10} />
              {profile.subscription_plan.charAt(0).toUpperCase() + profile.subscription_plan.slice(1)} Plan
            </div>
          </div>
        </div>

        <DevicePanel profile={profile} onSave={save} />

        <DeviceInfoPanel profile={profile} onSave={save} />

        {/* Safety Settings */}
        <div className="mb-6">
          <h2 className="text-[#666] text-xs uppercase tracking-widest mb-4">Safety Settings</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4">
            <Toggle label="Location Sharing" desc="Share GPS during emergencies" field="location_sharing" icon={MapPin} iconColor="bg-blue-500/15 text-blue-400" />
            <Toggle label="Auto-call 911" desc="Automatically call when SOS triggered" field="auto_call_911" icon={Phone} iconColor="bg-red-500/15 text-red-400" />
            <Toggle label="Safe Zone Alerts" desc="Notify when near safe zones" field="safe_zones_alerts" icon={Shield} iconColor="bg-emerald-500/15 text-emerald-400" />
            <Toggle label="Crime Alerts" desc="Area crime & safety notifications" field="crime_alerts" icon={Bell} iconColor="bg-amber-500/15 text-amber-400" />
          </div>
        </div>

        {/* Phone Number */}
        <div className="mb-6">
          <h2 className="text-[#666] text-xs uppercase tracking-widest mb-4">Your Phone Number</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <p className="text-[#555] text-xs mb-2">Used so others can find your device via "Find My Phone"</p>
            <input
              type="tel"
              value={profile.owner_phone || ""}
              onChange={e => setLocalProfile(p => ({ ...(p ?? rawProfile ?? defaultProfile), owner_phone: e.target.value }))}
              onBlur={() => save({ owner_phone: profile.owner_phone })}
              className="w-full bg-transparent text-white text-sm focus:outline-none placeholder-[#444]"
              placeholder="e.g. 0821234567"
            />
          </div>
        </div>

        {/* Alert Message */}
        <div className="mb-6">
          <h2 className="text-[#666] text-xs uppercase tracking-widest mb-4">Custom Alert Message</h2>
          <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-4">
            <textarea
              value={profile.custom_alert_message}
              onChange={e => setLocalProfile(p => ({ ...(p ?? rawProfile ?? defaultProfile), custom_alert_message: e.target.value }))}
              onBlur={() => save({ custom_alert_message: profile.custom_alert_message })}
              className="w-full bg-transparent text-white text-sm resize-none focus:outline-none"
              rows={3}
              placeholder="Your emergency message..."
            />
          </div>
        </div>

        <SubscriptionPanel plan={profile.subscription_plan} onUpgrade={(plan) => save({ subscription_plan: plan })} />

        {/* Logout */}
        <button
          onClick={() => base44.auth.logout()}
          className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-white/5 text-[#888] hover:bg-white/10 hover:text-white transition-colors text-sm"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </div>
  );
}