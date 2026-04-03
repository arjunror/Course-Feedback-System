const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

// Get all enrollments - Admin sees all, Student sees own
exports.getEnrollments = async (req, res) => {
  try {
    let enrollments;
    if (req.user.role === 'admin') {
      enrollments = await Enrollment.find()
        .populate('student', 'name email')
        .populate('course', 'title code semester');
    } else {
      enrollments = await Enrollment.find({ student: req.user.id })
        .populate('course', 'title code semester faculty')
        .populate('course');
    }
    res.status(200).json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Enroll student in course - Admin only
exports.createEnrollment = async (req, res) => {
  try {
    // Check if course exists
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: 'Course not found' 
      });
    }
    // Create enrollment
    const enrollment = await Enrollment.create(req.body);
    res.status(201).json({ success: true, data: enrollment });
  } catch (error) {
    // Handle duplicate enrollment
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Student already enrolled in this course' 
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update enrollment status - Admin only
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enrollment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enrollment not found' 
      });
    }
    res.status(200).json({ success: true, data: enrollment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete enrollment - Admin only
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByIdAndDelete(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Enrollment not found' 
      });
    }
    res.status(200).json({ 
      success: true, 
      message: 'Enrollment removed successfully' 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};