/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { TMemberApplications } from './memberApplications.interface';

/**
 * ================= Family Member Sub Schema =================
 */
const familyMemberSchema = new Schema(
  {
    fullName: { type: String, required: true },
    relationship: { type: String, required: true },
    dateOfBirth: { type: String },
  },
  { _id: false },
);

/**
 * ================= Main Schema =================
 */
const memberApplicationsSchema = new Schema<TMemberApplications>(
  {
    userId: Schema.Types.ObjectId,
    paymentId: Schema.Types.ObjectId,

    // ================= Personal Information =================
    fullName: { type: String, required: true },
    dateOfBirth: { type: String, required: true },
    gender: {
      type: String,
      required: true,
    },
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String },
    countryOfResidence: { type: String, required: true },
    cityOrRegion: { type: String, required: true },
    fullAddress: { type: String, required: true },

    // ================= Membership Selection =================
    membershipTier: {
      type: String,
      required: true,
    },

    familyMembers: {
      type: [familyMemberSchema],
      default: [],
    },

    // ================= Health Information =================
    currentHealthStatus: {
      type: String,
      required: true,
    },

    existingConditions: { type: String },
    currentMedications: { type: String },

    // ================= Onboarding =================
    bloodTestLocationPreference: {
      type: String,
      required: true,
    },
    preferredConsultationDate: {
      type: String,
      required: true,
    },
    preferredConsultationTime: {
      type: String,
      required: true,
    },

    // ================= Payment =================
    onboardingFee: {
      type: Number,
      default: 123,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    notification: {
      type: Boolean,
      default: false,
    },
    PrivacyPolicyHIPAA: {
      type: Boolean,
      required: true,
    },
    TermsOfService: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * ================= Model Export =================
 */
export const MemberApplications = model<TMemberApplications>(
  'MemberApplication',
  memberApplicationsSchema,
);
