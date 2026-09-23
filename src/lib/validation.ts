import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  password: z.string().min(10, "Password must be at least 10 characters"),
  role: z.enum(["CREATOR", "SUBSCRIBER"]),
  displayName: z.string().min(1, "Display name is required").or(z.literal("")),
});

export const loginSchema = z.object({
  identifier: z.string().min(1, "Email or phone is required"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  password: z.string().min(10, "Password must be at least 10 characters"),
});

export const tierSchema = z.object({
  name: z.string().min(1, "Tier name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().min(0, "Price must be 0 or greater"),
  interval: z.enum(["MONTHLY", "WEEKLY", "YEARLY"]),
});

export const contentPostSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  body: z.string().min(1, "Content body is required"),
  isPPV: z.boolean(),
  ppvPrice: z.number().min(0).optional(),
}).refine(
  (data) => {
    if (data.isPPV && (data.ppvPrice == null || data.ppvPrice === undefined)) {
      return false;
    }
    return true;
  },
  {
    message: "PPV price is required when post is PPV",
    path: ["ppvPrice"],
  }
);

export const reportSchema = z.object({
  reason: z.string().min(1, "Reason is required"),
  description: z.string().optional(),
});
