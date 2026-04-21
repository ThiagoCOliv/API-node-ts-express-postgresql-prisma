import { z } from 'zod';

export const CreatePlayerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  position: z.enum(['Goalkeeper', 'Defender', 'Midfielder', 'Forward']),
  number: z.number().int().min(1).max(99),
  birthday: z.date(),
  country: z.string().min(1, 'Country is required'),
  club_id: z.number().int().positive({ message: 'Club ID must be a positive integer' }),
});

export const UpdatePlayerSchema = CreatePlayerSchema.partial();

export const PlayerResponseSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
  position: z.string(),
  number: z.number(),
  birthday: z.date(),
  country: z.string(),
  club_id: z.number().int().positive({ message: 'Club ID must be a positive integer' }),
});

export const PlayerWithClubResponseSchema = PlayerResponseSchema.extend({
  club: z.object({
    id: z.number().int().positive(),
    name: z.string(),
    city: z.string(),
    country: z.string(),
  }),
});

export type CreatePlayerInput = z.infer<typeof CreatePlayerSchema>;
export type UpdatePlayerInput = z.infer<typeof UpdatePlayerSchema>;
export type PlayerResponse = z.infer<typeof PlayerResponseSchema>;
export type PlayerWithClubResponse = z.infer<typeof PlayerWithClubResponseSchema>;