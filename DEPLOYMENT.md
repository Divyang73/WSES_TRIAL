# Deployment Guide

This guide covers deploying WSES in different environments.

## Table of Contents
- [Local Deployment](#local-deployment)
- [Production Considerations](#production-considerations)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

## Local Deployment

### Quick Start

1. Ensure Docker and Docker Compose are installed
2. Clone the repository
3. Run verification script:
```bash
./verify.sh
```

4. Start all services:
```bash
docker compose up --build
```

5. Access the platform:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

### First Time Setup

The platform will automatically:
- Create database schema
- Insert sample problems
- Start all services

Wait 2-3 minutes for all services to initialize.

## Production Considerations

### Security

#### 1. Change Default Credentials

Edit `docker-compose.yml`:
```yaml
environment:
  MYSQL_ROOT_PASSWORD: <strong-password>
  DB_PASSWORD: <strong-password>
  JWT_SECRET: <strong-random-secret>
```

#### 2. Enable HTTPS

Add nginx reverse proxy:
```yaml
nginx:
  image: nginx:alpine
  ports:
    - "80:80"
    - "443:443"
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
    - ./ssl:/etc/ssl
```

#### 3. Restrict CORS

The backend CORS configuration supports environment-based origins. By default, it allows:
- `http://localhost:3000` (frontend)
- `http://localhost:5000` (backend)

For production, set the `ALLOWED_ORIGINS` environment variable in `docker-compose.yml`:

```yaml
backend:
  environment:
    - ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

Or use a wildcard for a single domain:
```yaml
backend:
  environment:
    - ALLOWED_ORIGINS=https://yourdomain.com
```

### Performance

#### 1. Enable Redis Caching

Redis is already included. Use for:
- Session storage
- Rate limiting
- API response caching

#### 2. Database Optimization

Add to `mysql-init/init.sql`:
```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_submission_verdict ON submissions(verdict);
CREATE INDEX idx_submission_user_problem ON submissions(user_id, problem_id);
```

#### 3. Frontend Optimization

Build optimized production bundle:
```bash
cd frontend
npm run build
```

Serve static files with nginx.

### Scaling

#### Horizontal Scaling

For multiple backend instances:

1. Add load balancer (nginx):
```yaml
backend:
  deploy:
    replicas: 3
```

2. Use external MySQL and Redis
3. Configure session store

#### Database Scaling

- Use read replicas for read-heavy workloads
- Partition submissions table by date
- Archive old submissions

### Monitoring

#### Health Checks

Backend health check:
```bash
curl http://localhost:5000/health
```

Database health:
```bash
docker exec wses-mysql mysqladmin ping -h localhost -u root -p
```

#### Logging

View logs:
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f judge0
```

#### Metrics

Consider adding:
- Prometheus for metrics
- Grafana for visualization
- ELK stack for log aggregation

### Backup

#### Database Backup

```bash
# Backup
docker exec wses-mysql mysqldump -u root -p<password> wses > backup.sql

# Restore
docker exec -i wses-mysql mysql -u root -p<password> wses < backup.sql
```

Automate with cron:
```bash
0 2 * * * /path/to/backup.sh
```

## Environment Variables

### Backend

```bash
# Database
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=password
DB_NAME=wses
DB_PORT=3306

# Judge0
JUDGE0_URL=http://judge0:2358

# Authentication
JWT_SECRET=your-secret-key-change-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5000

# Server
PORT=5000
NODE_ENV=production
```

### Frontend

```bash
# API URL
REACT_APP_API_URL=http://localhost:5000
```

## Docker Compose Production

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - internal

  backend:
    restart: always
    environment:
      NODE_ENV: production
      JWT_SECRET: ${JWT_SECRET}
      DB_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    networks:
      - internal
      - external

  frontend:
    restart: always
    networks:
      - external

networks:
  internal:
    internal: true
  external:
    driver: bridge

volumes:
  mysql_data:
    driver: local
```

Start with:
```bash
docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Issue: Judge0 Not Responding

**Symptoms:**
- Submissions stuck in "Pending"
- Timeout errors

**Solutions:**
1. Check Judge0 status:
```bash
docker compose logs judge0
```

2. Restart Judge0:
```bash
docker compose restart judge0
```

3. Increase timeout in `backend/src/services/judgeService.js`

### Issue: Database Connection Failed

**Symptoms:**
- Backend crashes on startup
- "Cannot connect to database" errors

**Solutions:**
1. Check MySQL status:
```bash
docker compose ps mysql
```

2. Check logs:
```bash
docker compose logs mysql
```

3. Verify credentials in `docker-compose.yml`

### Issue: Frontend Can't Reach Backend

**Symptoms:**
- API calls fail
- CORS errors in console

**Solutions:**
1. Check backend is running:
```bash
curl http://localhost:5000/health
```

2. Verify REACT_APP_API_URL in frontend

3. Check CORS configuration in backend

### Issue: Port Already in Use

**Symptoms:**
- Docker compose fails to start
- "port is already allocated" error

**Solutions:**
1. Find process using port:
```bash
lsof -i :3000
lsof -i :5000
lsof -i :3306
```

2. Kill process or change port in `docker-compose.yml`

### Issue: Slow Performance

**Solutions:**
1. Check Docker resources
2. Optimize database queries
3. Add indexes
4. Enable caching
5. Use production build for frontend

## Maintenance

### Regular Tasks

**Daily:**
- Check logs for errors
- Monitor disk space
- Review failed submissions

**Weekly:**
- Backup database
- Update dependencies (if needed)
- Review performance metrics

**Monthly:**
- Clean old logs
- Archive old submissions
- Security updates

### Updates

To update the platform:

1. Pull latest changes:
```bash
git pull origin main
```

2. Rebuild containers:
```bash
docker compose down
docker compose up --build -d
```

3. Run migrations if needed

### Rollback

If update fails:

1. Stop services:
```bash
docker compose down
```

2. Checkout previous version:
```bash
git checkout <previous-commit>
```

3. Start services:
```bash
docker compose up -d
```

4. Restore database if needed

## Support

For deployment issues:
- Check logs first
- Review troubleshooting section
- Open issue on GitHub
- Provide logs and environment details

## Security Checklist

Before production deployment:

- [ ] Change default passwords
- [ ] Generate strong JWT secret
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up firewall
- [ ] Enable rate limiting
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Review security headers
- [ ] Set up log rotation
- [ ] Disable debug mode
- [ ] Remove development tools
- [ ] Set proper file permissions
- [ ] Update all dependencies
- [ ] Configure error reporting
