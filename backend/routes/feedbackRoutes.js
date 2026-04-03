const express = require('express');
const router = express.Router();
const {
  getFeedback,
  getAnalytics,
  createFeedback,
  updateFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes require login
router.use(protect);

// Get feedback - all roles (filtered by role in controller)
router.get('/', getFeedback);

// Get analytics for a course - Faculty and Admin only
router.get('/analytics/:courseId', 
  authorize('faculty', 'admin'), 
  getAnalytics
);

// Submit feedback - Student only
router.post('/', authorize('student'), createFeedback);

// Update feedback - Student only
router.put('/:id', authorize('student'), updateFeedback);

// Delete feedback - Student and Admin
router.delete('/:id', 
  authorize('student', 'admin'), 
  deleteFeedback
);

module.exports = router;