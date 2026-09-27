from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import LandAcquisitionProject
from app.schemas.schemas import LandAcquisitionOut

router = APIRouter(prefix="/acquisition", tags=["Land Acquisition Intelligence"])

@router.get("/projects", response_model=List[LandAcquisitionOut])
def get_acquisition_projects(db: Session = Depends(get_db)):
    return db.query(LandAcquisitionProject).all()
