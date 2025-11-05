# CodeLearn (Homepage + Auth stubs)

A minimal code-learning website scaffold with:
- React + Vite frontend
- Java Spring Boot backend

This version implements the homepage with a few example courses and simple login/register forms wired to stub endpoints.

## Prerequisites
- Node.js 18+
- Java 17+
- Maven 3.9+

## Run backend
```bash
cd backend
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

## Run frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173` and calls the backend at `http://localhost:8080/api`.

## Endpoints (stub)
- GET `/api/courses` → list of featured courses
- POST `/api/auth/login` → accepts `{ email, password }`
- POST `/api/auth/register` → accepts `{ name, email, password }`

CORS is enabled for `http://localhost:5173`.

## Environment
Optional: set `VITE_API_URL` in `frontend` to override API base.

## Next steps
- Persist users and sessions (Spring Security/JWT)
- Add course details and video playback page
- Store courses in a database
- Styling/theme improvements and responsiveness tweaks

