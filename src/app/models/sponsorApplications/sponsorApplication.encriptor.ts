import { encrypt } from '../../utils/encryption.utils';
import { TSponsorApplication } from './sponsorApplications.interface';

export const encryptSponsorPayload = (
  payload: TSponsorApplication,
): TSponsorApplication => {
  return {
    ...payload,

    // ================= Sponsor Information =================
    fullName: encrypt(payload.fullName),
    phoneNumber: encrypt(payload.phoneNumber),
    whatsappNumber: payload.whatsappNumber
      ? encrypt(payload.whatsappNumber)
      : undefined,
    fullAddress: encrypt(payload.fullAddress),
    countryOfResidence: encrypt(payload.countryOfResidence),
    city: encrypt(payload.city),

    // ================= Communication Preferences =================
    primaryContact: encrypt(
      payload.primaryContact,
    ) as typeof payload.primaryContact,
    preferredCommunicationMethod: encrypt(
      payload.preferredCommunicationMethod,
    ) as typeof payload.preferredCommunicationMethod,

    // ================= Sponsored Members =================
    sponsoredMembers: payload.sponsoredMembers?.map((member) => ({
      fullName: encrypt(member.fullName),
      relationship: encrypt(member.relationship),
      dateOfBirth: encrypt(member.dateOfBirth),
      gender: encrypt(member.gender) as typeof member.gender,
      countryOfResidence: encrypt(member.countryOfResidence),
      cityOrRegion: encrypt(member.cityOrRegion),
      phoneNumber: encrypt(member.phoneNumber),
      email: member?.email && encrypt(member.email),
      homeAddress: encrypt(member.homeAddress),
      currentHealthStatus: encrypt(
        member.currentHealthStatus,
      ) as typeof member.currentHealthStatus,
      existingConditions:
        member.existingConditions &&
        (encrypt(
          member.existingConditions,
        ) as typeof member.existingConditions),
      membershipTier: encrypt(
        member.membershipTier,
      ) as typeof member.membershipTier,
    })),
  };
};
