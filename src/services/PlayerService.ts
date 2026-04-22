import * as playerRepository from '../repositories/PlayerRepository';
import * as clubRepository from '../repositories/ClubRepository';
import { CreatePlayerSchema, PlayerWithClubResponse, UpdatePlayerInput } from '../validation/Player';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Player } from '../models/Player';

async function createPlayer(data: any): Promise<PlayerWithClubResponse> 
{
  const validatedData = CreatePlayerSchema.parse(data);

  const clubExists = await clubRepository.exists(validatedData.club_id);
  if (!clubExists) throw new NotFoundError('Club');

  const numberExists = await playerRepository.checkNumberExistsInClub(validatedData.club_id, validatedData.number);
  if (numberExists) throw new ConflictError(`Player number ${validatedData.number} is already taken in this club`);

  const player: Player = await playerRepository.create(validatedData);
  const club = await clubRepository.findById(player.club_id);

  return {
    ...player,
    club
  } as PlayerWithClubResponse;
}

async function getPlayers(limit: number = 10, offset: number = 0): Promise<{
  players: PlayerWithClubResponse[];
  pagination: { limit: number; offset: number; total: number };
}> 
{
  if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
  if (offset < 0) throw new ValidationError('Offset must be non-negative');

  const { players, total } = await playerRepository.findAll(limit, offset);

  const playersWithClubs = await Promise.all(players.map(getPlayerWithClub));

  return {
    players: playersWithClubs,
    pagination: { limit, offset, total },
  };
}

async function getPlayerWithClub(player: Player): Promise<PlayerWithClubResponse>
{
  const club = player.club_id ? await clubRepository.findById(player.club_id) : null;
  return {
    ...player,
    club
  } as PlayerWithClubResponse;
}

async function getPlayerById(id: string): Promise<PlayerWithClubResponse> 
{
  const player = await playerRepository.findById(parseInt(id));
  if (!player) throw new NotFoundError('Player');

  const club = player.club_id ? await clubRepository.findById(player.club_id) : null;

  return {
      ...player,
      club
  } as PlayerWithClubResponse;
}

async function getPlayersByClub(clubId: string, limit: number = 10, offset: number = 0): Promise<{
  players: PlayerWithClubResponse[];
  pagination: { limit: number; offset: number; total: number };
}> 
{
  const clubIdNum = parseInt(clubId);

  const clubExists = await clubRepository.exists(clubIdNum);
  if (!clubExists) throw new NotFoundError('Club');

  if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
  if (offset < 0) throw new ValidationError('Offset must be non-negative');

  const { players, total } = await playerRepository.findByClub(clubIdNum, limit, offset);
  const playersWithClubs = await Promise.all(players.map(getPlayerWithClub));

  return {
    players: playersWithClubs,
    pagination: { limit, offset, total },
  };
}

async function updatePlayer(id: string, data: UpdatePlayerInput): Promise<PlayerWithClubResponse> 
{
  const playerId = parseInt(id);

  const existingPlayer = await playerRepository.findById(playerId);
  if (!existingPlayer) throw new NotFoundError('Player');

  if (data.club_id) 
  {
    const clubExists = await clubRepository.exists(data.club_id);
    if (!clubExists) throw new NotFoundError('Club');
  }

  if (data.number !== undefined || data.club_id) 
  {
    const targetClubId = data.club_id || existingPlayer.club_id;
    const targetNumber = data.number !== undefined ? data.number : existingPlayer.number;

    const numberExists = await playerRepository.checkNumberExistsInClub(targetClubId, targetNumber, playerId);
    if (numberExists) throw new ConflictError(`Player number ${targetNumber} is already taken in this club`);
  }

  const updatedPlayer = await playerRepository.update(playerId, data);
  if (!updatedPlayer) throw new NotFoundError('Player');

  const club = updatedPlayer.club_id ? await clubRepository.findById(updatedPlayer.club_id) : null;

  return {
      ...updatedPlayer,
      club
  } as PlayerWithClubResponse;
}

async function deletePlayer(id: string): Promise<void> 
{
  const success = await playerRepository.deleteById(parseInt(id));
  if (!success) throw new NotFoundError('Player');
}

export { createPlayer, getPlayers, getPlayerById, getPlayersByClub, updatePlayer, deletePlayer };