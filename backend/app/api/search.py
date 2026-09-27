from fastapi import APIRouter, Query
from typing import Optional, List, Dict, Any
from app.services.search_engine import search_engine

router = APIRouter(prefix="/search", tags=["Search & Discovery"])

@router.get("")
def search(
    q: str = Query(..., description="Search keyword or question"),
    state: Optional[str] = None,
    district: Optional[str] = None,
    topic: Optional[str] = None,
    document_type: Optional[str] = None,
    year_from: Optional[int] = None,
    year_to: Optional[int] = None,
    limit: int = 10
):
    results = search_engine.search_documents(
        query=q,
        state=state,
        district=district,
        topic=topic,
        document_type=document_type,
        year_from=year_from,
        year_to=year_to,
        limit=limit
    )
    return {
        "query": q,
        "total_hits": len(results),
        "results": results
    }
