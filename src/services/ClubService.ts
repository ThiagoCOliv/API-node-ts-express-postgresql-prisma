import { ClubRepository } from '../repositories/ClubRepository';
import { PlayerRepository } from '../repositories/PlayerRepository';
import { CreateClubInput, UpdateClubInput } from '../validation/Club';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Club } from '../models/Club';

export class ClubService 
{
  constructor(private clubRepository: ClubRepository, private playerRepository: PlayerRepository) {}

  async createClub(data: CreateClubInput): Promise<Club> 
  {
    const nameExists = await this.clubRepository.checkNameExists(data.name, data.country);
    if (nameExists) throw new ConflictError('A club with this name already exists in this country');

    const club: Club = await this.clubRepository.create(data);

    return club;
  }

  async getClubs(limit: number = 10, offset: number = 0): Promise<{
    clubs: Club[];
    pagination: { limit: number; offset: number; total: number };
  }> 
  {
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
    if (offset < 0) throw new ValidationError('Offset must be non-negative');

    const { clubs, total } = await this.clubRepository.findAll(limit, offset);

    return {
      clubs,
      pagination: { limit, offset, total },
    };
  }

  async getClubById(id: string): Promise<Club & { players: any[] }> 
  {
    const clubId = parseInt(id, 10);
    if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

    const club = await this.clubRepository.findById(clubId);
    if (!club) throw new NotFoundError('Club');

    const { players } = await this.playerRepository.findByClub(clubId, 100, 0);

    return {
        ...club,
        players
    };
  }

  async updateClub(id: string, data: UpdateClubInput): Promise<Club> 
  {
    const clubId = parseInt(id, 10);
    if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

    const existingClub = await this.clubRepository.findById(clubId);
    if (!existingClub) throw new NotFoundError('Club');

    if (data.name) 
    {
      const nameExists = await this.checkNameExists(data.name, data.country || existingClub.country, clubId);
      if (nameExists) throw new ConflictError('A club with this name already exists in this country');
    }

    const updatedClub = await this.clubRepository.update(clubId, data);
    if (!updatedClub) throw new NotFoundError('Club');

    return updatedClub;
  }

  async deleteClub(id: string): Promise<void> 
  {
    const clubId = parseInt(id, 10);
    if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

    const success = await this.clubRepository.delete(clubId);
    if (!success) throw new NotFoundError('Club');
  }

  private async checkNameExists(name: string, country: string, excludeId?: number): Promise<boolean> { return this.clubRepository.checkNameExists(name, country, excludeId); }
}