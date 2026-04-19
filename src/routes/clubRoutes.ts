import { Router } from 'express';
import { ClubController } from '../controllers/ClubController';

const router = Router();

router.post('/', ClubController.createClub);
router.get('/', ClubController.getClubs);
router.get('/:id', ClubController.getClubById);

export default router;