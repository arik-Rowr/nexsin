"use client";

import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin } from "lucide-react";
import ChatAgent from "@/components/ui/ChatAgent";

interface ContactModalProps {
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClose} // 🔹 background click closes modal
      className="fixed inset-0 z-[9999] flex flex-col bg-black/60 backdrop-blur-sm"
    >
      {/* 🔷 Contact Full Page Container */}
      <div
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
        className="flex flex-col h-full w-full bg-gradient-to-br from-[#0f172a] to-[#00132A] text-white overflow-y-auto"
      >
        {/* Header (no close button) */}
        <div className="flex items-center justify-center px-6 py-5 bg-[#0f172a]/70 border-b border-white/10 backdrop-blur-md shadow-lg">
          <h2 className="text-2xl font-semibold text-blue-400 tracking-wide">
            Contact Us
          </h2>
        </div>

        {/* 🔹 Main Content */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-8 p-6 md:p-12">
          {/* Left Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center bg-[#0E1F47]/70 backdrop-blur-md rounded-2xl p-8 border border-blue-900/40 shadow-inner"
          >
            <h3 className="text-3xl font-semibold mb-4 text-blue-400">
              Get in Touch
            </h3>
            <p className="text-gray-300 mb-8 leading-relaxed">
              We d love to hear from you! Fill out the form or reach us through
              the contact details below.
            </p>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <MapPin className="text-blue-400" size={22} />
                <span>Your Company Address, City, Country</span>
              </div>

              <div className="flex items-center gap-4">
                <Mail className="text-blue-400" size={22} />
                <span>info@example.com</span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="text-blue-400" size={22} />
                <span>+91 90000 12345</span>
              </div>
            </div>
          </motion.div>

          {/* Right Section - Contact Form */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col justify-center bg-[#0C1B38]/80 backdrop-blur-md rounded-2xl p-8 border border-blue-900/40 shadow-inner"
          >
            <h3 className="text-3xl font-semibold mb-6 text-blue-400">
              Contact Form
            </h3>
            <form className="space-y-5">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Name</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  className="w-full bg-[#091530] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="your_email@example.com"
                  className="w-full bg-[#091530] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">Message</label>
                <textarea
                  rows={5}
                  placeholder="Enter your message"
                  className="w-full bg-[#091530] border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300 shadow-md"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* 🔸 Floating Chat Agent */}
        <div className="absolute bottom-6 right-6">
          <ChatAgent />
        </div>
      </div>
    </motion.div>
  );
};

export default ContactModal;
