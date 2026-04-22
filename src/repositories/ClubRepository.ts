import * as clubData from '../data/ClubData';
import { Club } from '../models/Club';

async function create(data: Omit<Club, 'id' | 'deletedAt'>): Promise<Club> { return clubData.create(data); }

async function findAll(limit: number = 10, offset: number = 0): Promise<{ clubs: Club[]; total: number }> 
{
  const [clubs, total] = await Promise.all([
    clubData.findAll(limit, offset),
    clubData.count(),
  ]);

  return { clubs, total };
}

async function findById(id: number): Promise<Club | null> { return clubData.findById(id); }

async function update(id: number, data: Partial<Omit<Club, 'id' | 'deletedAt'>>): Promise<Club | null> { return clubData.update(id, data); }

async function deleteById(id: number): Promise<boolean> { return clubData.deleteById(id); }

async function exists(id: number): Promise<boolean> { return clubData.exists(id); }

async function checkNameExists(name: string, country: string, excludeId?: number): Promise<boolean> 
{
  const clubs = await clubData.findByNameAndCountry(name, country);
  return excludeId ? clubs.some(club => club.id !== excludeId) : clubs.length > 0;
}

export {
  create,
  findAll,
  findById,
  update,
  deleteById,
  exists,
  checkNameExists
}