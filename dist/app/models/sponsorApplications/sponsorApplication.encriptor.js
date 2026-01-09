"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptSponsorPayload = void 0;
const encryption_utils_1 = require("../../utils/encryption.utils");
const encryptSponsorPayload = (payload) => {
    var _a;
    return Object.assign(Object.assign({}, payload), { 
        // ================= Sponsor Information =================
        fullName: (0, encryption_utils_1.encrypt)(payload.fullName), phoneNumber: (0, encryption_utils_1.encrypt)(payload.phoneNumber), whatsappNumber: payload.whatsappNumber
            ? (0, encryption_utils_1.encrypt)(payload.whatsappNumber)
            : undefined, fullAddress: (0, encryption_utils_1.encrypt)(payload.fullAddress), countryOfResidence: (0, encryption_utils_1.encrypt)(payload.countryOfResidence), city: (0, encryption_utils_1.encrypt)(payload.city), 
        // ================= Communication Preferences =================
        primaryContact: (0, encryption_utils_1.encrypt)(payload.primaryContact), preferredCommunicationMethod: (0, encryption_utils_1.encrypt)(payload.preferredCommunicationMethod), 
        // ================= Sponsored Members =================
        sponsoredMembers: (_a = payload.sponsoredMembers) === null || _a === void 0 ? void 0 : _a.map((member) => ({
            fullName: (0, encryption_utils_1.encrypt)(member.fullName),
            relationship: (0, encryption_utils_1.encrypt)(member.relationship),
            dateOfBirth: (0, encryption_utils_1.encrypt)(member.dateOfBirth),
            gender: (0, encryption_utils_1.encrypt)(member.gender),
            countryOfResidence: (0, encryption_utils_1.encrypt)(member.countryOfResidence),
            cityOrRegion: (0, encryption_utils_1.encrypt)(member.cityOrRegion),
            phoneNumber: (0, encryption_utils_1.encrypt)(member.phoneNumber),
            email: (member === null || member === void 0 ? void 0 : member.email) && (0, encryption_utils_1.encrypt)(member.email),
            homeAddress: (0, encryption_utils_1.encrypt)(member.homeAddress),
            currentHealthStatus: (0, encryption_utils_1.encrypt)(member.currentHealthStatus),
            existingConditions: member.existingConditions &&
                (0, encryption_utils_1.encrypt)(member.existingConditions),
            membershipTier: (0, encryption_utils_1.encrypt)(member.membershipTier),
        })) });
};
exports.encryptSponsorPayload = encryptSponsorPayload;
