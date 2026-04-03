const mongoose = require('mongoose');

// Feedback schema - stores student feedback for courses
const feedbackSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  },
  categories: {
    contentQuality: { type: Number, min: 1, max: 5 },
    teachingClarity: { type: Number, min: 1, max: 5 },
    workload: { type: Number, min: 1, max: 5 }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// One feedback per student per course only
feedbackSchema.index({ student: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);