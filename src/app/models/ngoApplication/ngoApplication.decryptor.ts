/* eslint-disable @typescript-eslint/no-explicit-any */
import { decrypt } from '../../utils/encryption.utils';
import { TNGOApplication } from './ngoApplication.interface';

export const decryptNGOApplicationPayload = (payload: TNGOApplication) => {
  return {
    _id: payload?._id,
    userId: payload?.userId,
    paymentId: payload?.paymentId,

    // ================= Organization Information =================
    organizationName: decrypt(payload.organizationName),
    organizationType: decrypt(payload.organizationType),
    registrationNumber: decrypt(payload.registrationNumber),
    countryOfRegistration: decrypt(payload.countryOfRegistration),
    headquartersAddress: decrypt(payload.headquartersAddress),
    website: payload.website ? decrypt(payload.website) : undefined,

    // ================= Primary Contact Person =================
    primaryContact: {
      fullName: decrypt(payload.primaryContact.fullName),
      titleOrPosition: decrypt(payload.primaryContact.titleOrPosition),
      email: decrypt(payload.primaryContact.email),
      phoneNumber: decrypt(payload.primaryContact.phoneNumber),
      whatsappNumber: payload.primaryContact.whatsappNumber
        ? decrypt(payload.primaryContact.whatsappNumber)
        : undefined,
    },

    // ================= Program Details =================
    targetCommunityRegion: decrypt(payload.targetCommunityRegion),
    numberOfBeneficiaries: payload.numberOfBeneficiaries,
    beneficiaryDemographics: decrypt(payload.beneficiaryDemographics),
    programDuration: decrypt(payload.programDuration),

    // ================= Membership Configuration =================
    membershipTier: decrypt(payload.membershipTier),
    mixedTierBreakdown: payload.mixedTierBreakdown
      ? decrypt(payload.mixedTierBreakdown)
      : undefined,
    beneficiarySelectionCriteria: decrypt(payload.beneficiarySelectionCriteria),
    healthPriorities: decrypt(payload.healthPriorities),
    healthPrioritiesOtherSpacify: payload.healthPrioritiesOtherSpacify
      ? decrypt(payload.healthPrioritiesOtherSpacify)
      : undefined,

    // ================= Data & Reporting Requirements =================
    reportingFrequency: decrypt(payload.reportingFrequency),
    requiredMetrics: decrypt(payload.requiredMetrics),
    dataAccessLevel: decrypt(payload.dataAccessLevel),

    // ================= Budget & Payment =================
    estimatedTotalAnnualBudget: payload.estimatedTotalAnnualBudget,
    fundingSource: decrypt(payload.fundingSource),
    paymentSchedule: decrypt(payload.paymentSchedule),
    paymentMethod: payload.paymentMethod,
    isPaid: payload.isPaid,

    // ================= Partnership Terms =================
    agreeProvideBeneficiaryData: payload.agreeProvideBeneficiaryData,
    agreeBloodTestCoordination: payload.agreeBloodTestCoordination,
    agreePartnershipTerms: payload.agreePartnershipTerms,
    agreeDataPrivacyCompliance: payload.agreeDataPrivacyCompliance,

    // ================= Supporting Documents =================
    organizationRegistrationCertificate:
      payload.organizationRegistrationCertificate
        ? decrypt(payload.organizationRegistrationCertificate)
        : undefined,
    taxExemptStatus: payload.taxExemptStatus
      ? decrypt(payload.taxExemptStatus)
      : undefined,
    programProposal: payload.programProposal
      ? decrypt(payload.programProposal)
      : undefined,
    budgetBreakdown: payload.budgetBreakdown
      ? decrypt(payload.budgetBreakdown)
      : undefined,

    isDeleted: payload.isDeleted,
    createdAt: (payload as any).createdAt,
    updatedAt: (payload as any).updatedAt,
  };
};
