// Player interface
export interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
  age: number;
  country: string;
  clubId: string;
  deletedAt?: Date | null;
}

// Re-export validation types
export type { CreatePlayerInput, UpdatePlayerInput, PlayerResponse, PlayerWithClubResponse } from '../validation/Player';