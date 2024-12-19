import { z } from 'zod';

export const authValidation = {
  register: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().min(2),
      lastName: z.string().min(2),
    }),
  }),

  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  }),

  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),

  forgotPassword: z.object({
    body: z.object({
      email: z.string().email(),
    }),
  }),

  resetPassword: z.object({
    body: z.object({
      token: z.string(),
      password: z.string().min(6),
    }),
  }),

  verifyEmail: z.object({
    body: z.object({
      token: z.string(),
    }),
  }),
}; 