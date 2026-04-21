export interface Club 
{
    id: number;
    name: string;
    city: string;
    country: string;
    league: string;
    foundedYear: number;
    colors: string[];
    deletedAt?: Date | null;
}

export type { CreateClubInput, UpdateClubInput, ClubResponse } from '../validation/Club';