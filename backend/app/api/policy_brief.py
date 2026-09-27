from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from app.schemas.schemas import PolicyBriefRequest, PolicyBriefResponse
from app.services.brief_service import policy_brief_service
from app.api.auth import get_current_user
from app.models.models import User, AuditLog
from app.core.database import SessionLocal
import json

router = APIRouter(prefix="/policy-brief", tags=["Policy Brief Generator"])

@router.post("/generate", response_model=PolicyBriefResponse)
def generate_brief(
    req: PolicyBriefRequest,
    current_user: User = Depends(get_current_user)
):
    brief = policy_brief_service.generate_brief(
        district=req.district,
        state=req.state,
        target_year=req.target_year,
        policy_question=req.query,
        scenario_id=req.scenario_id
    )

    # Audit log
    db = SessionLocal()
    try:
        al = AuditLog(
            user_email=current_user.email if current_user else "policymaker@example.com",
            action="BRIEF_GENERATED",
            resource_type="POLICY_BRIEF",
            resource_id=brief["id"],
            details_json=json.dumps({"district": req.district, "state": req.state, "sources_count": len(brief["sources"])})
        )
        db.add(al)
        db.commit()
    finally:
        db.close()

    return brief

@router.post("/print-view", response_class=HTMLResponse)
def get_printable_html(
    req: PolicyBriefRequest,
    current_user: User = Depends(get_current_user)
):
    brief = policy_brief_service.generate_brief(
        district=req.district,
        state=req.state,
        target_year=req.target_year,
        policy_question=req.query,
        scenario_id=req.scenario_id
    )
    return HTMLResponse(content=brief["printable_html"])
