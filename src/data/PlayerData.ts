import { prismaClient } from './DatabaseConnection';
import { Player } from '../models/Player';

export class PlayerData 
{
  async create(data: Omit<Player, 'id' | 'deletedAt'>): Promise<Player> 
  {
    return prismaClient.players.create({
      data: {
        name: data.name,
        position: data.position,
        number: data.number,
        birthday: data.birthday,
        country: data.country,
        club_id: data.club_id,
      },
    });
  }

  async findAll(limit: number, offset: number): Promise<Player[]> 
  {
    return prismaClient.players.findMany({
      where: { deleted_at: null },
      take: limit,
      skip: offset,
      orderBy: { name: 'asc' },
      include: {
        Clubs: {
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
    return prismaClient.players.count({
      where: { deleted_at: null },
    });
  }

  async findById(id: number): Promise<Player | null> 
  {
    return prismaClient.players.findFirst({
      where: {
        id,
        deleted_at: null,
      },
      include: {
        Clubs: {
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

  async findByClubId(club_id: number, limit: number, offset: number): Promise<Player[]> 
  {
    return prismaClient.players.findMany({
      where: {
        club_id,
        deleted_at: null,
      },
      take: limit,
      skip: offset,
      orderBy: { number: 'asc' },
      include: {
        Clubs: {
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

  async countByClubId(club_id: number): Promise<number> 
  {
    return prismaClient.players.count({
      where: {
        club_id,
        deleted_at: null,
      },
    });
  }

  async update(id: number, data: Partial<Omit<Player, 'id' | 'deleted_at'>>): Promise<Player | null> 
  {
    try 
    {
      return await prismaClient.players.update({
        where: { id },
        data,
      });
    } catch (error) { return null; }
  }

  async delete(id: number): Promise<boolean> 
  {
    try 
    {
      await prismaClient.players.update({
        where: { id },
        data: { deleted_at: new Date() },
      });
      return true;
    } catch (error) { return false; }
  }

  async exists(id: number): Promise<boolean> 
  {
    const count = await prismaClient.players.count({
      where: {
        id,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async findByClubIdAndNumber(club_id: number, number: number, excludePlayerId?: number): Promise<Player[]> 
  {
    const whereClause: any = {
      club_id,
      number,
      deleted_at: null,
    };

    if (excludePlayerId) whereClause.id = { not: excludePlayerId };

    return prismaClient.players.findMany({
      where: whereClause,
    });
  }
}