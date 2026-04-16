import { PlayerService } from "../services/PlayerService";
import { Request, Response } from 'express';
import { CreatePlayerInput } from "../validation/Player";

export class PlayerController 
{
    constructor(private playerService: PlayerService) {}

    async createPlayer(req: Request, res: Response): Promise<void>
    {
        try
        {
            const playerData: CreatePlayerInput = req.body;
            const player = await this.playerService.createPlayer(playerData);
            res.status(201).json(player);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }

    async getPlayers(req: Request, res: Response): Promise<void>
    {
        try
        {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const result = await this.playerService.getPlayers(limit, offset);
            res.status(200).json(result);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }

    async getPlayerById(req: Request, res: Response): Promise<void>
    {
        try
        {
            const id = req.params.id;
            const player = await this.playerService.getPlayerById(id);
            res.status(200).json(player);
        }
        catch (error)
        {
            res.status(404).json({ error: error.message });
        }
    }

    async updatePlayer(req: Request, res: Response): Promise<void>
    {
        try
        {
            const id = req.params.id;
            const playerData = req.body;
            const player = await this.playerService.updatePlayer(id, playerData);
            res.status(200).json(player);
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }

    async deletePlayer(req: Request, res: Response): Promise<void>
    {
        try
        {
            const id = req.params.id;
            await this.playerService.deletePlayer(id);
            res.status(200).json({ message: "Player deleted successfully" });
        }
        catch (error)
        {
            res.status(400).json({ error: error.message });
        }
    }
}