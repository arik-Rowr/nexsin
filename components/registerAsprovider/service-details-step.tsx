/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { useState, useMemo } from "react";
import type { ServiceDetails, ServiceCategory } from "@/types/provider";
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
import { Checkbox } from "@/components/ui/checkbox";   // ← Added

interface ServiceDetailsStepProps {
  data: ServiceDetails;
  onUpdate: (data: ServiceDetails) => void;
  onNext: () => void;
  onBack: () => void;
}

const serviceCategories: { value: ServiceCategory; label: string }[] = [
  { value: "electrician", label: "Electrician" },
  { value: "plumber", label: "Plumber" },
  { value: "carpenter", label: "Carpenter" },
  { value: "painter", label: "Painter" },
  { value: "cleaner", label: "Cleaner" },
  { value: "appliance-repair", label: "Appliance Repair" },
  { value: "pest-control", label: "Pest Control" },
  { value: "other", label: "Other" },
];

const serviceRanges = [5, 10, 15, 20, 25, 30, 50, 75, 100];

export function ServiceDetailsStep({
  data,
  onUpdate,
  onNext,
  onBack,
}: ServiceDetailsStepProps) {
  const [newCustom, setNewCustom] = useState("");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [equipmentConfirmed, setEquipmentConfirmed] = useState(
    data.hasRequiredEquipment ?? false
  );

  const currentYear = new Date().getFullYear();

  const years = useMemo(() => {
    return Array.from({ length: currentYear - 1949 }, (_, i) => currentYear - i);
  }, [currentYear]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (data.category.length === 0) {
      alert("Please select at least one category");
      return;
    }

    if (!equipmentConfirmed) {
      alert("Please confirm that you have all required equipment and tools");
      return;
    }

    // Save confirmation to main data
    onUpdate({ ...data, hasRequiredEquipment: equipmentConfirmed });
    onNext();
  };

  const handleChange = (field: keyof ServiceDetails, value: any) => {
    onUpdate({ ...data, [field]: value });
  };

  const nameLabel =
    data.providerType === "business"
      ? "Shop / Business Name *"
      : "Display Name (Optional)";

  const namePlaceholder =
    data.providerType === "business"
      ? "ABC Electricals"
      : "e.g. Ramesh Electrician";

  const nameField = data.providerType === "business" ? "shopName" : "displayName";
  const isNameRequired = data.providerType === "business";

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          Service Details
        </h2>
        <p className="mt-2 text-gray-600">
          Help customers understand your expertise and reach
        </p>
      </div>

      <div className="space-y-6">
        {/* Provider Type, Name, Owner, Year, Range - Unchanged */}
        <div className="space-y-2">
          <Label>Provider Type *</Label>
          <Select
            value={data.providerType}
            onValueChange={(value) => handleChange("providerType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select provider type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual / Freelancer</SelectItem>
              <SelectItem value="business">Business / Shop</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Dynamic Name Field */}
          <div className="space-y-2">
            <Label htmlFor={nameField}>{nameLabel}</Label>
            <Input
              id={nameField}
              required={isNameRequired}
              value={data[nameField] || ""}
              onChange={(e) => handleChange(nameField, e.target.value)}
              placeholder={namePlaceholder}
            />
          </div>

          {/* Owner Name */}
          <div className="space-y-2">
            <Label htmlFor="ownerName">Owner / Contact Person Name *</Label>
            <Input
              id="ownerName"
              required
              value={data.ownerName}
              onChange={(e) => handleChange("ownerName", e.target.value)}
              placeholder="Ramesh Kumar"
            />
          </div>

          {/* Year Started */}
          <div className="space-y-2">
            <Label>Year Started *</Label>
            <Select
              value={data.startYear?.toString() || ""}
              onValueChange={(value) => handleChange("startYear", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select year started" />
              </SelectTrigger>
              <SelectContent className="max-h-80 overflow-y-auto">
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Service Range */}
          <div className="space-y-2">
            <Label>Service Area Range *</Label>
            {!showCustomRange ? (
              <Select
                value={data.serviceRange?.toString() || ""}
                onValueChange={(value) => {
                  if (value === "custom") {
                    setShowCustomRange(true);
                  } else {
                    handleChange("serviceRange", parseInt(value));
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {serviceRanges.map((range) => (
                    <SelectItem key={range} value={range.toString()}>
                      Up to {range} km
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom range...</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={data.serviceRange || ""}
                  onChange={(e) =>
                    handleChange("serviceRange", parseInt(e.target.value) || 10)
                  }
                  placeholder="Enter range in km"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomRange(false)}
                >
                  Back to presets
                </Button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-1">
              How far are you willing to travel for service
            </p>
          </div>
        </div>

        {/* Service Categories */}
        <div className="space-y-3">
          <Label>Service Categories *</Label>
          {/* Your existing categories code - unchanged */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {serviceCategories.map((cat) => {
              const isSelected = data.category.includes(cat.value);
              return (
                <label
                  key={cat.value}
                  className={`flex items-center gap-3 border rounded-xl px-4 py-3 cursor-pointer transition-all hover:shadow-sm
                    ${
                      isSelected
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {
                      if (isSelected) {
                        handleChange(
                          "category",
                          data.category.filter((c) => c !== cat.value)
                        );
                      } else {
                        handleChange("category", [...data.category, cat.value]);
                      }
                    }}
                    className="w-4 h-4 accent-indigo-600"
                  />
                  <span className="font-medium">{cat.label}</span>
                </label>
              );
            })}
          </div>

          {/* Custom Category Section - unchanged */}
          {data.category.includes("other") && (
            <div className="mt-6 space-y-3">
              <Label>Add Custom Service</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="E.g. CCTV Installation"
                  value={newCustom}
                  onChange={(e) => setNewCustom(e.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (newCustom.trim() && !data.customCategory.includes(newCustom.trim())) {
                      handleChange("customCategory", [
                        ...data.customCategory,
                        newCustom.trim(),
                      ]);
                      setNewCustom("");
                    }
                  }}
                >
                  Add
                </Button>
              </div>

              {data.customCategory.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {data.customCategory.map((item, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-medium"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() =>
                          handleChange(
                            "customCategory",
                            data.customCategory.filter((c) => c !== item)
                          )
                        }
                        className="ml-2 text-green-700 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==================== Equipment Confirmation ==================== */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mt-8">
          <div className="flex gap-4">
            <Checkbox
              id="hasEquipment"
              checked={equipmentConfirmed}
              onCheckedChange={(checked) => setEquipmentConfirmed(!!checked)}
            />
            <div>
              <Label
                htmlFor="hasEquipment"
                className="text-base font-medium text-gray-900 cursor-pointer"
              >
                I confirm I have all required professional equipment
              </Label>
              <p className="text-sm text-amber-700 mt-1 leading-relaxed">
                I possess complete tools, machines, and safety equipment needed 
                for the services I provide. False declaration may result in 
                profile suspension.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t">
        <Button type="button" onClick={onBack} variant="outline" size="lg">
          Back
        </Button>
        <Button 
          type="submit" 
          size="lg" 
          disabled={data.category.length === 0 || !equipmentConfirmed}
        >
          Continue
        </Button>
      </div>
    </form>
  );
}