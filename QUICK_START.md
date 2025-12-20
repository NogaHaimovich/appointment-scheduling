# Quick Start - Vercel Deployment

## 🚀 Quick Deployment Steps

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. **Push to Git**:
   ```bash
   git add .
   git commit -m "Ready for Vercel"
   git push
   ```

3. **Deploy to Vercel**:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add environment variables (see below)
   - Click Deploy

4. **Set Environment Variables in Vercel**:
   - `JWT_SECRET` - A random secret string (e.g., use `openssl rand -base64 32`)
   - `JWT_EXPIRES_IN` - Token expiration (e.g., `7d` or `24h`)
   - `CORS_ORIGIN` - Your Vercel URL (e.g., `https://your-app.vercel.app`)
   - `VITE_API_BASE_URL` - Your API URL (e.g., `https://your-app.vercel.app/api`)

## 📝 Important Notes

- **Database**: The SQLite database file (`backend/data/app.db`) will be copied to `/tmp/app.db` on Vercel
- **Data Persistence**: SQLite on Vercel has limitations - data may not persist between deployments
- **Production**: Consider migrating to Vercel Postgres or another cloud database for production use

## 🔧 Local Development

The app will still work locally:
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run dev`
- API will be at `http://localhost:5000`
- Frontend will be at `http://localhost:5173`

## 📚 Full Documentation

See `VERCEL_DEPLOYMENT.md` for detailed deployment instructions.

