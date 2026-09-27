from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import ResearchProject, AuditLog
from app.schemas.schemas import ProjectCreate
import json

router = APIRouter(prefix="/projects", tags=["Collaborative Research Workspace"])

@router.get("", response_model=List[dict])
def get_projects(db: Session = Depends(get_db)):
    projs = db.query(ResearchProject).all()
    return [
        {
            "id": p.id,
            "title": p.title,
            "objective": p.objective,
            "lead_researcher": p.lead_researcher,
            "organization": p.organization,
            "geography": p.geography,
            "status": p.status,
            "description": p.description,
            "collaborators": p.collaborators,
            "findings_summary": p.findings_summary,
            "created_at": p.created_at.isoformat() if p.created_at else None
        }
        for p in projs
    ]

@router.post("", response_model=dict)
def create_project(req: ProjectCreate, db: Session = Depends(get_db)):
    proj = ResearchProject(
        title=req.title,
        objective=req.objective,
        lead_researcher=req.lead_researcher,
        organization=req.organization,
        geography=req.geography,
        description=req.description,
        status=req.status
    )
    db.add(proj)
    db.flush()

    # Log action
    audit = AuditLog(
        user_email=req.lead_researcher,
        action="PROJECT_CREATE",
        resource_type="PROJECT",
        resource_id=proj.id,
        details_json=json.dumps({"title": proj.title})
    )
    db.add(audit)
    db.commit()
    db.refresh(proj)

    return {
        "id": proj.id,
        "title": proj.title,
        "lead_researcher": proj.lead_researcher,
        "status": proj.status
    }
