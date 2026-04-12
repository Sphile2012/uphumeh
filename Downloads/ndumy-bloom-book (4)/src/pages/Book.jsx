import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Loader2, ChevronRight, ChevronLeft, CheckCircle2, User, Sparkles, Clock, ClipboardCheck } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { allServices, timeSlots } from "../lib/serviceData";

const STEPS = [
  { id: 1, label: "Your Details", icon: User },
  { id: 2, label: "Service", icon: Sparkles },
  { id: 3, label: "Date & Time", icon: Clock },
  { id: 4, label: "Confirm", icon: ClipboardCheck },
];

const urlParams = new URLSearchParams(window.location.search);
const preselectedService = urlParams.get("service");

const initialForm = {
  client_name: "",
  client_phone: "",
  client_email: "",
  service_category: preselectedService === "course" ? "Beginner Nail Course" : "",
  service_detail: preselectedService === "course" ? "2-Week Beginner Course" : "",
  price: preselectedService === "course" ? 2500 : 0,
  preferred_time: "",
  notes: "",
};

export default function Book() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const fetchBookedSlots = async (selectedDate) => {
    if (!selectedDate) return;
    setLoadingSlots(true);
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    const bookings = await base44.entities.Booking.filter({ preferred_date: dateStr });
    setBookedSlots(bookings.filter(b => b.status !== "cancelled").map(b => b.preferred_time));
    setLoadingSlots(false);
  };

  const handleDateSelect = (d) => {
    setDate(d);
    setForm(prev => ({ ...prev, preferred_time: "" }));
    fetchBookedSlots(d);
  };

  const categories = Object.keys(allServices);
  const serviceOptions = form.service_category ? allServices[form.service_category] || [] : [];

  const handleCategorySelect = (cat) => {
    setForm({ ...form, service_category: cat, service_detail: "", price: 0 });
  };

  const handleServiceSelect = (s) => {
    setForm({ ...form, service_detail: s.name, price: s.price });
  };

  const handleTimeSelect = (t) => {
    setForm({ ...form, preferred_time: t });
  };

  const step1Valid = form.client_name && form.client_phone;
  const step2Valid = form.service_category && form.service_detail;
  const step3Valid = date && form.preferred_time;

  const handleSubmit = async () => {
    setLoading(true);
    const bookingData = {
      ...form,
      preferred_date: date ? format(date, "yyyy-MM-dd") : "",
      status: "pending",
    };
    await base44.entities.Booking.create(bookingData);
    navigate("/booking-confirmed", { state: { booking: bookingData } });
  };

  const slideVariants = {
    enter: (dir) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-2">Reserve Your Spot</p>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Book an Appointment
          </h1>
          <p className="text-muted-foreground text-sm mt-2">At <span className="italic font-semibold text-foreground">Bloom</span> Skills &amp; Beauty · Sangro House, Durban</p>
          <div className="mt-3 inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-semibold px-4 py-2 rounded-full">
            💳 R100 non-refundable booking deposit required to secure your slot
          </div>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            {/* connecting line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-border z-0" />
            <div
              className="absolute top-5 left-5 h-0.5 bg-primary z-0 transition-all duration-500"
              style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, maxWidth: "calc(100% - 40px)" }}
            />
            {STEPS.map((s) => {
              const Icon = s.icon;
              const done = step > s.id;
              const active = step === s.id;
              return (
                <div key={s.id} className="flex flex-col items-center gap-2 z-10">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done ? "bg-primary border-primary text-primary-foreground" : active ? "bg-background border-primary text-primary shadow-lg shadow-primary/20" : "bg-background border-border text-muted-foreground"}`}>
                    {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-medium hidden sm:block transition-colors ${active ? "text-primary" : done ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Card */}
        <div className="bg-card rounded-3xl border border-border/50 shadow-xl shadow-primary/5 overflow-hidden">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="p-6 sm:p-10"
            >

              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" /> Your Details
                    </h2>
                    <p className="text-sm text-muted-foreground">Tell us a little about yourself.</p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g. Naledi Dlamini"
                        value={form.client_name}
                        onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">WhatsApp / Phone Number *</Label>
                      <Input
                        id="phone"
                        placeholder="e.g. 079 806 0310"
                        value={form.client_phone}
                        onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={form.client_email}
                        onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                        className="mt-1.5 rounded-xl h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Special Requests <span className="text-muted-foreground font-normal">(optional)</span></Label>
                      <Textarea
                        placeholder="Any special requests or preferences..."
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="mt-1.5 rounded-xl"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Service Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" /> Choose Your Service
                    </h2>
                    <p className="text-sm text-muted-foreground">Select a category, then your specific service.</p>
                  </div>

                  {/* Category Tiles */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Category *</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {categories.map((cat) => {
                        const emoji = cat.toLowerCase().includes("lash") ? "🪭" : cat.toLowerCase().includes("course") ? "🎓" : "💅";
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => handleCategorySelect(cat)}
                            className={`p-3 rounded-2xl border-2 text-left transition-all text-sm font-medium ${form.service_category === cat ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"}`}
                          >
                            <span className="text-xl block mb-1">{emoji}</span>
                            {cat}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Service Options */}
                  {form.service_category && serviceOptions.length > 0 && (
                    <div>
                      <Label className="text-sm font-medium mb-3 block">Specific Service *</Label>
                      <div className="space-y-2">
                        {serviceOptions.map((s) => (
                          <button
                            key={s.name}
                            type="button"
                            onClick={() => handleServiceSelect(s)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${form.service_detail === s.name ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}
                          >
                            <span className={form.service_detail === s.name ? "text-primary font-semibold" : "text-foreground"}>{s.name}</span>
                            <span className={`font-bold ${form.service_detail === s.name ? "text-primary" : "text-muted-foreground"}`}>R{s.price}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price Summary */}
                  {form.price > 0 && (
                    <div className="bg-primary/5 border border-primary/15 rounded-2xl p-5 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Selected Price</p>
                      <p className="font-heading text-4xl font-black text-primary">R{form.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">{form.service_detail}</p>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Date & Time */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary" /> Pick a Date &amp; Time
                    </h2>
                    <p className="text-sm text-muted-foreground">Choose your preferred appointment slot.</p>
                  </div>

                  {/* Inline Calendar */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Date *</Label>
                    <div className="flex justify-center border border-border rounded-2xl overflow-hidden">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        disabled={(d) => d < new Date()}
                        className="w-full"
                      />
                    </div>
                    {date && (
                      <p className="text-center text-sm font-medium text-primary mt-2">
                        📅 {format(date, "EEEE, d MMMM yyyy")}
                      </p>
                    )}
                  </div>

                  {/* Time Grid */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">Time *</Label>
                    {!date ? (
                      <p className="text-sm text-muted-foreground py-3">👆 Please select a date first</p>
                    ) : loadingSlots ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="w-4 h-4 animate-spin" /> Checking availability...
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {timeSlots.map((t) => {
                          const isBooked = bookedSlots.includes(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => !isBooked && handleTimeSelect(t)}
                              disabled={isBooked}
                              title={isBooked ? "Already booked" : ""}
                              className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                                isBooked
                                  ? "border-border bg-muted text-muted-foreground line-through cursor-not-allowed opacity-50"
                                  : form.preferred_time === t
                                  ? "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                  : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirm */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-heading text-xl font-bold text-foreground mb-1 flex items-center gap-2">
                      <ClipboardCheck className="w-5 h-5 text-primary" /> Review &amp; Confirm
                    </h2>
                    <p className="text-sm text-muted-foreground">Please confirm your booking details below.</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: "Name", value: form.client_name, emoji: "👤" },
                      { label: "Phone", value: form.client_phone, emoji: "📱" },
                      { label: "Email", value: form.client_email || "Not provided", emoji: "📧" },
                      { label: "Service", value: form.service_detail, emoji: "💅" },
                      { label: "Category", value: form.service_category, emoji: "🗂️" },
                      { label: "Date", value: date ? format(date, "EEEE, d MMMM yyyy") : "—", emoji: "📅" },
                      { label: "Time", value: form.preferred_time, emoji: "⏰" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-start gap-3 py-3 border-b border-border/40 last:border-0">
                        <span className="text-xl shrink-0">{row.emoji}</span>
                        <div className="flex-1 flex items-center justify-between gap-2">
                          <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{row.label}</span>
                          <span className="text-sm font-semibold text-foreground text-right">{row.value}</span>
                        </div>
                      </div>
                    ))}

                    {/* Price highlight */}
                    {form.price > 0 && (
                      <div className="mt-2 bg-primary/5 border border-primary/15 rounded-2xl p-5 flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">Total Price</p>
                          {form.service_category === "Beginner Nail Course" && (
                            <p className="text-xs text-muted-foreground mt-0.5">Registration: R500 (non-refundable)</p>
                          )}
                          {form.price > 0 && (
                            <p className="text-xs text-amber-600 font-medium mt-0.5">Booking fee to secure: R100</p>
                          )}
                        </div>
                        <p className="font-heading text-3xl font-black text-primary">R{form.price}</p>
                      </div>
                    )}

                    {form.notes && (
                      <div className="bg-secondary/50 rounded-xl p-4 text-sm text-muted-foreground italic">
                        💬 "{form.notes}"
                      </div>
                    )}
                  </div>
                </div>
              )}

            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="px-6 sm:px-10 pb-8 flex items-center justify-between gap-4">
            {step > 1 ? (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="rounded-xl px-5">
                <ChevronLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            ) : <div />}

            {step < 4 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={(step === 1 && !step1Valid) || (step === 2 && !step2Valid) || (step === 3 && !step3Valid)}
                className="rounded-xl px-6 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                size="lg"
                className="rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground ml-auto shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Booking...</>
                ) : (
                  <><CheckCircle2 className="w-4 h-4 mr-2" /> Confirm Booking</>
                )}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-6">
          We'll confirm your appointment via WhatsApp shortly after booking 💬
        </p>
      </div>
    </div>
  );
}