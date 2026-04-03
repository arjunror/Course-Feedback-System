const Feedback = require('../models/Feedback');
const Enrollment = require('../models/Enrollment');

// Get feedback - Admin sees all, Faculty sees their course feedback, Student sees own
exports.getFeedback = async (req, res) => {
  try {
    let feedback;
    if (req.user.role === 'admin') {
      feedback = await Feedback.find()
        .populate('student', 'name email')
        .populate('course', 'title code');
    } else if (req.user.role === 'faculty') {
      feedback = await Feedback.find()
        .populate({
          path: 'course',
          match: { faculty: req.user.id },
          select: 'title code'
        })
        .populate('student', 'name email');
      // Filter out feedback where course is null
      feedback = feedback.filter(f => f.course !== null);
    } else {
      // Student sees only their own feedback
      feedback = await Feedback.find({ student: req.user.id })
        .populate('course', 'title code');
    }
    res.status(200).json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get analytics for faculty
exports.getAnalytics = async (req, res) => {
  try {
    const { courseId } = req.params;
    const feedback = await Feedback.find({ course: courseId });

    if (feedback.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalResponses: 0,
          averageRating: 0,
          categories: {}
        }
      });
    }

    // Calculate average rating
    const avgRating = feedback.reduce((sum, f) => 
      sum + f.rating, 0) / feedback.length;

    // Calculate category averages
    const categoryTotals = { 
      contentQuality: 0, 
      teachingClarity: 0, 
      workload: 0 
    };
    let categoryCount = 0;

    feedback.forEach(f => {
      if (f.categories) {
        categoryTotals.contentQuality += f.categories.contentQuality || 0;
        categoryTotals.teachingClarity += f.categories.teachingClarity || 0;
        categoryTotals.workload += f.categories.workload || 0;
        categoryCount++;
      }
    });

    res.status(200).json({
      success: true,
      data: {
        totalResponses: feedback.length,
        averageRating: avgRating.toFixed(1),
        categories: categoryCount > 0 ? {
          contentQuality: (categoryTotals.contentQuality / categoryCount).toFixed(1),
          teachingClarity: (categoryTotals.teachingClarity / categoryCount).toFixed(1),
          workload: (categoryTotals.workload / categoryCount).toFixed(1)
        } : {}
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Submit feedback - Student only
exports.createFeedback = async (req, res) => {
  try {
    // Check student is enrolled in course
    const enrollment = await Enrollment.findOne({
      student: req.user.id,
      course: req.body.course,
      status: 'active'
    });
    if (!enrollment) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in this course to give feedback'
      });
    }
    // Add student id to feedback
    req.body.student = req.user.id;
    const feedback = await Feedback.create(req.body);
    res.status(201).json({ success: true, data: feedback });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted feedback for this course'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update feedback - Student only (own feedback)
exports.updateFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findOne({
      _id: req.params.id,
      student: req.user.id
    });
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found or not authorized'
      });
    }
    const updated = await Feedback.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete feedback - Student deletes own, Admin deletes any
exports.deleteFeedback = async (req, res) => {
  try {
    let feedback;
    if (req.user.role === 'admin') {
      feedback = await Feedback.findByIdAndDelete(req.params.id);
    } else {
      feedback = await Feedback.findOneAndDelete({
        _id: req.params.id,
        student: req.user.id
      });
    }
    if (!feedback) {
      return res.status(404).json({
        success: false,
        message: 'Feedback not found or not authorized'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Feedback deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};