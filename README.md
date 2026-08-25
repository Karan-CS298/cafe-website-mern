# Creme Cafe — MERN Website + Admin CMS

Production-ready React/Vite frontend + Express/MongoDB backend for Creme Cafe.

## Deployment architecture

Recommended:

- **Frontend:** Vercel (Vite/React)
- **Backend:** Vercel Serverless Function (Express)
- **Database:** MongoDB Atlas
- **Media:** Cloudinary
- **Source:** GitHub

The production build does **not** contain a localhost API fallback. `VITE_API_URL` must be supplied by the frontend hosting environment.

## Required production environment variables

### Backend — Vercel

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<long-random-secret>
JWT_EXPIRES_IN=1d
CLIENT_URL=https://your-frontend.vercel.app
COOKIE_DOMAIN=
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MAX_UPLOAD_MB=4
```

### Frontend — Vercel

```env
VITE_API_URL=https://your-backend.vercel.app/api
```

`VITE_API_URL` is public configuration. Never put MongoDB credentials, JWT secrets, or Cloudinary API secrets in the frontend.

## Vercel setup

### Frontend

Create a Vercel project from this repository:

- Root Directory: `client`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://<backend-domain>/api`

`client/vercel.json` handles React Router history fallback.

### Backend

Create a second Vercel project from the same repository:

- Root Directory: `server`
- Framework Preset: Other
- Environment variables: all backend variables listed above

`server/api/index.js` is the serverless entry point and `server/vercel.json` rewrites requests to it.

### MongoDB Atlas

Create a production database and add the Vercel backend connection string as `MONGODB_URI`. Allow the deployed backend to connect according to your Atlas network-access policy.

### Cloudinary

Create a Cloudinary product environment and add:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Uploads are kept in memory and sent directly to Cloudinary. The production API does not depend on Vercel's local filesystem.

## Security

- Never commit `.env` files.
- Use a unique strong `JWT_SECRET`.
- Set `CLIENT_URL` to the exact deployed frontend origin.
- Keep Cloudinary API secret and MongoDB URI server-only.
- Use HTTPS on both frontend and backend.
- Keep `withCredentials: true` enabled because admin authentication uses an HTTP-only cookie.

## Netlify alternative

The repository also contains `client/netlify.toml` and a Netlify function wrapper under `server/netlify/functions/`. Vercel is the recommended path because the backend already has a Vercel serverless entry point.
