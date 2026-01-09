"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NGOApplicationValidations = void 0;
/* eslint-disable no-useless-escape */
const zod_1 = require("zod");
/**
 * ================= Common Helpers =================
 */
const phoneRegex = /^\+[1-9]\d{7,14}$/;
/**
 * ================= Beneficiary Demographics =================
 */
const beneficiaryDemographicsSchema = zod_1.z.object({
    children: zod_1.z.boolean().optional(),
    adults: zod_1.z.boolean().optional(),
    seniors: zod_1.z.boolean().optional(),
    pregnantWomen: zod_1.z.boolean().optional(),
    chronicDiseasePatients: zod_1.z.boolean().optional(),
});
/**
 * ================= Health Priorities =================
 */
const healthPrioritiesSchema = zod_1.z.object({
    preventativeCare: zod_1.z.boolean().optional(),
    chronicDiseaseManagement: zod_1.z.boolean().optional(),
    maternalHealth: zod_1.z.boolean().optional(),
    childHealth: zod_1.z.boolean().optional(),
    other: zod_1.z.string().optional(),
});
/**
 * ================= Required Metrics =================
 */
const requiredMetricsSchema = zod_1.z.object({
    numberOfConsultations: zod_1.z.boolean().optional(),
    healthOutcomes: zod_1.z.boolean().optional(),
    medicationAdherence: zod_1.z.boolean().optional(),
    preventativeScreeningsCompleted: zod_1.z.boolean().optional(),
    costPerBeneficiary: zod_1.z.boolean().optional(),
});
/**
 * ================= Supporting Documents =================
 */
const supportingDocumentsSchema = zod_1.z.object({});
/**
 * ================= Create NGO Group Sponsorship Application =================
 */
const createNGOApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        // ================= Organization Information =================
        organizationName: zod_1.z.string({ error: 'Organization name is required.' }),
        organizationType: zod_1.z.enum([
            'Non-Profit/NGO',
            'Faith-Based Organization',
            'Community Foundation',
            'International Development Agency',
            'Other',
        ], { error: 'Organization type is required.' }),
        registrationNumber: zod_1.z.string({
            error: 'Registration number is required.',
        }),
        countryOfRegistration: zod_1.z.string({
            error: 'Country of registration is required.',
        }),
        headquartersAddress: zod_1.z.string({
            error: 'Headquarters address is required.',
        }),
        website: zod_1.z.string().url().optional(),
        // ================= Primary Contact =================
        primaryContact: zod_1.z.object({
            fullName: zod_1.z.string({ error: 'Contact person name is required.' }),
            titleOrPosition: zod_1.z.string({
                error: 'Title or position is required.',
            }),
            email: zod_1.z.string().email({ message: 'Valid email is required.' }),
            phoneNumber: zod_1.z
                .string({ error: 'Phone number is required.' })
                .refine((val) => phoneRegex.test(val), {
                message: 'Phone number must include a valid country code (e.g. +8801712345678).',
            }),
            whatsappNumber: zod_1.z
                .string()
                .refine((val) => phoneRegex.test(val), {
                message: 'WhatsApp number must include a valid country code (e.g. +60123456789).',
            })
                .optional(),
        }),
        // ================= Program Details =================
        targetCommunityRegion: zod_1.z.string({
            error: 'Target community/region is required.',
        }),
        numberOfBeneficiaries: zod_1.z.number({
            error: 'Number of beneficiaries is required.',
        }),
        beneficiaryDemographics: zod_1.z.string({
            error: 'Beneficiary Demographics is required.',
        }),
        programDuration: zod_1.z.enum(['6 months', '1 year', '2 years', 'Ongoing'], {
            error: 'Program duration is required.',
        }),
        // ================= Membership Configuration =================
        membershipTier: zod_1.z.enum([
            'Preventative Wellness Care',
            'Disease Monitoring & Management',
            'Mixed',
        ], { error: 'Membership tier is required.' }),
        mixedTierBreakdown: zod_1.z.string().optional(),
        beneficiarySelectionCriteria: zod_1.z.string({
            error: 'Beneficiary selection criteria is required.',
        }),
        healthPriorities: zod_1.z.enum([
            'Preventative Care',
            'Chronic Disease Management',
            'Maternal Health',
            'Child Health',
            'Other (specify)'
        ], { error: 'Health Priorities is required.' }),
        healthPrioritiesOtherSpacify: zod_1.z.string().optional(),
        // ================= Data & Reporting =================
        reportingFrequency: zod_1.z.enum(['Monthly', 'Quarterly', 'Annually'], {
            error: 'Reporting frequency is required.',
        }),
        requiredMetrics: zod_1.z.enum([
            'Number of consultations',
            'Health outcomes',
            'Medication adherence',
            'Preventative screenings completed',
            'Cost per beneficiary'
        ], { error: 'Required Metrics is required.' }),
        dataAccessLevel: zod_1.z.enum(['Aggregated/anonymized only', 'Individual Level (With Consent)'], { error: 'Data access level is required.' }),
        // ================= Budget & Payment =================
        estimatedTotalAnnualBudget: zod_1.z.number({
            error: 'Estimated annual budget is required.',
        }),
        fundingSource: zod_1.z.enum(['Grant Funding', 'Donations', 'Institutional Budget', 'Mixed'], { error: 'Funding source is required.' }),
        paymentSchedule: zod_1.z.enum(['Upfront Annual', 'Quarterly', 'Monthly'], { error: 'Payment schedule is required.' }),
        paymentMethod: zod_1.z.enum(['Wire Transfer', 'ACH/Bank Transfer', 'Check'], { error: 'Payment method is required.' }),
        // ================= Agreements =================
        agreeProvideBeneficiaryData: zod_1.z
            .boolean({ error: 'Agreement is required.' })
            .refine((val) => val === true),
        agreeBloodTestCoordination: zod_1.z
            .boolean({ error: 'Agreement is required.' })
            .refine((val) => val === true),
        agreePartnershipTerms: zod_1.z
            .boolean({ error: 'You must agree to partnership terms.' })
            .refine((val) => val === true),
        agreeDataPrivacyCompliance: zod_1.z
            .boolean({ error: 'HIPAA/GDPR compliance is required.' })
            .refine((val) => val === true),
        // ================= Documents =================
        organizationRegistrationCertificate: zod_1.z.string().optional(),
        taxExemptStatus: zod_1.z.string().optional(),
        programProposal: zod_1.z.string().optional(),
        budgetBreakdown: zod_1.z.string().optional(),
    })
});
/**
 * ================= Update NGO Group Sponsorship Application =================
 */
const updateNGOApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        // ================= Organization Information =================
        organizationName: zod_1.z.string({ error: 'Organization name is required.' }).optional(),
        organizationType: zod_1.z.enum([
            'Non-Profit/NGO',
            'Faith-Based Organization',
            'Community Foundation',
            'International Development Agency',
            'Other',
        ], { error: 'Organization type is required.' }).optional(),
        registrationNumber: zod_1.z.string({
            error: 'Registration number is required.',
        }).optional(),
        countryOfRegistration: zod_1.z.string({
            error: 'Country of registration is required.',
        }).optional(),
        headquartersAddress: zod_1.z.string({
            error: 'Headquarters address is required.',
        }).optional(),
        website: zod_1.z.string().url().optional(),
        // ================= Primary Contact =================
        primaryContact: zod_1.z.object({
            fullName: zod_1.z.string({ error: 'Contact person name is required.' }).optional(),
            titleOrPosition: zod_1.z.string({
                error: 'Title or position is required.',
            }).optional(),
            email: zod_1.z.string().email({ message: 'Valid email is required.' }).optional(),
            phoneNumber: zod_1.z
                .string({ error: 'Phone number is required.' })
                .refine((val) => phoneRegex.test(val), {
                message: 'Phone number must include a valid country code (e.g. +8801712345678).',
            }).optional(),
            whatsappNumber: zod_1.z
                .string()
                .refine((val) => phoneRegex.test(val), {
                message: 'WhatsApp number must include a valid country code (e.g. +60123456789).',
            })
                .optional(),
        }).optional(),
        // ================= Program Details =================
        targetCommunityRegion: zod_1.z.string({
            error: 'Target community/region is required.',
        }).optional(),
        numberOfBeneficiaries: zod_1.z.number({
            error: 'Number of beneficiaries is required.',
        }).optional(),
        beneficiaryDemographics: zod_1.z.string({
            error: 'Beneficiary Demographics is required.',
        }).optional(),
        programDuration: zod_1.z.enum(['6 months', '1 year', '2 years', 'Ongoing'], {
            error: 'Program duration is required.',
        }).optional(),
        // ================= Membership Configuration =================
        membershipTier: zod_1.z.enum([
            'Preventative Wellness Care',
            'Disease Monitoring & Management',
            'Mixed',
        ], { error: 'Membership tier is required.' }).optional(),
        mixedTierBreakdown: zod_1.z.string().optional(),
        beneficiarySelectionCriteria: zod_1.z.string({
            error: 'Beneficiary selection criteria is required.',
        }).optional(),
        healthPriorities: zod_1.z.enum([
            'Preventative Care',
            'Chronic Disease Management',
            'Maternal Health',
            'Child Health',
            'Other (specify)'
        ], { error: 'Health Priorities is required.' }).optional(),
        healthPrioritiesOtherSpacify: zod_1.z.string().optional(),
        // ================= Data & Reporting =================
        reportingFrequency: zod_1.z.enum(['Monthly', 'Quarterly', 'Annually'], {
            error: 'Reporting frequency is required.',
        }).optional(),
        requiredMetrics: zod_1.z.enum([
            'Number of consultations',
            'Health outcomes',
            'Medication adherence',
            'Preventative screenings completed',
            'Cost per beneficiary'
        ], { error: 'Required Metrics is required.' }).optional(),
        dataAccessLevel: zod_1.z.enum(['Aggregated/Anonymized', 'Individual Level (With Consent)'], { error: 'Data access level is required.' }).optional(),
        // ================= Budget & Payment =================
        estimatedTotalAnnualBudget: zod_1.z.number({
            error: 'Estimated annual budget is required.',
        }).optional(),
        fundingSource: zod_1.z.enum(['Grant Funding', 'Donations', 'Institutional Budget', 'Mixed'], { error: 'Funding source is required.' }).optional(),
        paymentSchedule: zod_1.z.enum(['Upfront Annual', 'Quarterly', 'Monthly'], { error: 'Payment schedule is required.' }).optional(),
        paymentMethod: zod_1.z.enum(['Wire Transfer', 'ACH/Bank Transfer', 'Check'], { error: 'Payment method is required.' }).optional(),
        // ================= Agreements =================
        agreeProvideBeneficiaryData: zod_1.z
            .boolean({ error: 'Agreement is required.' })
            .refine((val) => val === true).optional(),
        agreeBloodTestCoordination: zod_1.z
            .boolean({ error: 'Agreement is required.' })
            .refine((val) => val === true).optional(),
        agreePartnershipTerms: zod_1.z
            .boolean({ error: 'You must agree to partnership terms.' })
            .refine((val) => val === true).optional(),
        agreeDataPrivacyCompliance: zod_1.z
            .boolean({ error: 'HIPAA/GDPR compliance is required.' })
            .refine((val) => val === true).optional(),
        // ================= Documents =================
        organizationRegistrationCertificate: zod_1.z.string().optional(),
        taxExemptStatus: zod_1.z.string().optional(),
        programProposal: zod_1.z.string().optional(),
        budgetBreakdown: zod_1.z.string().optional(),
    })
});
/**
 * ================= Export =================
 */
exports.NGOApplicationValidations = {
    createNGOApplicationValidationSchema,
    updateNGOApplicationValidationSchema,
};
