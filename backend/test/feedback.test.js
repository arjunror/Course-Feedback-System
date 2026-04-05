const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const Feedback = require('../models/Feedback');
const Course = require('../models/Course');
const { 
  createFeedback, 
  getFeedback, 
  updateFeedback, 
  deleteFeedback 
} = require('../controllers/feedbackController');
const { 
  createCourse, 
  getCourses 
} = require('../controllers/courseController');

const { expect } = chai;

// ─── Feedback CRUD Tests ───────────────────────────────────────────────────

describe('Feedback Controller Tests', () => {

  // Test 1: Create Feedback
  it('should create feedback successfully', async () => {
    // Mock request data
    const req = {
      user: { 
        id: new mongoose.Types.ObjectId(),
        role: 'student'
      },
      body: { 
        course: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Great course!',
        isAnonymous: true
      }
    };

    // Mock enrollment check
    const enrollmentStub = sinon.stub(
      require('../models/Enrollment'), 
      'findOne'
    ).resolves({ _id: new mongoose.Types.ObjectId() });

    // Mock feedback creation
    const createdFeedback = { 
      _id: new mongoose.Types.ObjectId(), 
      ...req.body,
      student: req.user.id
    };
    const createStub = sinon.stub(Feedback, 'create')
      .resolves(createdFeedback);

    // Mock response
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createFeedback(req, res);

    // Assertions
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    // Cleanup
    createStub.restore();
    enrollmentStub.restore();
  });

  // Test 2: Get Feedback
  it('should get feedback successfully', async () => {
    const req = {
      user: { 
        id: new mongoose.Types.ObjectId(),
        role: 'student'
      }
    };

    const fakeFeedback = [
      { 
        _id: new mongoose.Types.ObjectId(),
        rating: 4,
        comment: 'Good course',
        course: { title: 'Test Course', code: 'TST101' }
      }
    ];

    const findStub = sinon.stub(Feedback, 'find').returns({
      populate: sinon.stub().resolves(fakeFeedback)
    });

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getFeedback(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findStub.restore();
  });

  // Test 3: Update Feedback
  it('should update feedback successfully', async () => {
    const feedbackId = new mongoose.Types.ObjectId();
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      params: { id: feedbackId },
      body: { rating: 5, comment: 'Updated comment' }
    };

    const fakeFeedback = { 
      _id: feedbackId,
      rating: 4,
      comment: 'Old comment'
    };

    const findOneStub = sinon.stub(Feedback, 'findOne')
      .resolves(fakeFeedback);

    const updatedFeedback = { 
      _id: feedbackId,
      rating: 5,
      comment: 'Updated comment'
    };

    const updateStub = sinon.stub(Feedback, 'findByIdAndUpdate')
      .resolves(updatedFeedback);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateFeedback(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findOneStub.restore();
    updateStub.restore();
  });

  // Test 4: Delete Feedback
  it('should delete feedback successfully', async () => {
    const feedbackId = new mongoose.Types.ObjectId();
    const req = {
      user: { 
        id: new mongoose.Types.ObjectId(),
        role: 'student'
      },
      params: { id: feedbackId }
    };

    const deletedFeedback = { 
      _id: feedbackId,
      rating: 4,
      comment: 'Test comment'
    };

    const deleteStub = sinon.stub(Feedback, 'findOneAndDelete')
      .resolves(deletedFeedback);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await deleteFeedback(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    deleteStub.restore();
  });
});

// ─── Course CRUD Tests ─────────────────────────────────────────────────────

describe('Course Controller Tests', () => {

  // Test 5: Create Course
  it('should create a course successfully', async () => {
    const req = {
      user: { 
        id: new mongoose.Types.ObjectId(),
        role: 'admin'
      },
      body: {
        title: 'Software Engineering',
        code: 'IFN636',
        description: 'Software lifecycle management',
        semester: 'Semester 1 2025',
        faculty: new mongoose.Types.ObjectId()
      }
    };

    const createdCourse = { 
      _id: new mongoose.Types.ObjectId(), 
      ...req.body 
    };

    const createStub = sinon.stub(Course, 'create')
      .resolves(createdCourse);

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await createCourse(req, res);

    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    createStub.restore();
  });

  // Test 6: Get Courses - returns 500 if error occurs
  it('should return 500 if error occurs when getting courses', async () => {
    const req = {
      user: { 
        id: new mongoose.Types.ObjectId(),
        role: 'admin'
      }
    };

    const findStub = sinon.stub(Course, 'find')
      .throws(new Error('Database error'));

    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await getCourses(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledOnce).to.be.true;

    findStub.restore();
  });
});