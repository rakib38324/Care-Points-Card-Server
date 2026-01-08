/* eslint-disable no-useless-escape */
import { z } from 'zod';

/**
 * ================= Family Member Validation =================
 */
const familyMemberSchema = z.object({
  fullName: z.string({ error: 'Full name is required.' }),
  relationship: z.string({ error: 'Relationship is required.' }),
  dateOfBirth: z.string().optional(), // keep string if frontend sends string
});

/**
 * ================= Create Member Application =================
 */

const phoneRegex = /^\+[1-9]\d{7,14}$/;

const createMemberApplicationValidationSchema = z.object({
  body: z.object({
    // ================= Personal Information =================
    fullName: z.string({ error: 'Full name is required.' }),
    dateOfBirth: z.string({ error: 'Date of birth is required.' }),
    gender: z.enum(['Male', 'Female', 'Other'], {
      error: 'Gender is required.',
    }),
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
    cityOrRegion: z.string({ error: 'City or region is required.' }),
    fullAddress: z.string({ error: 'Full address is required.' }),

    // ================= Membership Selection =================
    membershipTier: z.enum(
      [
        'Preventative Wellness Care',
        'Disease Monitoring & Management',
        'Family & Friends Plan',
      ],
      { error: 'Membership tier is required.' },
    ),

    familyMembers: z.array(familyMemberSchema).optional(),

    // ================= Health Information =================
    currentHealthStatus: z.enum(
      ['Health/Preventative focus', 'Managing chronic conditions', 'Other'],
      { error: 'Health status is required.' },
    ),

    existingConditions: z.string().optional(),
    currentMedications: z.string().optional(),

    // ================= Onboarding =================
    bloodTestLocationPreference: z.string({
      error: 'Blood test location preference is required.',
    }),
    preferredConsultationDate: z.string({
      error: 'Preferred consultation date is required.',
    }),
    preferredConsultationTime: z.string({
      error: 'Preferred consultation time is required.',
    }),

    // ================= Payment =================
    onboardingFee: z.number().optional(),
    paymentMethod: z.string({ error: 'Payment method is required.' }),
    notification: z.boolean().optional(),
    PrivacyPolicyHIPAA: z
      .boolean({ error: 'You must agree to Privacy Policy & HIPAA' })
      .refine((val) => val === true),
    TermsOfService: z
      .boolean({ error: 'You must agree to Terms of Service.' })
      .refine((val) => val === true),
  }),
});

/**
 * ================= Update Member Application =================
 */
const updateMemberApplicationValidationSchema = z.object({
  body: z.object({
    fullName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.enum(['Male', 'Female', 'Other']).optional(),
    phoneNumber: z
      .string({ error: 'Phone number is required.' })
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
    cityOrRegion: z.string().optional(),
    fullAddress: z.string().optional(),

    membershipTier: z
      .enum([
        'Preventative Wellness Care',
        'Disease Monitoring & Management',
        'Family & Friends Plan',
      ])
      .optional(),

    familyMembers: z.array(familyMemberSchema).optional(),

    currentHealthStatus: z
      .enum([
        'Health/Preventative focus',
        'Managing chronic conditions',
        'Other',
      ])
      .optional(),

    existingConditions: z.string().optional(),
    currentMedications: z.string().optional(),

    bloodTestLocationPreference: z.string().optional(),
    preferredConsultationDate: z.string().optional(),
    preferredConsultationTime: z.string().optional(),

    onboardingFee: z.number().optional(),
    paymentMethod: z.string().optional(),
  }),
});

/**
 * ================= Export =================
 */
export const MemberApplicationValidations = {
  createMemberApplicationValidationSchema,
  updateMemberApplicationValidationSchema,
};
