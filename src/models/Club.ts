export interface Club 
{
    id: number;
    name: string;
    city: string;
    country: string;
    league: string;
    founded_year: number;
    colors: string[];
    deleted_at?: Date | null;
}

export type { CreateClubInput, UpdateClubInput, ClubResponse } from '../validation/Club';