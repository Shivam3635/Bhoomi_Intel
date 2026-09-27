from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.models import Document, Dataset, GISLayer, ResearchProject, Scenario, DistrictIndicator, EvidenceNode

router = APIRouter(prefix="/dashboard", tags=["Executive Analytics Dashboard"])

@router.get("/summary")
def get_dashboard_summary(db: Session = Depends(get_db)):
    doc_count = db.query(Document).count()
    dataset_count = db.query(Dataset).count()
    gis_count = db.query(GISLayer).count()
    project_count = db.query(ResearchProject).count()
    scenario_count = db.query(Scenario).count()
    node_count = db.query(EvidenceNode).count()
    states_count = db.query(DistrictIndicator.state).distinct().count()
    districts_count = db.query(DistrictIndicator.district).distinct().count()

    return {
        "total_documents": doc_count,
        "total_datasets": dataset_count,
        "total_gis_layers": gis_count,
        "total_projects": project_count,
        "active_scenarios_count": scenario_count,
        "evidence_nodes_count": node_count,
        "states_covered": states_count,
        "districts_covered": districts_count
    }

@router.get("/trends")
def get_dashboard_trends(db: Session = Depends(get_db)):
    # 5-year aggregated land-use trends across districts
    years = [2020, 2021, 2022, 2023, 2024]
    trend_data = []

    for yr in years:
        avg_built = db.query(func.avg(DistrictIndicator.built_up_area_sqkm)).filter(DistrictIndicator.year == yr).scalar() or 0.0
        avg_agri = db.query(func.avg(DistrictIndicator.agricultural_area_sqkm)).filter(DistrictIndicator.year == yr).scalar() or 0.0
        avg_forest = db.query(func.avg(DistrictIndicator.forest_area_sqkm)).filter(DistrictIndicator.year == yr).scalar() or 0.0
        avg_infra = db.query(func.avg(DistrictIndicator.infrastructure_index)).filter(DistrictIndicator.year == yr).scalar() or 0.0
        avg_pressure = db.query(func.avg(DistrictIndicator.land_pressure_score)).filter(DistrictIndicator.year == yr).scalar() or 0.0

        trend_data.append({
            "year": yr,
            "avg_built_up_sqkm": round(avg_built, 1),
            "avg_agri_sqkm": round(avg_agri, 1),
            "avg_forest_sqkm": round(avg_forest, 1),
            "avg_infra_index": round(avg_infra, 1),
            "avg_pressure_score": round(avg_pressure, 1)
        })

    # Topic distribution of documents
    topic_counts = db.query(Document.topic, func.count(Document.id)).group_by(Document.topic).all()
    topics = [{"topic": t[0], "count": t[1]} for t in topic_counts]

    # State wise indicator aggregates
    state_aggs = db.query(
        DistrictIndicator.state,
        func.avg(DistrictIndicator.built_up_area_sqkm),
        func.avg(DistrictIndicator.agricultural_area_sqkm),
        func.avg(DistrictIndicator.infrastructure_index),
        func.avg(DistrictIndicator.climate_risk_score)
    ).filter(DistrictIndicator.year == 2024).group_by(DistrictIndicator.state).all()

    states_summary = [
        {
            "state": s[0],
            "avg_built_up": round(s[1], 1),
            "avg_agri": round(s[2], 1),
            "avg_infra": round(s[3], 1),
            "avg_climate_risk": round(s[4], 1)
        }
        for s in state_aggs
    ]

    return {
        "time_series_trends": trend_data,
        "topic_distribution": topics,
        "state_comparison": states_summary,
        "disclaimer": "Aggregated Prototype Synthetic Spatial Data for Demonstration"
    }
