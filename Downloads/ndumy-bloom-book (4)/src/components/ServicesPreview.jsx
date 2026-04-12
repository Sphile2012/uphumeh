import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const services = [
  {
    title: "Nail Services",
    description: "Acrylic, gel, French tips, overlays & stunning designs — from classic to bold.",
    icon: "💅",
    from: "R150",
    image: "https://media.base44.com/images/public/69c85189646ba632d738f811/c8cd671aa_WhatsAppImage2026-03-29at1611561.jpg",
    link: "/services",
  },
  {
    title: "Lash Services",
    description: "Cluster lashes, individual lashes & combos for gorgeous, fluttery, dramatic eyes.",
    icon: "🪭",
    from: "R180",
    image: "https://media.base44.com/images/public/69c85189646ba632d738f811/0e807ad9d_WhatsAppImage2026-03-29at012931.jpeg",
    link: "/services",
  },
  {
    title: "Nail Course",
    description: "2-week beginner course with certificate, mentorship & training kit included.",
    icon: "💅🎓",
    from: "R2500",
    image: "https://media.base44.com/images/public/69c85189646ba632d738f811/6c4856f9a_WhatsAppImage2026-03-29at161158.jpg",
    link: "/nail-course",
  },
];

export default function ServicesPreview() {
  return (
    <section className="py-24 px-4 sm:px-6 bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Our Services
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-card rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group overflow-hidden"
            >
              {/* Service Image */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center gap-1">
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">From {service.from}</span>
                  <Link to={service.link} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 group-hover:gap-2 transition-all">
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/book">
            <Button size="lg" className="rounded-full px-10 bg-primary hover:bg-primary/90 text-primary-foreground">
              Book Your Appointment
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}