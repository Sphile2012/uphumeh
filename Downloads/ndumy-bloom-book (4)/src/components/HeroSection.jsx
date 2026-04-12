import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection({ heroImage }) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful nail art by Bloom Skills &amp; Beauty"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-background/30" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Sangro House, Durban
          </div>

          <h1 className="font-heading leading-tight mb-6">
            <span className="block text-5xl sm:text-6xl lg:text-7xl font-black text-primary tracking-tight">Bloom</span>
            <span className="block text-sm sm:text-base font-body font-light tracking-[0.35em] text-muted-foreground uppercase mt-2">Skills &amp; Beauty</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
            Step into a top-notch salon experience where beauty meets skill. Professional nails, stunning lashes & beginner nail courses.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/book">
              <Button size="lg" className="rounded-full px-8 text-base bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                Book Appointment
              </Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="rounded-full px-8 text-base border-foreground/20 hover:bg-foreground/5">
                View Services
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-12 pt-8 border-t border-border/50">
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">8am–4pm</p>
              <p className="text-xs text-muted-foreground">Daily Hours</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">R150+</p>
              <p className="text-xs text-muted-foreground">Starting Price</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div>
              <p className="font-heading text-2xl font-bold text-foreground">R2500</p>
              <p className="text-xs text-muted-foreground">Nail Course</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}