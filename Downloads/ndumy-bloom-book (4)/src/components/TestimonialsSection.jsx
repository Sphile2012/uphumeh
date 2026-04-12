import { motion } from "framer-motion";
import { Star, MapPin, Clock, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function TestimonialsSection() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">Why Choose Us</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            The Bloom Skills &amp; Beauty Experience
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Star, title: "Professional Quality", desc: "Top-notch nail art and lash services by skilled technicians" },
            { icon: Clock, title: "Open 24 Hours", desc: "We're always here for you, any time of day or night" },
            { icon: MapPin, title: "Sangro House", desc: "Conveniently located in Durban, easy to find and access" },
            { icon: Phone, title: "Easy Booking", desc: "Book online or WhatsApp us directly for appointments" },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6"
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-primary rounded-3xl p-10 sm:p-14 text-center text-primary-foreground"
        >
          <h3 className="font-heading text-2xl sm:text-3xl font-bold mb-4">Ready to Bloom?</h3>
          <p className="opacity-90 mb-8 max-w-md mx-auto">
            Book your appointment today or enrol in our beginner nail course and start your beauty journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/book">
              <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary font-semibold">
                Book Now
              </Button>
            </Link>
            <a href="https://wa.me/27798060310?text=Hi%20Bloom%20Skills%20%26%20Beauty!%20I'd%20like%20to%20enquire." target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="rounded-full px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                WhatsApp Us
              </Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}