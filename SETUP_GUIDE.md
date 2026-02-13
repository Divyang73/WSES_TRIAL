# Setup Guide - Do You Need to Change the Code?

## Quick Answer: **NO CODE CHANGES NEEDED!** ✅

The CORS fix I just implemented is **already configured and ready to run**. You don't need to modify any code to make it work.

---

## What's Already Configured

### ✅ CORS Configuration (Backend)
The backend (`backend/src/app.js`) is now configured with:
- **Default allowed origins**: `http://localhost:3000`, `http://localhost:5000`
- **Credentials**: Enabled
- **Methods**: GET, POST, PUT, DELETE, OPTIONS
- **Headers**: Content-Type, Authorization

**No changes needed** - these defaults work for local development.

### ✅ Docker Compose Configuration
The `docker-compose.yml` file already includes:
- **Backend environment**: All database and JWT settings configured
- **Frontend environment**: `REACT_APP_API_URL=http://localhost:5000`
- **MySQL**: Pre-configured with database name and password
- **Judge0**: Code execution engine ready to use

**No changes needed** - everything is pre-configured.

---

## How to Run the Application

### Step 1: Prerequisites
Install Docker and Docker Compose:
- **Docker**: version 20.10+
- **Docker Compose**: version 2.0+

### Step 2: Clone Repository (if not already done)
```bash
git clone https://github.com/Divyang73/WSES_TRIAL.git
cd WSES_TRIAL
```

### Step 3: Start All Services
```bash
docker compose up --build
```

**That's it!** Wait 2-3 minutes for services to start.

### Step 4: Access the Application
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

---

## First Time Usage

1. Open http://localhost:3000
2. Click **"Sign Up"**
3. Create account:
   - Name: Your Name
   - Email: your@email.com
   - Password: password123
4. Start solving problems!

---

## When You WOULD Need to Change Code

You only need to modify configuration in these scenarios:

### Scenario 1: Production Deployment
When deploying to production with a custom domain:

**Add to docker-compose.yml:**
```yaml
backend:
  environment:
    - ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Scenario 2: Different Ports
If you need to use different ports (e.g., port 3001 instead of 3000):

**Edit docker-compose.yml:**
```yaml
frontend:
  ports:
    - "3001:3000"  # Change host port
  environment:
    - REACT_APP_API_URL=http://localhost:5000
```

**And add to backend environment:**
```yaml
backend:
  environment:
    - ALLOWED_ORIGINS=http://localhost:3001,http://localhost:5000
```

### Scenario 3: Custom Database Password
To change the default database password:

**Edit docker-compose.yml:**
```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: your_secure_password

backend:
  environment:
    - DB_PASSWORD=your_secure_password
```

---

## Troubleshooting

### Issue: Port Already in Use
**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Find what's using the port
sudo lsof -i :3000

# Kill the process or change port in docker-compose.yml
```

### Issue: CORS Errors Still Appear
**Symptoms:** Browser console shows CORS errors

**Solutions:**
1. **Check backend is running:**
   ```bash
   curl http://localhost:5000/health
   # Should return: {"status":"ok","message":"WSES Backend is running"}
   ```

2. **Check frontend URL:**
   - Make sure you're accessing http://localhost:3000
   - Not http://127.0.0.1:3000 (different origin)

3. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Issue: Backend Won't Start
**Check logs:**
```bash
docker compose logs backend
```

**Common fixes:**
```bash
# Rebuild without cache
docker compose build --no-cache backend

# Restart all services
docker compose down
docker compose up --build
```

### Issue: Database Connection Failed
**Solution:**
```bash
# Check MySQL is healthy
docker compose ps

# Wait for MySQL to be ready (shows as "healthy")
# This can take 30-60 seconds on first start
```

---

## Testing the CORS Fix

To verify CORS is working:

### Test 1: Health Check
```bash
curl -X OPTIONS http://localhost:5000/api/auth/signup \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -v
```

**Expected:** Status 200 with CORS headers

### Test 2: Signup from Frontend
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill form and submit
4. Check browser console (F12) - **no CORS errors**
5. You should be logged in automatically

---

## Summary

### What You DON'T Need to Do:
❌ Modify backend code  
❌ Modify frontend code  
❌ Create .env files  
❌ Configure CORS manually  
❌ Install dependencies manually  

### What You DO Need to Do:
✅ Have Docker installed  
✅ Run `docker compose up --build`  
✅ Wait 2-3 minutes  
✅ Access http://localhost:3000  

---

## Additional Resources

- **Full Quick Start**: See `QUICKSTART.md`
- **Troubleshooting**: See `TROUBLESHOOTING.md`
- **Deployment Guide**: See `DEPLOYMENT.md`
- **API Documentation**: See `API.md`

---

## Still Having Issues?

If you encounter problems:

1. **Check Docker is running:**
   ```bash
   docker ps
   ```

2. **View all logs:**
   ```bash
   docker compose logs
   ```

3. **Restart everything:**
   ```bash
   docker compose down -v  # Remove volumes
   docker compose up --build
   ```

4. **Open an issue**: https://github.com/Divyang73/WSES_TRIAL/issues

---

**The application is ready to run with zero code changes!** 🚀
