/* eslint-disable no-useless-escape */
import { z } from 'zod';

/**
 * ================= Sponsored Member Validation =================
 */
const phoneRegex = /^\+[1-9]\d{7,14}$/;

const sponsoredMemberSchema = z.object({
  fullName: z.string({ error: 'Full name is required.' }),
  relationship: z.enum(
    ['Parent', 'Spouse', 'Child', 'Sibling', 'Extended Family', 'Other'],
    { error: 'Relationship is required.' },
  ),
  dateOfBirth: z.string({ error: 'Date of birth is required.' }),
  gender: z.enum(['Male', 'Female', 'Other'], { error: 'Gender is required.' }),
  countryOfResidence: z.string({ error: 'Country is required.' }),
  cityOrRegion: z.string({ error: 'City/Region is required.' }),
  phoneNumber: z
    .string({ error: 'Phone number is required.' })
    .refine((value) => phoneRegex.test(value), {
      message:
        'Phone number must include a valid country code (e.g. +8801712345678).',
    }),
  email: z.string().email().optional(),
  homeAddress: z.string({ error: 'Home address is required.' }),
  currentHealthStatus: z.enum(['Healthy', 'Managing Condition', 'Other'], {
    error:
      'Please select a health status: Healthy, Managing Condition, or Other.',
  }),
  existingConditions: z.string().optional(),
  membershipTier: z.enum(
    ['Preventative Wellness Care', 'Disease Monitoring & Management'],
    {
      error:
        'Please select a valid membership tier (Preventative Wellness Care or Disease Monitoring & Management).',
    },
  ),
});

/**
 * ================= Create  Sponsor Application =================
 */
const createSponsorValidationSchema = z.object({
  body: z.object({
    // ================= Sponsor Information =================
    fullName: z.string({ error: 'Sponsor full name is required.' }),
    phoneNumber: z
      .string({ error: 'Phone number is required.' })
      .refine((value) => phoneRegex.test(value), {
        message:
          'Phone number must include a valid country code (e.g. +8801712345678).',
      }),
    whatsappNumber: z
      .string()
      .refine((value) => phoneRegex.test(value), {
        message:
          'WhatsApp number must include a valid country code (e.g. +60123456789).',
      })
      .optional(),
    countryOfResidence: z.string({ error: 'Country is required.' }),
    city: z.string({ error: 'City is required.' }),
    fullAddress: z.string({ error: 'Full address is required.' }),

    // ================= Sponsored Members =================
    numberOfMembers: z
      .number({ error: 'Number of members is required.' })
      .min(1, { message: 'Must sponsor at least 1 member.' })
      .max(10, { message: 'Cannot sponsor more than 10 members.' }),
    sponsoredMembers: z.array(sponsoredMemberSchema),

    // ================= Communication Preferences =================
    primaryContact: z.enum(
      ['Sponsor only', 'Sponsored members directly', 'Both'],
      { error: 'Primary contact is required.' },
    ),
    preferredCommunicationMethod: z.enum(
      ['Email', 'WhatsApp', 'SMS', 'Phone'],
      {
        error: 'Preferred communication method is required.',
      },
    ),

    // ================= Payment & Billing =================
    totalOnboardingFees: z.number({
      error: 'Total onboarding fees are required.',
    }),
    membershipFeeEstimate: z.string().optional(),
    paymentMethod: z.enum(
      ['Credit/Debit Card', 'Bank Transfer', 'Mobile Money'],
      {
        error: 'Payment method is required.',
      },
    ),

    // ================= Reporting Preferences =================
    receiveMonthlyReports: z.boolean().optional(),
    accessDigitalHealthRecords: z.boolean().optional(),
    authorizeDirectCare: z.boolean().optional(),

    // ================= Consent & Agreements =================
    TermsOfService: z
      .boolean({ error: 'You must agree to Terms of Service.' })
      .refine((val) => val === true),
    PrivacyPolicyHIPAA: z
      .boolean({ error: 'You must agree to Privacy Policy.' })
      .refine((val) => val === true),
    authorizeHealthcareUpdates: z
      .boolean({ error: 'Authorization for healthcare updates is required.' })
      .refine((val) => val === true),
  }),
});

/**
 * ================= Update  Sponsor Application =================
 */
const updateSponsorValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phoneNumber: z
      .string()
      .refine((value) => phoneRegex.test(value), {
        message:
          'Phone number must include a valid country code (e.g. +8801712345678).',
      })
      .optional(),
    whatsappNumber: z
      .string()
      .refine((value) => phoneRegex.test(value), {
        message:
          'WhatsApp number must include a valid country code (e.g. +60123456789).',
      })
      .optional(),
    countryOfResidence: z.string().optional(),
    city: z.string().optional(),
    fullAddress: z.string().optional(),
    numberOfMembers: z.number().min(1).max(10).optional(),
    sponsoredMembers: z.array(sponsoredMemberSchema).optional(),
    primaryContact: z
      .enum(['Sponsor only', 'Sponsored members directly', 'Both'])
      .optional(),
    preferredCommunicationMethod: z
      .enum(['Email', 'WhatsApp', 'SMS', 'Phone'])
      .optional(),
    totalOnboardingFees: z.number().optional(),
    membershipFeeEstimate: z.number().optional(),
    paymentMethod: z
      .enum(['Credit/Debit Card', 'Bank Transfer', 'Mobile Money'])
      .optional(),
    isPaid: z.boolean().optional(),
    receiveMonthlyReports: z.boolean().optional(),
    accessDigitalHealthRecords: z.boolean().optional(),
    authorizeDirectCare: z.boolean().optional(),
    TermsOfService: z.boolean().optional(),
    PrivacyPolicyHIPAA: z.boolean().optional(),
    authorizeHealthcareUpdates: z.boolean().optional(),
  }),
});

/**
 * ================= Export =================
 */
export const SponsorApplicationValidations = {
  createSponsorValidationSchema,
  updateSponsorValidationSchema,
};
