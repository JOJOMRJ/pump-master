import { z } from 'zod';

// Login form validation
export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
