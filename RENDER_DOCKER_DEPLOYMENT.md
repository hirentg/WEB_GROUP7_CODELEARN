# Deploy Backend to Render Using Docker

Since Render may not support Java directly in your plan/region, we'll use Docker instead.

## ✅ Solution: Use Docker

Docker works on all Render plans and is more reliable for Java applications.

## Files Created

1. ✅ **`backend/Dockerfile`** - Docker configuration for Java 17
2. ✅ **`backend/.dockerignore`** - Excludes unnecessary files from Docker build
3. ✅ **`render.yaml`** - Updated to use Docker

## Quick Deployment Steps

### Option 1: Using Blueprint (render.yaml)

1. Push changes to GitHub:
   ```bash
   git add backend/Dockerfile backend/.dockerignore render.yaml
   git commit -m "Add Docker support for Render deployment"
   git push
   ```

2. In Render Dashboard:
   - Go to **New +** → **Blueprint**
   - Connect your repository
   - Render will detect `render.yaml` with Docker configuration
   - Click **Apply**
   - Wait for deployment (~10-15 minutes for first build)

### Option 2: Manual Setup

1. **Create PostgreSQL Database:**
   - **New +** → **PostgreSQL**
   - Name: `codelearn-db`
   - Plan: Free
   - Click **Create**

2. **Deploy Backend with Docker:**
   - **New +** → **Web Service**
   - Connect GitHub repository
   - Configure:
     - **Name:** `codelearn-backend`
     - **Environment:** `Docker`
     - **Root Directory:** `backend`
     - **Dockerfile Path:** `Dockerfile` (or `./Dockerfile`)
     - **Docker Context:** `.` (current directory)
   - Add Environment Variables (see below)
   - Click **Create Web Service**

3. **Deploy Frontend:**
   - **New +** → **Static Site**
   - Connect GitHub repository
   - Configure:
     - **Name:** `codelearn-frontend`
     - **Root Directory:** `frontend`
     - **Build Command:** `npm install && npm run build`
     - **Publish Directory:** `dist`
   - Add Environment Variable:
     - `VITE_API_URL` = `https://your-backend-app.onrender.com/api`

## Environment Variables for Backend

Add these in Render Dashboard → Backend Service → Environment:

```
DATABASE_HOST = (from PostgreSQL service)
DATABASE_PORT = 5432
DATABASE_NAME = codelearn
DATABASE_USERNAME = (from PostgreSQL service)
DATABASE_PASSWORD = (from PostgreSQL service)
SPRING_JPA_DDL_AUTO = update
SPRING_JPA_SHOW_SQL = false
LOG_LEVEL = INFO
FRONTEND_URL = https://your-frontend-app.onrender.com
PORT = 8080
```

## How Docker Works

The Dockerfile:
1. Uses Maven to build the JAR file
2. Creates a smaller runtime image with only Java 17 JRE
3. Copies the JAR file
4. Runs the application

This is more reliable than relying on Render's Java detection.

## Troubleshooting

### Build Fails

**Error:** "Cannot find Dockerfile"
- **Solution:** Make sure `Dockerfile` is in the `backend/` directory
- Check Docker Context is set to `./backend` or `.`

**Error:** "Maven build failed"
- **Solution:** Check build logs
- Verify `pom.xml` is correct
- Check internet connection during build

**Error:** "Port already in use"
- **Solution:** Make sure `PORT` environment variable is set
- Or use `EXPOSE 8080` in Dockerfile (already done)

### Runtime Errors

**Error:** "Database connection failed"
- **Solution:** Verify database environment variables are set
- Check database is running
- Use Internal Database URL if backend and DB in same region

**Error:** "Out of memory"
- **Solution:** Upgrade to paid plan
- Or optimize Docker image (already using multi-stage build)

## Alternative Platforms

If Render still doesn't work, consider:

### 1. Railway (Recommended Alternative)
- ✅ Supports Java natively
- ✅ Free tier available
- ✅ Easy deployment
- Website: https://railway.app

### 2. Heroku
- ✅ Supports Java
- ⚠️ No free tier anymore
- Website: https://heroku.com

### 3. AWS Elastic Beanstalk
- ✅ Free tier (12 months)
- ✅ Full Java support
- Website: https://aws.amazon.com/elasticbeanstalk

### 4. Google Cloud Run
- ✅ Pay per use
- ✅ Docker support
- Website: https://cloud.google.com/run

## Docker Build Locally (Test)

Test the Docker build locally:

```bash
cd backend
docker build -t codelearn-backend .
docker run -p 8080:8080 \
  -e DATABASE_HOST=localhost \
  -e DATABASE_PORT=5432 \
  -e DATABASE_NAME=code_learn_test \
  -e DATABASE_USERNAME=postgres \
  -e DATABASE_PASSWORD=admin \
  codelearn-backend
```

## Next Steps

1. ✅ Push Dockerfile to GitHub
2. ✅ Deploy on Render using Docker
3. ✅ Set environment variables
4. ✅ Test the deployment
5. ⏳ Consider alternative platforms if Render doesn't work

## Files Summary

- ✅ `backend/Dockerfile` - Docker configuration
- ✅ `backend/.dockerignore` - Docker ignore file
- ✅ `render.yaml` - Updated for Docker
- ✅ `backend/system.properties` - Still useful for other platforms

