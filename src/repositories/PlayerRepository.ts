import { PlayerData } from '../data/PlayerData';
import { Player } from '../models/Player';

export class PlayerRepository 
{
  constructor(private playerData: PlayerData) {}

  async create(data: Omit<Player, 'id' | 'deletedAt'>): Promise<Player> { return this.playerData.create(data); }

  async findAll(limit: number = 10, offset: number = 0): Promise<{ players: Player[]; total: number }> 
  {
    const [players, total] = await Promise.all([
      this.playerData.findAll(limit, offset),
      this.playerData.count(),
    ]);

    return { players, total };
  }

  async findById(id: string): Promise<Player | null> { return this.playerData.findById(id); }

  async findByClub(clubId: string, limit: number = 10, offset: number = 0): Promise<{ players: Player[]; total: number }> {
    const [players, total] = await Promise.all([
      this.playerData.findByClubId(clubId, limit, offset),
      this.playerData.countByClubId(clubId),
    ]);

    return { players, total };
  }

  async update(id: string, data: Partial<Omit<Player, 'id' | 'deletedAt'>>): Promise<Player | null> { return this.playerData.update(id, data); }

  async delete(id: string): Promise<boolean> { return this.playerData.delete(id); }

  async exists(id: string): Promise<boolean> { return this.playerData.exists(id); }

  async checkNumberExistsInClub(clubId: string, number: number, excludePlayerId?: string): Promise<boolean> 
  {
    const players = await this.playerData.findByClubIdAndNumber(clubId, number, excludePlayerId);
    return players.length > 0;
  }
}