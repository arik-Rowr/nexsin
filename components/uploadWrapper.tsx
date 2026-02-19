"use client";

import * as React from "react";



import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import ProfilePage from "@/components/ProfilePage";







export default function UploadAvatars() {
  const [open, setOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const router = useRouter();

  const handleClose = () => setOpen(false);

  const logout = () => {
    setOpen(false);
    router.push("/login");
  };

  // ✅ IMPORTANT: COMPONENT RETURNS JSX
  return (
    <>
      <div
        onClick={() => setOpen(true)}
        className="text-white cursor-pointer"
      >
        Open Menu
      </div>

      {open &&
        createPortal(
          <div className="fixed inset-0 bg-black text-white">
            <button onClick={handleClose}>Close</button>
            <button onClick={logout}>Logout</button>
          </div>,
          document.body
        )}

      {isProfileModalOpen &&
        createPortal(
          <ProfilePage onClose={() => setIsProfileModalOpen(false)} />,
          document.body
        )}
    </>
  );
}