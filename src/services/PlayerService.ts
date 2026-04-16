import { PlayerRepository } from '../repositories/PlayerRepository';
import { ClubRepository } from '../repositories/ClubRepository';
import { CreatePlayerInput, PlayerWithClubResponse, UpdatePlayerInput } from '../validation/Player';
import { NotFoundError, ValidationError, ConflictError } from '../utils/errors';

export class PlayerService 
{
  constructor(private playerRepository: PlayerRepository,private clubRepository: ClubRepository) {}

  async createPlayer(data: CreatePlayerInput): Promise<PlayerWithClubResponse> 
  {
    const clubExists = await this.clubRepository.exists(data.clubId);
    if (!clubExists) throw new NotFoundError('Club');

    const numberExists = await this.playerRepository.checkNumberExistsInClub(data.clubId, data.number);
    if (numberExists) throw new ConflictError(`Player number ${data.number} is already taken in this club`);

    const player = await this.playerRepository.create(data);
    const club = await this.clubRepository.findById(player.clubId);

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
      const club = player.clubId ? await this.clubRepository.findById(player.clubId) : null;
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
    const player = await this.playerRepository.findById(id);
    if (!player) throw new NotFoundError('Player');

    const club = player.clubId ? await this.clubRepository.findById(player.clubId) : null;

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
    const clubExists = await this.clubRepository.exists(clubId);
    if (!clubExists) throw new NotFoundError('Club');

    if (limit < 1 || limit > 100) throw new ValidationError('Limit must be between 1 and 100');
    if (offset < 0) throw new ValidationError('Offset must be non-negative');

    const { players, total } = await this.playerRepository.findByClub(clubId, limit, offset);
    const playersWithClubs = await Promise.all(players.map(async (player) => {
      const club = player.clubId ? await this.clubRepository.findById(player.clubId) : null;
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
    const existingPlayer = await this.playerRepository.findById(id);
    if (!existingPlayer) throw new NotFoundError('Player');

    if (data.clubId) 
    {
      const clubExists = await this.clubRepository.exists(data.clubId);
      if (!clubExists) throw new NotFoundError('Club');
    }

    if (data.number !== undefined || data.clubId) 
    {
      const targetClubId = data.clubId || existingPlayer.clubId;
      const targetNumber = data.number !== undefined ? data.number : existingPlayer.number;

      const numberExists = await this.playerRepository.checkNumberExistsInClub(targetClubId, targetNumber, id);
      if (numberExists) throw new ConflictError(`Player number ${targetNumber} is already taken in this club`);
    }

    const updatedPlayer = await this.playerRepository.update(id, data);
    if (!updatedPlayer) throw new NotFoundError('Player');

    const club = updatedPlayer.clubId ? await this.clubRepository.findById(updatedPlayer.clubId) : null;

    return {
        ...updatedPlayer,
        club
    } as PlayerWithClubResponse;
  }

  async deletePlayer(id: string): Promise<void> 
  {
    const success = await this.playerRepository.delete(id);
    if (!success) throw new NotFoundError('Player');
  }
}