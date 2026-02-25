from sqlalchemy.orm import Session
from app.models.saved_project import SavedProject
from app.services.pdf_service import PDFService
import uuid

class ProjectService:
    @staticmethod
    def save_project(db: Session, project_type: str, input_json: dict, total_cost: float, breakdown_json: dict):
        # Generate PDF
        filename = f"report_{uuid.uuid4().hex}.pdf"
        project_data = {
            "project_type": project_type,
            "input_json": input_json,
            "total_cost": total_cost,
            "breakdown_json": breakdown_json
        }
        pdf_path = PDFService.generate_project_report(project_data, filename)
        
        db_project = SavedProject(
            project_type=project_type,
            input_json=input_json,
            total_cost=total_cost,
            breakdown_json=breakdown_json,
            pdf_path=pdf_path
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def get_project(db: Session, project_id: int):
        return db.query(SavedProject).filter(SavedProject.id == project_id).first()

    @staticmethod
    def get_all_projects(db: Session, skip: int = 0, limit: int = 100):
        return db.query(SavedProject).order_by(SavedProject.created_at.desc()).offset(skip).limit(limit).all()

    @staticmethod
    def delete_project(db: Session, project_id: int):
        project = db.query(SavedProject).filter(SavedProject.id == project_id).first()
        if project:
            db.delete(project)
            db.commit()
            return True
        return False
