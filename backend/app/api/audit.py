from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import AuditLog, AIQueryLog
import json

router = APIRouter(prefix="/audit-logs", tags=["Audit & Provenance"])

@router.get("")
def get_audit_logs(limit: int = 50, db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return [
        {
            "id": l.id,
            "user_email": l.user_email,
            "action": l.action,
            "resource_type": l.resource_type,
            "resource_id": l.resource_id,
            "timestamp": l.timestamp.isoformat() if l.timestamp else None,
            "details": json.loads(l.details_json or "{}")
        }
        for l in logs
    ]

@router.get("/ai-provenance")
def get_ai_queries_provenance(limit: int = 20, db: Session = Depends(get_db)):
    queries = db.query(AIQueryLog).order_by(AIQueryLog.created_at.desc()).limit(limit).all()
    return [
        {
            "id": q.id,
            "user_id": q.user_id,
            "query_text": q.query_text,
            "confidence": q.confidence,
            "methodology": q.methodology,
            "limitations": q.limitations,
            "created_at": q.created_at.isoformat() if q.created_at else None,
            "provenance": json.loads(q.provenance_json or "{}"),
            "retrieved_doc_ids": json.loads(q.retrieved_doc_ids or "[]")
        }
        for q in queries
    ]
