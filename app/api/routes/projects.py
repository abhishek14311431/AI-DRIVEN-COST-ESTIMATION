from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.services.project_service import ProjectService
from app.database.session import get_db
import os

from app.schemas.project_save_schema import ProjectSaveRequest

router = APIRouter()

@router.post("/save")
def save_generic_project(data: ProjectSaveRequest, db: Session = Depends(get_db)):
    project = ProjectService.save_project(
        db=db,
        project_type=data.project_type,
        input_json=data.input_json,
        total_cost=data.total_cost,
        breakdown_json=data.breakdown_json
    )
    return {"message": "Project saved", "project_id": project.id}

@router.get("/")
def list_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return ProjectService.get_all_projects(db, skip=skip, limit=limit)

@router.get("/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = ProjectService.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.get("/{project_id}/download-pdf")
def download_pdf(project_id: int, db: Session = Depends(get_db)):
    project = ProjectService.get_project(db, project_id)
    if not project or not project.pdf_path:
        raise HTTPException(status_code=404, detail="Project or PDF not found")
    
    if not os.path.exists(project.pdf_path):
        raise HTTPException(status_code=404, detail="PDF file missing on server")
        
    return FileResponse(
        path=project.pdf_path,
        filename=os.path.basename(project.pdf_path),
        media_type='application/pdf'
    )

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db)):
    project = ProjectService.get_project(db, project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    try:
        ProjectService.delete_project(db, project_id)
        return {"message": "Project deleted successfully", "project_id": project_id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

