import { PlayerRepository } from '../repositories/PlayerRepository';
import { ClubRepository } from '../repositories/ClubRepository';
import { CreatePlayerSchema, PlayerWithClubResponse, UpdatePlayerInput } from '../validation/Player';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';
import { Player } from '../models/Player';

export class PlayerService 
{
  constructor(private playerRepository: PlayerRepository,private clubRepository: ClubRepository) {}

  async createPlayer(data: any): Promise<PlayerWithClubResponse> 
  {
    const validatedData = CreatePlayerSchema.parse(data);

    const clubExists = await this.clubRepository.exists(validatedData.club_id);
    if (!clubExists) throw new NotFoundError('Club');

    const numberExists = await this.playerRepository.checkNumberExistsInClub(validatedData.club_id, validatedData.number);
    if (numberExists) throw new ConflictError(`Player number ${validatedData.number} is already taken in this club`);

    const player: Player = await this.playerRepository.create(validatedData);
    const club = await this.clubRepository.findById(player.club_id);

    return {
      ...player,
      club
    } as PlayerWithClubResponse;
  }

  async getPlayers(limit: number = 10, offset: number = 0): Promise<{
    players: PlayerWithClubResponse[];
    pagination: { limit: number; offset: number; total: number };
  }> 
  {
    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
    if (offset < 0) throw new ValidationError('Offset must be non-negative');

    const { players, total } = await this.playerRepository.findAll(limit, offset);

    const playersWithClubs = await Promise.all(players.map(async (player) => {
      const club = player.club_id ? await this.clubRepository.findById(player.club_id) : null;
      return {
        ...player,
        club
      } as PlayerWithClubResponse;
    }));

    return {
      players: playersWithClubs,
      pagination: { limit, offset, total },
    };
  }

  async getPlayerById(id: string): Promise<PlayerWithClubResponse> 
  {
    const player = await this.playerRepository.findById(parseInt(id));
    if (!player) throw new NotFoundError('Player');

    const club = player.club_id ? await this.clubRepository.findById(player.club_id) : null;

    return {
        ...player,
        club
    } as PlayerWithClubResponse;
  }

  async getPlayersByClub(clubId: string, limit: number = 10, offset: number = 0): Promise<{
    players: PlayerWithClubResponse[];
    pagination: { limit: number; offset: number; total: number };
  }> 
  {
    const clubIdNum = parseInt(clubId);

    const clubExists = await this.clubRepository.exists(clubIdNum);
    if (!clubExists) throw new NotFoundError('Club');

    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
    if (offset < 0) throw new ValidationError('Offset must be non-negative');

    const { players, total } = await this.playerRepository.findByClub(clubIdNum, limit, offset);
    const playersWithClubs = await Promise.all(players.map(async (player) => {
      const club = player.club_id ? await this.clubRepository.findById(player.club_id) : null;
      return {
        ...player,
        club
      } as PlayerWithClubResponse;
    }));

    return {
      players: playersWithClubs,
      pagination: { limit, offset, total },
    };
  }

  async updatePlayer(id: string, data: UpdatePlayerInput): Promise<PlayerWithClubResponse> 
  {
    const playerId = parseInt(id);

    const existingPlayer = await this.playerRepository.findById(playerId);
    if (!existingPlayer) throw new NotFoundError('Player');

    if (data.club_id) 
    {
      const clubExists = await this.clubRepository.exists(data.club_id);
      if (!clubExists) throw new NotFoundError('Club');
    }

    if (data.number !== undefined || data.club_id) 
    {
      const targetClubId = data.club_id || existingPlayer.club_id;
      const targetNumber = data.number !== undefined ? data.number : existingPlayer.number;

      const numberExists = await this.playerRepository.checkNumberExistsInClub(targetClubId, targetNumber, playerId);
      if (numberExists) throw new ConflictError(`Player number ${targetNumber} is already taken in this club`);
    }

    const updatedPlayer = await this.playerRepository.update(playerId, data);
    if (!updatedPlayer) throw new NotFoundError('Player');

    const club = updatedPlayer.club_id ? await this.clubRepository.findById(updatedPlayer.club_id) : null;

    return {
        ...updatedPlayer,
        club
    } as PlayerWithClubResponse;
  }

  async deletePlayer(id: string): Promise<void> 
  {
    const success = await this.playerRepository.delete(parseInt(id));
    if (!success) throw new NotFoundError('Player');
  }
}