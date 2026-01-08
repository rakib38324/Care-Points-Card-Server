export type TSponsorApplication = {
  _id: string;
  userId: string; // user id of the sponsor
  paymentId?: string;

  // ================= Sponsor Information =================
  fullName: string;
  phoneNumber: string;
  whatsappNumber?: string;
  countryOfResidence: string;
  city: string;
  fullAddress: string;

  // ================= Sponsored Members =================
  numberOfMembers: number;
  sponsoredMembers: {
    fullName: string;
    relationship: string;
    dateOfBirth: string;
    gender: string;
    countryOfResidence: string;
    cityOrRegion: string;
    phoneNumber: string;
    email?: string;
    homeAddress: string;
    currentHealthStatus: string;
    existingConditions?: string;
    membershipTier: string;
  }[];

  // ================= Communication Preferences =================
  primaryContact: string;
  preferredCommunicationMethod: string;

  // ================= Payment & Billing =================
  totalOnboardingFees: number;
  membershipFeeEstimate?: string;
  paymentMethod: 'Credit/Debit Card' | 'Bank Transfer' | 'Mobile Money';
  isPaid: boolean;

  // ================= Reporting Preferences =================
  receiveMonthlyReports?: boolean;
  accessDigitalHealthRecords?: boolean;
  authorizeDirectCare?: boolean;

  // ================= Consent & Agreements =================
  TermsOfService: boolean;
  PrivacyPolicyHIPAA: boolean;
  authorizeHealthcareUpdates: boolean;

  isDeleted: boolean;

  // ================= System Fields =================
  createdAt: Date;
  updatedAt: Date;
};
