from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import EvidenceNode, EvidenceEdge
from app.schemas.schemas import EvidenceGraphResponse, EvidenceGraphNode, EvidenceGraphEdge
import json

router = APIRouter(prefix="/evidence-graph", tags=["Evidence Graph"])

@router.get("", response_model=EvidenceGraphResponse)
def get_evidence_graph(db: Session = Depends(get_db)):
    nodes = db.query(EvidenceNode).all()
    edges = db.query(EvidenceEdge).all()

    node_out = []
    for n in nodes:
        meta = json.loads(n.metadata_json or "{}")
        node_out.append(EvidenceGraphNode(
            id=n.id,
            node_type=n.node_type,
            label=n.label,
            subtitle=n.subtitle,
            description=n.description,
            source_ref=n.source_ref,
            entity_id=n.entity_id,
            metadata=meta
        ))

    edge_out = [
        EvidenceGraphEdge(
            id=e.id,
            source=e.source,
            target=e.target,
            relationship_type=e.relationship_type,
            strength=e.strength,
            description=e.description
        )
        for e in edges
    ]

    return EvidenceGraphResponse(nodes=node_out, edges=edge_out)
