"use client";

import * as React from "react";
import ButtonBase from "@mui/material/ButtonBase";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";

// Import your modal component
import ProfileCardModal from "@/components/ProfileCardModal";

const defaultAvatar = "public/default-user.png";

// SVG default user icon (same as ProfileCardModal)
function DefaultUserIcon({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="rounded-full bg-gray-700 border-2 border-gray-600 shadow-md"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M2 20c0-3.333 5.333-6 10-6s10 2.667 10 6v2H2v-2z" />
    </svg>
  );
}

// UserAvatar component to show avatar or default icon
function UserAvatar({ src, alt, size = 40 }: { src?: string; alt?: string; size?: number }) {
  if (!src || src === defaultAvatar) {
    return (
      <span
        className="flex items-center justify-center rounded-full"
        style={{
          width: size,
          height: size,
          backgroundColor: "#374151",
          borderWidth: 2,
          borderColor: "#4b5563",
          boxShadow: "0 0 8px rgba(0,0,0,0.3)",
          borderStyle: "solid",
        }}
      >
        <DefaultUserIcon size={size} />
      </span>
    );
  }
  return (
    <img
      alt={alt || ""}
      src={src}
      style={{ width: size, height: size }}
      className="rounded-full object-cover border-2 border-gray-600 shadow-md"
    />
  );
}

export default function UploadAvatars() {
  const [avatarSrc, setAvatarSrc] = React.useState<string>(defaultAvatar);
  const [open, setOpen] = React.useState<boolean>(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState<boolean>(false);

  const handleClose = () => setOpen(false);

  const handleProfileClick = () => {
    handleClose();
    setIsProfileModalOpen(true);
  };

  return (
    <>
      {/* Avatar Button */}
      <ButtonBase
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        sx={{
          borderRadius: "50%",
          width: 48,
          height: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <UserAvatar src={avatarSrc} alt="User Avatar" size={40} />
      </ButtonBase>

      {/* Slide-down menu */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Background overlay */}
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-[9998]"
                  onClick={handleClose}
                />

                {/* Slide-down menu */}
                <motion.div
                  key="slide-menu"
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="fixed top-0 left-0 w-full max-h-[90vh] bg-[#0D1117] text-white shadow-lg z-[9999] rounded-b-2xl border-b border-gray-700"
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">User Menu</h2>
                    <button onClick={handleClose} className="text-gray-400 hover:text-white text-xl">
                      ✕
                    </button>
                  </div>
                  <ul className="flex flex-col text-center text-base py-4">
                    <li onClick={handleProfileClick} className="py-3 hover:bg-gray-800 cursor-pointer">
                      profile
                    </li>
                    <li onClick={handleClose} className="py-3 hover:bg-gray-800 cursor-pointer">
                      Update
                    </li>
                    <li onClick={handleClose} className="py-3 hover:bg-gray-800 cursor-pointer">
                      Contact Us
                    </li>
                    <li onClick={handleClose} className="py-3 hover:bg-gray-800 cursor-pointer">
                      History
                    </li>
                    <li onClick={handleClose} className="py-3 hover:bg-gray-800 cursor-pointer">
                      Order Status
                    </li>
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}

      {/* Profile Modal */}
      {typeof window !== "undefined" &&
        isProfileModalOpen &&
        createPortal(
          <ProfileCardModal
            onClose={() => setIsProfileModalOpen(false)}
            avatarSrc={avatarSrc}
            setAvatarSrc={setAvatarSrc} // pass setter to modal for updating avatar
          />,
          document.body
        )}
    </>
  );
}
