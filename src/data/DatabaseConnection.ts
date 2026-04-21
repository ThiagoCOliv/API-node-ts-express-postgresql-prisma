import { PrismaClient } from '../../prisma/..generated/prisma/client';
import { prisma } from '../utils/prisma';

class DatabaseConnection 
{
  private static instance: DatabaseConnection;

  public static getInstance(): DatabaseConnection 
  {
    if (!DatabaseConnection.instance) DatabaseConnection.instance = new DatabaseConnection();
    
    return DatabaseConnection.instance;
  }

  public getClient(): PrismaClient { return prisma; }

  public async connect(): Promise<void> 
  {
    try 
    {
      await prisma.$connect();
      console.log('✅ Database connected successfully');
    } 
    catch (error) 
    {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> 
  {
    try 
    {
      await prisma.$disconnect();
      console.log('✅ Database disconnected successfully');
    } 
    catch (error) 
    {
      console.error('❌ Database disconnection failed:', error);
      throw error;
    }
  }

  public async healthCheck(): Promise<boolean> 
  {
    try 
    {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } 
    catch (error) 
    {
      console.error('❌ Database health check failed:', error);
      return false;
    }
  }
}

export const databaseConnection = DatabaseConnection.getInstance();

export const prismaClient = databaseConnection.getClient();