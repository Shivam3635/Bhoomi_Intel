from fastapi import APIRouter, Query
from typing import Optional, Dict, Any, List
from app.services.gis_service import gis_service

router = APIRouter(prefix="/gis", tags=["GIS Explorer"])

@router.get("/layers", response_model=List[Dict[str, Any]])
def get_layers():
    return gis_service.get_layers()

@router.get("/features", response_model=Dict[str, Any])
def get_features(
    layer_type: Optional[str] = Query(None, description="boundary, land_use, infrastructure, climate_vulnerability, research_hotspot"),
    state: Optional[str] = None,
    district: Optional[str] = None
):
    return gis_service.get_geojson_features(layer_type=layer_type, state=state, district=district)

@router.get("/profile", response_model=Dict[str, Any])
def get_profile(
    state: str = Query("Uttar Pradesh"),
    district: str = Query("Lucknow")
):
    return gis_service.get_district_spatial_profile(state=state, district=district)
