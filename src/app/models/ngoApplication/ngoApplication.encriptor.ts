/* eslint-disable @typescript-eslint/no-explicit-any */
import { encrypt } from '../../utils/encryption.utils';
import { TNGOApplication } from './ngoApplication.interface';

export const encryptNGOApplicationPayload = (
  payload: TNGOApplication,
): TNGOApplication => {
  return {
    ...payload,

    // ================= Organization Information =================
    organizationName: encrypt(payload.organizationName),
    organizationType: encrypt(payload.organizationType),
    registrationNumber: encrypt(payload.registrationNumber),
    countryOfRegistration: encrypt(payload.countryOfRegistration),
    headquartersAddress: encrypt(payload.headquartersAddress),
    website: payload.website ? encrypt(payload.website) : undefined,

    // ================= Primary Contact Person =================
    primaryContact: {
      fullName: encrypt(payload.primaryContact.fullName),
      titleOrPosition: encrypt(payload.primaryContact.titleOrPosition),
      email: encrypt(payload.primaryContact.email),
      phoneNumber: encrypt(payload.primaryContact.phoneNumber),
      whatsappNumber: payload.primaryContact.whatsappNumber
        ? encrypt(payload.primaryContact.whatsappNumber)
        : undefined,
    },

    // ================= Program Details =================
    targetCommunityRegion: encrypt(payload.targetCommunityRegion),
    beneficiaryDemographics: encrypt(payload.beneficiaryDemographics),
    programDuration: encrypt(payload.programDuration),

    // ================= Membership Configuration =================
    membershipTier: encrypt(payload.membershipTier),
    mixedTierBreakdown: payload.mixedTierBreakdown
      ? encrypt(payload.mixedTierBreakdown)
      : undefined,
    beneficiarySelectionCriteria: encrypt(payload.beneficiarySelectionCriteria),
    healthPriorities: encrypt(payload.healthPriorities),
    healthPrioritiesOtherSpacify: payload.healthPrioritiesOtherSpacify
      ? encrypt(payload.healthPrioritiesOtherSpacify)
      : undefined,

    // ================= Data & Reporting Requirements =================
    reportingFrequency: encrypt(payload.reportingFrequency),
    requiredMetrics: encrypt(payload.requiredMetrics),
    dataAccessLevel: encrypt(payload.dataAccessLevel),

    // ================= Budget & Payment =================
    fundingSource: encrypt(payload.fundingSource),
    paymentSchedule: encrypt(payload.paymentSchedule),
    paymentMethod: payload.paymentMethod,

    // ================= Supporting Documents =================
    // Note: Usually we encrypt the file URLs or store them as is if the bucket is private
    organizationRegistrationCertificate:
      payload.organizationRegistrationCertificate
        ? encrypt(payload.organizationRegistrationCertificate)
        : undefined,
    taxExemptStatus: payload.taxExemptStatus
      ? encrypt(payload.taxExemptStatus)
      : undefined,
    programProposal: payload.programProposal
      ? encrypt(payload.programProposal)
      : undefined,
    budgetBreakdown: payload.budgetBreakdown
      ? encrypt(payload.budgetBreakdown)
      : undefined,
  } as TNGOApplication;
};
