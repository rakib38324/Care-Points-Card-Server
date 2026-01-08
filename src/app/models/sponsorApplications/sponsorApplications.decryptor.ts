import { decrypt } from '../../utils/encryption.utils';
import { TSponsorApplication } from './sponsorApplications.interface';

export const decryptSponsorPayload = (payload: TSponsorApplication) => {
  return {
    _id: payload?._id,

    // ================= Sponsor Information =================
    fullName: decrypt(payload.fullName),
    phoneNumber: decrypt(payload.phoneNumber),
    whatsappNumber: payload.whatsappNumber
      ? decrypt(payload.whatsappNumber)
      : undefined,
    countryOfResidence: decrypt(payload.countryOfResidence),
    city: decrypt(payload.city),
    fullAddress: decrypt(payload.fullAddress),

    // ================= Communication Preferences =================
    primaryContact: decrypt(payload.primaryContact),
    preferredCommunicationMethod: decrypt(payload.preferredCommunicationMethod),

    // ================= Sponsored Members =================
    sponsoredMembers: payload.sponsoredMembers?.map((member: any) => ({
      fullName: decrypt(member.fullName),
      relationship: decrypt(member.relationship),
      dateOfBirth: member.dateOfBirth ? decrypt(member.dateOfBirth) : undefined,
      gender: decrypt(member.gender),
      countryOfResidence: decrypt(member.countryOfResidence),
      cityOrRegion: decrypt(member.cityOrRegion),
      phoneNumber: decrypt(member.phoneNumber),
      email: member.email ? decrypt(member.email) : undefined,
      homeAddress: decrypt(member.homeAddress),
      currentHealthStatus: decrypt(member.currentHealthStatus),
      existingConditions: decrypt(member.existingConditions),
      membershipTier: decrypt(member.membershipTier),
    })),

    // ================= Payment & Billing =================
    totalOnboardingFees: payload.totalOnboardingFees,
    membershipFeeEstimate: payload.membershipFeeEstimate,
    paymentMethod: payload.paymentMethod,
    isPaid: payload.isPaid,

    // ================= Reporting Preferences =================
    receiveMonthlyReports: payload.receiveMonthlyReports,
    accessDigitalHealthRecords: payload.accessDigitalHealthRecords,
    authorizeDirectCare: payload.authorizeDirectCare,

    // ================= Consent & Agreements =================
    TermsOfService: payload.TermsOfService,
    PrivacyPolicyHIPAA: payload.PrivacyPolicyHIPAA,
    authorizeHealthcareUpdates: payload.authorizeHealthcareUpdates,

    // ================= System Fields =================
    isDeleted: payload.isDeleted,
    userId: payload.userId,
  };
};
