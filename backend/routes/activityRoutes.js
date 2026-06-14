import express from 'express';
import {
  createActivity,
  getActivities,
  getGroupedActivities,
  updateActivity,
  deleteActivity,
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createActivity);
router.get('/', protect, getActivities);
router.get('/grouped/:type', protect, getGroupedActivities);
router.put('/:id', protect, updateActivity);
router.delete('/:id', protect, deleteActivity);

export default router;