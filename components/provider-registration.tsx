"use client";

import { useState, useEffect } from "react";
import { PersonalDetailsStep } from "@/components/registerAsprovider/personal-details-step";
import { ServiceDetailsStep } from "@/components/registerAsprovider/service-details-step";
import { DocumentUploadStep } from "@/components/registerAsprovider/document-upload-step";
import { ReviewSubmitStep } from "@/components/registerAsprovider/review-submit-step";
import { SuccessStep } from "@/components/registerAsprovider/success-step";
import { StepperIntroCard } from "@/components/ui/StepperIntroCard";

import type {
  PersonalDetails,
  ServiceDetails,
  Documents,
  BankDetails,
} from "@/types/provider";

import {
  saveCurrentApplication,
  getCurrentApplication,
  clearCurrentApplication,
} from "@/lib/storage";

// ================= NEW FACE VERIFICATION COMPONENT =================
import FaceVerificationStep from "./registerAsprovider/Face-Verificationi-Step";

const steps = [
  { id: 1, label: "Face Verification" },
  { id: 2, label: "Service Details" },
  { id: 3, label: "Documents" },
  { id: 4, label: "Personal Details" },
  { id: 5, label: "Review" },
];

export default function ProviderRegistration() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState("");
  const [showStepperIntro, setShowStepperIntro] = useState(true);

  // Face Verification State
  const [faceVerified, setFaceVerified] = useState(false);
  const [verificationAttempt, setVerificationAttempt] = useState(0);

  // ================= FORM STATES =================

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    shopName: "",
    ownerName: "",
    startYear: "",
    category: [],
    customCategory: [],
    serviceRange: "",
  });

  const [documents, setDocuments] = useState<Documents>({
    aadhaarFront: null,
    aadhaarBack: null,
    panCard: null,
    bankProof: null,
    profilePhoto: null,
  });

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    name: "",
    email: "",
    createPassword: "",
    confirmPassword: "",
  });

  const [gstNumber, setGstNumber] = useState("");
  const [bankDetails, setBankDetails] = useState<BankDetails>({
    accountHolderName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
  });

  // ================= RESTORE SAVED PROGRESS =================
  useEffect(() => {
    const saved = getCurrentApplication();
    if (saved) {
      setCurrentStep(saved.currentStep || 1);
      setFaceVerified(saved.faceVerified || false);

      setPersonalDetails(saved.personalDetails || personalDetails);
      setServiceDetails(saved.serviceDetails || serviceDetails);
      setBankDetails(saved.bankDetails || bankDetails);
      setGstNumber(saved.gstNumber || "");
    }
  }, []);

  // ================= SAVE PROGRESS =================
  const saveProgress = () => {
    saveCurrentApplication({
      currentStep,
      faceVerified,
      personalDetails,
      serviceDetails,
      bankDetails,
      gstNumber,
    });
  };

  const handleNext = () => {
    saveProgress();
    setCurrentStep((p) => Math.min(p + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep((p) => Math.max(p - 1, 1));
  };

  const handleFaceVerificationComplete = (success: boolean) => {
    if (success) {
      setFaceVerified(true);
      setVerificationAttempt(0);
      handleNext();
    } else {
      setVerificationAttempt((prev) => prev + 1);
    }
  };

  const handleSubmit = (id: string) => {
    setApplicationId(id);
    setSubmitted(true);
    clearCurrentApplication();
  };

  if (submitted) {
    return <SuccessStep applicationId={applicationId} />;
  }

  return (
    <>
      {showStepperIntro && (
        <StepperIntroCard onFinish={() => setShowStepperIntro(false)} />
      )}

      {!showStepperIntro && (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex justify-center px-4 py-14">
          <div className="w-full max-w-4xl">
            {/* HEADER */}
            <div className="text-center mb-14">
              <h1 className="text-3xl font-bold text-gray-900">
                Become a Verified Service Provider
              </h1>
              <p className="text-sm font-medium text-gray-600 mt-2">
                Secure identity verification • Trusted professionals only
              </p>
            </div>

            {/* STEPPER */}
            <div className="flex justify-center mb-14">
              <div className="w-full max-w-4xl">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-1 items-center">
                      <div className="flex flex-col items-center z-10">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                            ${
                              currentStep > step.id ||
                              (step.id === 1 && faceVerified)
                                ? "bg-emerald-600 text-white"
                                : currentStep === step.id
                                  ? "bg-blue-600 text-white ring-2 ring-blue-200"
                                  : "bg-white border-2 border-gray-300 text-gray-400"
                            }`}
                        >
                          {step.id}
                        </div>
                        <span className="mt-3 text-xs font-medium text-gray-600 text-center tracking-tight">
                          {step.label}
                        </span>
                      </div>

                      {index !== steps.length - 1 && (
                        <div
                          className={`flex-1 h-0.5 mx-2 mt-[-18px] transition-all
                            ${
                              currentStep > step.id ||
                              (step.id === 1 && faceVerified)
                                ? "bg-emerald-600"
                                : "bg-gray-200"
                            }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MAIN CARD */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="p-10">
                {/* ================= STEP 1: FACE VERIFICATION ================= */}
                {currentStep === 1 && (
                  <FaceVerificationStep
                    onComplete={handleFaceVerificationComplete}
                    attempts={verificationAttempt}
                  />
                )}

                {/* ================= OTHER STEPS ================= */}

                {currentStep === 2 && (
                  <ServiceDetailsStep
                    data={serviceDetails}
                    onUpdate={setServiceDetails}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {currentStep === 3 && (
                  <DocumentUploadStep
                    documents={documents}
                    gstNumber={gstNumber}
                    onUpdateDocuments={setDocuments}
                    onUpdateGst={setGstNumber}
                    onNext={handleNext}
                    onBack={handleBack}
                  />
                )}

                {currentStep === 4 && (
                  <PersonalDetailsStep
                    data={personalDetails}
                    onUpdate={setPersonalDetails}
                    onNext={handleNext}
                  />
                )}

                {currentStep === 5 && (
                  <ReviewSubmitStep
                    personalDetails={personalDetails}
                    serviceDetails={serviceDetails}
                    documents={documents}
                    bankDetails={bankDetails}
                    gstNumber={gstNumber}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                  />
                )}
              </div>
            </div>

            <p className="text-center text-xs text-gray-500 mt-8">
              Your data is encrypted and secure • Face verification powered by
              liveness detection
            </p>
          </div>
        </div>
      )}
    </>
  );
}
