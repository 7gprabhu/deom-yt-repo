# Todo App (MERN)

Full-stack to-do app: React (Vite) frontend + Express/MongoDB backend, deployable to Vercel in one repo.

## Local setup

1. Create a free MongoDB database (MongoDB Atlas: https://www.mongodb.com/atlas), then copy `backend/.env.example` to `backend/.env` and set `MONGODB_URI`.
2. Install and run the API (terminal 1):

   ```bash
   cd backend
   npm install
   npm run dev        # listens on http://localhost:5000
   ```

3. Install and run the frontend (terminal 2):

   ```bash
   cd frontend
   npm install
   npm run dev        # http://localhost:5173, proxies /api to :5000
   ```

## Deploy to Vercel

1. Push this repo to GitHub.
2. On vercel.com: Add New → Project → import the repo.
3. Add an Environment Variable in Vercel's project settings: `MONGODB_URI` = your Atlas connection string.
4. Deploy. `vercel.json` routes `/api/*` to the Express backend and everything else to the built React app.

## API endpoints

- `GET /api/todos` — list
- `POST /api/todos` — create (`{ "title": "..." }`)
- `PATCH /api/todos/:id` — update (`{ "completed": true }` or `{ "title": "..." }`)
- `DELETE /api/todos/:id` — delete
- `GET /api/health` — sanity check