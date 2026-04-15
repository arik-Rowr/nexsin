// ======================================================
// SERVICE CATEGORIES
// ======================================================

export type ServiceCategory =
  | "electrician"
  | "plumber"
  | "carpenter"
  | "painter"
  | "cleaner"
  | "appliance-repair"
  | "pest-control"
  | "other";

// ======================================================
// APPLICATION STATUS
// ======================================================

export type ApplicationStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "under-review";

// ======================================================
// PERSONAL DETAILS
// ======================================================

export interface PersonalDetails {
  name: string;
  email: string;
  createPassword: string;
  confirmPassword: string;
}

// ======================================================
// SERVICE DETAILS (MULTI-SELECT CATEGORY)
// ======================================================

export interface ServiceDetails {
  providerType: "individual" | "business";
  displayName: string;
  shopName: string;
  ownerName: string;
  startYear: string;
  category: ServiceCategory[];
  customCategory: string[]; // 👈 NEW
  serviceRange: string;
  hasRequiredEquipment: boolean;
}

// ======================================================
// DOCUMENTS (FILE STATE)
// ======================================================

export interface Documents {
  profilePhoto: File | null;

  docType1?: string;
  docType2?: string;

  doc1Front: File | null;
  doc2Front: File | null;

  // Optional fields
  aadhaarBack?: File | null;
  panBack?: File | null;
  gstNumber?: string;
}

// ======================================================
// BANK DETAILS
// ======================================================

export interface BankDetails {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

// ======================================================
// FULL PROVIDER APPLICATION STRUCTURE
// ======================================================

export interface ProviderApplication {
  id: string;
  personalDetails: PersonalDetails;
  serviceDetails: ServiceDetails;
  documents: {
    aadhaarFront: string;
    aadhaarBack: string;
    panCard: string;
    bankProof: string;
    profilePhoto: string;
  };
  bankDetails: BankDetails;
  status: ApplicationStatus;
  submittedAt: Date;
  reviewedAt?: Date;
  reviewNotes?: string;
}
