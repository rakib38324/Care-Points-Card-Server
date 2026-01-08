"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptMemberApplicationPayload = void 0;
const encryption_utils_1 = require("../../utils/encryption.utils");
const decryptMemberApplicationPayload = (payload) => {
    var _a;
    return {
        _id: payload === null || payload === void 0 ? void 0 : payload._id,
        // ================= Personal Info =================
        fullName: (0, encryption_utils_1.decrypt)(payload.fullName),
        dateOfBirth: (0, encryption_utils_1.decrypt)(payload.dateOfBirth),
        gender: (0, encryption_utils_1.decrypt)(payload.gender), // not encrypted
        phoneNumber: (0, encryption_utils_1.decrypt)(payload.phoneNumber),
        whatsappNumber: payload.whatsappNumber
            ? (0, encryption_utils_1.decrypt)(payload.whatsappNumber)
            : undefined,
        countryOfResidence: (0, encryption_utils_1.decrypt)(payload.countryOfResidence),
        cityOrRegion: (0, encryption_utils_1.decrypt)(payload.cityOrRegion),
        fullAddress: (0, encryption_utils_1.decrypt)(payload.fullAddress),
        // ================= Membership =================
        membershipTier: (0, encryption_utils_1.decrypt)(payload.membershipTier),
        currentHealthStatus: (0, encryption_utils_1.decrypt)(payload.currentHealthStatus),
        // ================= Health Info =================
        existingConditions: payload.existingConditions
            ? (0, encryption_utils_1.decrypt)(payload.existingConditions)
            : undefined,
        currentMedications: payload.currentMedications
            ? (0, encryption_utils_1.decrypt)(payload.currentMedications)
            : undefined,
        // ================= Onboarding =================
        bloodTestLocationPreference: (0, encryption_utils_1.decrypt)(payload.bloodTestLocationPreference),
        preferredConsultationDate: payload.preferredConsultationDate
            ? new Date((0, encryption_utils_1.decrypt)(payload.preferredConsultationDate))
            : undefined,
        preferredConsultationTime: (0, encryption_utils_1.decrypt)(payload.preferredConsultationTime),
        // ================= Family Members =================
        familyMembers: (_a = payload.familyMembers) === null || _a === void 0 ? void 0 : _a.map((member) => ({
            fullName: (0, encryption_utils_1.decrypt)(member.fullName),
            relationship: (0, encryption_utils_1.decrypt)(member.relationship),
            dateOfBirth: member.dateOfBirth
                ? new Date((0, encryption_utils_1.decrypt)(member.dateOfBirth))
                : undefined,
        })),
        onboardingFee: payload === null || payload === void 0 ? void 0 : payload.onboardingFee,
        paymentMethod: payload === null || payload === void 0 ? void 0 : payload.paymentMethod,
        paymentId: payload === null || payload === void 0 ? void 0 : payload.paymentId,
        ispaid: payload === null || payload === void 0 ? void 0 : payload.isPaid,
        isDeleted: payload === null || payload === void 0 ? void 0 : payload.isDeleted
    };
};
exports.decryptMemberApplicationPayload = decryptMemberApplicationPayload;
