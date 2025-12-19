# Alternative Deployment Platforms

If Render doesn't support Java in your region/plan, here are alternative platforms:

## 🚀 Recommended Alternatives

### 1. Railway (Best Alternative) ⭐

**Why:** Native Java support, easy setup, free tier

**Steps:**
1. Go to https://railway.app
2. Sign up with GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Add PostgreSQL service
5. Configure backend:
   - **Root Directory:** `backend`
   - **Build Command:** `mvn clean package -DskipTests`
   - **Start Command:** `java -jar target/codelearn-backend-0.0.1-SNAPSHOT.jar`
6. Set environment variables (same as Render)
7. Deploy frontend as separate service

**Pricing:** Free tier available, then pay-as-you-go

---

### 2. Heroku

**Why:** Reliable, well-documented, Java support

**Steps:**
1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Login: `heroku login`
3. Create app: `heroku create codelearn-backend`
4. Add PostgreSQL: `heroku addons:create heroku-postgresql:hobby-dev`
5. Set config vars:
   ```bash
   heroku config:set SPRING_JPA_DDL_AUTO=update
   heroku config:set SPRING_JPA_SHOW_SQL=false
   ```
6. Deploy: `git push heroku main`

**Pricing:** No free tier, starts at $7/month

---

### 3. AWS Elastic Beanstalk

**Why:** Full Java support, scalable, free tier (12 months)

**Steps:**
1. Install EB CLI: `pip install awsebcli`
2. Initialize: `eb init -p java-17 codelearn-backend`
3. Create environment: `eb create codelearn-env`
4. Set environment variables: `eb setenv KEY=value`
5. Deploy: `eb deploy`

**Pricing:** Free tier for 12 months, then pay-as-you-go

---

### 4. Google Cloud Run

**Why:** Serverless, Docker support, pay-per-use

**Steps:**
1. Install gcloud CLI
2. Build Docker image: `gcloud builds submit --tag gcr.io/PROJECT-ID/codelearn-backend`
3. Deploy: `gcloud run deploy --image gcr.io/PROJECT-ID/codelearn-backend`
4. Set environment variables in Cloud Console

**Pricing:** Free tier, then pay-per-use

---

### 5. DigitalOcean App Platform

**Why:** Simple, Docker support, good pricing

**Steps:**
1. Go to https://cloud.digitalocean.com/apps
2. Create App → GitHub
3. Select repository
4. Configure:
   - **Type:** Web Service
   - **Dockerfile Path:** `backend/Dockerfile`
5. Add database (PostgreSQL)
6. Set environment variables

**Pricing:** Starts at $5/month

---

### 6. Fly.io

**Why:** Global deployment, Docker support, free tier

**Steps:**
1. Install flyctl: https://fly.io/docs/getting-started/installing-flyctl/
2. Login: `fly auth login`
3. Launch: `fly launch` (in backend directory)
4. Deploy: `fly deploy`

**Pricing:** Free tier available

---

## Quick Comparison

| Platform | Java Support | Free Tier | Ease of Use | Best For |
|----------|-------------|-----------|-------------|----------|
| **Railway** | ✅ Native | ✅ Yes | ⭐⭐⭐⭐⭐ | Quick deployment |
| **Heroku** | ✅ Native | ❌ No | ⭐⭐⭐⭐ | Production apps |
| **AWS EB** | ✅ Native | ✅ 12mo | ⭐⭐⭐ | Enterprise |
| **Cloud Run** | ✅ Docker | ✅ Yes | ⭐⭐⭐ | Serverless |
| **DigitalOcean** | ✅ Docker | ❌ No | ⭐⭐⭐⭐ | Simple apps |
| **Fly.io** | ✅ Docker | ✅ Yes | ⭐⭐⭐⭐ | Global apps |
| **Render** | ⚠️ Docker | ✅ Yes | ⭐⭐⭐⭐ | Current choice |

## Recommendation

**For Free Tier:** Railway or Fly.io
**For Production:** Heroku or AWS Elastic Beanstalk
**For Docker:** Any platform (Render, DigitalOcean, Cloud Run)

## Migration Guide

If switching from Render:

1. **Export environment variables** from Render
2. **Create new service** on chosen platform
3. **Set environment variables** on new platform
4. **Update frontend** `VITE_API_URL` to new backend URL
5. **Test thoroughly** before switching DNS

## Need Help?

- Railway Docs: https://docs.railway.app
- Heroku Java Guide: https://devcenter.heroku.com/articles/getting-started-with-java
- AWS EB Guide: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/java-se-platform.html

