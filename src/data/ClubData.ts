import { prisma } from './DatabaseConnection';
import { Club } from '../models/Club';

export class ClubData 
{
  async create(data: Omit<Club, 'id' | 'deletedAt'>): Promise<Club> 
  {
    return prisma.club.create({
      data: {
        name: data.name,
        city: data.city,
        country: data.country,
        league: data.league,
        foundedYear: data.foundedYear,
        colors: data.colors,
      },
    });
  }

  async findAll(limit: number, offset: number): Promise<Club[]> 
  {
    return prisma.club.findMany({
      where: { deletedAt: null },
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
    });
  }

  async count(): Promise<number> 
  {
    return prisma.club.count({ where: { deletedAt: null } });
  }

  async findById(id: string): Promise<Club | null> 
  {
    return prisma.club.findFirst({
      where: {
        id,
        deletedAt: null,
      },
    });
  }

  // Update club by ID
  async update(id: string, data: Partial<Omit<Club, 'id' | 'deletedAt'>>): Promise<Club | null> 
  {
    try 
    {
      return await prisma.club.update({
        where: { id },
        data,
      });
    } catch (error) { return null; }
  }

  async delete(id: string): Promise<boolean> 
  {
    try 
    {
      await prisma.club.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (error) { return false; }
  }

  async exists(id: string): Promise<boolean> 
  {
    const count = await prisma.club.count({
      where: {
        id,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findByNameAndCountry(name: string, country: string): Promise<Club[]> 
  {
    return prisma.club.findMany({
      where: {
        name: {
          equals: name,
          mode: 'insensitive',
        },
        country: {
          equals: country,
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  }
}