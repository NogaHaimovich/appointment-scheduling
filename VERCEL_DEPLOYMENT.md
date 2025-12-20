# Vercel Deployment Guide

This guide will help you deploy your appointment manager application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. Vercel CLI installed (optional, for CLI deployment): `npm i -g vercel`

## Important Notes

⚠️ **SQLite Database Limitation**: This application uses SQLite, which has limitations on Vercel's serverless platform:
- Vercel's filesystem is read-only except for `/tmp`
- `/tmp` is ephemeral and cleared between function invocations
- **For production use, consider migrating to Vercel Postgres, Supabase, or another cloud database**

The current setup copies the database to `/tmp` on first run, but data persistence may be limited.

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

2. **Import Project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your Git repository
   - Vercel will auto-detect the configuration from `vercel.json`

3. **Configure Environment Variables**
   In the Vercel dashboard, go to Settings → Environment Variables and add:
   ```
   JWT_SECRET=your-secret-key-here (use a strong random string)
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=https://your-app.vercel.app
   VITE_API_BASE_URL=https://your-app.vercel.app/api
   ```
   
   **Important**: After your first deployment, update `VITE_API_BASE_URL` and `CORS_ORIGIN` with your actual Vercel URL.

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)
   
5. **Update Environment Variables**
   - Go back to Settings → Environment Variables
   - Update `CORS_ORIGIN` and `VITE_API_BASE_URL` with your actual Vercel URL
   - Redeploy if needed

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   Follow the prompts to configure your project.

4. **Set Environment Variables**
   ```bash
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRES_IN
   vercel env add CORS_ORIGIN
   vercel env add VITE_API_BASE_URL
   ```

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Project Structure

```
apps/
├── frontend/          # React + Vite frontend
├── backend/           # Express backend
├── api/               # Vercel serverless API handler
└── vercel.json        # Vercel configuration
```

## Environment Variables

### Required Variables

- `JWT_SECRET`: Secret key for JWT token signing
- `JWT_EXPIRES_IN`: JWT token expiration (e.g., "7d", "24h")
- `VITE_API_BASE_URL`: Frontend API base URL (for production)

### Optional Variables

- `CORS_ORIGIN`: Comma-separated list of allowed origins
- `DATABASE_PATH`: Custom database path (defaults to `/tmp/app.db` on Vercel)

## API Routes

All API routes are accessible under `/api/*`:
- `/api/getCode` - POST - Generate verification code
- `/api/validateCode` - POST - Validate code and get token
- `/api/appointments/*` - Appointment-related endpoints
- `/api/specialties/*` - Specialty-related endpoints

## Troubleshooting

### Database Issues

If you encounter database errors:
1. Ensure the database file exists in `backend/data/app.db`
2. The database will be copied to `/tmp/app.db` on Vercel
3. Consider migrating to a cloud database for production

### Build Errors

- Ensure all dependencies are installed
- Check that TypeScript compiles without errors
- Verify environment variables are set correctly

### CORS Errors

- Update `CORS_ORIGIN` environment variable with your Vercel URL
- Ensure `VITE_API_BASE_URL` points to your Vercel deployment

## Next Steps

1. **Database Migration**: Consider migrating from SQLite to:
   - Vercel Postgres
   - Supabase
   - PlanetScale
   - Railway

2. **Environment Variables**: Set up all required environment variables in Vercel dashboard

3. **Custom Domain**: Configure a custom domain in Vercel settings

4. **Monitoring**: Set up Vercel Analytics and monitoring

## Support

For issues specific to Vercel deployment, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

