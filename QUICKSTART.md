# Quick Start Guide

## Local Development Setup

### Backend Setup

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run FastAPI server**
   ```bash
   uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
   ```
   Backend will be available at: `http://127.0.0.1:8000`

3. **Access API documentation**
   - Swagger UI: `http://127.0.0.1:8000/docs`
   - ReDoc: `http://127.0.0.1:8000/redoc`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will be available at: `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

## Project Structure

```
.
├── app/                          # FastAPI backend
│   ├── main.py                  # FastAPI app entry point
│   ├── core/                    # Configuration & constants
│   ├── api/routes/              # API endpoint routes
│   ├── engines/                 # Business logic engines
│   ├── services/                # Database & utility services
│   ├── models/                  # SQLAlchemy ORM models
│   ├── schemas/                 # Pydantic request/response schemas
│   └── database/                # Database configuration
│
├── frontend/                    # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx             # Main app component
│   │   ├── main.jsx            # React entry point
│   │   ├── pages/              # Page components
│   │   ├── constants/          # Configuration constants
│   │   └── assets/             # Images & static files
│   ├── index.html              # HTML template
│   └── package.json            # NPM dependencies
│
├── requirements.txt            # Python dependencies
├── DEPLOYMENT.md              # Production deployment guide
├── render.yaml               # Render deployment config
├── vercel.json              # Vercel deployment config
└── Procfile                 # Heroku deployment config
```

## Available Estimation Types

1. **Own House** - Residential building
2. **Rental** - Rental property
3. **Villa** - Villa/luxury property
4. **Commercial** - Commercial building
5. **Interior** - Interior design package
6. **Exterior** - Exterior finishes
7. **Projects** - Manage saved projects

## API Endpoints

### Own House Estimation
- `POST /api/v1/own-house/estimate` - Calculate cost estimate
- `GET /api/v1/own-house/grade-facilities` - Get grade facilities
- `POST /api/v1/own-house/save` - Save project

### Other Project Types
- `POST /api/v1/rental/estimate`
- `POST /api/v1/villa/estimate`
- `POST /api/v1/commercial/estimate`
- `POST /api/v1/interior/estimate`
- `POST /api/v1/exterior/estimate`

### Project Management
- `GET /api/v1/projects/` - List all saved projects
- `POST /api/v1/projects/save` - Save new project
- `GET /api/v1/projects/{project_id}` - Get project details

## Database

Default: SQLite (test.db)

For production, consider upgrading to PostgreSQL via Render.

## Environment Variables

See `.env.example` and `frontend/.env.example` for configuration options.

## Testing

Run tests (if available):
```bash
pytest tests/
```

## Deployment

See `DEPLOYMENT.md` for production deployment instructions.

## Common Issues

### "Network Connectivity Issue" on estimation
- Ensure backend is running on port 8000
- Check `API_BASE_URL` in frontend code
- Look at browser console for detailed errors

### Port already in use
```bash
# Find process on port 8000
lsof -i :8000
# Kill it
kill -9 <PID>
```

### Module not found errors
- Reinstall dependencies: `pip install -r requirements.txt`
- Ensure virtual environment is active

---

For more help, check the main README.md or DEPLOYMENT.md files.
