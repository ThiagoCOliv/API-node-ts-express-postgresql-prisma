import { Router } from 'express';
import { createClub, getClubs, getClubById } from '../controllers/ClubController';

const router = Router();

router.post('/', createClub);
router.get('/', getClubs);
router.get('/:id', getClubById);

export default router;