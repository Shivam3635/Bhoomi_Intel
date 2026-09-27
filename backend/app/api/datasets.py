from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.models.models import Dataset
from app.schemas.schemas import DatasetOut

router = APIRouter(prefix="/datasets", tags=["Data Catalog"])

@router.get("", response_model=List[DatasetOut])
def get_datasets(
    topic: Optional[str] = None,
    state: Optional[str] = None,
    year: Optional[int] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    q = db.query(Dataset)
    if topic and topic != "All":
        q = q.filter(Dataset.topic == topic)
    if state and state != "All":
        q = q.filter(Dataset.state == state)
    if year:
        q = q.filter(Dataset.year == year)
    return q.offset(skip).limit(limit).all()

@router.get("/{dataset_id}", response_model=DatasetOut)
def get_dataset(dataset_id: str, db: Session = Depends(get_db)):
    ds = db.query(Dataset).filter(Dataset.id == dataset_id).first()
    if not ds:
        raise HTTPException(status_code=404, detail="Dataset not found")
    return ds
