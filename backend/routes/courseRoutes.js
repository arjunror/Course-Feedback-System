const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// Get all courses - all roles can view
router.get('/', getCourses);

// Get single course - all roles can view
router.get('/:id', getCourse);

// Create course - Admin only
router.post('/', authorize('admin'), createCourse);

// Update course - Admin only
router.put('/:id', authorize('admin'), updateCourse);

// Delete course - Admin only
router.delete('/:id', authorize('admin'), deleteCourse);

module.exports = router;