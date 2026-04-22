import { Router } from 'express';
import { createPlayer, deletePlayer, getPlayers, getPlayerById, updatePlayer } from '../controllers/PlayerController';

const router = Router();

// Routes
router.post('/', createPlayer);
router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.put('/:id', updatePlayer);
router.delete('/:id', deletePlayer);

export default router;