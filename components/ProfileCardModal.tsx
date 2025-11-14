"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";

interface ProfileModalProps {
  onClose: () => void;
  avatarSrc: string;
  setAvatarSrc: React.Dispatch<React.SetStateAction<string>>;
}

interface ProfileState {
  avatarSrc: string;
  fullName: string;
  nickName: string;
  gender: string;
  mobile: string;
}

const defaultAvatar = "/defaultcharacter.png";


const ProfileCardModal: React.FC<ProfileModalProps> = ({
  onClose,
  avatarSrc,
  setAvatarSrc,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarOptions, setShowAvatarOptions] = useState(false);
  const [animate, setAnimate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  

  const [inputs, setInputs] = useState({
    
    fullName: "abhi yadav",
    nickName: "Alexa",
    gender: "Female",
    mobile: "9876543210",
  });




  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newAvatarUrl = URL.createObjectURL(file);
      setInputs((prev) => ({ ...prev, avatarSrc: newAvatarUrl }));
      setAvatarSrc(newAvatarUrl);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing) setShowAvatarOptions(true);
  };

  const handlePickGallery = () => {
    fileInputRef.current?.click();
    setShowAvatarOptions(false);
  };

  const handleRemoveAvatar = () => {
    setInputs((prev) => ({ ...prev, avatarSrc: defaultAvatar }));
    setAvatarSrc(defaultAvatar);
    setShowAvatarOptions(false);
  };

  const handleEdit = () => setIsEditing(true);
  const handleSave = () => setIsEditing(false);
  const handleCancel = () => setIsEditing(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-2xl mx-auto mb-6 
          bg-[rgba(15,23,42,0.92)] text-white rounded-t-3xl 
          shadow-[0_-8px_40px_rgba(0,0,0,0.4)] overflow-hidden 
          border border-white/10 flex flex-col backdrop-blur-md backdrop-saturate-150
          transform transition-all duration-500 ease-out 
          ${animate ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}
      >
        {/* 🔷 Top Header Block */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0f172a]/60 backdrop-blur-sm border-b border-white/10">
          <h3 className="text-lg font-semibold text-gray-200 tracking-wide">
            User Profile
          </h3>

          {/* ❌ Close Button */}
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white text-2xl bg-white/5 w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-all duration-200 ease-out"
          >
            &times;
          </button>
        </div>

        {/* Header */}
        <div className="text-center p-5 border-b border-[oklch(12.9%_0.042_264.695)] relative">
          <h2 className="text-2xl font-semibold text-gray-100 tracking-wide">
            Profile Overview
          </h2>
          <div className="absolute left-1/2 -bottom-[1px] w-20 h-[2px] bg-[oklch(12.9%_0.042_264.695)] -translate-x-1/2 rounded-full"></div>
        </div>

        {/* Avatar Section */}
        <div className="flex flex-col items-center justify-center py-6 relative">
          <div
            className={`relative rounded-full ${
              isEditing ? "cursor-pointer" : ""
            } group transition-transform duration-300 hover:scale-[1.02]`}
            onClick={handleAvatarClick}
          >
            <Image
              src={avatarSrc && avatarSrc.trim() !== "" ? avatarSrc : defaultAvatar}
              alt="Avatar"
              className="w-28 h-28 rounded-full object-cover border-2 border-[oklch(12.9%_0.042_264.695)] shadow-md bg-gray-700"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-xs font-semibold">Change</span>
              </div>
            )}
          </div>

          {/* Avatar Options */}
          {isEditing && showAvatarOptions && (
            <div className="absolute mt-36 bg-slate-900 border border-[oklch(12.9%_0.042_264.695)] rounded-lg shadow-lg p-3 flex flex-col space-y-2 z-[10001]">
              <button
                className="py-2 px-3 text-left hover:bg-slate-800 rounded"
                onClick={handlePickGallery}
              >
                Choose from Gallery
              </button>
              <button
                className="py-2 px-3 text-left text-red-500 hover:bg-slate-800 rounded"
                onClick={handleRemoveAvatar}
              >
                Remove Photo
              </button>
            </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
          />

          {/* ✏️ Edit Button */}
          {!isEditing && (
            <button
              onClick={handleEdit}
              className="mt-6 px-6 py-2.5 font-semibold text-white bg-[oklch(12.9%_0.042_264.695)] rounded-lg shadow-md active:translate-y-[1px] active:scale-95 transition-transform duration-150 ease-out hover:brightness-125"
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Information Section */}
        <div
          className={`p-6 border-t border-[oklch(12.9%_0.042_264.695)/60] transition-all duration-500 ${
            !isEditing
              ? "opacity-40 blur-sm pointer-events-none"
              : "opacity-100 blur-none"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
            {/* Full Name */}
            <div className="bg-[#1e293b]/40 border border-[oklch(12.9%_0.042_264.695)/60] p-3 rounded-xl hover:border-[oklch(12.9%_0.042_264.695)] transition-all">
              <label className="block text-sm text-gray-400">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={inputs.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-1.5 mt-1 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-100 ${
                  !isEditing
                    ? "opacity-50 cursor-default"
                    : "focus:outline-none focus:ring-2 focus:ring-[oklch(12.9%_0.042_264.695)]/60"
                }`}
              />
            </div>

            {/* Nick Name */}
            <div className="bg-[#1e293b]/40 border border-[oklch(12.9%_0.042_264.695)/60] p-3 rounded-xl hover:border-[oklch(12.9%_0.042_264.695)] transition-all">
              <label className="block text-sm text-gray-400">Nick Name</label>
              <input
                id="nickName"
                type="text"
                value={inputs.nickName}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-1.5 mt-1 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-100 ${
                  !isEditing
                    ? "opacity-50 cursor-default"
                    : "focus:outline-none focus:ring-2 focus:ring-[oklch(12.9%_0.042_264.695)]/60"
                }`}
              />
            </div>

            {/* Gender */}
            <div className="bg-[#1e293b]/40 border border-[oklch(12.9%_0.042_264.695)/60] p-3 rounded-xl hover:border-[oklch(12.9%_0.042_264.695)] transition-all">
              <label className="block text-sm text-gray-400">Gender</label>
              <select
                id="gender"
                value={inputs.gender}
                onChange={handleSelectChange}
                disabled={!isEditing}
                className={`w-full px-3 py-1.5 mt-1 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-100 ${
                  !isEditing
                    ? "opacity-50 cursor-default"
                    : "focus:outline-none focus:ring-2 focus:ring-[oklch(12.9%_0.042_264.695)]/60"
                }`}
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>

            {/* Mobile */}
            <div className="bg-[#1e293b]/40 border border-[oklch(12.9%_0.042_264.695)/60] p-3 rounded-xl hover:border-[oklch(12.9%_0.042_264.695)] transition-all">
              <label className="block text-sm text-gray-400">
                Mobile Number
              </label>
              <input
                id="mobile"
                type="tel"
                value={inputs.mobile}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-3 py-1.5 mt-1 bg-[#1e293b] border border-gray-700 rounded-lg text-gray-100 ${
                  !isEditing
                    ? "opacity-50 cursor-default"
                    : "focus:outline-none focus:ring-2 focus:ring-[oklch(12.9%_0.042_264.695)]/60"
                }`}
              />
            </div>
          </div>
        </div>

        {/* ✅ Bottom Buttons */}
        {isEditing && (
          <div className="flex justify-center items-center py-5 border-t border-[oklch(12.9%_0.042_264.695)/50] bg-[#111827]/60">
            <div className="flex gap-3">
              <button
                onClick={handleCancel}
                className="px-5 py-2 font-semibold text-gray-300 bg-gray-700/40 border border-gray-600 rounded-lg hover:bg-gray-700/70 transition-all duration-200 ease-out"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 font-semibold text-white bg-[oklch(12.9%_0.042_264.695)] rounded-lg shadow-sm hover:brightness-125 active:translate-y-[2px] active:shadow-inner transition-all duration-150 ease-out"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCardModal;
