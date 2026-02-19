"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
<<<<<<< HEAD:components/ui/UploadAvatars.tsx
import ProfilePage from "@/components/ProfilePage";
=======
import ProfilePage from "../ProfilePage";
import { supabase } from "@/lib/supabase";
>>>>>>> 99ea0e30153461e0d29b63a677dab3105518dc61:components/ui/sliderAvtar.tsx

export default function UploadAvatars({
  avatarSrc,
  setAvatarSrc,
}: {
  avatarSrc: string;
  setAvatarSrc: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);

  const router = useRouter();

  const handleClose = () => setOpen(false);

<<<<<<< HEAD:components/ui/UploadAvatars.tsx
  const logout = () => {
    setOpen(false);
    router.push("/login");
=======
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      alert("You have been logged out successfully ✅");
      router.replace("/login");
    } else {
      alert("Logout failed ❌ Please try again");
      console.error(error);
    }
>>>>>>> 99ea0e30153461e0d29b63a677dab3105518dc61:components/ui/sliderAvtar.tsx
  };

  return (
    <>
      {/* 🔥 HAMBURGER BUTTON */}
      <div
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        className={`profile-hamburger ${open ? "open" : ""}`}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* 🔥 FULLSCREEN SLIDE MENU */}
      {typeof window !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-[9998]"
                  onClick={handleClose}
                />

                {/* Slide Down Panel */}
                <motion.div
                  initial={{ y: "-100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: "-100%", opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="fixed top-0 left-0 w-full max-h-[90vh] bg-[#0D1117] text-white shadow-lg z-[9999] rounded-b-2xl border-b border-gray-700"
                >
                  <div className="flex justify-between items-center p-4 border-b border-gray-800">
                    <h2 className="text-lg font-semibold">Menu</h2>
                    <button
                      onClick={handleClose}
                      className="text-gray-400 hover:text-white text-xl"
                    >
                      ✕
                    </button>
                  </div>

                  <ul className="flex flex-col text-center text-base py-4">
                    <li
                      className="py-3 hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        setIsProfileModalOpen(true);
                      }}
                    >
                      Profile
                    </li>

                    <li className="py-3 hover:bg-gray-800 cursor-pointer">
                      Update
                    </li>

                    <li
                      className="py-3 hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        router.push("/contactus");
                      }}
                    >
                      Contact Us
                    </li>

                    <li className="py-3 hover:bg-gray-800 cursor-pointer">
                      Order Status
                    </li>

                    <li className="py-3 hover:bg-gray-800 cursor-pointer">
                      History
                    </li>

                    <li
                      className="py-3 hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setOpen(false);
                        router.push(
                          "/serviceproviderauthentication/register"
                        );
                      }}
                    >
                      Register as professional
                    </li>

                    <li
<<<<<<< HEAD:components/ui/UploadAvatars.tsx
                      className="py-3 text-red-400 hover:bg-gray-800 cursor-pointer"
                      onClick={logout}
=======
                      className="bg-red py-3 hover:bg-gray-800 cursor-pointer"
                      onClick={signOut}
>>>>>>> 99ea0e30153461e0d29b63a677dab3105518dc61:components/ui/sliderAvtar.tsx
                    >
                      SignOut
                    </li>
                  </ul>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}

      {/* 🔥 PROFILE MODAL */}
      {typeof window !== "undefined" &&
        isProfileModalOpen &&
        createPortal(
          <ProfilePage
            avatarSrc={avatarSrc}
            setAvatarSrc={setAvatarSrc}
            onClose={() => setIsProfileModalOpen(false)}
          />,
          document.body,
        )}

      {/* 🔥 HAMBURGER CSS */}
      <style jsx>{`
        .profile-hamburger {
          width: 28px;
          height: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
        }

        .profile-hamburger span {
          height: 3px;
          width: 100%;
          background: white;
          border-radius: 3px;
          transition: 0.3s ease;
        }

        /* Animated X effect */
        .profile-hamburger.open span:nth-child(1) {
          transform: rotate(45deg) translateY(8px);
        }

        .profile-hamburger.open span:nth-child(2) {
          opacity: 0;
        }

        .profile-hamburger.open span:nth-child(3) {
          transform: rotate(-45deg) translateY(-8px);
        }
      `}</style>
    </>
  );
}
