"use client";

import { useRouter } from "next/navigation";
import ContactModal from "@/components/ui/ContactModal";

export default function ContactPage() {
  const router = useRouter();

  return (
    <ContactModal
      onClose={() => router.back()}
    />
  );
}
