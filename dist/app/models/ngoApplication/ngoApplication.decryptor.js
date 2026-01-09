"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptNGOApplicationPayload = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const encryption_utils_1 = require("../../utils/encryption.utils");
const decryptNGOApplicationPayload = (payload) => {
    return {
        _id: payload === null || payload === void 0 ? void 0 : payload._id,
        userId: payload === null || payload === void 0 ? void 0 : payload.userId,
        paymentId: payload === null || payload === void 0 ? void 0 : payload.paymentId,
        // ================= Organization Information =================
        organizationName: (0, encryption_utils_1.decrypt)(payload.organizationName),
        organizationType: (0, encryption_utils_1.decrypt)(payload.organizationType),
        registrationNumber: (0, encryption_utils_1.decrypt)(payload.registrationNumber),
        countryOfRegistration: (0, encryption_utils_1.decrypt)(payload.countryOfRegistration),
        headquartersAddress: (0, encryption_utils_1.decrypt)(payload.headquartersAddress),
        website: payload.website
            ? (0, encryption_utils_1.decrypt)(payload.website)
            : undefined,
        // ================= Primary Contact Person =================
        primaryContact: {
            fullName: (0, encryption_utils_1.decrypt)(payload.primaryContact.fullName),
            titleOrPosition: (0, encryption_utils_1.decrypt)(payload.primaryContact.titleOrPosition),
            email: (0, encryption_utils_1.decrypt)(payload.primaryContact.email),
            phoneNumber: (0, encryption_utils_1.decrypt)(payload.primaryContact.phoneNumber),
            whatsappNumber: payload.primaryContact.whatsappNumber
                ? (0, encryption_utils_1.decrypt)(payload.primaryContact.whatsappNumber)
                : undefined,
        },
        // ================= Program Details =================
        targetCommunityRegion: (0, encryption_utils_1.decrypt)(payload.targetCommunityRegion),
        numberOfBeneficiaries: payload.numberOfBeneficiaries,
        beneficiaryDemographics: (0, encryption_utils_1.decrypt)(payload.beneficiaryDemographics),
        programDuration: (0, encryption_utils_1.decrypt)(payload.programDuration),
        // ================= Membership Configuration =================
        membershipTier: (0, encryption_utils_1.decrypt)(payload.membershipTier),
        mixedTierBreakdown: payload.mixedTierBreakdown
            ? (0, encryption_utils_1.decrypt)(payload.mixedTierBreakdown)
            : undefined,
        beneficiarySelectionCriteria: (0, encryption_utils_1.decrypt)(payload.beneficiarySelectionCriteria),
        healthPriorities: (0, encryption_utils_1.decrypt)(payload.healthPriorities),
        healthPrioritiesOtherSpacify: payload.healthPrioritiesOtherSpacify
            ? (0, encryption_utils_1.decrypt)(payload.healthPrioritiesOtherSpacify)
            : undefined,
        // ================= Data & Reporting Requirements =================
        reportingFrequency: (0, encryption_utils_1.decrypt)(payload.reportingFrequency),
        requiredMetrics: (0, encryption_utils_1.decrypt)(payload.requiredMetrics),
        dataAccessLevel: (0, encryption_utils_1.decrypt)(payload.dataAccessLevel),
        // ================= Budget & Payment =================
        estimatedTotalAnnualBudget: payload.estimatedTotalAnnualBudget,
        fundingSource: (0, encryption_utils_1.decrypt)(payload.fundingSource),
        paymentSchedule: (0, encryption_utils_1.decrypt)(payload.paymentSchedule),
        paymentMethod: payload.paymentMethod,
        isPaid: payload.isPaid,
        // ================= Partnership Terms =================
        agreeProvideBeneficiaryData: payload.agreeProvideBeneficiaryData,
        agreeBloodTestCoordination: payload.agreeBloodTestCoordination,
        agreePartnershipTerms: payload.agreePartnershipTerms,
        agreeDataPrivacyCompliance: payload.agreeDataPrivacyCompliance,
        // ================= Supporting Documents =================
        organizationRegistrationCertificate: payload.organizationRegistrationCertificate
            ? (0, encryption_utils_1.decrypt)(payload.organizationRegistrationCertificate)
            : undefined,
        taxExemptStatus: payload.taxExemptStatus
            ? (0, encryption_utils_1.decrypt)(payload.taxExemptStatus)
            : undefined,
        programProposal: payload.programProposal
            ? (0, encryption_utils_1.decrypt)(payload.programProposal)
            : undefined,
        budgetBreakdown: payload.budgetBreakdown
            ? (0, encryption_utils_1.decrypt)(payload.budgetBreakdown)
            : undefined,
        isDeleted: payload.isDeleted,
        createdAt: payload.createdAt,
        updatedAt: payload.updatedAt,
    };
};
exports.decryptNGOApplicationPayload = decryptNGOApplicationPayload;
