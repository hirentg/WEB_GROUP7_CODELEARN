# Fix: Docker Build Error - "/src": not found

## Problem
Error: `failed to solve: failed to compute cache key: "/src": not found`

This happens when Docker can't find the files it's trying to copy.

## Solution

### Option 1: Fix Docker Context (Recommended) ✅

The issue is with the Docker build context. I've updated the files:

**`render.yaml`** - Set `dockerContext: backend` (not `./backend`)
**`backend/Dockerfile`** - Uses relative paths (`pom.xml`, `src`)

### Option 2: Manual Configuration in Render

If using manual setup (not Blueprint):

1. Go to your backend service → **Settings**
2. Find **Docker** section
3. Set:
   - **Dockerfile Path:** `backend/Dockerfile` or `Dockerfile`
   - **Docker Context:** `backend` (just `backend`, not `./backend`)
4. Save and redeploy

### Option 3: Move Dockerfile to Root (Alternative)

If the above doesn't work:

1. **Move Dockerfile to project root:**
   ```bash
   mv backend/Dockerfile ./Dockerfile
   ```

2. **Update Dockerfile paths:**
   ```dockerfile
   COPY backend/pom.xml ./pom.xml
   COPY backend/src ./src
   ```

3. **Update render.yaml:**
   ```yaml
   dockerfilePath: ./Dockerfile
   dockerContext: .
   ```

### Option 4: Use Root Directory as Context

**In Render Dashboard:**
- **Root Directory:** (leave empty or set to `.`)
- **Dockerfile Path:** `backend/Dockerfile`
- **Docker Context:** `.` (project root)

Then update Dockerfile:
```dockerfile
COPY backend/pom.xml ./pom.xml
COPY backend/src ./src
```

## Verify Files Exist

Make sure these files exist:
- ✅ `backend/pom.xml`
- ✅ `backend/src/` directory
- ✅ `backend/Dockerfile`

## Test Locally

Test the Docker build locally:

```bash
cd backend
docker build -t codelearn-backend .
```

Or from project root:
```bash
docker build -f backend/Dockerfile -t codelearn-backend backend/
```

## Current Configuration

**render.yaml:**
```yaml
dockerfilePath: backend/Dockerfile
dockerContext: backend
```

**Dockerfile:**
```dockerfile
COPY pom.xml .
COPY src ./src
```

This should work because:
- Context is `backend/` directory
- Dockerfile is in `backend/`
- Files are copied relative to context

## If Still Not Working

1. Check Render build logs for exact error
2. Verify file structure matches Dockerfile expectations
3. Try Option 3 (move Dockerfile to root)
4. Consider using Railway or other platform (see `ALTERNATIVE_PLATFORMS.md`)

