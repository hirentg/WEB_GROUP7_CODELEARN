# Fix: Java Runtime Not Found on Render

## Problem
When deploying the backend to Render, you get an error that Java runtime is not available.

## Solution

### Option 1: Create system.properties File (Recommended) ✅

Create a file `backend/system.properties` with:

```
java.runtime.version=17
```

This tells Render to use Java 17.

**File location:** `backend/system.properties`

**Content:**
```
java.runtime.version=17
```

### Option 2: Manual Configuration in Render Dashboard

If `system.properties` doesn't work:

1. Go to your backend service in Render dashboard
2. Click on **Settings**
3. Scroll to **Build & Deploy**
4. Look for **Runtime** or **Java Version** setting
5. Select **Java 17** or enter `17` in the version field
6. Save and redeploy

### Option 3: Update Build Command

You can also specify Java version in the build command:

**In render.yaml:**
```yaml
buildCommand: JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn clean package -DskipTests
```

**Or in Render Dashboard:**
- **Build Command:** `JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 mvn clean package -DskipTests`

## Verification

After deploying, check the build logs:

1. Go to your backend service → **Logs**
2. Look for Java version in the build output
3. Should see: `Java version: 17` or similar

## Files Created/Modified

✅ **`backend/system.properties`** - Specifies Java 17 runtime
✅ **`render.yaml`** - Updated with `runtime: java-17` (if supported)

## Quick Fix Steps

1. Create `backend/system.properties`:
   ```bash
   echo "java.runtime.version=17" > backend/system.properties
   ```

2. Commit and push:
   ```bash
   git add backend/system.properties
   git commit -m "Add Java 17 runtime specification for Render"
   git push
   ```

3. Redeploy on Render (or wait for auto-deploy)

## Troubleshooting

**Still not working?**

1. Check build logs for Java version errors
2. Verify `system.properties` is in the `backend/` directory
3. Try specifying Java in build command explicitly
4. Contact Render support if issue persists

**Alternative: Use Docker**

If Java detection continues to fail, consider using Docker:
- Create `backend/Dockerfile`
- Specify Java 17 in Dockerfile
- Render will use Docker build instead

