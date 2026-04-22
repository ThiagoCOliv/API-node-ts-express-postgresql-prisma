import { prismaClient } from './DatabaseConnection';
import { Club } from '../models/Club';

async function create(data: Omit<Club, 'id' | 'deletedAt'>): Promise<Club> 
{
  return prismaClient.clubs.create({
    data: {
      name: data.name,
      city: data.city,
      country: data.country,
      league: data.league,
      founded_year: data.founded_year,
      colors: data.colors,
    },
  });
}

async function findAll(limit: number, offset: number): Promise<Club[]> 
{
  return prismaClient.clubs.findMany({
    where: { deleted_at: null },
    take: limit,
    skip: offset,
    orderBy: { name: 'asc' },
  });
}

async function count(): Promise<number> 
{
  return prismaClient.clubs.count({ where: { deleted_at: null } });
}

async function findById(id: number): Promise<Club | null> 
{
  return prismaClient.clubs.findFirst({
    where: {
      id,
      deleted_at: null,
    },
  });
}

async function update(id: number, data: Partial<Omit<Club, 'id' | 'deleted_at'>>): Promise<Club | null> 
{
  try 
  {
    return await prismaClient.clubs.update({
      where: { id },
      data,
    });
  } catch (error) { return null; }
}

async function deleteById(id: number): Promise<boolean> 
{
  try 
  {
    await prismaClient.clubs.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  } catch (error) { return false; }
}

async function exists(id: number): Promise<boolean> 
{
  const count = await prismaClient.clubs.count({
    where: {
      id,
      deleted_at: null,
    },
  });
  return count > 0;
}

async function findByNameAndCountry(name: string, country: string): Promise<Club[]> 
{
  return prismaClient.clubs.findMany({
    where: {
      name: {
        equals: name,
        mode: 'insensitive',
      },
      country: {
        equals: country,
        mode: 'insensitive',
      },
      deleted_at: null,
    },
  });
}

export {
  create,
  findAll,
  count,
  findById,
  update,
  deleteById,
  exists,
  findByNameAndCountry
}