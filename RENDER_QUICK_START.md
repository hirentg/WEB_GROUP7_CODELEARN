# Quick Start: Deploy to Render

## 🚀 Quick Deployment Steps

### 1. Update Files (Already Done ✅)

The following files have been updated:
- ✅ `backend/src/main/resources/application.properties` - Uses environment variables
- ✅ `backend/src/main/java/com/codelearn/config/CorsConfig.java` - Supports Render URLs
- ✅ `backend/Dockerfile` - Docker configuration for Java 17
- ✅ `backend/.dockerignore` - Docker ignore file
- ✅ `render.yaml` - Blueprint configuration using Docker

### 2. Push to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 3. Deploy on Render

#### Option A: Using Blueprint (Easiest)

1. Go to https://dashboard.render.com
2. Click **New +** → **Blueprint**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml`
5. Review and click **Apply**
6. Wait for deployment (~10 minutes)

#### Option B: Manual Setup

**Step 1: Create PostgreSQL Database**
1. **New +** → **PostgreSQL**
2. Name: `codelearn-db`
3. Database: `codelearn`
4. Plan: Free
5. Click **Create**
6. Copy **Internal Database URL**

**Step 2: Deploy Backend**
1. **New +** → **Web Service**
2. Connect GitHub repo
3. Settings:
   - **Name:** `codelearn-backend`
   - **Root Directory:** `backend`
   - **Environment:** `Docker` ⚠️ **Important: Select Docker, not Java**
   - **Dockerfile Path:** `Dockerfile` (or leave default)
   - **Docker Context:** `.` (or leave default)
   - **Note:** Dockerfile is already created in `backend/` directory
4. Add Environment Variables:
   ```
   DATABASE_URL = (paste from PostgreSQL service)
   SPRING_JPA_DDL_AUTO = update
   SPRING_JPA_SHOW_SQL = false
   LOG_LEVEL = INFO
   FRONTEND_URL = https://codelearn-frontend.onrender.com
   ```
5. Click **Create Web Service**

**Step 3: Deploy Frontend**
1. **New +** → **Static Site**
2. Connect GitHub repo
3. Settings:
   - **Name:** `codelearn-frontend`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   ```
   VITE_API_URL = https://codelearn-backend.onrender.com/api
   ```
   (Replace with your actual backend URL)
5. Click **Create Static Site**

### 4. Update Frontend URL

After backend is deployed:
1. Copy backend URL (e.g., `https://codelearn-backend.onrender.com`)
2. Go to frontend service → **Environment**
3. Update `VITE_API_URL` to: `https://codelearn-backend.onrender.com/api`
4. Go to backend service → **Environment**
5. Update `FRONTEND_URL` to: `https://codelearn-frontend.onrender.com`
6. Both services will auto-redeploy

### 5. Test Deployment

1. Visit your frontend URL
2. Try logging in/registering
3. Check backend logs for errors
4. Verify database connection

## ⚠️ Important Notes

1. **Docker Deployment:**
   - ✅ Using Docker instead of native Java (more reliable)
   - ✅ `backend/Dockerfile` contains Java 17 configuration
   - ✅ Works on all Render plans
   - See `RENDER_DOCKER_DEPLOYMENT.md` for details

2. **If Render Doesn't Support Java:**
   - ✅ Docker solution is already set up
   - See `ALTERNATIVE_PLATFORMS.md` for other options (Railway, Heroku, etc.)

2. **Database URL Format:**
   - Render provides: `postgresql://user:pass@host:port/db`
   - Spring Boot needs: `jdbc:postgresql://host:port/db?user=user&password=pass`
   - Use individual variables (`DATABASE_HOST`, etc.) instead

3. **First Deployment:**
   - Takes 5-10 minutes
   - Database tables created automatically (if `SPRING_JPA_DDL_AUTO=update`)

4. **Free Tier:**
   - Services spin down after 15 min inactivity
   - First request after spin-down takes ~30 seconds

5. **CORS:**
   - Make sure `FRONTEND_URL` matches your actual frontend URL
   - Update `CorsConfig.java` if needed

## 🔧 Troubleshooting

**Backend won't start:**
- Check build logs (Docker build may take 10-15 minutes)
- Verify `DATABASE_URL` or individual DB variables are set
- Check Dockerfile is in `backend/` directory
- Verify Docker Context is set correctly
- See `RENDER_DOCKER_DEPLOYMENT.md` for Docker troubleshooting
- Consider alternative platforms (see `ALTERNATIVE_PLATFORMS.md`)

**Frontend can't connect:**
- Verify `VITE_API_URL` is set
- Check CORS configuration
- Ensure backend is running

**Database errors:**
- Verify database is running
- Check connection string format
- Ensure tables are created (check logs)

## 📝 Next Steps

1. Set up custom domain (optional)
2. Configure SSL certificates
3. Set up monitoring
4. Optimize for production

For detailed instructions, see `RENDER_DEPLOYMENT.md`

