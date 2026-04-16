import { prisma } from './DatabaseConnection';
import { Player } from '../models/Player';

export class PlayerData 
{
  async create(data: Omit<Player, 'id' | 'deletedAt'>): Promise<Player> 
  {
    return prisma.player.create({
      data: {
        name: data.name,
        position: data.position,
        number: data.number,
        age: data.age,
        country: data.country,
        clubId: data.clubId,
      },
    });
  }

  async findAll(limit: number, offset: number): Promise<Player[]> 
  {
    return prisma.player.findMany({
      where: { deletedAt: null },
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });
  }

  async count(): Promise<number> 
  {
    return prisma.player.count({
      where: { deletedAt: null },
    });
  }

  async findById(id: string): Promise<Player | null> 
  {
    return prisma.player.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });
  }

  async findByClubId(clubId: string, limit: number, offset: number): Promise<Player[]> 
  {
    return prisma.player.findMany({
      where: {
        clubId,
        deletedAt: null,
      },
      take: limit,
      skip: offset,
      orderBy: { number: 'asc' },
      include: {
        club: {
          select: {
            id: true,
            name: true,
            city: true,
            country: true,
          },
        },
      },
    });
  }

  async countByClubId(clubId: string): Promise<number> 
  {
    return prisma.player.count({
      where: {
        clubId,
        deletedAt: null,
      },
    });
  }

  async update(id: string, data: Partial<Omit<Player, 'id' | 'deletedAt'>>): Promise<Player | null> 
  {
    try 
    {
      return await prisma.player.update({
        where: { id },
        data,
      });
    } catch (error) { return null; }
  }

  async delete(id: string): Promise<boolean> 
  {
    try 
    {
      await prisma.player.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
      return true;
    } catch (error) { return false; }
  }

  async exists(id: string): Promise<boolean> 
  {
    const count = await prisma.player.count({
      where: {
        id,
        deletedAt: null,
      },
    });
    return count > 0;
  }

  async findByClubIdAndNumber(clubId: string, number: number, excludePlayerId?: string): Promise<Player[]> 
  {
    const whereClause: any = {
      clubId,
      number,
      deletedAt: null,
    };

    if (excludePlayerId) whereClause.id = { not: excludePlayerId };

    return prisma.player.findMany({
      where: whereClause,
    });
  }
}