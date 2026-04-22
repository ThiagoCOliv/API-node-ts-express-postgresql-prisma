import * as playerService from "../services/PlayerService";
import { Request, Response } from 'express';
import { CreatePlayerInput } from "../validation/Player";

async function createPlayer(req: Request, res: Response): Promise<void>
{
    try
    {
        const playerData: CreatePlayerInput = req.body;
        const player = await playerService.createPlayer(playerData);
        res.status(201).json(player);
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
}

async function getPlayers(req: Request, res: Response): Promise<void>
{
    try
    {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const result = await playerService.getPlayers(limit, offset);
        res.status(200).json(result);
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
}

async function getPlayerById(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = req.params.id as string;
        const player = await playerService.getPlayerById(id);
        res.status(200).json(player);
    }
    catch (error: any)
    {
        res.status(404).json({ error: error.message });
    }
}

async function updatePlayer(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = req.params.id as string;
        const playerData = req.body;
        const player = await playerService.updatePlayer(id, playerData);
        res.status(200).json(player);
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
}

async function deletePlayer(req: Request, res: Response): Promise<void>
{
    try
    {
        const id = req.params.id as string;
        await playerService.deletePlayer(id);
        res.status(200).json({ message: "Player deleted successfully" });
    }
    catch (error: any)
    {
        res.status(400).json({ error: error.message });
    }
}

export { createPlayer, getPlayers, getPlayerById, updatePlayer, deletePlayer };