from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from typing import Optional, List
from app.core.database import get_db
from app.models.models import Document, DocumentChunk, AuditLog
from app.schemas.schemas import DocumentOut, DocumentCreate
from app.services.search_engine import search_engine
import json

router = APIRouter(prefix="/documents", tags=["Land Governance Knowledge Hub"])

@router.get("", response_model=List[DocumentOut])
def get_documents(
    topic: Optional[str] = None,
    document_type: Optional[str] = None,
    state: Optional[str] = None,
    year: Optional[int] = None,
    skip: int = 0,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if topic and topic != "All":
        query = query.filter(Document.topic == topic)
    if document_type and document_type != "All":
        query = query.filter(Document.document_type == document_type)
    if state and state != "All":
        query = query.filter(Document.state == state)
    if year:
        query = query.filter(Document.year == year)
    
    return query.offset(skip).limit(limit).all()

@router.get("/{doc_id}", response_model=DocumentOut)
def get_document(doc_id: str, db: Session = Depends(get_db)):
    doc = db.query(Document).filter(Document.id == doc_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")
    return doc

@router.post("", response_model=DocumentOut)
def create_document(doc_in: DocumentCreate, db: Session = Depends(get_db)):
    doc = Document(**doc_in.model_dump())
    db.add(doc)
    db.flush()

    # Create chunks for search indexing
    c1 = DocumentChunk(document_id=doc.id, chunk_index=0, chunk_text=doc.content_text[:400])
    c2 = DocumentChunk(document_id=doc.id, chunk_index=1, chunk_text=doc.content_text[400:])
    db.add(c1)
    db.add(c2)

    # Log action
    audit = AuditLog(
        user_email="researcher@example.com",
        action="DOCUMENT_UPLOAD",
        resource_type="DOCUMENT",
        resource_id=doc.id,
        details_json=json.dumps({"title": doc.title, "publisher": doc.publisher})
    )
    db.add(audit)
    db.commit()
    db.refresh(doc)
    return doc
