"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberApplicationValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
/**
 * ================= Family Member Validation =================
 */
const familyMemberSchema = zod_1.z.object({
    fullName: zod_1.z.string({ error: 'Full name is required.' }),
    relationship: zod_1.z.string({ error: 'Relationship is required.' }),
    dateOfBirth: zod_1.z.string().optional(), // keep string if frontend sends string
});
/**
 * ================= Create Member Application =================
 */
const phoneRegex = /^\+[1-9]\d{7,14}$/;
const createMemberApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // ================= Personal Information =================
        fullName: zod_1.z.string({ error: 'Full name is required.' }),
        dateOfBirth: zod_1.z.string({ error: 'Date of birth is required.' }),
        gender: zod_1.z.enum(['Male', 'Female', 'Other'], {
            error: 'Gender is required.',
        }),
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
        cityOrRegion: zod_1.z.string({ error: 'City or region is required.' }),
        fullAddress: zod_1.z.string({ error: 'Full address is required.' }),
        // ================= Membership Selection =================
        membershipTier: zod_1.z.enum([
            'Preventative Wellness Care',
            'Disease Monitoring & Management',
            'Family & Friends Plan',
        ], { error: 'Membership tier is required.' }),
        familyMembers: zod_1.z.array(familyMemberSchema).optional(),
        // ================= Health Information =================
        currentHealthStatus: zod_1.z.enum(['Health/Preventative focus', 'Managing chronic conditions', 'Other'], { error: 'Health status is required.' }),
        existingConditions: zod_1.z.string().optional(),
        currentMedications: zod_1.z.string().optional(),
        // ================= Onboarding =================
        bloodTestLocationPreference: zod_1.z.string({
            error: 'Blood test location preference is required.',
        }),
        preferredConsultationDate: zod_1.z.string({
            error: 'Preferred consultation date is required.',
        }),
        preferredConsultationTime: zod_1.z.string({
            error: 'Preferred consultation time is required.',
        }),
        // ================= Payment =================
        onboardingFee: zod_1.z.number().optional(),
        paymentMethod: zod_1.z.string({ error: 'Payment method is required.' }),
        notification: zod_1.z.boolean().optional(),
        PrivacyPolicyHIPAA: zod_1.z
            .boolean({ error: 'You must agree to Privacy Policy & HIPAA' })
            .refine((val) => val === true),
        TermsOfService: zod_1.z
            .boolean({ error: 'You must agree to Terms of Service.' })
            .refine((val) => val === true),
    }),
});
/**
 * ================= Update Member Application =================
 */
const updateMemberApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        fullName: zod_1.z.string().optional(),
        dateOfBirth: zod_1.z.string().optional(),
        gender: zod_1.z.enum(['Male', 'Female', 'Other']).optional(),
        phoneNumber: zod_1.z
            .string({ error: 'Phone number is required.' })
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
        cityOrRegion: zod_1.z.string().optional(),
        fullAddress: zod_1.z.string().optional(),
        membershipTier: zod_1.z
            .enum([
            'Preventative Wellness Care',
            'Disease Monitoring & Management',
            'Family & Friends Plan',
        ])
            .optional(),
        familyMembers: zod_1.z.array(familyMemberSchema).optional(),
        currentHealthStatus: zod_1.z
            .enum([
            'Health/Preventative focus',
            'Managing chronic conditions',
            'Other',
        ])
            .optional(),
        existingConditions: zod_1.z.string().optional(),
        currentMedications: zod_1.z.string().optional(),
        bloodTestLocationPreference: zod_1.z.string().optional(),
        preferredConsultationDate: zod_1.z.string().optional(),
        preferredConsultationTime: zod_1.z.string().optional(),
        onboardingFee: zod_1.z.number().optional(),
        paymentMethod: zod_1.z.string().optional(),
    }),
});
/**
 * ================= Export =================
 */
exports.MemberApplicationValidations = {
    createMemberApplicationValidationSchema,
    updateMemberApplicationValidationSchema,
};
