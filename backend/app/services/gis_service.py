import json
from typing import List, Dict, Any, Optional
from app.core.config import settings
from app.core.database import SessionLocal
from app.models.models import GISLayer, GISFeature, DistrictIndicator

class GISService:
    def __init__(self):
        self.geoserver_enabled = settings.GEOSERVER_ENABLED
        self.geoserver_url = settings.GEOSERVER_URL

    def get_layers(self) -> List[Dict[str, Any]]:
        db = SessionLocal()
        try:
            layers = db.query(GISLayer).all()
            return [
                {
                    "id": lyr.id,
                    "name": lyr.name,
                    "layer_type": lyr.layer_type,
                    "category": lyr.category,
                    "description": lyr.description,
                    "attribution": lyr.attribution,
                    "is_synthetic": lyr.is_synthetic,
                    "features_count": len(lyr.features)
                }
                for lyr in layers
            ]
        finally:
            db.close()

    def get_geojson_features(
        self,
        layer_type: Optional[str] = None,
        state: Optional[str] = None,
        district: Optional[str] = None
    ) -> Dict[str, Any]:
        db = SessionLocal()
        try:
            query = db.query(GISFeature).join(GISLayer)
            if layer_type and layer_type != "All":
                query = query.filter(GISLayer.layer_type == layer_type)
            if state and state != "All":
                query = query.filter(GISFeature.state == state)
            if district and district != "All":
                query = query.filter(GISFeature.district == district)

            features = query.all()
            feature_list = []

            for f in features:
                geom = json.loads(f.geometry_geojson)
                props = json.loads(f.properties_json or "{}")
                props.update({
                    "id": f.id,
                    "name": f.feature_name,
                    "state": f.state,
                    "district": f.district,
                    "layer_name": f.layer.name if f.layer else ""
                })
                feature_list.append({
                    "type": "Feature",
                    "id": f.id,
                    "geometry": geom,
                    "properties": props
                })

            return {
                "type": "FeatureCollection",
                "features": feature_list,
                "metadata": {
                    "total_features": len(feature_list),
                    "disclaimer": "Prototype / Synthetic Spatial Data. Boundary geometry is simplified for demonstration."
                }
            }
        finally:
            db.close()

    def get_district_spatial_profile(self, state: str, district: str) -> Dict[str, Any]:
        db = SessionLocal()
        try:
            ind = db.query(DistrictIndicator).filter(
                DistrictIndicator.state == state,
                DistrictIndicator.district == district,
                DistrictIndicator.year == 2024
            ).first()

            if not ind:
                return {}

            return {
                "state": ind.state,
                "district": ind.district,
                "year": ind.year,
                "total_area_sqkm": ind.total_area_sqkm,
                "built_up_area_sqkm": ind.built_up_area_sqkm,
                "agricultural_area_sqkm": ind.agricultural_area_sqkm,
                "forest_area_sqkm": ind.forest_area_sqkm,
                "water_area_sqkm": ind.water_area_sqkm,
                "infrastructure_index": ind.infrastructure_index,
                "climate_risk_score": ind.climate_risk_score,
                "land_pressure_score": ind.land_pressure_score,
                "dispute_index": ind.dispute_index,
                "population": ind.population,
                "data_status": "Prototype / Synthetic Data"
            }
        finally:
            db.close()

gis_service = GISService()
