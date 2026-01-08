"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSponsorPayload = void 0;
const encryption_utils_1 = require("../../utils/encryption.utils");
const decryptSponsorPayload = (payload) => {
    var _a;
    return {
        _id: payload === null || payload === void 0 ? void 0 : payload._id,
        // ================= Sponsor Information =================
        fullName: (0, encryption_utils_1.decrypt)(payload.fullName),
        phoneNumber: (0, encryption_utils_1.decrypt)(payload.phoneNumber),
        whatsappNumber: payload.whatsappNumber ? (0, encryption_utils_1.decrypt)(payload.whatsappNumber) : undefined,
        countryOfResidence: (0, encryption_utils_1.decrypt)(payload.countryOfResidence),
        city: (0, encryption_utils_1.decrypt)(payload.city),
        fullAddress: (0, encryption_utils_1.decrypt)(payload.fullAddress),
        // ================= Communication Preferences =================
        primaryContact: (0, encryption_utils_1.decrypt)(payload.primaryContact),
        preferredCommunicationMethod: (0, encryption_utils_1.decrypt)(payload.preferredCommunicationMethod),
        // ================= Sponsored Members =================
        sponsoredMembers: (_a = payload.sponsoredMembers) === null || _a === void 0 ? void 0 : _a.map((member) => ({
            fullName: (0, encryption_utils_1.decrypt)(member.fullName),
            relationship: (0, encryption_utils_1.decrypt)(member.relationship),
            dateOfBirth: member.dateOfBirth ? ((0, encryption_utils_1.decrypt)(member.dateOfBirth)) : undefined,
            gender: (0, encryption_utils_1.decrypt)(member.gender),
            countryOfResidence: (0, encryption_utils_1.decrypt)(member.countryOfResidence),
            cityOrRegion: (0, encryption_utils_1.decrypt)(member.cityOrRegion),
            phoneNumber: (0, encryption_utils_1.decrypt)(member.phoneNumber),
            email: member.email ? (0, encryption_utils_1.decrypt)(member.email) : undefined,
            homeAddress: (0, encryption_utils_1.decrypt)(member.homeAddress),
            currentHealthStatus: (0, encryption_utils_1.decrypt)(member.currentHealthStatus),
            existingConditions: (0, encryption_utils_1.decrypt)(member.existingConditions),
            membershipTier: (0, encryption_utils_1.decrypt)(member.membershipTier),
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
exports.decryptSponsorPayload = decryptSponsorPayload;
