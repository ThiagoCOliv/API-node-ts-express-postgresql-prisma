import { z } from 'zod';

// Player creation schema (without id, timestamps)
export const CreatePlayerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward'], {
    errorMap: () => ({ message: 'Position must be Goalkeeper, Defender, Midfielder, or Forward' }),
  }),
  number: z.number().int().min(1).max(99),
  age: z.number().int().min(16).max(50),
  country: z.string().min(1, 'Country is required'),
  clubId: z.string().min(1, 'Club ID is required'),
});

// Player update schema (all fields optional)
export const UpdatePlayerSchema = CreatePlayerSchema.partial();

// Player response schema (includes id, excludes deletedAt)
export const PlayerResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.string(),
  number: z.number(),
  age: z.number(),
  country: z.string(),
  clubId: z.string(),
});

// Player with club info response schema
export const PlayerWithClubResponseSchema = PlayerResponseSchema.extend({
  club: z.object({
    id: z.string(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});

// Type exports
export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;
export type PlayerResponse = z.infer<typeof PlayerResponseSchema>;
export type PlayerWithClubResponse = z.infer<typeof PlayerWithClubResponseSchema>;