# API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing fields or email already registered
- 500: Server error

---

### POST /auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors:**
- 400: Missing fields
- 401: Invalid credentials
- 500: Server error

---

### GET /auth/profile
Get current user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Errors:**
- 401: Missing or invalid token
- 404: User not found
- 500: Server error

---

## Problem Endpoints

### GET /problems
List all problems (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "problems": [
    {
      "id": 1,
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "Easy",
      "created_at": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "title": "Reverse String",
      "slug": "reverse-string",
      "difficulty": "Easy",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET /problems/:slug
Get detailed problem information (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `slug`: Problem slug (e.g., "two-sum")

**Response (200):**
```json
{
  "problem": {
    "id": 1,
    "title": "Two Sum",
    "slug": "two-sum",
    "description": "Given an array of integers nums and an integer target...",
    "input_format": "First line contains n...",
    "output_format": "Single integer...",
    "constraints": "2 ≤ n ≤ 10^4",
    "sample_input": "4\n2 7 11 15\n9",
    "sample_output": "9",
    "difficulty": "Easy",
    "created_at": "2024-01-01T00:00:00.000Z"
  },
  "testCases": [
    {
      "id": 1,
      "input": "4\n2 7 11 15\n9",
      "expected_output": "9"
    }
  ]
}
```

**Note:** Only non-hidden test cases are returned.

**Errors:**
- 404: Problem not found
- 500: Server error

---

## Submission Endpoints

### POST /submissions
Submit code for a problem (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "problemSlug": "two-sum",
  "code": "n = int(input())\narr = list(map(int, input().split()))\ntarget = int(input())\nprint(target)",
  "language": "python"
}
```

**Supported Languages:**
- `python` - Python 3
- `javascript` - JavaScript (Node.js)
- `cpp` - C++
- `c` - C
- `java` - Java

**Response (201):**
```json
{
  "message": "Submission created",
  "submissionId": 123
}
```

**Note:** Submission is processed asynchronously. Use GET /submissions/:id to check status.

**Errors:**
- 400: Missing fields or unsupported language
- 404: Problem not found
- 500: Server error

---

### GET /submissions/:id
Get submission details (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `id`: Submission ID

**Response (200):**
```json
{
  "submission": {
    "id": 123,
    "user_id": 1,
    "problem_id": 1,
    "language": "python",
    "code": "n = int(input())...",
    "verdict": "Accepted",
    "judge_token": "abc123",
    "runtime": 45,
    "memory": 2048,
    "error_message": null,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:01.000Z"
  }
}
```

**Possible Verdicts:**
- `Pending` - Still processing
- `Accepted` - All test cases passed
- `Wrong Answer` - Output doesn't match expected
- `Time Limit Exceeded` - Took too long
- `Compilation Error` - Code doesn't compile
- `Runtime Error` - Code crashed during execution
- `System Error` - Internal error

**Errors:**
- 403: Not authorized to view this submission
- 404: Submission not found
- 500: Server error

---

### GET /submissions
Get all user submissions (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of submissions to return (default: 50, max: 50)

**Response (200):**
```json
{
  "submissions": [
    {
      "id": 123,
      "problem_id": 1,
      "language": "python",
      "verdict": "Accepted",
      "runtime": 45,
      "memory": 2048,
      "created_at": "2024-01-01T00:00:00.000Z",
      "title": "Two Sum",
      "slug": "two-sum"
    }
  ]
}
```

---

### GET /submissions/problem/:problemSlug
Get user submissions for a specific problem (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Parameters:**
- `problemSlug`: Problem slug (e.g., "two-sum")

**Query Parameters:**
- `limit` (optional): Number of submissions to return (default: 20, max: 20)

**Response (200):**
```json
{
  "submissions": [
    {
      "id": 123,
      "language": "python",
      "verdict": "Accepted",
      "runtime": 45,
      "memory": 2048,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- 404: Problem not found
- 500: Server error

---

## Health Check

### GET /health
Check if backend is running (no authentication required).

**Response (200):**
```json
{
  "status": "ok",
  "message": "WSES Backend is running"
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized (missing/invalid token)
- 403: Forbidden (no access to resource)
- 404: Not Found
- 500: Internal Server Error

---

## Rate Limiting

Currently not implemented. Consider adding rate limiting for production deployment.

---

## CORS

CORS is enabled for all origins in development. Configure for production use.

---

## Judge0 Integration

The backend uses Judge0 for code execution:
- Submissions are sent to Judge0 asynchronously
- Backend polls Judge0 for results
- Results are stored in database
- Frontend polls backend for updates

This ensures the API remains responsive even during code execution.
