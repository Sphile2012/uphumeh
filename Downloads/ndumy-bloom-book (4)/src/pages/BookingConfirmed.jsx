// @ts-nocheck
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle, MessageCircle, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function BookingConfirmed() {
  const location = useLocation();
  const booking = location.state?.booking;

  const whatsappMsg = `Hi Bloom Skills & Beauty! I've just booked online. 🌸\n\nName: ${booking?.client_name || ''}\nService: ${booking?.service_detail || ''}\nDate: ${booking?.preferred_date || ''}\nTime: ${booking?.preferred_time || ''}\nAmount: R${booking?.price || ''}\n\nPlease find my proof of payment attached. 💳`;
  const whatsappUrl = `https://wa.me/27798060310?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <div className="py-20 px-4 sm:px-6 min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <div className="bg-card rounded-3xl border border-border/50 p-8 sm:p-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Booking Received! 🌸
          </h1>

          <p className="text-muted-foreground mb-6">
            Thank you{booking?.client_name ? `, ${booking.client_name.split(" ")[0]}` : ""}! Your booking has been submitted successfully. We'll confirm your appointment shortly.
          </p>

          {booking && (
            <div className="bg-secondary/50 rounded-xl p-5 text-left text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service:</span>
                <span className="font-medium text-foreground">{booking.service_detail}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date:</span>
                <span className="font-medium text-foreground">{booking.preferred_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time:</span>
                <span className="font-medium text-foreground">{booking.preferred_time}</span>
              </div>
              {booking.price > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-semibold text-primary">R{booking.price}</span>
                </div>
              )}
            </div>
          )}

          {booking?.price > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-2">
              <p className="font-semibold mb-1">💳 Payment Required</p>
              <p className="mb-2">To secure your booking, please deposit <strong>R100</strong> to FNB account <strong>631 935 53469</strong> using your name as reference, then send your slip via WhatsApp below.</p>
              <p className="text-xs text-amber-700">The R100 booking fee forms part of your total of R{booking.price}.</p>
            </div>
          )}

          <div className="space-y-3">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button className="w-full rounded-xl bg-green-500 hover:bg-green-600 text-white">
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Proof of Payment 💳
              </Button>
            </a>

            <Link to="/">
              <Button variant="outline" className="w-full rounded-xl">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}