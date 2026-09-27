from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.models.models import DistrictIndicator
from app.schemas.schemas import DistrictIndicatorOut

router = APIRouter(prefix="/indicators", tags=["Land Governance Indicators & Analytics"])

@router.get("", response_model=List[DistrictIndicatorOut])
def get_indicators(
    state: Optional[str] = None,
    district: Optional[str] = None,
    year: Optional[int] = None,
    db: Session = Depends(get_db)
):
    q = db.query(DistrictIndicator)
    if state and state != "All":
        q = q.filter(DistrictIndicator.state == state)
    if district and district != "All":
        q = q.filter(DistrictIndicator.district == district)
    if year:
        q = q.filter(DistrictIndicator.year == year)
    return q.order_by(DistrictIndicator.year.asc()).all()

@router.get("/districts", response_model=List[str])
def get_district_list(state: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(DistrictIndicator.district).distinct()
    if state and state != "All":
        q = q.filter(DistrictIndicator.state == state)
    return [r[0] for r in q.all()]

@router.get("/states", response_model=List[str])
def get_state_list(db: Session = Depends(get_db)):
    q = db.query(DistrictIndicator.state).distinct()
    return [r[0] for r in q.all()]
