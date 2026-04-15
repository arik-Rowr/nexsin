"use client";

import type React from "react";
import { useState, useMemo } from "react";
import type { Documents } from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, User } from "lucide-react";
import Image from "next/image";

interface DocumentUploadStepProps {
  documents: Documents;
  gstNumber: string;
  onUpdateDocuments: (docs: Documents) => void;
  onUpdateGst: (gst: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const governmentDocs = [
  { value: "aadhaar", label: "Aadhaar Card" },
  { value: "pan", label: "PAN Card" },
  { value: "voter", label: "Voter ID" },
  { value: "driving", label: "Driving Licence" },
  { value: "passport", label: "Passport" },
];

export function DocumentUploadStep({
  documents,
  gstNumber,
  onUpdateDocuments,
  onUpdateGst,
  onNext,
  onBack,
}: DocumentUploadStepProps) {
  const [docType1, setDocType1] = useState<string>(
    documents.docType1 || "aadhaar",
  );
  const [docType2, setDocType2] = useState<string>(documents.docType2 || "pan");

  // Preview for DP
  const profilePreview = useMemo(() => {
    return documents.profilePhoto
      ? URL.createObjectURL(documents.profilePhoto)
      : null;
  }, [documents.profilePhoto]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  const handleFileChange = (field: keyof Documents, file: File | null) => {
    onUpdateDocuments({ ...documents, [field]: file });
  };

  const handleDocTypeChange = (
    type: "docType1" | "docType2",
    value: string,
  ) => {
    if (type === "docType1") {
      setDocType1(value);
      onUpdateDocuments({ ...documents, docType1: value });
      if (value === docType2) {
        const alternative =
          governmentDocs.find((d) => d.value !== value)?.value || "pan";
        setDocType2(alternative);
        onUpdateDocuments({ ...documents, docType2: alternative });
      }
    } else {
      setDocType2(value);
      onUpdateDocuments({ ...documents, docType2: value });
    }
  };

  const requiredDocumentsUploaded =
    documents.profilePhoto && documents.doc1Front && documents.doc2Front;

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl mx-auto">
      {/* Header */}

      {/* ==================== WHATSAPP STYLE DP ==================== */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>

          {/* Upload Overlay */}
          <label className="absolute bottom-1 right-1 w-9 h-9 bg-indigo-600 hover:bg-indigo-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all">
            <Camera className="w-5 h-5 text-white" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleFileChange("profilePhoto", e.target.files?.[0] || null)
              }
            />
          </label>
        </div>

        <p className="text-xs text-gray-500 text-center">
          Click the camera icon to upload your profile picture
        </p>
      </div>

      {/* ==================== TWO GOVERNMENT IDs ==================== */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Document 1 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            First Government ID <span className="text-red-500">*</span>
          </Label>
          <Select
            value={docType1}
            onValueChange={(v) => handleDocTypeChange("docType1", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Document" />
            </SelectTrigger>
            <SelectContent>
              {governmentDocs.map((doc) => (
                <SelectItem key={doc.value} value={doc.value}>
                  {doc.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div>
            <Label className="text-sm">Front Side</Label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileChange("doc1Front", e.target.files?.[0] || null)
              }
            />
            {documents.doc1Front && (
              <p className="text-xs text-green-600 mt-1">
                ✓ {documents.doc1Front.name}
              </p>
            )}
          </div>
        </div>

        {/* Document 2 */}
        <div className="space-y-3">
          <Label className="text-base font-medium">
            Second Government ID <span className="text-red-500">*</span>
          </Label>
          <Select
            value={docType2}
            onValueChange={(v) => handleDocTypeChange("docType2", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Document" />
            </SelectTrigger>
            <SelectContent>
              {governmentDocs
                .filter((doc) => doc.value !== docType1)
                .map((doc) => (
                  <SelectItem key={doc.value} value={doc.value}>
                    {doc.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <div>
            <Label className="text-sm">Front Side</Label>
            <Input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleFileChange("doc2Front", e.target.files?.[0] || null)
              }
            />
            {documents.doc2Front && (
              <p className="text-xs text-green-600 mt-1">
                ✓ {documents.doc2Front.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* GST Number */}
      <div className="space-y-2">
        <Label>GST Number (Optional)</Label>
        <Input
          value={gstNumber}
          onChange={(e) => onUpdateGst(e.target.value.toUpperCase())}
          placeholder="22ABCDE1234F1Z5"
          className="font-mono tracking-widest"
          maxLength={15}
        />
        <p className="mt-2 text-gray-600">
          Upload clear documents. All files are secure and used only for
          verification.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button type="button" onClick={onBack} variant="outline" size="lg">
          Back
        </Button>

        <Button
          type="submit"
          size="lg"
          disabled={!requiredDocumentsUploaded}
          className="min-w-32"
        >
          Continue
        </Button>
      </div>
    </form>
  );
}
