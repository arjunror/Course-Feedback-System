const express = require('express');
const router = express.Router();
const {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment
} = require('../controllers/enrollmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getEnrollments);
router.post('/', authorize('admin'), createEnrollment);
router.put('/:id', authorize('admin'), updateEnrollment);
router.delete('/:id', authorize('admin'), deleteEnrollment);

module.exports = router;
