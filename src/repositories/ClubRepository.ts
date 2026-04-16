import { ClubData } from '../data/ClubData';
import { Club } from '../models/Club';

export class ClubRepository 
{
  constructor(private clubData: ClubData) {}

  async create(data: Omit<Club, 'id' | 'deletedAt'>): Promise<Club> { return this.clubData.create(data); }

  async findAll(limit: number = 10, offset: number = 0): Promise<{ clubs: Club[]; total: number }> 
  {
    const [clubs, total] = await Promise.all([
      this.clubData.findAll(limit, offset),
      this.clubData.count(),
    ]);

    return { clubs, total };
  }

  async findById(id: string): Promise<Club | null> { return this.clubData.findById(id); }

  async update(id: string, data: Partial<Omit<Club, 'id' | 'deletedAt'>>): Promise<Club | null> { return this.clubData.update(id, data); }

  async delete(id: string): Promise<boolean> { return this.clubData.delete(id); }

  async exists(id: string): Promise<boolean> { return this.clubData.exists(id); }

  async checkNameExists(name: string, country: string, excludeId?: string): Promise<boolean> 
  {
    const clubs = await this.clubData.findByNameAndCountry(name, country);
    return excludeId ? clubs.some(club => club.id !== excludeId) : clubs.length > 0;
  }
}