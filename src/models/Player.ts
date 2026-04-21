export interface Player 
{
  id: number;
  name: string;
  position: string;
  number: number;
  birthday: Date;
  country: string;
  club_id: number;
  deleted_at?: Date | null;
}

export type { CreatePlayerInput, UpdatePlayerInput, PlayerResponse, PlayerWithClubResponse } from '../validation/Player';