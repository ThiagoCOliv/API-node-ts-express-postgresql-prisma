import * as playerData from '../data/PlayerData';
import { Player } from '../models/Player';

async function create(data: Omit<Player, 'id' | 'deletedAt'>): Promise<Player> { return playerData.create(data); }

async function findAll(limit: number = 10, offset: number = 0): Promise<{ players: Player[]; total: number }> 
{
  const [players, total] = await Promise.all([
    playerData.findAll(limit, offset),
    playerData.count(),
  ]);

  return { players, total };
}

async function findById(id: number): Promise<Player | null> { return playerData.findById(id); }

async function findByClub(clubId: number, limit: number = 10, offset: number = 0): Promise<{ players: Player[]; total: number }> {
  const [players, total] = await Promise.all([
    playerData.findByClubId(clubId, limit, offset),
    playerData.countByClubId(clubId),
  ]);

  return { players, total };
}

async function update(id: number, data: Partial<Omit<Player, 'id' | 'deletedAt'>>): Promise<Player | null> { return playerData.update(id, data); }

async function deleteById(id: number): Promise<boolean> { return playerData.deleteById(id); }

async function exists(id: number): Promise<boolean> { return playerData.exists(id); }

async function checkNumberExistsInClub(clubId: number, number: number, excludePlayerId?: number): Promise<boolean> 
{
  const players = await playerData.findByClubIdAndNumber(clubId, number, excludePlayerId);
  return players.length > 0;
}

export {
  create,
  findAll,
  findById,
  findByClub,
  update,
  deleteById,
  exists,
  checkNumberExistsInClub
}