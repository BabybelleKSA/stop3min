import { z } from "zod";

export const reportCreateSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  addressLine1: z.string().min(1, "Address is required"),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1, "City is required"),
  state: z
    .string()
    .min(2, "State is required")
    .max(2, "Use 2-letter code")
    .transform((val) => val.toUpperCase()),
  zip: z.string().min(1, "ZIP is required"),
  country: z.string().default("US"),
  cardType: z.enum(["DEBIT", "CREDIT", "BOTH", "UNKNOWN"]),
  minAmount: z.coerce.number().min(0, "Minimum must be at least 0"),
  signText: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  visitedAt: z
    .string()
    .optional()
    .nullable()
    .transform((val) => (val ? new Date(val) : undefined)),
  photoUrl: z.string().url("Must be a valid URL").optional().nullable(),
  reporterEmail: z.string().email("Invalid email").optional().nullable(),
  reporterHandle: z.string().optional().nullable(),
  consentToContact: z.coerce.boolean().optional().default(false),
  consentConfirmed: z.coerce.boolean().refine((v) => v === true, {
    message: "Consent is required"
  })
});

export const reportUpdateSchema = z.object({
  status: z.enum(["NEW", "IN_REVIEW", "COMPLAINT_FILED", "RESOLVED", "DISMISSED"]),
  followUpNotes: z.string().optional().nullable(),
  networksReportedTo: z.string().optional().nullable()
});

export const reportsQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  status: z.enum(["NEW", "IN_REVIEW", "COMPLAINT_FILED", "RESOLVED", "DISMISSED"]).optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  search: z.string().optional()
});
