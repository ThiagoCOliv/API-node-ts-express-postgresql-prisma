import * as clubRepository from '../repositories/ClubRepository';
import * as playerRepository from '../repositories/PlayerRepository';
import { CreateClubInput, UpdateClubInput } from '../validation/Club';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Club } from '../models/Club';

async function createClub(data: CreateClubInput): Promise<Club> 
{
  const nameExists = await clubRepository.checkNameExists(data.name, data.country);
  if (nameExists) throw new ConflictError('A club with this name already exists in this country');
  
  const club: Club = await clubRepository.create(data);

  return club;
}

async function getClubs(limit: number = 10, offset: number = 0): Promise<{
  clubs: Club[];
  pagination: { limit: number; offset: number; total: number };
}> 
{
  if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
  if (offset < 0) throw new ValidationError('Offset must be non-negative');

  const { clubs, total } = await clubRepository.findAll(limit, offset);

  return {
    clubs,
    pagination: { limit, offset, total },
  };
}

async function getClubById(id: string): Promise<Club & { players: any[] }> 
{
  const clubId = parseInt(id, 10);
  if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

  const club = await clubRepository.findById(clubId);
  if (!club) throw new NotFoundError('Club');

  const { players } = await playerRepository.findByClub(clubId, 100, 0);

  return {
      ...club,
      players
  };
}

async function updateClub(id: string, data: UpdateClubInput): Promise<Club> 
{
  const clubId = parseInt(id, 10);
  if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

  const existingClub = await clubRepository.findById(clubId);
  if (!existingClub) throw new NotFoundError('Club');

  if (data.name) 
  {
    const nameExists = await checkNameExists(data.name, data.country || existingClub.country, clubId);
    if (nameExists) throw new ConflictError('A club with this name already exists in this country');
  }

  const updatedClub = await clubRepository.update(clubId, data);
  if (!updatedClub) throw new NotFoundError('Club');

  return updatedClub;
}

async function deleteClub(id: string): Promise<void> 
{
  const clubId = parseInt(id, 10);
  if (isNaN(clubId)) throw new ValidationError('Invalid club ID');

  const success = await clubRepository.deleteById(clubId);
  if (!success) throw new NotFoundError('Club');
}

async function checkNameExists(name: string, country: string, excludeId?: number): Promise<boolean> { return clubRepository.checkNameExists(name, country, excludeId); }

export {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub
}