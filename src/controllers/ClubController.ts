import { Request, Response } from 'express';
import { ClubService } from "../services/ClubService";
import { CreateClubInput } from '../validation/Club';
import { Club } from '../models/Club';

export class ClubController 
{
    constructor(private clubService: ClubService) {}

    async createClub(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const clubData: CreateClubInput = req.body;
            const club: Club = await this.clubService.createClub(clubData);
            res.status(201).json(club);
        } 
        catch (error) 
        {
            res.status(400).json({ error: error.message });
        }
    }

    async getClubs(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const limit = parseInt(req.query.limit as string) || 10;
            const offset = parseInt(req.query.offset as string) || 0;
            const result = await this.clubService.getClubs(limit, offset);
            res.status(200).json(result);
        }
        catch (error) 
        {
            res.status(400).json({ error: error.message });
        }
    }

    async getClubById(req: Request, res: Response): Promise<void> 
    {
        try 
        {
            const id = req.params.id;
            const club = await this.clubService.getClubById(id);
            res.status(200).json(club);
        }
        catch (error) 
        {
            res.status(404).json({ error: error.message });
        }
    }
}