from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="/ecosystem", tags=["External Land Governance Ecosystem"])

@router.get("/sources", response_model=List[Dict[str, Any]])
def get_ecosystem_sources():
    return [
        {
            "name": "DILRMP",
            "full_name": "Digital India Land Records Modernization Programme",
            "nodal_body": "Department of Land Resources (DoLR), MoRD",
            "integration_status": "Integration-Ready Interface",
            "type": "Cadastral RoR & Spatial Geo-referencing",
            "description": "Standardized spatial APIs for linking cadastral parcel polygons with textual Record of Rights (Khatauni) and dispute litigation dockets.",
            "adapter_class": "DILRMPDataSourceAdapter",
            "data_flow": "ULPIN / Bhu-Aadhaar verification -> Parcel Geometry -> Ownership Traceability"
        },
        {
            "name": "Bhuvan",
            "full_name": "ISRO / NRSC Geoportal",
            "nodal_body": "Indian Space Research Organisation (ISRO)",
            "integration_status": "Integration-Ready Interface",
            "type": "Satellite Remote Sensing & LULC Layers",
            "description": "Multi-temporal satellite imagery classification for land-use, land-cover, wastelands, and waterbody monitoring.",
            "adapter_class": "BhuvanWMSAdapter",
            "data_flow": "WMS / WFS Geo-services -> Normalized LULC Raster Tiles -> District Pressure Indices"
        },
        {
            "name": "SVAMITVA",
            "full_name": "Survey of Villages Abadi and Mapping with Improvised Technology",
            "nodal_body": "Ministry of Panchayati Raj (MoPR)",
            "integration_status": "Integration-Ready Interface",
            "type": "High-Resolution UAV Cadastral Surveys",
            "description": "Drone photogrammetry (5cm GSD) and CORS network mapping of rural inhabited abadi parcels for Property Card issuance.",
            "adapter_class": "SvamitvaPropertyAdapter",
            "data_flow": "Orthorectified Imagery -> Abadi Boundaries -> Village Asset Registers"
        },
        {
            "name": "NDAP",
            "full_name": "National Data & Analytics Platform",
            "nodal_body": "NITI Aayog",
            "integration_status": "Integration-Ready Interface",
            "type": "Harmonized Socio-Economic Datasets",
            "description": "Standardized district and sub-district indicators spanning agriculture, population census, and infrastructure telemetry.",
            "adapter_class": "NDAPHarmonizedAPIAdapter",
            "data_flow": "REST API -> Schema Harmonization -> Time-Series Scenario Calibration"
        },
        {
            "name": "NAKSHA",
            "full_name": "National Land Records GIS Platform",
            "nodal_body": "DoLR / NIC",
            "integration_status": "Conceptual Data Source",
            "type": "Unified Cadastral Mapping Portal",
            "description": "Single-window national GIS viewer for interstate and inter-district mosaic cadastral representations.",
            "adapter_class": "NakshaSpatialMosaicAdapter",
            "data_flow": "Cadastral Geo-mosaic -> Cross-state Border Harmonization"
        },
        {
            "name": "India Code",
            "full_name": "Digital Repository of Central and State Acts",
            "nodal_body": "Legislative Department, Ministry of Law and Justice",
            "integration_status": "Integration-Ready Interface",
            "type": "Statutory Acts, RFCTLARR 2013, Forest Rights Act",
            "description": "Official legal statutes, state land reform amendments, and compensation valuation schedules.",
            "adapter_class": "IndiaCodeStatuteAdapter",
            "data_flow": "Statute Scraping / NLP Parsing -> Legal Evidence Nodes -> Compliance Check"
        },
        {
            "name": "NSDI",
            "full_name": "National Spatial Data Infrastructure",
            "nodal_body": "Department of Science and Technology (DST)",
            "integration_status": "Conceptual Data Source",
            "type": "National Geospatial Data Framework",
            "description": "Interoperable metadata standards and clearinghouse node for spatial information across government agencies.",
            "adapter_class": "NSDIMetadataAdapter",
            "data_flow": "ISO/OGC Spatial Metadata -> Catalogue Interoperability"
        }
    ]
