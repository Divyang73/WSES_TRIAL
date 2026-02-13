# WSES - Competitive Programming Platform

A modern, full-stack competitive programming platform inspired by CSES and LeetCode. Built with React, Node.js, Express, MySQL, and Judge0 for sandboxed code execution.

## 🚀 Features

- **User Authentication**: Secure signup/login with JWT
- **Problem Browser**: Browse and filter programming problems
- **Code Editor**: Integrated Monaco editor with syntax highlighting
- **Multiple Languages**: Support for Python, JavaScript, C++, C, and Java
- **Live Code Execution**: Sandboxed code execution using Judge0
- **Instant Feedback**: Real-time verdict display (AC, WA, TLE, CE, etc.)
- **Submission History**: Track all your submissions with detailed metrics
- **Responsive UI**: Clean, dark-themed interface

## 🏗️ Architecture

```
Frontend (React + Monaco)
    ↓
Backend API (Node + Express)
    ↓
Judge0 (Docker Container)
    ↓
MySQL Database
```

## 📦 Tech Stack

### Frontend
- React 18
- React Router v6
- Monaco Editor
- Axios
- Tailwind CSS

### Backend
- Node.js
- Express
- MySQL 8.0
- JWT Authentication
- bcryptjs

### Infrastructure
- Docker & Docker Compose
- Judge0 (Code Execution Engine)
- Redis

## 🚀 Getting Started

### Prerequisites
- Docker (version 20.10+)
- Docker Compose (version 2.0+)

### Installation

**No code changes required! Everything is pre-configured and ready to run.**

1. Clone the repository:
```bash
git clone https://github.com/Divyang73/WSES_TRIAL.git
cd WSES_TRIAL
```

2. Start all services:
```bash
docker compose up --build
```

3. Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### First Time Setup

1. The MySQL database will be automatically initialized with sample problems
2. Create an account by clicking "Sign Up"
3. Start solving problems!

**Note:** First startup takes 2-3 minutes as Docker downloads images and initializes services. See `SETUP_GUIDE.md` for detailed instructions and troubleshooting.

## 📊 Database Schema

### Users
- Authentication and user profiles

### Problems
- Problem statements with difficulty levels
- Sample inputs/outputs
- Constraints

### TestCases
- Hidden and visible test cases for problems

### Submissions
- Code submissions with verdicts
- Runtime and memory metrics
- Judge0 integration tokens

## 🧪 Testing the Platform

Try these test cases to verify the system:

1. **Correct Solution** → Should show "Accepted"
2. **Wrong Output** → Should show "Wrong Answer"
3. **Infinite Loop** → Should show "Time Limit Exceeded"
4. **Compilation Error** → Should show "Compilation Error"
5. **Multiple Users** → Create multiple accounts and submit simultaneously

## 🎯 Sample Problems

The platform comes with three sample problems:

1. **Two Sum** (Easy)
2. **Reverse String** (Easy)
3. **Factorial** (Easy)

## 🔧 Development

### Backend Development
```bash
cd backend
npm install
npm run dev
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

## 📝 API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Problems
- `GET /api/problems` - List all problems
- `GET /api/problems/:slug` - Get problem details

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions` - Get user submissions
- `GET /api/submissions/:id` - Get submission details
- `GET /api/submissions/problem/:slug` - Get problem submissions

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Sandboxed code execution via Judge0
- SQL injection protection
- CORS configuration

## 🎨 UI Design Principles

- Clean, minimal interface
- Split-screen layout (problem description + code editor)
- Dark theme optimized for coding
- Real-time feedback
- Clear visual indicators for verdicts

## 📈 Future Enhancements (Phase 2)

- [ ] Discussion forums
- [ ] Hint system
- [ ] User profiles with statistics
- [ ] Difficulty filters
- [ ] Problem tags
- [ ] Leaderboard
- [ ] AI-powered hints
- [ ] Custom test cases

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built by Divyang as a resume-grade full-stack system demonstrating:
- Backend architecture
- Asynchronous job handling
- Docker-based execution
- Clean UI/UX design
- Database modeling
- System-level thinking

## 🙏 Acknowledgments

- Judge0 for the code execution engine
- Monaco Editor for the code editor component
- LeetCode and CSES for inspiration