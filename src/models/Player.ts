export interface Player 
{
  id: number;
  name: string;
  position: string;
  number: number;
  birthday: Date;
  country: string;
  clubId: number;
  deletedAt?: Date | null;
}

export type { CreatePlayerInput, UpdatePlayerInput, PlayerResponse, PlayerWithClubResponse } from '../validation/Player';