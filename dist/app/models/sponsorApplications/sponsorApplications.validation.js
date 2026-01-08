"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SponsorApplicationValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
/**
 * ================= Sponsored Member Validation =================
 */
const phoneRegex = /^\+[1-9]\d{7,14}$/;
const sponsoredMemberSchema = zod_1.z.object({
    fullName: zod_1.z.string({ error: 'Full name is required.' }),
    relationship: zod_1.z.enum(['Parent', 'Spouse', 'Child', 'Sibling', 'Extended Family', 'Other'], { error: 'Relationship is required.' }),
    dateOfBirth: zod_1.z.string({ error: 'Date of birth is required.' }),
    gender: zod_1.z.enum(['Male', 'Female', 'Other'], { error: 'Gender is required.' }),
    countryOfResidence: zod_1.z.string({ error: 'Country is required.' }),
    cityOrRegion: zod_1.z.string({ error: 'City/Region is required.' }),
    phoneNumber: zod_1.z
        .string({ error: 'Phone number is required.' })
        .refine((value) => phoneRegex.test(value), {
        message: 'Phone number must include a valid country code (e.g. +8801712345678).',
    }),
    email: zod_1.z.string().email().optional(),
    homeAddress: zod_1.z.string({ error: 'Home address is required.' }),
    currentHealthStatus: zod_1.z.enum(['Healthy', 'Managing Condition', 'Other'], { error: 'Please select a health status: Healthy, Managing Condition, or Other.' }),
    existingConditions: zod_1.z.string().optional(),
    membershipTier: zod_1.z.enum(['Preventative Wellness Care', 'Disease Monitoring & Management'], { error: 'Please select a valid membership tier (Preventative Wellness Care or Disease Monitoring & Management).' }),
});
/**
 * ================= Create  Sponsor Application =================
 */
const createSponsorValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // ================= Sponsor Information =================
        fullName: zod_1.z.string({ error: 'Sponsor full name is required.' }),
        phoneNumber: zod_1.z
            .string({ error: 'Phone number is required.' })
            .refine((value) => phoneRegex.test(value), {
            message: 'Phone number must include a valid country code (e.g. +8801712345678).',
        }),
        whatsappNumber: zod_1.z
            .string()
            .refine((value) => phoneRegex.test(value), {
            message: 'WhatsApp number must include a valid country code (e.g. +60123456789).',
        })
            .optional(),
        countryOfResidence: zod_1.z.string({ error: 'Country is required.' }),
        city: zod_1.z.string({ error: 'City is required.' }),
        fullAddress: zod_1.z.string({ error: 'Full address is required.' }),
        // ================= Sponsored Members =================
        numberOfMembers: zod_1.z
            .number({ error: 'Number of members is required.' })
            .min(1, { message: 'Must sponsor at least 1 member.' })
            .max(10, { message: 'Cannot sponsor more than 10 members.' }),
        sponsoredMembers: zod_1.z.array(sponsoredMemberSchema),
        // ================= Communication Preferences =================
        primaryContact: zod_1.z.enum(['Sponsor only', 'Sponsored members directly', 'Both'], { error: 'Primary contact is required.' }),
        preferredCommunicationMethod: zod_1.z.enum(['Email', 'WhatsApp', 'SMS', 'Phone'], {
            error: 'Preferred communication method is required.',
        }),
        // ================= Payment & Billing =================
        totalOnboardingFees: zod_1.z.number({ error: 'Total onboarding fees are required.' }),
        membershipFeeEstimate: zod_1.z.string().optional(),
        paymentMethod: zod_1.z.enum(['Credit/Debit Card', 'Bank Transfer', 'Mobile Money'], {
            error: 'Payment method is required.',
        }),
        // ================= Reporting Preferences =================
        receiveMonthlyReports: zod_1.z.boolean().optional(),
        accessDigitalHealthRecords: zod_1.z.boolean().optional(),
        authorizeDirectCare: zod_1.z.boolean().optional(),
        // ================= Consent & Agreements =================
        TermsOfService: zod_1.z.boolean({ error: 'You must agree to Terms of Service.' }).refine(val => val === true),
        PrivacyPolicyHIPAA: zod_1.z.boolean({ error: 'You must agree to Privacy Policy.' }).refine(val => val === true),
        authorizeHealthcareUpdates: zod_1.z.boolean({ error: 'Authorization for healthcare updates is required.' }).refine(val => val === true),
    }),
});
/**
 * ================= Update  Sponsor Application =================
 */
const updateSponsorValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        phoneNumber: zod_1.z
            .string()
            .refine((value) => phoneRegex.test(value), {
            message: 'Phone number must include a valid country code (e.g. +8801712345678).',
        })
            .optional(),
        whatsappNumber: zod_1.z
            .string()
            .refine((value) => phoneRegex.test(value), {
            message: 'WhatsApp number must include a valid country code (e.g. +60123456789).',
        })
            .optional(),
        countryOfResidence: zod_1.z.string().optional(),
        city: zod_1.z.string().optional(),
        fullAddress: zod_1.z.string().optional(),
        numberOfMembers: zod_1.z.number().min(1).max(10).optional(),
        sponsoredMembers: zod_1.z.array(sponsoredMemberSchema).optional(),
        primaryContact: zod_1.z.enum(['Sponsor only', 'Sponsored members directly', 'Both']).optional(),
        preferredCommunicationMethod: zod_1.z.enum(['Email', 'WhatsApp', 'SMS', 'Phone']).optional(),
        totalOnboardingFees: zod_1.z.number().optional(),
        membershipFeeEstimate: zod_1.z.number().optional(),
        paymentMethod: zod_1.z.enum(['Credit/Debit Card', 'Bank Transfer', 'Mobile Money']).optional(),
        isPaid: zod_1.z.boolean().optional(),
        receiveMonthlyReports: zod_1.z.boolean().optional(),
        accessDigitalHealthRecords: zod_1.z.boolean().optional(),
        authorizeDirectCare: zod_1.z.boolean().optional(),
        TermsOfService: zod_1.z.boolean().optional(),
        PrivacyPolicyHIPAA: zod_1.z.boolean().optional(),
        authorizeHealthcareUpdates: zod_1.z.boolean().optional(),
    }),
});
/**
 * ================= Export =================
 */
exports.SponsorApplicationValidations = {
    createSponsorValidationSchema,
    updateSponsorValidationSchema,
};
