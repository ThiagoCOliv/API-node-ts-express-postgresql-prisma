import { z } from 'zod';

export const CreateClubSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  city: z.string().min(3, 'City must be at least 3 characters long'),
  country: z.string().min(3, 'Country must be at least 3 characters long'),
  league: z.string().min(3, 'League must be at least 3 characters long'),
  founded_year: z.number().int().min(1800).max(new Date().getFullYear()),
  colors: z.array(z.string()).min(1, 'At least one color is required'),
});

export const UpdateClubSchema = CreateClubSchema.partial();

export const ClubResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  city: z.string(),
  country: z.string(),
  league: z.string(),
  founded_year: z.number(),
  colors: z.array(z.string()),
});

export type CreateClubInput = z.infer<typeof CreateClubSchema>;
export type UpdateClubInput = z.infer<typeof UpdateClubSchema>;
export type ClubResponse = z.infer<typeof ClubResponseSchema>;