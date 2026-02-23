# Deployment Guide - AI-Driven Construction Cost Estimation

This guide explains how to deploy the application on Vercel (Frontend) and Render (Backend).

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Render account (free tier available)
- Git installed locally

## Architecture

```
Frontend (React + Vite)
├── Deployed on: Vercel
├── Repository: Latest version on GitHub main branch
└── API calls to: Backend URL (via VITE_API_BASE_URL env var)

Backend (FastAPI + SQLite)
├── Deployed on: Render
├── Repository: Latest version on GitHub main branch
└── Database: SQLite (included in deployment)
```

## Step 1: Prepare GitHub Repository

1. **Initialize Git (if not done already)**
   ```bash
   cd "path/to/AI-Driven Construction Cost Estimation"
   git init
   git add .
   git commit -m "Initial commit: AI Construction Cost Estimation App"
   ```

2. **Push to GitHub**
   - Create a new repository on GitHub (e.g., `ai-construction-cost-estimation`)
   - Add remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ai-construction-cost-estimation.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy Backend on Render

### A. Connect Render to GitHub

1. Go to https://render.com
2. Sign up or log in
3. Click **New** → **Web Service**
4. Select **Build and deploy from a git repository**
5. Connect your GitHub account
6. Select your repository

### B. Configure Backend Service

In the deployment form:

- **Name**: `construction-cost-backend`
- **Environment**: `Python 3`
- **Build Command**: 
  ```
  pip install -r requirements.txt
  ```
- **Start Command**: 
  ```
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- **Plan**: Free (or Starter if you want more resources)

### C. Set Environment Variables

Click **Environment** and add:

| Key | Value |
|-----|-------|
| `PYTHON_VERSION` | `3.11` |
| `DATABASE_URL` | `sqlite:///./test.db` |

### D. Deploy

- Click **Deploy**
- Wait for deployment to complete (~2-3 minutes)
- Copy the backend URL (e.g., `https://construction-cost-backend.onrender.com`)

---

## Step 3: Deploy Frontend on Vercel

### A. Connect Vercel to GitHub

1. Go to https://vercel.com
2. Sign up or log in with GitHub
3. Click **New Project**
4. Import your GitHub repository

### B. Configure Frontend

In the project settings:

- **Framework Preset**: Vite
- **Root Directory**: `./frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### C. Set Environment Variables

Click **Environment Variables** and add:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://construction-cost-backend.onrender.com/api/v1` |

**Replace** `construction-cost-backend.onrender.com` with your actual backend URL from Step 2D

### D. Deploy

- Click **Deploy**
- Wait for deployment to complete (~3-5 minutes)
- Your frontend URL will be provided (e.g., `https://ai-construction-cost.vercel.app`)

---

## Step 4: Verify Deployment

1. **Open your frontend URL** in a browser
2. **Test the estimation flow**:
   - Select project type
   - Fill in all details
   - Click "Cost Estimation"
   - Verify data loads from backend
3. **Save a project** to test database connectivity

---

## Environment Variables Reference

### Backend (Render)
| Variable | Purpose | Example |
|----------|---------|---------|
| `PYTHON_VERSION` | Python runtime version | `3.11` |
| `DATABASE_URL` | SQLite database path | `sqlite:///./test.db` |

### Frontend (Vercel)
| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://backend.onrender.com/api/v1` |

---

## Updating Deployment

### Push changes to production:

1. **Make changes locally**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push origin main
   ```

2. **Automatic deployment**:
   - Vercel and Render automatically redeploy when you push to `main` branch
   - Check deployment status on their dashboards

### Manual redeployment (if needed):

- **Vercel**: Dashboard → Your Project → Click **Redeploy**
- **Render**: Dashboard → Service → Click **Manual Deploy**

---

## Troubleshooting

### Frontend shows "Network Connectivity Issue"
- Check that `VITE_API_BASE_URL` is set correctly on Vercel
- Verify backend service is running on Render
- Check browser console for detailed error messages

### Backend 500 error on Render
- Check Render logs: Dashboard → Service → Logs
- Ensure all Python dependencies in `requirements.txt` are installed
- Verify database initialization is working

### CORS errors
- Backend has CORS enabled for all origins in `app/main.py`
- Should work with any frontend URL automatically

### Database not persisting
- Render's SQLite is ephemeral (data resets on redeploy)
- For production, consider upgrading to PostgreSQL on Render
- Or use a persistent volume option

---

## Production Enhancements

### Future improvements:

1. **Use PostgreSQL** instead of SQLite:
   - Add Render PostgreSQL database
   - Update `DATABASE_URL` in backend env vars
   - Better for production workloads

2. **Enable HTTPS** (automatic on both Vercel & Render)

3. **Add monitoring/logging**:
   - Sentry for error tracking
   - LogRocket for frontend monitoring

4. **Performance optimization**:
   - Enable caching headers
   - Consider CDN for static assets

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Render backend deployed and running
- [ ] Backend URL copied
- [ ] Vercel frontend deployed with `VITE_API_BASE_URL` set
- [ ] Frontend and backend can communicate
- [ ] Estimation flow tested end-to-end
- [ ] Project save/load working

---

## Support

For issues with specific deployment platforms:
- **Vercel**: https://vercel.com/docs
- **Render**: https://render.com/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **React**: https://react.dev
