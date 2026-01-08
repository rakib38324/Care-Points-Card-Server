import { decrypt } from '../../utils/encryption.utils';
import { TMemberApplications } from './memberApplications.interface';

export const decryptMemberApplicationPayload = (
  payload: TMemberApplications,
) => {
  return {
    _id: payload?._id,
    // ================= Personal Info =================
    fullName: decrypt(payload.fullName),
    dateOfBirth: decrypt(payload.dateOfBirth),
    gender: decrypt(payload.gender), // not encrypted
    phoneNumber: decrypt(payload.phoneNumber),
    whatsappNumber: payload.whatsappNumber
      ? decrypt(payload.whatsappNumber)
      : undefined,
    countryOfResidence: decrypt(payload.countryOfResidence),
    cityOrRegion: decrypt(payload.cityOrRegion),
    fullAddress: decrypt(payload.fullAddress),

    // ================= Membership =================
    membershipTier: decrypt(payload.membershipTier),
    currentHealthStatus: decrypt(payload.currentHealthStatus),

    // ================= Health Info =================
    existingConditions: payload.existingConditions
      ? decrypt(payload.existingConditions)
      : undefined,
    currentMedications: payload.currentMedications
      ? decrypt(payload.currentMedications)
      : undefined,

    // ================= Onboarding =================
    bloodTestLocationPreference: decrypt(payload.bloodTestLocationPreference),
    preferredConsultationDate: payload.preferredConsultationDate
      ? new Date(decrypt(payload.preferredConsultationDate))
      : undefined,
    preferredConsultationTime: decrypt(payload.preferredConsultationTime),

    // ================= Family Members =================
    familyMembers: payload.familyMembers?.map((member: any) => ({
      fullName: decrypt(member.fullName),
      relationship: decrypt(member.relationship),
      dateOfBirth: member.dateOfBirth
        ? new Date(decrypt(member.dateOfBirth))
        : undefined,
    })),

    onboardingFee: payload?.onboardingFee,
    paymentMethod: payload?.paymentMethod,
    paymentId: payload?.paymentId,
    ispaid: payload?.isPaid,
    isDeleted: payload?.isDeleted,
  };
};
