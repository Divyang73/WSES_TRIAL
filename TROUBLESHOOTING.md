# Troubleshooting Guide

Common issues and their solutions when running WSES platform.

## Table of Contents
- [Installation Issues](#installation-issues)
- [Docker Issues](#docker-issues)
- [Backend Issues](#backend-issues)
- [Frontend Issues](#frontend-issues)
- [Judge0 Issues](#judge0-issues)
- [Database Issues](#database-issues)
- [Network Issues](#network-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### Docker Not Found

**Symptom:**
```bash
bash: docker: command not found
```

**Solution:**
Install Docker:
- **Ubuntu/Debian:**
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sudo sh get-docker.sh
  ```
- **macOS:** Download Docker Desktop from docker.com
- **Windows:** Download Docker Desktop from docker.com

### Docker Compose Not Found

**Symptom:**
```bash
docker: 'compose' is not a docker command
```

**Solution:**
- Docker Compose v2 comes with Docker Desktop
- For Linux, install separately:
  ```bash
  sudo apt install docker-compose-plugin
  ```

---

## Docker Issues

### Permission Denied

**Symptom:**
```bash
Got permission denied while trying to connect to the Docker daemon socket
```

**Solution:**
Add user to docker group:
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Port Already in Use

**Symptom:**
```bash
Error starting userland proxy: listen tcp 0.0.0.0:3000: bind: address already in use
```
or
```bash
Error response from daemon: ports are not available: exposing port TCP 0.0.0.0:5000 -> 127.0.0.1:0: listen tcp 0.0.0.0:5000: bind: address already in use
```

**Solution:**

**Option 1:** Stop conflicting service
```bash
# Find process using the port (replace 3000 with 5000 for backend)
sudo lsof -i :3000
# Or for backend
sudo lsof -i :5000
# Kill process
sudo kill -9 <PID>
```

**Option 2:** Change port in docker-compose.yml
```yaml
# For frontend
frontend:
  ports:
    - "3001:3000"  # Change 3000 to 3001
  environment:
    - REACT_APP_API_URL=http://localhost:5001  # Update if backend port changed

# For backend
backend:
  ports:
    - "5001:5000"  # Change 5000 to 5001 (host:container)
```

**Note:** Port 5000 is commonly used by macOS AirPlay Receiver. If using macOS:
- System Preferences → Sharing → Uncheck "AirPlay Receiver"
- Or use the port change option above (recommended)

### Container Keeps Restarting

**Symptom:**
```bash
docker compose ps
# Shows container constantly restarting
```

**Solution:**
Check logs:
```bash
docker compose logs <service-name>
```

Common causes:
- Missing environment variables
- Database not ready
- Port conflicts
- Application crashes

### Out of Disk Space

**Symptom:**
```bash
no space left on device
```

**Solution:**
Clean up Docker:
```bash
# Remove unused containers, networks, images
docker system prune -a

# Remove unused volumes
docker volume prune
```

---

## Backend Issues

### Backend Won't Start

**Symptom:**
Backend container exits immediately

**Solution:**
Check logs:
```bash
docker compose logs backend
```

Common issues:
1. **Database connection failed**
   - Ensure MySQL is running and healthy
   - Check DB credentials in docker-compose.yml

2. **Missing dependencies**
   - Rebuild: `docker compose build --no-cache backend`

3. **Syntax errors in code**
   - Check recent code changes
   - Review error stack trace

### Database Connection Error

**Symptom:**
```
Error: connect ECONNREFUSED mysql:3306
```

**Solution:**
1. Check MySQL is running:
```bash
docker compose ps mysql
```

2. Check MySQL is healthy:
```bash
docker compose logs mysql
```

3. Verify environment variables in docker-compose.yml:
```yaml
backend:
  environment:
    DB_HOST: mysql  # Use service name, not localhost
    DB_PORT: 3306
    DB_USER: root
    DB_PASSWORD: password
    DB_NAME: wses
```

### JWT Token Issues

**Symptom:**
- "Invalid or expired token" errors
- Users logged out unexpectedly

**Solution:**
1. Ensure JWT_SECRET is set in backend
2. Check token expiry (default: 7 days)
3. Clear localStorage in browser:
```javascript
localStorage.clear()
```

### API Returns 500 Errors

**Symptom:**
All API calls return 500 Internal Server Error

**Solution:**
1. Check backend logs:
```bash
docker compose logs backend -f
```

2. Look for stack traces
3. Common causes:
   - Database query errors
   - Null pointer exceptions
   - Unhandled promises

---

## Frontend Issues

### Frontend Won't Load

**Symptom:**
Browser shows "Cannot connect" or blank page

**Solution:**
1. Check if frontend is running:
```bash
docker compose ps frontend
```

2. Check logs:
```bash
docker compose logs frontend
```

3. Verify port:
   - Should be accessible at http://localhost:3000

### API Calls Failing

**Symptom:**
Network errors in browser console

**Solution:**
1. Verify backend is running:
```bash
curl http://localhost:5000/health
```

2. Check REACT_APP_API_URL:
```yaml
frontend:
  environment:
    REACT_APP_API_URL: http://localhost:5000
```

3. Check browser console for CORS errors

### CORS Errors

**Symptom:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**
1. Verify backend CORS configuration in `backend/src/app.js`
   - Default allows `http://localhost:3000` and `http://localhost:5000`
   - Supports credentials and common HTTP methods
   - Handles OPTIONS preflight requests

2. Check if backend is running:
```bash
curl http://localhost:5000/health
```

3. Test OPTIONS preflight:
```bash
curl -X OPTIONS http://localhost:5000/api/auth/signup \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v
```

4. For production, configure `ALLOWED_ORIGINS` in docker-compose.yml:
```yaml
backend:
  environment:
    - ALLOWED_ORIGINS=https://yourdomain.com
```

5. Verify API URL doesn't have trailing slash in frontend configuration

### Monaco Editor Not Loading

**Symptom:**
Code editor area is blank

**Solution:**
1. Check browser console for errors
2. Ensure @monaco-editor/react is installed
3. Try rebuilding:
```bash
docker compose build --no-cache frontend
```

---

## Judge0 Issues

### Judge0 Not Responding

**Symptom:**
All submissions stuck in "Pending" status

**Solution:**
1. Check Judge0 is running:
```bash
docker compose ps judge0
```

2. Check Judge0 logs:
```bash
docker compose logs judge0
```

3. Test Judge0 manually:
```bash
curl http://localhost:2358/languages
```

4. Restart Judge0:
```bash
docker compose restart judge0
```

### Judge0 Takes Too Long

**Symptom:**
Submissions take 30+ seconds

**Solution:**
1. Judge0 needs ~30 seconds on first start
2. Wait for Judge0 to fully initialize
3. Check Judge0 logs for "API ready"

### Submissions Timeout

**Symptom:**
All submissions show "Runtime Error" or timeout

**Solution:**
1. Increase timeout in backend/src/services/judgeService.js:
```javascript
const pollSubmission = async (token, maxAttempts = 60) // Increase from 30
```

2. Check Judge0 resource limits
3. Ensure Judge0 has enough memory

---

## Database Issues

### MySQL Won't Start

**Symptom:**
MySQL container keeps restarting

**Solution:**
1. Check logs:
```bash
docker compose logs mysql
```

2. Common causes:
   - Port 3306 already in use
   - Corrupted data volume
   - Insufficient memory

3. Reset MySQL:
```bash
docker compose down -v  # Warning: Deletes all data
docker compose up mysql
```

### Database Not Initialized

**Symptom:**
Tables don't exist, queries fail

**Solution:**
1. Check if init.sql ran:
```bash
docker compose logs mysql | grep "init.sql"
```

2. Manually initialize:
```bash
docker compose exec mysql mysql -u root -p wses < mysql-init/init.sql
```

### Can't Connect to MySQL

**Symptom:**
```
ERROR 2003 (HY000): Can't connect to MySQL server
```

**Solution:**
1. Wait for MySQL to be healthy (check docker compose ps)
2. Verify credentials
3. Check port not blocked by firewall

---

## Network Issues

### Containers Can't Communicate

**Symptom:**
Backend can't reach MySQL or Judge0

**Solution:**
1. Check all in same network:
```bash
docker network inspect wses_wses-network
```

2. Use service names, not IP addresses:
   - ✅ `DB_HOST=mysql`
   - ❌ `DB_HOST=localhost`

3. Restart network:
```bash
docker compose down
docker compose up
```

### Can't Access from Browser

**Symptom:**
http://localhost:3000 doesn't load

**Solution:**
1. Check firewall settings
2. Try 127.0.0.1 instead of localhost
3. Check if port forwarding works:
```bash
docker compose ps
# Verify 0.0.0.0:3000->3000/tcp
```

---

## Performance Issues

### Slow Initial Load

**Symptom:**
First request takes 10+ seconds

**Solution:**
- Normal behavior (cold start)
- Database connection pool initializing
- Subsequent requests will be faster

### Slow Submissions

**Symptom:**
Code execution takes minutes

**Solution:**
1. Check Judge0 resources
2. Verify not actually infinite loop
3. Check Docker has enough CPU/RAM allocated
4. Monitor with:
```bash
docker stats
```

### High Memory Usage

**Symptom:**
System becomes slow, containers crash

**Solution:**
1. Check memory usage:
```bash
docker stats
```

2. Increase Docker memory limit (Docker Desktop → Settings)
3. Reduce container memory limits in docker-compose.yml
4. Clean up old data:
```bash
docker system prune -a
```

---

## Development Issues

### Code Changes Not Reflecting

**Symptom:**
Changed code but no effect

**Solution:**
1. **Frontend:**
   - React should hot-reload automatically
   - If not, restart: `docker compose restart frontend`

2. **Backend:**
   - Need to restart: `docker compose restart backend`
   - Or use nodemon (already configured)

3. **Force rebuild:**
```bash
docker compose build --no-cache
docker compose up
```

### Environment Variables Not Working

**Symptom:**
process.env.VARIABLE is undefined

**Solution:**
1. **Frontend:**
   - Must start with `REACT_APP_`
   - Rebuild required after changes

2. **Backend:**
   - Check .env file or docker-compose.yml
   - Restart container after changes

---

## Common Error Messages

### "EADDRINUSE" Error
**Meaning:** Port already in use
**Solution:** Kill process or change port

### "ECONNREFUSED" Error
**Meaning:** Can't connect to service
**Solution:** Check service is running and accessible

### "MODULE_NOT_FOUND" Error
**Meaning:** Missing npm package
**Solution:** Rebuild container with `--no-cache`

### "Unauthorized" Error
**Meaning:** Invalid or missing JWT token
**Solution:** Login again, check token in localStorage

### "Cannot GET /api/..." Error
**Meaning:** Route doesn't exist
**Solution:** Check API endpoint spelling and method (GET/POST)

---

## Getting Help

If you're still stuck:

1. **Check logs:**
```bash
docker compose logs -f
```

2. **Search existing issues:**
   - GitHub Issues
   - Stack Overflow

3. **Open new issue:**
   - Include error messages
   - Include relevant logs
   - Describe steps to reproduce
   - Mention OS and Docker version

4. **Debug mode:**
```bash
# Enable verbose logging
docker compose up --verbose
```

---

## Preventive Measures

1. **Regular maintenance:**
```bash
# Weekly
docker system prune

# Monthly
docker compose down -v
docker compose up --build
```

2. **Monitor resources:**
```bash
docker stats
```

3. **Keep updated:**
```bash
git pull
docker compose pull
docker compose up --build
```

4. **Backup database:**
```bash
docker exec wses-mysql mysqldump -u root -ppassword wses > backup.sql
```

---

## Quick Fixes

### Reset Everything
```bash
docker compose down -v
docker compose up --build
```

### Reset Database Only
```bash
docker compose down mysql
docker volume rm wses_mysql_data
docker compose up mysql
```

### Rebuild Single Service
```bash
docker compose build --no-cache backend
docker compose up backend
```

### Clear Browser Cache
```javascript
// Browser console
localStorage.clear()
sessionStorage.clear()
location.reload()
```

---

## Still Having Issues?

Contact support:
- GitHub Issues: https://github.com/Divyang73/WSES_TRIAL/issues
- Email: (add your email)
- Discord: (add if you have one)

Include:
- Error messages
- Logs
- Steps to reproduce
- System info (OS, Docker version)

We're here to help! 🚀
