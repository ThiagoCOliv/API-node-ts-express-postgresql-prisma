import express from 'express';
import cors from 'cors';
import routes from './routes/routes';
import { errorHandler, requestLogger } from './middlewares/errorHandler';
import { databaseConnection } from './data/DatabaseConnection';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(requestLogger);

app.get('/health', async (req, res) => {
  try 
  {
    const isDbHealthy = await databaseConnection.healthCheck();
    res.status(200).json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: isDbHealthy ? 'connected' : 'disconnected'
    });
  } 
  catch (error) 
  {
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'error'
    });
  }
});

app.use('/clubs', routes.clubRoutes);
app.use('/players', routes.playerRoutes);

/*
app.use('(.*)', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      path: req.path,
      method: req.method,
    });
});
*/

app.use(errorHandler);

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await databaseConnection.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully');
  await databaseConnection.disconnect();
  process.exit(0);
});

export default app;