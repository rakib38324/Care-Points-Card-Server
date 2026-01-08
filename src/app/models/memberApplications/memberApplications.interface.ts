export type TMemberApplications = {
  _id: string;
  userId: string;
  paymentId?: string;

  // ================= Personal Information =================
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phoneNumber: string;
  whatsappNumber?: string;
  countryOfResidence: string;
  cityOrRegion: string;
  fullAddress: string;

  // ================= Membership Selection =================
  membershipTier: string;

  familyMembers?: {
    fullName: string;
    relationship: string;
    dateOfBirth?: String;
  }[];

  // ================= Health Information =================
  currentHealthStatus: string;

  existingConditions?: string;

  currentMedications?: string;

  // ================= Onboarding =================
  bloodTestLocationPreference: string;
  preferredConsultationDate: string;
  preferredConsultationTime: string; // e.g. "10:30 AM"

  // ================= Payment =================
  onboardingFee?: number;
  paymentMethod: string;
  isPaid: boolean;
  isDeleted: boolean;

  // ----------- condition ---------
  TermsOfService: boolean;
  PrivacyPolicyHIPAA: boolean;
  notification: boolean;

  // ================= System Fields =================
  createdAt: Date;
  updatedAt: Date;
};
