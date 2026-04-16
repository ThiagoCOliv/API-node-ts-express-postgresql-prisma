import { Router } from 'express';
import { PlayerController } from '../controllers/PlayerController';

const router = Router();

// Routes
router.post('/', PlayerController.createPlayer);
router.get('/', PlayerController.getPlayers);
router.get('/:id', PlayerController.getPlayerById);
router.put('/:id', PlayerController.updatePlayer);
router.delete('/:id', PlayerController.deletePlayer);

export default router;