"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Avatar from "@mui/material/Avatar";

interface UserProfile {
  fullName: string;
  phone: string;
  gender?: string;
  alternatePhone?: string;
}

interface ProfilePageProps {
  onClose: () => void;
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL;


export default function ProfilePage({ onClose }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<UserProfile>({
    fullName: "",
    phone: "",
    gender: "",
    alternatePhone: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${API}/api/users/profile`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        console.log(data)
        setProfile(data);
        setFormData({
          fullName: data.fullName || "",
          phone: data.phone || "",
          gender: data.gender || "",
          alternatePhone: data.alternatePhone || "",
        });
      
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
   
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };




  const handleSave = async () => {
    if (!formData.fullName || !formData.phone) {
      alert("Full Name and Mobile Number are required");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // Prepare update payload with only required fields
      const updatePayload = {
        fullName: formData.fullName,
        phone: formData.phone,
        gender: formData.gender,
        alternatePhone: formData.alternatePhone,
      };

      const res = await fetch(`${API}/api/users/profile`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) throw new Error("Failed to update profile");

      const updated = await res.json();
      console.log(updated)
      setProfile(updated);
      setFormData({
        fullName: updated.fullName || "",
        phone: updated.phone || "",
        gender: updated.gender || "",
        alternatePhone: updated.alternatePhone || "",
      });
      setIsEditing(false);
      setSelectedFile(null);
      alert("Profile updated successfully!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] overflow-y-auto flex justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-[#0F172A] text-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* GitHub-style Header */}
        <div className="border-b border-gray-700 px-8 py-6 flex items-center justify-between bg-[#1E2937]">
          <div className="flex items-center gap-4">
           <Avatar/>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Profile Settings</h1>
              <p className="text-gray-400 text-sm">Manage your account information</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl transition-colors"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-12">


            <div className="mt-4 text-center">
              <div className="font-medium text-xl">{formData.fullName}</div>
            </div>
          </div>

          {/* Edit Toggle */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              {isEditing ? "Cancel Editing" : "✏️ Edit Profile"}
            </button>
          </div>

          {/* Profile Info Sections */}
          <div className="space-y-10">
            {/* Basic Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Basic Information</h2>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Gender</label>
                  <select
                    id="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 disabled:opacity-70"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Mobile Number <span className="text-red-500">*</span></label>
                  <input
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="10-digit number"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 disabled:opacity-70"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Alternate Phone</label>
                  <input
                    id="alternatePhone"
                    placeholder="Alternate number (if any)"
                    value={formData.alternatePhone || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-indigo-500 disabled:opacity-70"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && <div className="mt-6 text-red-400 text-sm">{error}</div>}
        </div>

        {/* Footer Actions */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="border-t border-gray-700 px-8 py-6 flex justify-end gap-4 bg-[#0F172A]"
            >
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    fullName: profile?.fullName || "",
                    phone: profile?.phone || "",
                    gender: profile?.gender || "",
                    alternatePhone: profile?.alternatePhone || "",
                  });
                }}
                className="px-8 py-3 bg-gray-700 hover:bg-gray-600 rounded-2xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}