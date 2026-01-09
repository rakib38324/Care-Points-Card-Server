"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployerApplicationValidations = void 0;
const zod_1 = require("zod");
const createEmployerApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        // ================= Company Information =================
        companyName: zod_1.z.string({ error: 'Company Name is required.' }),
        industry: zod_1.z.string({ error: 'Industry is required.' }),
        companySize: zod_1.z.enum(['10-50', '51-200', '201-500', '500+'], {
            error: 'Company Size is required.',
        }),
        registrationNumber: zod_1.z.string({ error: 'Registration Number is required.' }),
        countryOfRegistration: zod_1.z.string({
            error: 'Country of Registration is required.',
        }),
        headquartersAddress: zod_1.z.string({
            error: 'Headquarters Address is required.',
        }),
        website: zod_1.z.string().url().optional(),
        // ================= Primary Contact =================
        primaryContact: zod_1.z.object({
            fullName: zod_1.z.string({ error: 'Full Name is required.' }),
            titleOrPosition: zod_1.z.string({ error: 'Title/Position is required.' }),
            email: zod_1.z
                .string({ error: 'Email is required.' })
                .email('Invalid email address'),
            phoneNumber: zod_1.z.string({ error: 'Phone Number is required.' }),
            whatsappNumber: zod_1.z.string().optional(),
        }),
        // ================= Employee Coverage Details =================
        numberOfEmployeesToEnroll: zod_1.z
            .number({ error: 'Number of employees is required.' })
            .min(1),
        employeeLocations: zod_1.z.string({ error: 'Employee Location is required.' }),
        coverageType: zod_1.z.enum(['Employee Only', 'Employee + Spouse', 'Employee + Family'], {
            error: 'Coverage Type is required.',
        }),
        eligibilityCriteria: zod_1.z.string({
            error: 'Eligibility criteria is required.',
        }),
        eligibilityCriteriaOther: zod_1.z.string().optional(),
        // ================= Membership Configuration =================
        // membershipTier: z.string({ error: 'Membership Tier is required.' }),
        membershipTier: zod_1.z.enum([
            'Preventative Wellness Care (all employees)',
            'Disease Monitoring & Management (all employees)',
            'Tiered by role/seniority (specify)',
        ], {
            error: 'Membership Tier is required.',
        }),
        membershipTierDetails: zod_1.z.string().optional(),
        onboardingApproach: zod_1.z.enum(['Phased rollout', 'All at once', 'Voluntary enrollment'], {
            error: 'Onboarding approach is required.',
        }),
        // ================= Program Customization =================
        wellnessPriorities: zod_1.z.enum([
            'Preventative health screenings',
            'Chronic disease management',
            'Mental health support',
            'Nutrition counseling',
            'Fitness tracking',
        ], {
            error: 'Wellness Priorities is required.',
        }),
        additionalServicesRequested: zod_1.z.enum([
            'On-site health fairs',
            'Group wellness workshops',
            'Executive health assessments',
            'Telemedicine for dependents',
        ], {
            error: 'Additional Services is required.',
        }),
        // ================= Reporting & Analytics =================
        dashboardAccess: zod_1.z.enum(['HR Admin only', 'Multiple users (specify number)'], {
            error: 'Dashboard Access section is required.',
        }),
        dashboardAccessSpecificNumber: zod_1.z.number().optional(),
        reportingFrequency: zod_1.z.enum(['Monthly', 'Quarterly', 'Annually'], {
            error: 'Reporting frequency is required.',
        }),
        keyMetrics: zod_1.z.enum([
            'Enrollment rates',
            'Utilization rates',
            'Health outcomes',
            'Cost per employee',
            'Absenteeism impact',
            'Employee satisfaction',
        ], {
            error: 'Key Metrics  is required.',
        }),
        // ================= Budget & Payment =================
        estimatedAnnualCost: zod_1.z.number().optional(),
        costSharingModel: zod_1.z.enum([
            'Employee pays 100%',
            'Employer pays 50%, employee pays 50%',
            'Employee pays 100% (employer-facilitated)',
        ], {
            error: 'Key Metrics  is required.',
        }),
        paymentSchedule: zod_1.z.enum(['Annual', 'Quarterly', 'Monthly'], {
            error: 'Payment schedule is required.',
        }),
        paymentMethod: zod_1.z.enum(['Wire Transfer', 'ACH/Bank Transfer', 'Corporate Credit Card'], {
            error: 'Payment method is required.',
        }),
        // ================= Implementation Timeline =================
        desiredStartDate: zod_1.z.string({ error: 'Desired start date is required.' }),
        openEnrollmentPeriod: zod_1.z.object({
            start: zod_1.z.string({ error: 'Enrollment start date is required.' }),
            end: zod_1.z.string({ error: 'Enrollment end date is required.' }),
        }),
        communicationSupportNeeded: zod_1.z
            .enum([
            'Employee announcement templates',
            'Benefits presentation',
            'FAQ documents',
            'Onboarding webinar',
        ], {
            error: 'Communication Support Needed is required.',
        })
            .optional(),
        // ================= Legal & Compliance =================
        agreePartnershipTerms: zod_1.z.boolean().refine((val) => val === true, {
            message: 'You must agree to the partnership terms',
        }),
        agreeDataPrivacyCompliance: zod_1.z.boolean().refine((val) => val === true, {
            message: 'You must agree to data privacy compliance',
        }),
        agreeEmployeeConsentCollection: zod_1.z.boolean().refine((val) => val === true, {
            message: 'You must agree to facilitate consent collection',
        }),
        authorizeDirectCommunication: zod_1.z.boolean().optional(),
        // ================= Supporting Documents =================
        companyRegistrationCertificate: zod_1.z.string().optional(),
        benefitsPolicyOverview: zod_1.z.string().optional(),
        employeeDemographicsSummary: zod_1.z.string().optional(),
    }),
});
const updateEmployerApplicationValidationSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        // ================= Company Information =================
        companyName: zod_1.z.string({ error: 'Company Name is required.' }).optional(),
        industry: zod_1.z.string({ error: 'Industry is required.' }).optional(),
        companySize: zod_1.z
            .enum(['10-50', '51-200', '201-500', '500+'], {
            error: 'Company Size is required.',
        })
            .optional(),
        registrationNumber: zod_1.z
            .string({ error: 'Registration Number is required.' })
            .optional(),
        countryOfRegistration: zod_1.z
            .string({ error: 'Country of Registration is required.' })
            .optional(),
        headquartersAddress: zod_1.z
            .string({ error: 'Headquarters Address is required.' })
            .optional(),
        website: zod_1.z.string().url().optional(),
        // ================= Primary Contact =================
        primaryContact: zod_1.z
            .object({
            fullName: zod_1.z.string({ error: 'Full Name is required.' }).optional(),
            titleOrPosition: zod_1.z
                .string({ error: 'Title/Position is required.' })
                .optional(),
            email: zod_1.z
                .string({ error: 'Email is required.' })
                .email('Invalid email address')
                .optional(),
            phoneNumber: zod_1.z
                .string({ error: 'Phone Number is required.' })
                .optional(),
            whatsappNumber: zod_1.z.string().optional(),
        })
            .optional(),
        // ================= Employee Coverage Details =================
        numberOfEmployeesToEnroll: zod_1.z
            .number({ error: 'Number of employees is required.' })
            .min(1)
            .optional(),
        employeeLocations: zod_1.z
            .string({ error: 'Employee Location is required.' })
            .optional(),
        coverageType: zod_1.z
            .enum(['Employee Only', 'Employee + Spouse', 'Employee + Family'], {
            error: 'Coverage Type is required.',
        })
            .optional(),
        eligibilityCriteria: zod_1.z
            .string({ error: 'Eligibility criteria is required.' })
            .optional(),
        eligibilityCriteriaOther: zod_1.z.string().optional(),
        // ================= Membership Configuration =================
        // membershipTier: z.string({ error: 'Membership Tier is required.' }) .optional(),
        membershipTier: zod_1.z
            .enum([
            'Preventative Wellness Care (all employees)',
            'Disease Monitoring & Management (all employees)',
            'Tiered by role/seniority (specify)',
        ], {
            error: 'Membership Tier is required.',
        })
            .optional(),
        membershipTierDetails: zod_1.z.string().optional(),
        onboardingApproach: zod_1.z
            .enum(['Phased rollout', 'All at once', 'Voluntary enrollment'], {
            error: 'Onboarding approach is required.',
        })
            .optional(),
        // ================= Program Customization =================
        wellnessPriorities: zod_1.z
            .enum([
            'Preventative health screenings',
            'Chronic disease management',
            'Mental health support',
            'Nutrition counseling',
            'Fitness tracking',
        ], {
            error: 'Wellness Priorities is required.',
        })
            .optional(),
        additionalServicesRequested: zod_1.z
            .enum([
            'On-site health fairs',
            'Group wellness workshops',
            'Executive health assessments',
            'Telemedicine for dependents',
        ], {
            error: 'Additional Services is required.',
        })
            .optional(),
        // ================= Reporting & Analytics =================
        dashboardAccess: zod_1.z
            .enum(['HR Admin only', 'Multiple users (specify number)'], {
            error: 'Dashboard Access section is required.',
        })
            .optional(),
        dashboardAccessSpecificNumber: zod_1.z.number().optional(),
        reportingFrequency: zod_1.z
            .enum(['Monthly', 'Quarterly', 'Annually'], {
            error: 'Reporting frequency is required.',
        })
            .optional(),
        keyMetrics: zod_1.z
            .enum([
            'Enrollment rates',
            'Utilization rates',
            'Health outcomes',
            'Cost per employee',
            'Absenteeism impact',
            'Employee satisfaction',
        ], {
            error: 'Key Metrics  is required.',
        })
            .optional(),
        // ================= Budget & Payment =================
        estimatedAnnualCost: zod_1.z.number().optional(),
        costSharingModel: zod_1.z
            .enum([
            'Employee pays 100%',
            'Employer pays 50%, employee pays 50%',
            'Employee pays 100% (employer-facilitated)',
        ], {
            error: 'Key Metrics  is required.',
        })
            .optional(),
        paymentSchedule: zod_1.z
            .enum(['Annual', 'Quarterly', 'Monthly'], {
            error: 'Payment schedule is required.',
        })
            .optional(),
        paymentMethod: zod_1.z
            .enum(['Wire Transfer', 'ACH/Bank Transfer', 'Corporate Credit Card'], {
            error: 'Payment method is required.',
        })
            .optional(),
        // ================= Implementation Timeline =================
        desiredStartDate: zod_1.z
            .string({ error: 'Desired start date is required.' })
            .optional(),
        openEnrollmentPeriod: zod_1.z
            .object({
            start: zod_1.z
                .string({ error: 'Enrollment start date is required.' })
                .optional(),
            end: zod_1.z
                .string({ error: 'Enrollment end date is required.' })
                .optional(),
        })
            .optional(),
        communicationSupportNeeded: zod_1.z
            .enum([
            'Employee announcement templates',
            'Benefits presentation',
            'FAQ documents',
            'Onboarding webinar',
        ], {
            error: 'Communication Support Needed is required.',
        })
            .optional(),
        // ================= Legal & Compliance =================
        agreePartnershipTerms: zod_1.z
            .boolean()
            .refine((val) => val === true, {
            message: 'You must agree to the partnership terms',
        })
            .optional(),
        agreeDataPrivacyCompliance: zod_1.z
            .boolean()
            .refine((val) => val === true, {
            message: 'You must agree to data privacy compliance',
        })
            .optional(),
        agreeEmployeeConsentCollection: zod_1.z
            .boolean()
            .refine((val) => val === true, {
            message: 'You must agree to facilitate consent collection',
        })
            .optional(),
        authorizeDirectCommunication: zod_1.z.boolean().optional(),
        // ================= Supporting Documents =================
        companyRegistrationCertificate: zod_1.z.string().optional(),
        benefitsPolicyOverview: zod_1.z.string().optional(),
        employeeDemographicsSummary: zod_1.z.string().optional(),
    })
        .optional(),
});
exports.EmployerApplicationValidations = {
    createEmployerApplicationValidationSchema,
    updateEmployerApplicationValidationSchema,
};
