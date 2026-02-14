"use client";

import React, { useRef } from "react";
import CardNav, { CardNavItem } from "@/components/CardNav";
import UploadAvatars from "@/components/ui/UploadAvatars";
import { Hero } from "@/components/Hero";
import { ServicesGrid } from "@/components/ServicesGrid";
import { FinalCTA } from "@/components/finalCTA";

/* FOOTER ICONS */
import {
  Wrench,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

/* ---------------- NAV ITEMS ---------------- */
const items: CardNavItem[] = [
  {
    label: "About",
    bgColor: "#0D0716",
    textColor: "#fff",
    links: [
      { label: "Company", href: "/information/about", ariaLabel: "About Company" },
      { label: "Careers", href: "/information/careers", ariaLabel: "Careers" },
    ],
  },
  {
    label: "Projects",
    bgColor: "#170D27",
    textColor: "#fff",
    links: [
      { label: "Featured", href: "/features", ariaLabel: "Featured Projects" },
      { label: "Case Studies", href: "/projects", ariaLabel: "Case Studies" },
    ],
  },
  {
    label: "Contact",
    bgColor: "#271E37",
    textColor: "#fff",
    links: [
      { label: "Email", href: "/email", ariaLabel: "Email" },
      { label: "Twitter", href: "/twitter", ariaLabel: "Twitter" },
      { label: "LinkedIn", href: "/linkedin", ariaLabel: "LinkedIn" },
    ],
  },
];

export default function HomePage() {
  const [avatarSrc, setAvatarSrc] = React.useState("/defaultcharacter.png");
  const [searchQuery, setSearchQuery] = React.useState("");

  // 🔥 ref for scrolling
  const servicesRef = useRef<HTMLDivElement>(null);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "radial-gradient(circle at top, #1E293B 0%, #0A0D17 60%)",
      }}
    >
      {/* NAVBAR */}
      <CardNav
        items={items}
        baseColor="rgba(235, 222, 222, 0.05)"
        menuColor="#0e0c0c"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        showSearch
        onSearch={(query) => setSearchQuery(query)}
        UploadAvatarComponent={
          <UploadAvatars avatarSrc={avatarSrc} setAvatarSrc={setAvatarSrc} />
        }
      />

     

      {/* SERVICES (SCROLL TARGET) */}
      <div ref={servicesRef}>
        <ServicesGrid />
      </div>


      {/* FOOTER (NO EXTRA GAP) */}
      <footer className="bg-[#0f172a] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="h-7 w-7 text-indigo-400" />
                <span className="text-2xl font-bold">Nexcyn</span>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Your trusted partner for all home repair and maintenance services.
              </p>
              <div className="flex gap-4">
                <Facebook className="h-5 w-5 text-slate-400 hover:text-white" />
                <Twitter className="h-5 w-5 text-slate-400 hover:text-white" />
                <Instagram className="h-5 w-5 text-slate-400 hover:text-white" />
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>Plumbing</li>
                <li>Electrical</li>
                <li>AC Repair</li>
                <li>Carpentry</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-slate-300 text-sm">
                <li>About Us</li>
                <li>Careers</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-3 text-slate-300 text-sm">
                <div className="flex items-center gap-2">
                  <Phone size={14} /> +91 XXX-XXX-XXXX
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} /> support@nexsyn.com
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={14} /> Madhya Pradesh, India
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-6 text-center text-slate-400 text-sm">
            © 2024 FixMate. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
