# URL Shortener

A full-stack MERN URL shortener with custom aliases, click tracking, rate limiting, and a React dashboard.

## Features

- **Shorten URLs** via REST API with optional custom aliases
- **Click analytics** with total counts and recent click history
- **Rate limiting** to reduce abuse on create and redirect endpoints
- **Dashboard UI** to view all links, copy short URLs, and monitor activity

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose), express-rate-limit
- **Frontend:** React, Vite, Tailwind CSS

## Project Structure

```
url-shortener/
├── backend/          # Express API + MongoDB
├── frontend/         # React + Tailwind UI
├── package.json      # Root scripts
└── .env.example      # Environment variable template
```

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

1. **Install dependencies**

   ```bash
   npm run install:all
   ```

2. **Configure environment**

   Copy `.env.example` to `backend/.env`:

   ```bash
   cp .env.example backend/.env
   ```

   Copy the frontend line to `frontend/.env`:

   ```bash
   echo VITE_API_URL=http://localhost:5000 > frontend/.env
   ```

3. **Start MongoDB** (if running locally)

   Ensure MongoDB is available at `mongodb://localhost:27017`.

4. **Run the app**

   Terminal 1 — backend:

   ```bash
   npm run dev:backend
   ```

   Terminal 2 — frontend:

   ```bash
   npm run dev:frontend
   ```

   - API: http://localhost:5000
   - UI: http://localhost:5173

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/urls` | Create a short URL |
| GET | `/api/urls` | List all URLs with analytics |
| GET | `/api/urls/:shortCode` | Get a single URL |
| GET | `/:shortCode` | Redirect and increment click count |

### Create URL

```json
POST /api/urls
{
  "originalUrl": "https://example.com/long/path",
  "customAlias": "my-link"
}
```

## Rate Limits

- **Create URL:** 30 requests per 15 minutes per IP
- **Redirect:** 100 requests per minute per IP

## License

MIT
