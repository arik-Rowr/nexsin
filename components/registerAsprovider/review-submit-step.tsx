"use client";

import type React from "react";
import { useState } from "react";
import type {
  PersonalDetails,
  ServiceDetails,
  Documents,
  BankDetails,
} from "@/types/provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  User,
  Briefcase,
  FileText,
} from "lucide-react";

interface ReviewSubmitStepProps {
  personalDetails: PersonalDetails;
  serviceDetails: ServiceDetails;
  documents: Documents;
  bankDetails: BankDetails;
  gstNumber: string;
  onBack: () => void;
  onSubmit: (applicationId: string) => void;
}

export function ReviewSubmitStep({
  personalDetails,
  serviceDetails,
  documents,
  gstNumber,
  onBack,
  onSubmit,
}: ReviewSubmitStepProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (isSubmitting) return;

    setIsSubmitting(true);

    const timestamp = Date.now();
    const randomBytes = crypto.getRandomValues(new Uint8Array(6));
    const randomSuffix = Array.from(randomBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase();

    const applicationId = `APP-${timestamp}-${randomSuffix}`;

    setTimeout(() => {
      onSubmit(applicationId);
      setIsSubmitting(false);
    }, 900);
  };

  const getProviderDisplayName = () => {
    if (serviceDetails.providerType === "business") {
      return serviceDetails.shopName || "Not Provided";
    }
    return (
      serviceDetails.displayName || serviceDetails.ownerName || "Not Provided"
    );
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          Review Your Application
        </h2>
        <p className="mt-3 text-gray-600">
          Please carefully review all details before submitting
        </p>
      </div>

      {/* Personal Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>Personal Information</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <InfoItem label="Full Name" value={personalDetails.name} />
          <InfoItem label="Email Address" value={personalDetails.email} />
        </CardContent>
      </Card>

      {/* Service Details */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            <CardTitle>Service Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <InfoItem
              label="Provider Type"
              value={
                serviceDetails.providerType === "business"
                  ? "Business / Shop"
                  : "Individual"
              }
            />
            <InfoItem label="Display Name" value={getProviderDisplayName()} />
            <InfoItem label="Owner Name" value={serviceDetails.ownerName} />
            <InfoItem label="Year Started" value={serviceDetails.startYear} />
            <InfoItem
              label="Service Range"
              value={`${serviceDetails.serviceRange} KM`}
            />
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">
              Service Categories
            </p>
            <div className="flex flex-wrap gap-2">
              {serviceDetails.category?.map((cat) => (
                <Badge key={cat} variant="secondary" className="capitalize">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {serviceDetails.customCategory?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">
                Custom Services
              </p>
              <div className="flex flex-wrap gap-2">
                {serviceDetails.customCategory.map((item, i) => (
                  <Badge key={i} variant="outline">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Documents */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-emerald-600" />
            <CardTitle>Documents Uploaded</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <DocumentItem label="Profile Photo" file={documents.profilePhoto} />
            <DocumentItem
              label={`${(documents.docType1 || "Aadhaar").toUpperCase()} (Front)`}
              file={documents.doc1Front}
            />
            <DocumentItem
              label={`${(documents.docType2 || "PAN").toUpperCase()} (Front)`}
              file={documents.doc2Front}
            />
          </div>
        </CardContent>
        <p className="text-center text-xs text-gray-500">
          By submitting, you confirm that all information provided is accurate
          and true.
        </p>
      </Card>

      {/* GST */}
      {gstNumber && (
        <Card>
          <CardHeader>
            <CardTitle>GST Details</CardTitle>
          </CardHeader>
          <CardContent>
            <InfoItem label="GST Number" value={gstNumber} />
          </CardContent>
        </Card>
      )}

      {/* Final Action */}
      <div className="flex justify-between pt-8 border-t">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          size="lg"
          disabled={isSubmitting}
        >
          Back
        </Button>

        <Button
          onClick={handleSubmit}
          size="lg"
          disabled={isSubmitting}
          className="min-w-48"
        >
          {isSubmitting ? (
            "Submitting Application..."
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Submit Application
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

/* ====================== HELPER COMPONENTS ====================== */

function InfoItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string | number | undefined;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className="mt-1 text-base font-semibold text-gray-900 break-all">
        {value || "Not Provided"}
      </p>
    </div>
  );
}

function DocumentItem({
  label,
  file,
}: {
  label: string;
  file: File | null | undefined;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4 border border-gray-100">
      <div className="text-green-600">
        <CheckCircle className="w-5 h-5" />
      </div>
      <div>
        <p className="font-medium text-gray-800">{label}</p>
        <p className="text-sm text-gray-600 truncate max-w-[260px]">
          {file?.name || "Not Uploaded"}
        </p>
      </div>
    </div>
  );
}
