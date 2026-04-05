# Course Feedback System (CFS)

## Project Overview
A full-stack web application for managing course feedback between students, faculty, and administrators. Built with Node.js, React.js, and MongoDB.

## Public URL
http://16.176.219.14

## Test Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | admin123 |
| Faculty | faculty@test.com | faculty123 |
| Student | student@test.com | student123 |

## Tech Stack
- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Process Manager:** PM2
- **Web Server:** Nginx
- **CI/CD:** GitHub Actions
- **Deployment:** AWS EC2

## Features
### Student
- View enrolled courses
- Submit feedback with star ratings
- Edit and delete own feedback

### Faculty
- View assigned courses
- View anonymous student feedback
- View course analytics

### Admin
- Full CRUD for users
- Full CRUD for courses
- Manage enrollments
- View all feedback

## Project Setup Instructions

### Prerequisites
- Node.js v22
- MongoDB Atlas account
- Git

### Local Setup

**Step 1: Clone the repository**
git clone https://github.com/arjunror/Course-Feedback-System.git
cd Course-Feedback-System
**Step 2: Backend setup**
cd backend
npm install
**Step 3: Create .env file in backend folder**
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/coursefeedback?appName=Cluster0
JWT_SECRET=your_jwt_secret
PORT=5001
**Step 4: Start backend**
npm start
**Step 5: Frontend setup**
cd frontend
npm install
npm start
**Step 6: Open browser**
http://localhost:3000

## GitHub Repository
https://github.com/arjunror/Course-Feedback-System

## EC2 Instance
- Public IP: 16.176.219.14
- Backend runs on port 5001
- Frontend runs on port 3000
- Nginx configured on port 80

## CI/CD Pipeline
- Automated testing with Mocha/Chai
- Automatic deployment via GitHub Actions
- Self-hosted runner on AWS EC2
- Triggers on push to main branch

## Branching Strategy
- main — production branch
- feature-feedback — backend CRUD features
- feature-frontend-clean — frontend pages