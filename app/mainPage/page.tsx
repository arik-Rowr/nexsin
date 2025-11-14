/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import CardNav, { CardNavItem } from "@/components/CardNav";

 const items: CardNavItem[] = [
    {
      label: "About",
      bgColor: "#0D0716",
      textColor: "#fff",
      links: [
        { label: "Company", href: "/about", ariaLabel: "About Company" },
        { label: "Careers", href: "/careers", ariaLabel: "About Careers" },
      ],
    },
    {
      label: "Projects",
      bgColor: "#170D27",
      textColor: "#fff",
      links: [
        {
          label: "Featured",
          href: "/features",
          ariaLabel: "Featured Projects",
        },
        {
          label: "Case Studies",
          href: "/Projects",
          ariaLabel: "Project Case Studies",
        },
      ],
    },
    {
      label: "Contact",
      bgColor: "#271E37",
      textColor: "#fff",
      links: [
        { label: "Email", href: "/email", ariaLabel: "Email us" },
        { label: "Twitter", href: "/twitter", ariaLabel: "Twitter" },
        { label: "LinkedIn", href: "/linkedin", ariaLabel: "LinkedIn" },
      ],
    },
  ];

export default function MainPage() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // ✅ Only run on client
    if (typeof window === "undefined") return;

    // Load Leaflet and socket.io dynamically
    (async () => {
      const L = (await import("leaflet")).default;
      const { io } = await import("socket.io-client");

      // Initialize map
      const map = L.map(mapRef.current as HTMLElement).setView(
        [20.5937, 78.9629],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {

      }).addTo(map);

      // Fix default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/marker-icon-2x.png",
        iconUrl: "/marker-icon.png",
        shadowUrl: "/marker-shadow.png",
      });

      // Example marker
      const marker = L.marker([20.5937, 78.9629]).addTo(map);

      // ✅ Connect socket.io
      const socket = io("http://localhost:4000");

      socket.on("positionUpdate", (data: { lat: number; lng: number }) => {
        marker.setLatLng([data.lat, data.lng]);
        map.setView([data.lat, data.lng], map.getZoom());
      });

      return () => {
        socket.disconnect();
        map.remove();
      };
    })();
  }, []);

  return (
    <div className="h-screen w-full relative">
      <div ref={mapRef} id="map" className="h-full w-full z-0" />
      <CardNav
        items={items}
        baseColor="rgba(235, 222, 222, 0.05)"
        menuColor="#0e0c0cff"
        buttonBgColor="#111"
        buttonTextColor="#fff"
        ease="power3.out"
        showSearch={true}
        onSearch={(query) => console.log("Search for:", query)}
      />
    </div>
  );
}
