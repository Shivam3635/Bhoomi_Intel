from fastapi import APIRouter, Depends
from app.schemas.schemas import ResearchQueryRequest, ResearchQueryResponse
from app.services.rag_service import rag_service
from app.api.auth import get_current_user
from app.models.models import User

router = APIRouter(prefix="/research", tags=["AI Research Assistant"])

@router.post("/query", response_model=ResearchQueryResponse)
def query_research(
    req: ResearchQueryRequest,
    current_user: User = Depends(get_current_user)
):
    result = rag_service.answer_query(
        query=req.query,
        state=req.state,
        district=req.district,
        topic=req.topic,
        year_from=req.year_from,
        year_to=req.year_to,
        user_email=current_user.email if current_user else "policymaker@example.com"
    )
    return result
