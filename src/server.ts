import app from './app';
import dotenv from 'dotenv';
import { databaseConnection } from './data/DatabaseConnection';

dotenv.config();

const PORT = process.env.PORT || 3333;

async function startServer() 
{
  try 
  {
    await databaseConnection.connect();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🏟️  Clubs API: http://localhost:${PORT}/clubs`);
      console.log(`⚽ Players API: http://localhost:${PORT}/players`);
    });
  } 
  catch (error) 
  {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
