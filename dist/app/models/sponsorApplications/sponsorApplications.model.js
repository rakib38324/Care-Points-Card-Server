"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorApplications = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = require("mongoose");
/**
 * ================= Sponsored Member Sub Schema =================
 */
const sponsoredMemberSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    relationship: {
        type: String,
        required: true,
    },
    dateOfBirth: { type: String, required: true },
    gender: { type: String, required: true },
    countryOfResidence: { type: String, required: true },
    cityOrRegion: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    homeAddress: { type: String, required: true },
    currentHealthStatus: {
        type: String,
        required: true,
    },
    existingConditions: { type: String },
    membershipTier: {
        type: String,
        required: true,
    },
});
/**
 * ================= Main Schema =================
 */
const SponsorApplicationSchema = new mongoose_1.Schema({
    userId: mongoose_1.Schema.Types.ObjectId,
    paymentId: mongoose_1.Schema.Types.ObjectId,
    // ================= Sponsor Information =================
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String },
    countryOfResidence: { type: String, required: true },
    city: { type: String, required: true },
    fullAddress: { type: String, required: true },
    // ================= Sponsored Members =================
    numberOfMembers: { type: Number, required: true },
    sponsoredMembers: { type: [sponsoredMemberSchema], default: [] },
    // ================= Communication Preferences =================
    primaryContact: {
        type: String,
        required: true,
    },
    preferredCommunicationMethod: {
        type: String,
        required: true,
    },
    // ================= Payment & Billing =================
    totalOnboardingFees: { type: Number, required: true },
    membershipFeeEstimate: { type: String },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Credit/Debit Card', 'Bank Transfer', 'Mobile Money'],
    },
    isPaid: { type: Boolean, default: false },
    // ================= Reporting Preferences =================
    receiveMonthlyReports: { type: Boolean, default: false },
    accessDigitalHealthRecords: { type: Boolean, default: false },
    authorizeDirectCare: { type: Boolean, default: false },
    // ================= Consent & Agreements =================
    TermsOfService: { type: Boolean, required: true },
    PrivacyPolicyHIPAA: { type: Boolean, required: true },
    authorizeHealthcareUpdates: { type: Boolean, required: true },
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
exports.SponsorApplications = (0, mongoose_1.model)('SponsorApplication', SponsorApplicationSchema);
