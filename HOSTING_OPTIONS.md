# Hosting Options for AI Construction Cost Estimation

This document covers multiple deployment options with step-by-step instructions.

---

## 1. 🐳 Docker (Local / Any Cloud Provider)

### Prerequisites
- Docker Desktop installed
- Docker Compose installed

### Quick Start

```bash
# Build and run everything
docker-compose up -d

# Frontend will be at: http://localhost:3000
# Backend will be at: http://localhost:8000
```

### Individual Services

**Build Backend**
```bash
docker build -t construction-backend .
docker run -p 8000:8000 construction-backend
```

**Build Frontend**
```bash
cd frontend
docker build -t construction-frontend .
docker run -p 3000:80 construction-frontend
```

### Deployment Targets with Docker
- **AWS ECS** - Docker container orchestration
- **Google Cloud Run** - Serverless containers
- **Azure Container Instances** - Container hosting
- **DigitalOcean App Platform** - Container deployment
- **Railway.app** - GitHub-based deployment

---

## 2. ☁️ Vercel (Frontend Only)

**Pros**: Automatic deployments, free tier, global CDN
**Cons**: Frontend only (need external backend)

### Steps

1. Push code to GitHub
2. Go to https://vercel.com/new
3. Import repository, select `frontend` directory
4. Set environment variable:
   - `VITE_API_BASE_URL` = your backend URL
5. Deploy! ✅

---

## 3. 🚀 Render (Full Stack)

**Pros**: Full stack support, PostgreSQL included, free tier
**Cons**: Cold starts on free tier

### Backend Deployment

1. Visit https://render.com
2. New → Web Service
3. Connect GitHub repository
4. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment: `DATABASE_URL=sqlite:///./test.db`
6. Deploy! ✅

### Frontend Deployment

1. New → Static Site
2. Connect GitHub repository, select `frontend` directory
3. **Build Command**: `npm run build`
4. **Publish Directory**: `dist`
5. Add environment: `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`
6. Deploy! ✅

---

## 4. 💻 Railway.app (Full Stack)

**Pros**: Simple GitHub integration, free tier, PostgreSQL support
**Cons**: Limited free tier hours

### Steps

1. Go to https://railway.app
2. Create new project → GitHub repo
3. Create 2 services:

   **Backend Service**
   - Root directory: `.`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

   **Frontend Service**
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview`

4. Set environment variables
5. Deploy! ✅

---

## 5. ☁️ Heroku (Deprecated - Use Alternatives)

**Note**: Heroku free tier is deprecated. Use these instead:
- Railway.app
- Render
- PythonAnywhere (Backend)
- Netlify (Frontend)

---

## 6. 🟦 AWS Services

### Option A: Elastic Beanstalk
```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.11 construction-cost

# Deploy
eb create production
eb deploy
```

### Option B: Lightsail + Docker
1. Create Lightsail container service
2. Push Docker image
3. Deploy container with `docker-compose.yml`

### Option C: ECS + Fargate
1. Create Docker images
2. Push to ECR
3. Create ECS task definitions
4. Deploy with Fargate

---

## 7. 🔷 Azure App Service

### Backend
1. Go to Azure Portal
2. Create → App Service
3. Publish: Docker Container
4. Select your Docker image
5. Configure environment variables
6. Deploy! ✅

### Frontend
1. Create → Static Web App
2. Connect GitHub
3. Build preset: React/Vite
4. Configure environment variables
5. Deploy! ✅

---

## 8. 🟦 Google Cloud

### Cloud Run (Recommended for Docker)
```bash
# Build image
docker build -t construction-backend .

# Tag for Google Cloud
docker tag construction-backend gcr.io/PROJECT_ID/construction-backend

# Push to registry
docker push gcr.io/PROJECT_ID/construction-backend

# Deploy
gcloud run deploy construction-backend \
  --image gcr.io/PROJECT_ID/construction-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### App Engine
```bash
# Edit app.yaml for your needs
gcloud app deploy
```

---

## 9. 🟢 DigitalOcean App Platform

**Pros**: Affordable, simple UI, included database
**Cons**: Not as many free resources

### Steps

1. Connect GitHub account at https://cloud.digitalocean.com
2. Create new App
3. Select your repository
4. Set build commands for backend/frontend
5. Add PostgreSQL database (optional)
6. Deploy! ✅

---

## 10. 🔗 PythonAnywhere (Backend Only)

**Pros**: Simple Python hosting
**Cons**: Frontend needs separate hosting

### Steps

1. Upload code to PythonAnywhere
2. Configure web app with FastAPI
3. Point to `app.main:app`
4. Set environment variables
5. Deploy! ✅

---

## 11. 📦 Netlify (Frontend Only)

**Pros**: Free tier, automatic deployments, great for SPAs
**Cons**: Static only (need external backend)

### Steps

1. Connect GitHub at https://netlify.com
2. Select `frontend` directory
3. **Build command**: `npm run build`
4. **Publish directory**: `dist`
5. Set environment: `VITE_API_BASE_URL`
6. Deploy! ✅

---

## Quick Comparison

| Platform | Backend | Frontend | Free Tier | Complexity |
|----------|---------|----------|-----------|-----------|
| **Docker** | ✅ | ✅ | Variable | Medium |
| **Vercel** | ❌ | ✅ | ✅ | Easy |
| **Render** | ✅ | ✅ | ✅ | Easy |
| **Railway** | ✅ | ✅ | ✅ | Easy |
| **AWS** | ✅ | ✅ | Limited | Hard |
| **Azure** | ✅ | ✅ | Limited | Hard |
| **Google Cloud** | ✅ | ✅ | Limited | Hard |
| **DigitalOcean** | ✅ | ✅ | ❌ | Medium |
| **PythonAnywhere** | ✅ | ❌ | Limited | Easy |
| **Netlify** | ❌ | ✅ | ✅ | Easy |

---

## Recommended Stack by Use Case

### 🚀 **Best for Quick Launch** (Free)
1. Vercel (Frontend)
2. Render (Backend)
3. Use free tier database

### 💼 **Best for Production**
1. AWS/Google Cloud/Azure (Infrastructure)
2. PostgreSQL for database
3. CDN for frontend
4. Monitoring & logging

### 🏠 **Best for Learning/Demo**
1. Docker Compose (Local)
2. Railway.app (Hosting with GitHub)
3. Free tier with quick deployment

### 🎯 **Best Value**
1. Railway.app or DigitalOcean
2. Affordable, reliable, good features

---

## Environment Variables by Platform

### Render
```
DATABASE_URL=sqlite:///./test.db
VITE_API_BASE_URL=https://backend.onrender.com/api/v1
```

### Railway
```
DATABASE_URL=sqlite:///./test.db
VITE_API_BASE_URL=https://your-backend-railway.railway.app/api/v1
```

### Docker Local
```
DATABASE_URL=sqlite:///./test.db
VITE_API_BASE_URL=http://backend:8000/api/v1
```

### AWS/Azure/GCP
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
VITE_API_BASE_URL=https://your-api.example.com/api/v1
```

---

## Next Steps

1. **Choose a platform** from the options above
2. **Follow the specific guide** for your choice
3. **Set up environment variables**
4. **Test with sample data**
5. **Monitor and scale** as needed

For detailed instructions on your chosen platform, see the specific guides above or check the platform's documentation.
