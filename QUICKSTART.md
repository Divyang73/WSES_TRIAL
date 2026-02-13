# Quick Start Guide

## Prerequisites

- Docker (version 20.10+)
- Docker Compose (version 2.0+)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/Divyang73/WSES_TRIAL.git
cd WSES_TRIAL
```

### 2. Verify Setup (Optional)
```bash
./verify.sh
```

### 3. Start All Services
```bash
docker compose up --build
```

This will start:
- MySQL database (with sample problems)
- Redis
- Judge0 (code execution engine)
- Backend API (Node.js/Express)
- Frontend (React)

**Note**: First time startup may take 2-3 minutes as Docker downloads images and builds containers.

### 4. Access the Platform

Once all services are running, open your browser:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001

## First Time Usage

1. Click **"Sign Up"** on the login page
2. Create your account with:
   - Name
   - Email
   - Password (minimum 6 characters)
3. After signup, you'll be automatically logged in
4. Browse problems on the main page
5. Click on a problem to start coding!

## Testing the Platform

### Sample Problems

The platform includes 3 sample problems:

1. **Two Sum** (Easy)
   - Given an array and target, return the sum of two numbers
   - Test language support

2. **Reverse String** (Easy)
   - Reverse a given string
   - Test basic I/O

3. **Factorial** (Easy)
   - Calculate factorial of a number
   - Test mathematical operations

### Supported Languages

- Python 3
- JavaScript (Node.js)
- C++
- C
- Java

### Example: Solving "Reverse String"

1. Navigate to **Problems** page
2. Click on **"Reverse String"**
3. Select **Python** from the language dropdown
4. Write your solution:

```python
# Read input
s = input()

# Reverse and print
print(s[::-1])
```

5. Click **Submit**
6. Wait for verdict (1-3 seconds)
7. See result: **Accepted** ✅

### Testing Different Verdicts

#### ✅ Accepted (AC)
Submit correct solution for any problem.

#### ❌ Wrong Answer (WA)
For "Reverse String", submit:
```python
s = input()
print(s)  # Not reversed
```

#### ⏱️ Time Limit Exceeded (TLE)
For "Factorial", submit:
```python
while True:
    pass  # Infinite loop
```

#### 🔴 Compilation Error (CE)
For any problem, submit invalid syntax:
```python
def foo(
    # Missing closing parenthesis
```

## Stopping the Platform

Press `Ctrl+C` in the terminal running docker compose, then:

```bash
docker compose down
```

To also remove volumes (database data):
```bash
docker compose down -v
```

## Development Mode

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

## Troubleshooting

### Port Already in Use
If ports 3000, 5001, or 3306 are already in use, stop those services or modify `docker-compose.yml`.

### Judge0 Not Responding
Wait a bit longer - Judge0 takes ~30 seconds to initialize on first start.

### Database Connection Failed
Ensure MySQL container is healthy:
```bash
docker ps
```
Look for `healthy` status on `wses-mysql`.

### Frontend Can't Connect to Backend
Check that backend is running:
```bash
curl http://localhost:5001/health
```
Should return: `{"status":"ok","message":"WSES Backend is running"}`

## Architecture Overview

```
┌─────────────────┐
│   Browser       │
│  (Port 3000)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Frontend │
│   + Monaco      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Express API    │◄─────┤    MySQL     │
│  (Port 5001)    │      │  (Port 3306) │
└────────┬────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│    Judge0       │◄─────┤    Redis     │
│  (Port 2358)    │      │  (Port 6379) │
└─────────────────┘      └──────────────┘
```

## What's Next?

After successfully running the MVP:

1. **Explore the codebase**:
   - Backend: Clean MVC architecture
   - Frontend: React with hooks and context
   - Database: Well-structured schema

2. **Add more problems**:
   - Insert into MySQL via `mysql-init/init.sql`

3. **Customize the UI**:
   - Edit Tailwind classes in frontend components

4. **Phase 2 features**:
   - Discussion forums
   - Hints system
   - User profiles
   - Leaderboard

## Support

For issues or questions, open an issue on GitHub:
https://github.com/Divyang73/WSES_TRIAL/issues

## License

MIT License - See LICENSE file for details
