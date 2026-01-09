/* eslint-disable no-useless-escape */
import { z } from 'zod';

/**
 * ================= Common Helpers =================
 */
const phoneRegex = /^\+[1-9]\d{7,14}$/;

/**
 * ================= Beneficiary Demographics =================
 */
const beneficiaryDemographicsSchema = z.object({
  children: z.boolean().optional(),
  adults: z.boolean().optional(),
  seniors: z.boolean().optional(),
  pregnantWomen: z.boolean().optional(),
  chronicDiseasePatients: z.boolean().optional(),
});

/**
 * ================= Health Priorities =================
 */
const healthPrioritiesSchema = z.object({
  preventativeCare: z.boolean().optional(),
  chronicDiseaseManagement: z.boolean().optional(),
  maternalHealth: z.boolean().optional(),
  childHealth: z.boolean().optional(),
  other: z.string().optional(),
});

/**
 * ================= Required Metrics =================
 */
const requiredMetricsSchema = z.object({
  numberOfConsultations: z.boolean().optional(),
  healthOutcomes: z.boolean().optional(),
  medicationAdherence: z.boolean().optional(),
  preventativeScreeningsCompleted: z.boolean().optional(),
  costPerBeneficiary: z.boolean().optional(),
});

/**
 * ================= Supporting Documents =================
 */
const supportingDocumentsSchema = z.object({});

/**
 * ================= Create NGO Group Sponsorship Application =================
 */
const createNGOApplicationValidationSchema = z.object({
  body: z.object({
    // ================= Organization Information =================
    organizationName: z.string({ error: 'Organization name is required.' }),
    organizationType: z.enum(
      [
        'Non-Profit/NGO',
        'Faith-Based Organization',
        'Community Foundation',
        'International Development Agency',
        'Other',
      ],
      { error: 'Organization type is required.' },
    ),
    registrationNumber: z.string({
      error: 'Registration number is required.',
    }),
    countryOfRegistration: z.string({
      error: 'Country of registration is required.',
    }),
    headquartersAddress: z.string({
      error: 'Headquarters address is required.',
    }),
    website: z.string().url().optional(),

    // ================= Primary Contact =================
    primaryContact: z.object({
      fullName: z.string({ error: 'Contact person name is required.' }),
      titleOrPosition: z.string({
        error: 'Title or position is required.',
      }),
      email: z.string().email({ message: 'Valid email is required.' }),
      phoneNumber: z
        .string({ error: 'Phone number is required.' })
        .refine((val) => phoneRegex.test(val), {
          message:
            'Phone number must include a valid country code (e.g. +8801712345678).',
        }),
      whatsappNumber: z
        .string()
        .refine((val) => phoneRegex.test(val), {
          message:
            'WhatsApp number must include a valid country code (e.g. +60123456789).',
        })
        .optional(),
    }),

    // ================= Program Details =================
    targetCommunityRegion: z.string({
      error: 'Target community/region is required.',
    }),
    numberOfBeneficiaries: z.number({
      error: 'Number of beneficiaries is required.',
    }),
    beneficiaryDemographics: z.string({
      error: 'Beneficiary Demographics is required.',
    }),
    programDuration: z.enum(['6 months', '1 year', '2 years', 'Ongoing'], {
      error: 'Program duration is required.',
    }),

    // ================= Membership Configuration =================
    membershipTier: z.enum(
      [
        'Preventative Wellness Care',
        'Disease Monitoring & Management',
        'Mixed',
      ],
      { error: 'Membership tier is required.' },
    ),
    mixedTierBreakdown: z.string().optional(),
    beneficiarySelectionCriteria: z.string({
      error: 'Beneficiary selection criteria is required.',
    }),
    healthPriorities: z.enum(
      [
        'Preventative Care',
        'Chronic Disease Management',
        'Maternal Health',
        'Child Health',
        'Other (specify)',
      ],
      { error: 'Health Priorities is required.' },
    ),
    healthPrioritiesOtherSpacify: z.string().optional(),

    // ================= Data & Reporting =================
    reportingFrequency: z.enum(['Monthly', 'Quarterly', 'Annually'], {
      error: 'Reporting frequency is required.',
    }),
    requiredMetrics: z.enum(
      [
        'Number of consultations',
        'Health outcomes',
        'Medication adherence',
        'Preventative screenings completed',
        'Cost per beneficiary',
      ],
      { error: 'Required Metrics is required.' },
    ),
    dataAccessLevel: z.enum(
      ['Aggregated/anonymized only', 'Individual Level (With Consent)'],
      { error: 'Data access level is required.' },
    ),

    // ================= Budget & Payment =================
    estimatedTotalAnnualBudget: z.number({
      error: 'Estimated annual budget is required.',
    }),
    fundingSource: z.enum(
      ['Grant Funding', 'Donations', 'Institutional Budget', 'Mixed'],
      { error: 'Funding source is required.' },
    ),
    paymentSchedule: z.enum(['Upfront Annual', 'Quarterly', 'Monthly'], {
      error: 'Payment schedule is required.',
    }),
    paymentMethod: z.enum(['Wire Transfer', 'ACH/Bank Transfer', 'Check'], {
      error: 'Payment method is required.',
    }),

    // ================= Agreements =================
    agreeProvideBeneficiaryData: z
      .boolean({ error: 'Agreement is required.' })
      .refine((val) => val === true),
    agreeBloodTestCoordination: z
      .boolean({ error: 'Agreement is required.' })
      .refine((val) => val === true),
    agreePartnershipTerms: z
      .boolean({ error: 'You must agree to partnership terms.' })
      .refine((val) => val === true),
    agreeDataPrivacyCompliance: z
      .boolean({ error: 'HIPAA/GDPR compliance is required.' })
      .refine((val) => val === true),

    // ================= Documents =================
    organizationRegistrationCertificate: z.string().optional(),
    taxExemptStatus: z.string().optional(),
    programProposal: z.string().optional(),
    budgetBreakdown: z.string().optional(),
  }),
});

/**
 * ================= Update NGO Group Sponsorship Application =================
 */
const updateNGOApplicationValidationSchema = z.object({
  body: z.object({
    // ================= Organization Information =================
    organizationName: z
      .string({ error: 'Organization name is required.' })
      .optional(),
    organizationType: z
      .enum(
        [
          'Non-Profit/NGO',
          'Faith-Based Organization',
          'Community Foundation',
          'International Development Agency',
          'Other',
        ],
        { error: 'Organization type is required.' },
      )
      .optional(),
    registrationNumber: z
      .string({
        error: 'Registration number is required.',
      })
      .optional(),
    countryOfRegistration: z
      .string({
        error: 'Country of registration is required.',
      })
      .optional(),
    headquartersAddress: z
      .string({
        error: 'Headquarters address is required.',
      })
      .optional(),
    website: z.string().url().optional(),

    // ================= Primary Contact =================
    primaryContact: z
      .object({
        fullName: z
          .string({ error: 'Contact person name is required.' })
          .optional(),
        titleOrPosition: z
          .string({
            error: 'Title or position is required.',
          })
          .optional(),
        email: z
          .string()
          .email({ message: 'Valid email is required.' })
          .optional(),
        phoneNumber: z
          .string({ error: 'Phone number is required.' })
          .refine((val) => phoneRegex.test(val), {
            message:
              'Phone number must include a valid country code (e.g. +8801712345678).',
          })
          .optional(),
        whatsappNumber: z
          .string()
          .refine((val) => phoneRegex.test(val), {
            message:
              'WhatsApp number must include a valid country code (e.g. +60123456789).',
          })
          .optional(),
      })
      .optional(),

    // ================= Program Details =================
    targetCommunityRegion: z
      .string({
        error: 'Target community/region is required.',
      })
      .optional(),
    numberOfBeneficiaries: z
      .number({
        error: 'Number of beneficiaries is required.',
      })
      .optional(),
    beneficiaryDemographics: z
      .string({
        error: 'Beneficiary Demographics is required.',
      })
      .optional(),
    programDuration: z
      .enum(['6 months', '1 year', '2 years', 'Ongoing'], {
        error: 'Program duration is required.',
      })
      .optional(),

    // ================= Membership Configuration =================
    membershipTier: z
      .enum(
        [
          'Preventative Wellness Care',
          'Disease Monitoring & Management',
          'Mixed',
        ],
        { error: 'Membership tier is required.' },
      )
      .optional(),
    mixedTierBreakdown: z.string().optional(),
    beneficiarySelectionCriteria: z
      .string({
        error: 'Beneficiary selection criteria is required.',
      })
      .optional(),
    healthPriorities: z
      .enum(
        [
          'Preventative Care',
          'Chronic Disease Management',
          'Maternal Health',
          'Child Health',
          'Other (specify)',
        ],
        { error: 'Health Priorities is required.' },
      )
      .optional(),
    healthPrioritiesOtherSpacify: z.string().optional(),

    // ================= Data & Reporting =================
    reportingFrequency: z
      .enum(['Monthly', 'Quarterly', 'Annually'], {
        error: 'Reporting frequency is required.',
      })
      .optional(),
    requiredMetrics: z
      .enum(
        [
          'Number of consultations',
          'Health outcomes',
          'Medication adherence',
          'Preventative screenings completed',
          'Cost per beneficiary',
        ],
        { error: 'Required Metrics is required.' },
      )
      .optional(),
    dataAccessLevel: z
      .enum(['Aggregated/Anonymized', 'Individual Level (With Consent)'], {
        error: 'Data access level is required.',
      })
      .optional(),

    // ================= Budget & Payment =================
    estimatedTotalAnnualBudget: z
      .number({
        error: 'Estimated annual budget is required.',
      })
      .optional(),
    fundingSource: z
      .enum(['Grant Funding', 'Donations', 'Institutional Budget', 'Mixed'], {
        error: 'Funding source is required.',
      })
      .optional(),
    paymentSchedule: z
      .enum(['Upfront Annual', 'Quarterly', 'Monthly'], {
        error: 'Payment schedule is required.',
      })
      .optional(),
    paymentMethod: z
      .enum(['Wire Transfer', 'ACH/Bank Transfer', 'Check'], {
        error: 'Payment method is required.',
      })
      .optional(),

    // ================= Agreements =================
    agreeProvideBeneficiaryData: z
      .boolean({ error: 'Agreement is required.' })
      .refine((val) => val === true)
      .optional(),
    agreeBloodTestCoordination: z
      .boolean({ error: 'Agreement is required.' })
      .refine((val) => val === true)
      .optional(),
    agreePartnershipTerms: z
      .boolean({ error: 'You must agree to partnership terms.' })
      .refine((val) => val === true)
      .optional(),
    agreeDataPrivacyCompliance: z
      .boolean({ error: 'HIPAA/GDPR compliance is required.' })
      .refine((val) => val === true)
      .optional(),

    // ================= Documents =================
    organizationRegistrationCertificate: z.string().optional(),
    taxExemptStatus: z.string().optional(),
    programProposal: z.string().optional(),
    budgetBreakdown: z.string().optional(),
  }),
});

/**
 * ================= Export =================
 */
export const NGOApplicationValidations = {
  createNGOApplicationValidationSchema,
  updateNGOApplicationValidationSchema,
};
