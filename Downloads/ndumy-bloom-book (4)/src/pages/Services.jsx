import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const nailServices = {
  title: "Nail Services",
  emoji: "💅",
  categories: [
    {
      name: "Acrylic Plain Nails",
      items: [
        { service: "Short", price: 150 },
        { service: "Medium", price: 170 },
        { service: "Long", price: 200 },
      ],
    },
    {
      name: "Frenchies",
      items: [
        { service: "Short", price: 200 },
        { service: "Medium", price: 230 },
        { service: "Long", price: 270 },
      ],
    },
    {
      name: "Nail Combos",
      items: [
        { service: "Plain Hands & Toes", price: 280 },
        { service: "French Hands & Toes", price: 350 },
      ],
    },
    {
      name: "Gel Nails",
      items: [
        { service: "Plain Rubberbase Gel", price: 150 },
        { service: "Plain GelX", price: 180 },
        { service: "Gel Overlay", price: 120 },
        { service: "Toes", price: 100 },
      ],
    },
    {
      name: "Design Add-ons ✨",
      items: [
        { service: "3D Lines", price: 5 },
        { service: "3D Flowers", price: 20 },
        { service: "Chrome Frenchies", price: 50 },
        { service: "Aura Effect", price: 5 },
        { service: "Ombre", price: 20 },
        { service: "Charms", price: 5 },
        { service: "Glitter", price: 5 },
      ],
    },
  ],
};

const lashServices = {
  title: "Lash Services",
  emoji: "🪭",
  categories: [
    {
      name: "Cluster Lashes",
      items: [
        { service: "Classic", price: 180 },
        { service: "Hybrid", price: 220 },
      ],
    },
    {
      name: "Individual Lashes",
      items: [
        { service: "Classic", price: 300 },
        { service: "Hybrid", price: 350 },
      ],
    },
    {
      name: "Lash Combos 💅🪭",
      items: [
        { service: "Plain Hands + Cluster Lashes", price: 320 },
        { service: "Frenchies + Cluster Lashes", price: 370 },
        { service: "Plain Hands & Toes + Cluster Lashes", price: 450 },
        { service: "French Hands & Toes + Cluster Lashes", price: 520 },
        { service: "Plain Hands + Individuals", price: 420 },
        { service: "Frenchies + Individuals", price: 450 },
        { service: "Plain Hands & Toes + Individuals", price: 550 },
        { service: "French Hands & Toes + Individuals", price: 650 },
      ],
    },
  ],
};

function PriceCategory({ category, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="mb-8 last:mb-0"
    >
      <h3 className="font-heading text-base font-semibold text-foreground mb-4 pb-2 border-b-2 border-primary/20 flex items-center gap-2">
        {category.name}
      </h3>
      <div className="space-y-3">
        {category.items.map((item) => (
          <div key={item.service} className="flex items-center justify-between group py-1">
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              {item.service}
            </span>
            <div className="flex-1 mx-4 border-b border-dotted border-border/60" />
            <span className="text-sm font-bold text-primary">R{item.price}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function ServiceColumn({ data, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-2xl shadow-sm">
          {data.emoji}
        </div>
        <h2 className="font-heading text-2xl font-bold text-foreground">{data.title}</h2>
      </div>
      <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-sm hover:shadow-md transition-shadow">
        {data.categories.map((cat, i) => (
          <PriceCategory key={cat.name} category={cat} delay={i * 0.06} />
        ))}
      </div>
    </motion.div>
  );
}

const nailPhotos = [
  "https://media.base44.com/images/public/69c85189646ba632d738f811/c8cd671aa_WhatsAppImage2026-03-29at1611561.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/c741426a1_WhatsAppImage2026-03-29at1611562.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/cd7960eea_WhatsAppImage2026-03-29at161156.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/152b9b063_WhatsAppImage2026-03-29at161157.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/a6b27b1a3_WhatsAppImage2026-03-29at1611581.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/185661d16_WhatsAppImage2026-03-29at161158.jpg",
];

export default function Services() {
  return (
    <div className="py-12 sm:py-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">Our Menu</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-2">
            Services & Prices
          </h1>
          <p className="font-heading italic text-primary text-lg mb-4">Bloom Skills & Beauty</p>
          <p className="text-muted-foreground max-w-md mx-auto text-sm">
            Professional nail art and lash services at Sangro House, Durban. Quality you can trust 💅🪭
          </p>
        </motion.div>
      </div>

      {/* Photo Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-16">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
          {nailPhotos.map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden aspect-square">
              <img src={src} alt={`Nail work ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Price Lists */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <ServiceColumn data={nailServices} delay={0} />
          <ServiceColumn data={lashServices} delay={0.1} />
        </div>

        {/* Payment Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #fdf6f7, #fef9f0)" }}
        >
          <div className="p-8 sm:p-12 text-center border border-primary/10 rounded-3xl">
            <span className="text-4xl mb-4 block">💳</span>
            <h3 className="font-heading text-2xl font-bold text-foreground mb-2">Payment Details</h3>
            <p className="text-muted-foreground text-sm mb-6">Direct Deposit — Immediate Payment Required</p>
            <div className="inline-flex flex-col items-center bg-white rounded-2xl p-6 border border-border/50 shadow-sm">
              <p className="text-sm text-muted-foreground uppercase tracking-widest font-medium mb-1">FNB Account</p>
              <p className="font-heading text-3xl font-black text-primary tracking-widest">631 935 53469</p>
              <p className="text-xs text-muted-foreground mt-2">Use your name as reference</p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm mb-6 italic">Ready to glow? Book your appointment today ✨</p>
          <Link to="/book">
            <Button size="lg" className="rounded-full px-12 py-6 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
              Book Your Service 💅
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}