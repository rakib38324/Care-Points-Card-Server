/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, model } from 'mongoose';
import { TSponsorApplication } from './sponsorApplications.interface';

/**
 * ================= Sponsored Member Sub Schema =================
 */
const sponsoredMemberSchema = new Schema(
  {
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
  },
  { _id: false },
);

/**
 * ================= Main Schema =================
 */
const SponsorApplicationSchema = new Schema<TSponsorApplication>(
  {
    userId: Schema.Types.ObjectId,
    paymentId: Schema.Types.ObjectId,

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
  },
  {
    timestamps: true,
  },
);

/**
 * ================= Model Export =================
 */
export const SponsorApplications = model<TSponsorApplication>(
  'SponsorApplication',
  SponsorApplicationSchema,
);
