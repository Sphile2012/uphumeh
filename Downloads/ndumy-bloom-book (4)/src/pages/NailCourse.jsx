// @ts-nocheck
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, BookOpen, Clock, Award, Users } from "lucide-react";
import { motion } from "framer-motion";

const flyerImage = "https://media.base44.com/images/public/69c85189646ba632d738f811/9b9ef6b7c_image.png";"https://media.base44.com/images/public/69c85189646ba632d738f811/9ae24d428_WhatsAppImage2026-03-28at2311451.jpg";"https://media.base44.com/images/public/69c85189646ba632d738f811/235c4c9e0_WhatsAppImage2026-03-29at0049121.jpeg";

const nailPhotos = [
  "https://media.base44.com/images/public/69c85189646ba632d738f811/3c4247ab4_WhatsAppImage2026-03-29at1611562.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/3c4247ab4_WhatsAppImage2026-03-29at1611562.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/3c4247ab4_WhatsAppImage2026-03-29at1611562.jpg",
  "https://media.base44.com/images/public/69c85189646ba632d738f811/3c4247ab4_WhatsAppImage2026-03-29at1611562.jpg",
  "https://media.base44.com/images/public/user_6971b3bc769db4b08518a023/17c8c847e_WhatsAppImage2026-03-28at231145.jpg",
  "https://media.base44.com/images/public/user_6971b3bc769db4b08518a023/9a5636b78_WhatsAppImage2026-03-28at2311451.jpg",
];"https://media.base44.com/images/public/69c85189646ba632d738f811/fd334f126_WhatsAppImage2026-03-29at0049121.jpeg";

const curriculum = [
  { text: "Nail shaping & prepping", emoji: "✂️" },
  { text: "Acrylic application", emoji: "💅" },
  { text: "Nail prepping and fitting", emoji: "🔧" },
  { text: "Health and safety precautions", emoji: "🛡️" },
  { text: "Various nail art incl. ombre", emoji: "🎨" },
  { text: "Marbling techniques", emoji: "🌊" },
  { text: "Classic French cut out", emoji: "🤍" },
  { text: "3D Art", emoji: "⭐" },
];

const benefits = [
  { text: "Attendance Certificate", emoji: "🎓" },
  { text: "2 Months Mentorship", emoji: "🤝" },
  { text: "Training Kit", emoji: "🧰" },
  { text: "Practical Hands-On Experience", emoji: "💅" },
  { text: "Business Guidance Tips", emoji: "💼" },
];

export default function NailCourse() {
  return (
    <div className="py-12 sm:py-20">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-primary text-sm font-medium uppercase tracking-widest mb-3">Start Your Journey</p>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-foreground mb-2 flex items-center justify-center gap-3 flex-wrap">
            <span>💅</span> Beginner Nail Course <span>🎓</span>
          </h1>
          <p className="font-heading italic text-primary text-lg mb-4">Bloom Skills & Beauty</p>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Learn essential nail techniques from scratch and bloom into your beauty career. From zero to professional in just 2 weeks!
          </p>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero: Flyer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden mb-16 shadow-2xl shadow-primary/15 max-w-lg mx-auto"
        >
          <img src="https://media.base44.com/images/public/69c85189646ba632d738f811/3c4247ab4_WhatsAppImage2026-03-29at1611562.jpg" alt="Nail Art" className="w-full object-cover object-top" style={{height: '520px'}} />
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {[
            { icon: Clock, label: "Duration", value: "2 Weeks", emoji: "⏰" },
            { icon: BookOpen, label: "Course Fee", value: "R2,500", emoji: "💰" },
            { icon: Award, label: "Certificate", value: "Included", emoji: "🎓" },
            { icon: Users, label: "Mentorship", value: "2 Months", emoji: "🤝" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-5 sm:p-6 text-center hover:border-primary/30 hover:shadow-md transition-all"
            >
              <span className="text-3xl block mb-2">{stat.emoji}</span>
              <p className="font-heading text-lg sm:text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Curriculum & Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-card rounded-3xl border border-border/50 p-8 shadow-sm"
          >
            <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              💅 What You'll Learn
            </h3>
            <ul className="space-y-4">
              {curriculum.map((item) => (
                <li key={item.text} className="flex items-center gap-3">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl overflow-hidden"
            style={{ background: "linear-gradient(135deg, #fdf6f7, #fef9f0)", border: "1px solid rgba(192,96,112,0.15)" }}
          >
            <div className="p-8">
              <h3 className="font-heading text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                🎁 What You'll Get
              </h3>
              <ul className="space-y-4">
                {benefits.map((item) => (
                  <li key={item.text} className="flex items-center gap-3">
                    <span className="text-xl shrink-0">{item.emoji}</span>
                    <span className="text-sm font-medium text-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-primary/10">
                <p className="text-xs text-muted-foreground mb-1">Total Course Investment</p>
                <p className="font-heading text-4xl font-black text-primary">R2,500</p>
                <p className="text-xs text-muted-foreground mt-2">Registration: R500 (non-refundable, part of total)</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl text-center p-10 sm:p-14 text-primary-foreground"
          style={{ background: "linear-gradient(135deg, #c06070 0%, #e8a0a8 100%)" }}
        >
          <span className="text-5xl block mb-4">💅🎓</span>
          <h3 className="font-heading text-2xl sm:text-3xl font-black mb-3 italic">
            Ready to Bloom?
          </h3>
          <p className="opacity-90 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
            Join the Bloom Skills & Beauty family and turn your passion for nails into a thriving career.
          </p>
          <Link to="/book?service=course">
            <Button size="lg" variant="secondary" className="rounded-full px-10 py-6 text-base text-primary font-bold shadow-lg">
              Enrol Now 🌸
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}