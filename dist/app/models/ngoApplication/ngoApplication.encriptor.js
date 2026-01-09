"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encryptNGOApplicationPayload = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const encryption_utils_1 = require("../../utils/encryption.utils");
const encryptNGOApplicationPayload = (payload) => {
    return Object.assign(Object.assign({}, payload), { 
        // ================= Organization Information =================
        organizationName: (0, encryption_utils_1.encrypt)(payload.organizationName), organizationType: (0, encryption_utils_1.encrypt)(payload.organizationType), registrationNumber: (0, encryption_utils_1.encrypt)(payload.registrationNumber), countryOfRegistration: (0, encryption_utils_1.encrypt)(payload.countryOfRegistration), headquartersAddress: (0, encryption_utils_1.encrypt)(payload.headquartersAddress), website: payload.website ? (0, encryption_utils_1.encrypt)(payload.website) : undefined, 
        // ================= Primary Contact Person =================
        primaryContact: {
            fullName: (0, encryption_utils_1.encrypt)(payload.primaryContact.fullName),
            titleOrPosition: (0, encryption_utils_1.encrypt)(payload.primaryContact.titleOrPosition),
            email: (0, encryption_utils_1.encrypt)(payload.primaryContact.email),
            phoneNumber: (0, encryption_utils_1.encrypt)(payload.primaryContact.phoneNumber),
            whatsappNumber: payload.primaryContact.whatsappNumber
                ? (0, encryption_utils_1.encrypt)(payload.primaryContact.whatsappNumber)
                : undefined,
        }, 
        // ================= Program Details =================
        targetCommunityRegion: (0, encryption_utils_1.encrypt)(payload.targetCommunityRegion), beneficiaryDemographics: (0, encryption_utils_1.encrypt)(payload.beneficiaryDemographics), programDuration: (0, encryption_utils_1.encrypt)(payload.programDuration), 
        // ================= Membership Configuration =================
        membershipTier: (0, encryption_utils_1.encrypt)(payload.membershipTier), mixedTierBreakdown: payload.mixedTierBreakdown
            ? (0, encryption_utils_1.encrypt)(payload.mixedTierBreakdown)
            : undefined, beneficiarySelectionCriteria: (0, encryption_utils_1.encrypt)(payload.beneficiarySelectionCriteria), healthPriorities: (0, encryption_utils_1.encrypt)(payload.healthPriorities), healthPrioritiesOtherSpacify: payload.healthPrioritiesOtherSpacify
            ? (0, encryption_utils_1.encrypt)(payload.healthPrioritiesOtherSpacify)
            : undefined, 
        // ================= Data & Reporting Requirements =================
        reportingFrequency: (0, encryption_utils_1.encrypt)(payload.reportingFrequency), requiredMetrics: (0, encryption_utils_1.encrypt)(payload.requiredMetrics), dataAccessLevel: (0, encryption_utils_1.encrypt)(payload.dataAccessLevel), 
        // ================= Budget & Payment =================
        fundingSource: (0, encryption_utils_1.encrypt)(payload.fundingSource), paymentSchedule: (0, encryption_utils_1.encrypt)(payload.paymentSchedule), paymentMethod: payload.paymentMethod, 
        // ================= Supporting Documents =================
        // Note: Usually we encrypt the file URLs or store them as is if the bucket is private
        organizationRegistrationCertificate: payload.organizationRegistrationCertificate
            ? (0, encryption_utils_1.encrypt)(payload.organizationRegistrationCertificate)
            : undefined, taxExemptStatus: payload.taxExemptStatus
            ? (0, encryption_utils_1.encrypt)(payload.taxExemptStatus)
            : undefined, programProposal: payload.programProposal
            ? (0, encryption_utils_1.encrypt)(payload.programProposal)
            : undefined, budgetBreakdown: payload.budgetBreakdown
            ? (0, encryption_utils_1.encrypt)(payload.budgetBreakdown)
            : undefined });
};
exports.encryptNGOApplicationPayload = encryptNGOApplicationPayload;
