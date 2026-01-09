"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NGOApplication = void 0;
const mongoose_1 = require("mongoose");
/**
 * ================= Primary Contact Sub Schema =================
 */
const primaryContactSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    titleOrPosition: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String },
}, { _id: false });
/**
 * ================= Main NGO Application Schema =================
 */
const ngoApplicationSchema = new mongoose_1.Schema({
    userId: mongoose_1.Schema.Types.ObjectId,
    paymentId: mongoose_1.Schema.Types.ObjectId,
    // ================= Organization Information =================
    organizationName: { type: String, required: true },
    organizationType: { type: String, required: true },
    registrationNumber: { type: String, required: true },
    countryOfRegistration: { type: String, required: true },
    headquartersAddress: { type: String, required: true },
    website: { type: String },
    // ================= Primary Contact Person =================
    primaryContact: {
        type: primaryContactSchema,
        required: true,
    },
    // ================= Program Details =================
    targetCommunityRegion: { type: String, required: true },
    numberOfBeneficiaries: { type: Number, required: true },
    beneficiaryDemographics: { type: String, required: true },
    programDuration: { type: String, required: true },
    // ================= Membership Configuration =================
    membershipTier: { type: String, required: true },
    mixedTierBreakdown: { type: String },
    beneficiarySelectionCriteria: { type: String, required: true },
    healthPriorities: { type: String, required: true },
    healthPrioritiesOtherSpacify: { type: String },
    // ================= Data & Reporting Requirements =================
    reportingFrequency: { type: String, required: true },
    requiredMetrics: { type: String, required: true },
    dataAccessLevel: { type: String, required: true },
    // ================= Budget & Payment =================
    estimatedTotalAnnualBudget: { type: Number, required: true },
    fundingSource: { type: String, required: true },
    paymentSchedule: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    isPaid: { type: Boolean, default: false },
    // ================= Partnership Terms =================
    agreeProvideBeneficiaryData: { type: Boolean, required: true },
    agreeBloodTestCoordination: { type: Boolean, required: true },
    agreePartnershipTerms: { type: Boolean, required: true },
    agreeDataPrivacyCompliance: { type: Boolean, required: true },
    // ================= Supporting Documents =================
    organizationRegistrationCertificate: { type: String }, // URL
    taxExemptStatus: { type: String }, // URL
    programProposal: { type: String }, // URL
    budgetBreakdown: { type: String }, // URL
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
/**
 * ================= Model Export =================
 */
exports.NGOApplication = (0, mongoose_1.model)('NGOApplication', ngoApplicationSchema);
