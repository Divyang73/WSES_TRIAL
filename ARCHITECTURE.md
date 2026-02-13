# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         WSES Platform                        │
└─────────────────────────────────────────────────────────────┘

┌───────────────┐
│   Browser     │  User Interface
│ (Port 3000)   │  - React + Monaco Editor
└───────┬───────┘  - Tailwind CSS
        │          - Axios HTTP Client
        │
        │ HTTP/REST
        ▼
┌───────────────┐
│   Frontend    │  React Application
│   Container   │  - Authentication UI
│               │  - Problem Browser
│               │  - Code Editor
│               │  - Submission History
└───────┬───────┘
        │
        │ HTTP/REST (API calls)
        ▼
┌───────────────┐
│   Backend     │  Express.js API Server
│   Container   │  - JWT Authentication
│  (Port 5000)  │  - REST API Endpoints
│               │  - Business Logic
│               │  - Async Processing
└─┬─────────┬───┘
  │         │
  │         │ Judge0 API
  │         ▼
  │   ┌─────────────┐    ┌──────────┐
  │   │   Judge0    │◄───┤  Redis   │
  │   │  Container  │    │Container │
  │   │(Port 2358)  │    │          │
  │   │             │    │ Session  │
  │   │ Sandboxed   │    │ Storage  │
  │   │ Code Exec   │    └──────────┘
  │   └─────────────┘
  │
  │ MySQL Connection
  ▼
┌───────────────┐
│   MySQL       │  Database
│   Container   │  - Users
│  (Port 3306)  │  - Problems
│               │  - TestCases
│               │  - Submissions
└───────────────┘

All containers run in Docker Network: wses-network
```

## Data Flow: Code Submission

```
1. User writes code in Monaco Editor
   └─> Frontend validates language selection

2. User clicks "Submit"
   └─> Frontend sends POST /api/submissions
       {
         problemSlug: "two-sum",
         code: "...",
         language: "python"
       }

3. Backend creates submission record
   └─> Status: "Pending"
   └─> Returns submissionId

4. Backend async processing starts
   └─> Fetch all test cases from DB
   
5. For each test case:
   ├─> Send to Judge0 API
   ├─> Receive Judge0 token
   └─> Poll Judge0 for result
       └─> Status ID:
           ├─> 1,2: Still processing
           ├─> 3: Accepted
           ├─> 4: Wrong Answer
           ├─> 5: Time Limit Exceeded
           ├─> 6: Compilation Error
           └─> 7-14: Runtime Errors

6. Backend updates submission
   └─> Verdict, Runtime, Memory
   └─> Error message (if any)

7. Frontend polls GET /api/submissions/:id
   └─> Every 1 second
   └─> Displays verdict when ready

8. Submission shown in history
   └─> GET /api/submissions/problem/:slug
```

## Authentication Flow

```
┌──────────┐                 ┌──────────┐                 ┌──────────┐
│  User    │                 │ Frontend │                 │ Backend  │
└────┬─────┘                 └────┬─────┘                 └────┬─────┘
     │                            │                            │
     │  1. Enter credentials      │                            │
     ├──────────────────────────►│                            │
     │                            │                            │
     │                            │  2. POST /api/auth/login   │
     │                            ├──────────────────────────►│
     │                            │                            │
     │                            │                            │
     │                            │  3. Verify password        │
     │                            │     (bcrypt compare)       │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │                            │  4. Generate JWT token     │
     │                            │     (expires in 7 days)    │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │                            │  5. Return token + user    │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │  6. Store in localStorage  │                            │
     │◄───────────────────────────┤                            │
     │                            │                            │
     │  7. Redirect to dashboard  │                            │
     │◄───────────────────────────┤                            │
     │                            │                            │
     │  8. Access protected route │                            │
     ├──────────────────────────►│                            │
     │                            │                            │
     │                            │  9. Include token in       │
     │                            │     Authorization header   │
     │                            ├──────────────────────────►│
     │                            │                            │
     │                            │  10. Verify JWT token      │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │                            │  11. Return protected data │
     │                            │◄───────────────────────────┤
     │                            │                            │
     │  12. Display content       │                            │
     │◄───────────────────────────┤                            │
     │                            │                            │
```

## Database Schema

```sql
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ email (UNIQUE)      │
│ password_hash       │
│ created_at          │
└─────────┬───────────┘
          │
          │ 1:N
          │
          ▼
┌─────────────────────┐       ┌─────────────────────┐
│    submissions      │  N:1  │     problems        │
├─────────────────────┤───────├─────────────────────┤
│ id (PK)             │       │ id (PK)             │
│ user_id (FK)        │       │ title               │
│ problem_id (FK)     │◄──────│ slug (UNIQUE)       │
│ language            │       │ description         │
│ code                │       │ input_format        │
│ verdict             │       │ output_format       │
│ judge_token         │       │ constraints         │
│ runtime             │       │ sample_input        │
│ memory              │       │ sample_output       │
│ error_message       │       │ difficulty          │
│ created_at          │       │ created_at          │
│ updated_at          │       └─────────┬───────────┘
└─────────────────────┘                 │
                                        │ 1:N
                                        │
                                        ▼
                              ┌─────────────────────┐
                              │    test_cases       │
                              ├─────────────────────┤
                              │ id (PK)             │
                              │ problem_id (FK)     │
                              │ input               │
                              │ expected_output     │
                              │ is_hidden           │
                              │ created_at          │
                              └─────────────────────┘
```

## Component Hierarchy (Frontend)

```
App.js
│
├─ AuthProvider (Context)
│  └─ Manages authentication state
│
├─ Router
│  │
│  ├─ /login
│  │  └─ Login.js
│  │
│  ├─ /signup
│  │  └─ Signup.js
│  │
│  ├─ / (Protected)
│  │  └─ ProblemList.js
│  │     └─ Navbar.js
│  │
│  ├─ /problems/:slug (Protected)
│  │  └─ ProblemDetail.js
│  │     ├─ Navbar.js
│  │     ├─ Monaco Editor
│  │     └─ Submission History
│  │
│  └─ /submissions (Protected)
│     └─ Submissions.js
│        └─ Navbar.js
```

## API Request Flow

```
┌─────────────┐
│  Request    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  CORS Middleware    │  Allow cross-origin
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Body Parser        │  Parse JSON
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Route Handler      │  /api/auth/*
└──────┬──────────────┘  /api/problems/*
       │                 /api/submissions/*
       ▼
┌─────────────────────┐
│  Auth Middleware    │  Verify JWT (if protected)
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Controller         │  Business logic
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│  Model/Service      │  Database/Judge0
└──────┬──────────────┘
       │
       ▼
┌─────────────┐
│  Response   │  JSON
└─────────────┘
```

## Judge0 Integration Pattern

```
Backend                      Judge0
   │                           │
   │  1. POST /submissions     │
   │  {                        │
   │    source_code: "...",    │
   │    language_id: 71,       │
   │    stdin: "...",          │
   │    expected_output: "..." │
   │  }                        │
   ├─────────────────────────►│
   │                           │
   │  2. Return token          │
   │  { token: "abc123" }      │
   │◄──────────────────────────┤
   │                           │
   │  3. Store token in DB     │
   │                           │
   │  4. Start polling         │
   │     (every 1 second)      │
   │                           │
   │  GET /submissions/abc123  │
   ├─────────────────────────►│
   │                           │
   │  5. Check status          │
   │  { status: {id: 2} }      │  id=1,2: Processing
   │◄──────────────────────────┤
   │                           │
   │  6. Continue polling...   │
   │                           │
   │  GET /submissions/abc123  │
   ├─────────────────────────►│
   │                           │
   │  7. Result ready          │
   │  {                        │
   │    status: {id: 3},       │  id=3: Accepted
   │    time: "0.045",         │  id=4: Wrong Answer
   │    memory: 2048           │  id=5: TLE
   │  }                        │  id=6: Compile Error
   │◄──────────────────────────┤
   │                           │
   │  8. Update DB verdict     │
   │                           │
```

## Technology Stack

### Frontend
- **React 18**: UI framework
- **React Router v6**: Client-side routing
- **Monaco Editor**: Code editor (VS Code engine)
- **Axios**: HTTP client
- **Tailwind CSS**: Utility-first CSS

### Backend
- **Node.js 18**: Runtime environment
- **Express.js**: Web framework
- **MySQL 8.0**: Relational database
- **mysql2**: MySQL client
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Judge0**: Code execution engine
- **Redis**: Caching and queuing

## Security Measures

1. **Password Security**
   - bcrypt hashing (10 rounds)
   - Salted passwords

2. **Authentication**
   - JWT tokens (7-day expiry)
   - Secure token storage
   - Token verification middleware

3. **Database Security**
   - Parameterized queries
   - No SQL injection vulnerabilities
   - Foreign key constraints

4. **Code Execution**
   - Sandboxed Judge0 environment
   - Time and memory limits
   - Isolated containers

5. **API Security**
   - CORS configuration
   - Input validation
   - Error handling

## Performance Optimizations

1. **Database**
   - Indexes on frequently queried columns
   - Connection pooling
   - Efficient queries

2. **API**
   - Async/await for non-blocking operations
   - Background job processing
   - Pagination for large result sets

3. **Frontend**
   - Code splitting
   - Lazy loading
   - Optimized builds

4. **Judge0**
   - Async submission processing
   - Polling with reasonable intervals
   - Timeout handling

## Scalability Considerations

1. **Horizontal Scaling**
   - Stateless backend (can add more instances)
   - External session storage (Redis)
   - Load balancing ready

2. **Vertical Scaling**
   - Resource limits configurable
   - Database can be upgraded
   - Judge0 can handle multiple submissions

3. **Caching Strategy**
   - Redis for session data
   - Problem data can be cached
   - Submission results stored in DB

4. **Future Improvements**
   - Message queue (RabbitMQ/Redis Queue)
   - Microservices architecture
   - CDN for static assets
   - Read replicas for database
