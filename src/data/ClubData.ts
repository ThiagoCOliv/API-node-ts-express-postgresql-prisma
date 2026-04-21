import { prismaClient } from './DatabaseConnection';
import { Club } from '../models/Club';

export class ClubData 
{
  async create(data: Omit<Club, 'id' | 'deletedAt'>): Promise<Club> 
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

  async findAll(limit: number, offset: number): Promise<Club[]> 
  {
    return prismaClient.clubs.findMany({
      where: { deleted_at: null },
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
    });
  }

  async count(): Promise<number> 
  {
    return prismaClient.clubs.count({ where: { deleted_at: null } });
  }

  async findById(id: number): Promise<Club | null> 
  {
    return prismaClient.clubs.findFirst({
      where: {
        id,
        deleted_at: null,
      },
    });
  }

  // Update club by ID
  async update(id: number, data: Partial<Omit<Club, 'id' | 'deleted_at'>>): Promise<Club | null> 
  {
    try 
    {
      return await prismaClient.clubs.update({
        where: { id },
        data,
      });
    } catch (error) { return null; }
  }

  async delete(id: number): Promise<boolean> 
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

  async exists(id: number): Promise<boolean> 
  {
    const count = await prismaClient.clubs.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async findByNameAndCountry(name: string, country: string): Promise<Club[]> 
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
}