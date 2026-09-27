from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import ScenarioRunRequest, ScenarioResponse
from app.services.scenario_service import scenario_service
from app.api.auth import get_current_user
from app.models.models import User, Scenario, ScenarioResult, AuditLog
import json

router = APIRouter(prefix="/scenarios", tags=["Policy Scenario Simulator"])

@router.post("/run", response_model=ScenarioResponse)
def run_scenario(
    req: ScenarioRunRequest,
    current_user: User = Depends(get_current_user)
):
    res = scenario_service.run_simulation(
        state=req.state,
        district=req.district,
        infra_expansion_pct_a=req.infra_expansion_pct_a,
        infra_expansion_pct_b=req.infra_expansion_pct_b,
        land_use_pressure_pct=req.land_use_pressure_pct,
        urban_growth_pct=req.urban_growth_pct,
        climate_risk_level=req.climate_risk_level,
        user_email=current_user.email if current_user else "policymaker@example.com"
    )
    return res

@router.get("", response_model=list[dict])
def get_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(Scenario).order_by(Scenario.created_at.desc()).limit(10).all()
    results = []
    for s in scenarios:
        results.append({
            "id": s.id,
            "title": s.title,
            "state": s.state,
            "district": s.district,
            "baseline_year": s.baseline_year,
            "target_year": s.target_year,
            "parameters": json.loads(s.parameters_json),
            "created_by": s.created_by,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "results_count": len(s.results)
        })
    return results

@router.get("/{scenario_id}", response_model=dict)
def get_scenario(scenario_id: str, db: Session = Depends(get_db)):
    s = db.query(Scenario).filter(Scenario.id == scenario_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Scenario not found")
    
    results = [
        {
            "indicator_name": r.indicator_name,
            "baseline_val": r.baseline_val,
            "scenario_a_val": r.scenario_a_val,
            "scenario_b_val": r.scenario_b_val,
            "unit": r.unit,
            "pct_change_a": r.pct_change_a,
            "pct_change_b": r.pct_change_b,
            "risk_level": r.risk_level,
            "interpretation": json.loads(r.details_json or "{}").get("interpretation", "")
        }
        for r in s.results
    ]

    return {
        "id": s.id,
        "title": s.title,
        "state": s.state,
        "district": s.district,
        "baseline_year": s.baseline_year,
        "target_year": s.target_year,
        "parameters": json.loads(s.parameters_json),
        "results": results,
        "assumptions": [
            "Empirical land diversion ratio: 85% of expanded built-up footprint directly displaces adjacent agricultural parcels.",
            "Constant baseline zoning regulations without proactive Transferable Development Rights (TDR) enforcement."
        ],
        "limitations": [
            "Models aggregate district-level indicators; localized micro-watershed topography is generalized.",
            "Estimates provide decision-support sensitivity bounds, not guaranteed deterministic future states."
        ],
        "methodology": "Multivariate linear-elasticity land conversion model coupled with spatial permeability runoff coefficients.",
        "data_sources": [
            "NRSC Bhuvan District Land-Use Classification (2020-2024)",
            "DILRMP Cadastral Registry Revenue Records"
        ],
        "disclaimer": "Scenario output — not a guaranteed prediction. Intended strictly for evidence-based policy formulation."
    }
