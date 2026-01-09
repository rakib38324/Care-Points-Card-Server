export type TNGOApplication = {
  _id: string;
  userId: string;
  paymentId?: string;

  // ================= Organization Information =================
  organizationName: string;
  organizationType: string;
  registrationNumber: string;
  countryOfRegistration: string;
  headquartersAddress: string;
  website?: string;

  // ================= Primary Contact Person =================
  primaryContact: {
    fullName: string;
    titleOrPosition: string;
    email: string;
    phoneNumber: string;
    whatsappNumber?: string;
  };

  // ================= Program Details =================
  targetCommunityRegion: string; // CarePoints Card operating region
  numberOfBeneficiaries: number;
  beneficiaryDemographics: string;
  programDuration: string;

  // ================= Membership Configuration =================
  membershipTier: string;
  mixedTierBreakdown?: string; // required only if tier = Mixed
  beneficiarySelectionCriteria: string;
  healthPriorities: string;
  healthPrioritiesOtherSpacify?: string;

  // ================= Data & Reporting Requirements =================
  reportingFrequency: string;
  requiredMetrics: string;
  dataAccessLevel: string;

  // ================= Budget & Payment =================
  estimatedTotalAnnualBudget: number; // auto-calculated
  fundingSource: string;
  paymentSchedule: string;
  paymentMethod: string;
  isPaid: boolean;

  // ================= Partnership Terms =================
  agreeProvideBeneficiaryData: boolean;
  agreeBloodTestCoordination: boolean;
  agreePartnershipTerms: boolean;
  agreeDataPrivacyCompliance: boolean; // HIPAA/GDPR

  // ================= Supporting Documents =================

  organizationRegistrationCertificate?: string; // file URL
  taxExemptStatus?: string; // file URL
  programProposal?: string; // file URL
  budgetBreakdown?: string; // file URL

  isDeleted: boolean;

  // ================= System Fields =================
  createdAt: Date;
  updatedAt: Date;
};
