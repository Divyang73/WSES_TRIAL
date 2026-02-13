# Contributing to WSES

Thank you for considering contributing to WSES! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what's best for the community

## How to Contribute

### Reporting Bugs

If you find a bug, please open an issue with:
- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, Docker version, etc.)

### Suggesting Features

For new features:
- Check if feature already exists or is planned
- Open an issue with `[Feature Request]` prefix
- Explain the use case
- Describe the proposed solution

### Pull Requests

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

#### PR Guidelines

- Keep changes focused and minimal
- Update documentation if needed
- Add tests for new features
- Follow existing code style
- Ensure all tests pass

## Development Setup

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local development)
- MySQL 8.0+ (for local development)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Divyang73/WSES_TRIAL.git
cd WSES_TRIAL
```

2. Start services with Docker:
```bash
docker compose up --build
```

3. For frontend development:
```bash
cd frontend
npm install
npm start
```

4. For backend development:
```bash
cd backend
npm install
npm run dev
```

## Project Structure

```
WSES_TRIAL/
├── backend/
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Helper functions
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   └── utils/          # Helper functions
│   └── Dockerfile
├── mysql-init/
│   └── init.sql            # Database schema
└── docker-compose.yml
```

## Coding Standards

### Backend (Node.js)

- Use `async/await` over callbacks
- Follow RESTful API conventions
- Add error handling to all routes
- Use meaningful variable names
- Comment complex logic

Example:
```javascript
const getUserSubmissions = async (req, res) => {
  try {
    const userId = req.user.id;
    const submissions = await Submission.findByUserId(userId);
    res.json({ submissions });
  } catch (error) {
    console.error('Get submissions error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
```

### Frontend (React)

- Use functional components with hooks
- Keep components small and focused
- Use meaningful component names
- Follow React best practices
- Use Tailwind CSS for styling

Example:
```javascript
const ProblemCard = ({ problem }) => {
  return (
    <div className="bg-gray-800 p-4 rounded">
      <h3 className="text-white font-bold">{problem.title}</h3>
      <span className={getDifficultyColor(problem.difficulty)}>
        {problem.difficulty}
      </span>
    </div>
  );
};
```

### Database

- Use prepared statements (parameterized queries)
- Add appropriate indexes
- Use transactions for multi-step operations
- Follow naming conventions: `snake_case` for columns

## Testing

### Before Submitting PR

Test these scenarios:
1. User signup/login
2. Problem list loading
3. Problem detail display
4. Code submission (AC, WA, TLE, CE)
5. Submission history
6. Multiple concurrent users

### Testing Commands

```bash
# Backend tests (if added)
cd backend
npm test

# Frontend tests (if added)
cd frontend
npm test
```

## Database Migrations

If you modify the database schema:
1. Update `mysql-init/init.sql`
2. Document changes in PR description
3. Test with fresh database

## Adding New Problems

To add problems to the platform:

1. Edit `mysql-init/init.sql`
2. Add problem:
```sql
INSERT INTO problems (title, slug, description, ...) VALUES
('Problem Title', 'problem-slug', 'Description...', ...);
```

3. Add test cases:
```sql
INSERT INTO test_cases (problem_id, input, expected_output, is_hidden) VALUES
(problem_id, 'input', 'output', FALSE);
```

## Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying setup process
- Adding dependencies

Documentation files:
- `README.md` - Main documentation
- `QUICKSTART.md` - Quick start guide
- `API.md` - API documentation
- `CONTRIBUTING.md` - This file

## Branch Strategy

- `main` - Stable production code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

## Commit Messages

Follow conventional commits:
- `feat: Add new feature`
- `fix: Fix bug`
- `docs: Update documentation`
- `style: Format code`
- `refactor: Refactor code`
- `test: Add tests`
- `chore: Update dependencies`

Example:
```
feat: Add user profile page

- Add profile component
- Add API endpoint for user stats
- Update navigation menu
```

## Security

If you discover a security vulnerability:
- DO NOT open a public issue
- Email the maintainer directly
- Provide detailed description
- Allow time for fix before disclosure

## Performance

Consider performance when:
- Adding database queries
- Processing large datasets
- Rendering lists
- Handling file uploads

Use:
- Pagination for large lists
- Indexes for frequent queries
- Lazy loading for heavy components
- Caching where appropriate

## Questions?

If you have questions:
- Check existing documentation
- Search closed issues
- Open a new issue with `[Question]` prefix

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in commits

Thank you for contributing to WSES! 🚀
