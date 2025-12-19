# Deploy CodeLearn to Render

This guide will help you deploy both the backend and frontend to Render.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [What Needs to Change](#what-needs-to-change)
3. [Step-by-Step Deployment](#step-by-step-deployment)
4. [Environment Variables](#environment-variables)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with your code pushed to a repository
- Render account (sign up at https://render.com)
- PostgreSQL database (we'll create one on Render)

---

## What Needs to Change

### 1. Backend Changes

#### Update `application.properties` to use environment variables:

**File:** `backend/src/main/resources/application.properties`

```properties
server.port=${PORT:8080}
spring.application.name=codelearn

# PostgreSQL connection - use environment variables
spring.datasource.url=${DATABASE_URL:jdbc:postgresql://localhost:5432/code_learn_test}
spring.datasource.username=${DATABASE_USERNAME:postgres}
spring.datasource.password=${DATABASE_PASSWORD:admin}
spring.datasource.driverClassName=org.postgresql.Driver

# JPA/Hibernate settings
spring.jpa.hibernate.ddl-auto=${SPRING_JPA_DDL_AUTO:update}
spring.jpa.show-sql=${SPRING_JPA_SHOW_SQL:false}
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

# File upload settings
spring.servlet.multipart.enabled=true
spring.servlet.multipart.max-file-size=500MB
spring.servlet.multipart.max-request-size=500MB

# Video storage path (use absolute path for production)
video.storage.path=${VIDEO_STORAGE_PATH:uploads/videos}
thumbnail.storage.path=${THUMBNAIL_STORAGE_PATH:uploads/thumbnails}

# Logging (disable debug in production)
logging.level.org.springframework.security=${LOG_LEVEL:INFO}
logging.level.org.springframework.web=${LOG_LEVEL:INFO}
logging.level.root=INFO
```

#### Update CORS Configuration:

**File:** `backend/src/main/java/com/codelearn/config/CorsConfig.java`

Make sure it allows your frontend domain:

```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            System.getenv("FRONTEND_URL") != null 
                ? System.getenv("FRONTEND_URL") 
                : "http://localhost:5173",
            "https://your-frontend-app.onrender.com" // Add your Render frontend URL
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
```

### 2. Frontend Changes

#### Update `vite.config.js` for production build:

**File:** `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

#### Create `.env.production` file:

**File:** `frontend/.env.production`

```
VITE_API_URL=https://your-backend-app.onrender.com/api
```

**Note:** Replace `your-backend-app` with your actual Render backend service name.

---

## Step-by-Step Deployment

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **New +** → **PostgreSQL**
3. Configure:
   - **Name:** `codelearn-db`
   - **Database:** `codelearn`
   - **User:** (auto-generated)
   - **Region:** Choose closest to you
   - **PostgreSQL Version:** 15 or 16
   - **Plan:** Free tier (or paid if needed)
4. Click **Create Database**
5. **Important:** Copy the **Internal Database URL** (we'll use this later)

### Step 2: Deploy Backend

1. In Render dashboard, click **New +** → **Web Service**
2. Connect your GitHub repository
3. Configure the service:
   - **Name:** `codelearn-backend` (or your preferred name)
   - **Region:** Same as database
   - **Branch:** `main` (or your default branch)
   - **Root Directory:** `backend`
   - **Runtime:** `Java`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/codelearn-backend-0.0.1-SNAPSHOT.jar`
4. Click **Advanced** and add Environment Variables (see section below)
5. Click **Create Web Service**
6. Wait for deployment (first build takes 5-10 minutes)

### Step 3: Deploy Frontend

1. In Render dashboard, click **New +** → **Static Site**
2. Connect your GitHub repository
3. Configure:
   - **Name:** `codelearn-frontend`
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `dist`
4. Add Environment Variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-backend-app.onrender.com/api`
   - (Replace with your actual backend URL)
5. Click **Create Static Site**
6. Wait for deployment

---

## Environment Variables

### Backend Environment Variables (in Render Dashboard)

Add these in your backend service settings → **Environment**:

| Key | Value | Description |
|-----|-------|-------------|
| `DATABASE_URL` | (from PostgreSQL service) | Full database connection string |
| `SPRING_JPA_DDL_AUTO` | `update` | Hibernate DDL mode |
| `SPRING_JPA_SHOW_SQL` | `false` | Disable SQL logging in production |
| `LOG_LEVEL` | `INFO` | Logging level |
| `FRONTEND_URL` | `https://your-frontend-app.onrender.com` | Frontend URL for CORS |
| `PORT` | (auto-set by Render) | Server port |
| `VIDEO_STORAGE_PATH` | `/opt/render/project/src/uploads/videos` | Video storage path |
| `THUMBNAIL_STORAGE_PATH` | `/opt/render/project/src/uploads/thumbnails` | Thumbnail storage path |

**How to get Database Connection Details:**

Render provides the connection string in PostgreSQL format. You have two options:

### Option 1: Use Individual Environment Variables (Recommended)

Instead of using `DATABASE_URL`, set these individual variables in Render:

1. Go to your PostgreSQL service → **Info** tab
2. Note these values:
   - **Host:** (e.g., `dpg-xxxxx-a.oregon-postgres.render.com`)
   - **Port:** (usually `5432`)
   - **Database:** (e.g., `codelearn`)
   - **User:** (e.g., `codelearn_user`)
   - **Password:** (shown in the connection string)

3. In your backend service → **Environment**, add:
   ```
   DATABASE_HOST = dpg-xxxxx-a.oregon-postgres.render.com
   DATABASE_PORT = 5432
   DATABASE_NAME = codelearn
   DATABASE_USERNAME = codelearn_user
   DATABASE_PASSWORD = (your password)
   ```

4. Update `application.properties` (already done):
   ```properties
   spring.datasource.url=jdbc:postgresql://${DATABASE_HOST:localhost}:${DATABASE_PORT:5432}/${DATABASE_NAME:code_learn_test}
   spring.datasource.username=${DATABASE_USERNAME:postgres}
   spring.datasource.password=${DATABASE_PASSWORD:admin}
   ```

### Option 2: Parse DATABASE_URL (Alternative)

If you prefer using `DATABASE_URL`, you can parse it. Render provides:
```
postgresql://user:password@hostname:port/database
```

You'll need to convert it to JDBC format manually or use a script. For simplicity, **Option 1 is recommended**.

---

## Create render.yaml (Optional but Recommended)

Create `render.yaml` in your project root for easier deployment:

**File:** `render.yaml`

```yaml
services:
  # PostgreSQL Database
  - type: pspg
    name: codelearn-db
    databaseName: codelearn
    user: codelearn_user
    plan: free

  # Backend Service
  - type: web
    name: codelearn-backend
    env: java
    region: oregon
    plan: free
    buildCommand: cd backend && mvn clean package -DskipTests
    startCommand: cd backend && java -jar target/codelearn-backend-0.0.1-SNAPSHOT.jar
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: codelearn-db
          property: connectionString
      - key: SPRING_JPA_DDL_AUTO
        value: update
      - key: SPRING_JPA_SHOW_SQL
        value: "false"
      - key: LOG_LEVEL
        value: INFO
      - key: FRONTEND_URL
        value: https://codelearn-frontend.onrender.com

  # Frontend Static Site
  - type: web
    name: codelearn-frontend
    env: static
    region: oregon
    plan: free
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: ./frontend/dist
    envVars:
      - key: VITE_API_URL
        value: https://codelearn-backend.onrender.com/api
```

**To use render.yaml:**
1. Push `render.yaml` to your GitHub repo
2. In Render dashboard, click **New +** → **Blueprint**
3. Connect your repository
4. Render will automatically create all services

---

## Important Configuration Changes Summary

### Files to Modify:

1. ✅ **`backend/src/main/resources/application.properties`**
   - Use environment variables for database connection
   - Set `server.port=${PORT:8080}`

2. ✅ **`backend/src/main/java/com/codelearn/config/CorsConfig.java`**
   - Add your Render frontend URL to allowed origins

3. ✅ **`frontend/.env.production`**
   - Set `VITE_API_URL` to your backend Render URL

4. ✅ **`frontend/vite.config.js`**
   - Ensure build configuration is correct

### Files to Create:

1. ✅ **`render.yaml`** (optional, for Blueprint deployment)
2. ✅ **`frontend/.env.production`** (for production API URL)

---

## Database Setup on Render

### Option 1: Import Existing Database

If you have a `database.sql` file:

1. Get connection details from Render PostgreSQL service
2. Use pgAdmin or psql to connect:
   ```bash
   psql "postgresql://user:password@hostname:port/database"
   ```
3. Import your SQL file:
   ```bash
   psql "postgresql://..." -f database.sql
   ```

### Option 2: Let Hibernate Create Tables

If `spring.jpa.hibernate.ddl-auto=update`:
- Tables will be created automatically on first backend startup
- You'll need to create initial data via API or manually

---

## Troubleshooting

### Backend Won't Start

**Error:** "Port already in use"
- **Solution:** Render sets `PORT` automatically, make sure you use `${PORT}` in application.properties

**Error:** "Database connection failed"
- **Solution:** 
  - Check `DATABASE_URL` is set correctly
  - Verify database is running
  - Check if using Internal Database URL (for same region) or External Database URL

**Error:** "Build failed"
- **Solution:**
  - Check build logs in Render dashboard
  - Ensure `pom.xml` is correct
  - Verify Java version (Render uses Java 17 by default)

### Frontend Can't Connect to Backend

**Error:** CORS errors
- **Solution:**
  - Update `CorsConfig.java` with frontend URL
  - Check `FRONTEND_URL` environment variable
  - Ensure frontend URL includes protocol (`https://`)

**Error:** API calls failing
- **Solution:**
  - Verify `VITE_API_URL` is set correctly
  - Check backend is running
  - Ensure backend URL doesn't have trailing slash

### Database Issues

**Error:** "Relation does not exist"
- **Solution:**
  - Set `SPRING_JPA_DDL_AUTO=update` to create tables
  - Or import your database.sql manually

**Error:** "Connection timeout"
- **Solution:**
  - Use Internal Database URL (if backend and DB in same region)
  - Check firewall/security settings

---

## Post-Deployment Checklist

- [ ] Backend service is running (green status)
- [ ] Frontend static site is deployed
- [ ] Database connection works
- [ ] CORS is configured correctly
- [ ] Environment variables are set
- [ ] API endpoints are accessible
- [ ] Frontend can make API calls
- [ ] Authentication works
- [ ] File uploads work (if applicable)

---

## Custom Domain (Optional)

### For Backend:
1. Go to backend service → **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records as instructed

### For Frontend:
1. Go to frontend service → **Settings** → **Custom Domains**
2. Add your domain
3. Update DNS records

**Remember to update:**
- `FRONTEND_URL` in backend environment variables
- `VITE_API_URL` in frontend environment variables
- CORS configuration

---

## Cost Considerations

**Free Tier Limits:**
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- 750 hours/month free (enough for 24/7 single service)
- Database: 90 days free trial, then $7/month

**Recommendations:**
- Use free tier for development/testing
- Upgrade to paid for production (starts at $7/month per service)

---

## Quick Start Commands

### Local Testing with Render Database

```bash
# Get database connection string from Render
# Set as environment variable
export DATABASE_URL="postgresql://user:pass@host:port/db"

# Run backend locally
cd backend
mvn spring-boot:run
```

---

## Support Resources

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com
- Spring Boot on Render: https://render.com/docs/deploy-spring-boot

---

## Next Steps

1. ✅ Update configuration files
2. ✅ Push changes to GitHub
3. ✅ Create services on Render
4. ✅ Set environment variables
5. ✅ Deploy and test
6. ✅ Set up custom domain (optional)
7. ✅ Monitor and optimize

Good luck with your deployment! 🚀

