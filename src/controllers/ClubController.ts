import { Request, Response } from 'express';
import * as clubService from "../services/ClubService";
import { CreateClubInput } from '../validation/Club';
import { Club } from '../models/Club';

export async function createClub(req: Request, res: Response): Promise<void> 
{
    try 
    {
        const clubData: CreateClubInput = req.body;
        const club: Club = await clubService.createClub(clubData);
        res.status(201).json(club);
    } 
    catch (error: any) 
    {
        res.status(400).json({ error });
    }
}

export async function getClubs(req: Request, res: Response): Promise<void> 
{
    try 
    {
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = parseInt(req.query.offset as string) || 0;
        const result = await clubService.getClubs(limit, offset);
        res.status(200).json(result);
    }
    catch (error: any) 
    {
        res.status(400).json({ error: error.message });
    }
}

export async function getClubById(req: Request, res: Response): Promise<void> 
{
    try 
    {
        const id = req.params.id as string;
        const club = await clubService.getClubById(id);
        res.status(200).json(club);
    }
    catch (error: any) 
    {
        res.status(404).json({ error: error.message });
    }
}