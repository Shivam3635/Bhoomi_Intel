from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Token & Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    email: str
    full_name: str
    organization: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    full_name: str
    password: str
    role: str = "RESEARCHER"
    organization: str = "Department of Land Resources"

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    organization: str
    created_at: datetime
    class Config:
        from_attributes = True

# Documents
class DocumentBase(BaseModel):
    title: str
    description: Optional[str] = None
    source: str
    publisher: str
    document_type: str
    topic: str
    state: Optional[str] = None
    district: Optional[str] = None
    year: int
    publication_date: Optional[str] = None
    tags: Optional[str] = None
    geographic_coverage: Optional[str] = "District / State Level"
    data_type: Optional[str] = "Text / Spatial"
    source_url: Optional[str] = None
    data_status: Optional[str] = "Verified"
    methodology: Optional[str] = None
    license: Optional[str] = "Open Government Data License"
    is_synthetic: bool = False

class DocumentCreate(DocumentBase):
    content_text: str

class DocumentOut(DocumentBase):
    id: str
    content_text: str
    created_at: datetime
    class Config:
        from_attributes = True

# Datasets
class DatasetOut(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    publisher: str
    year: int
    geography: str
    state: Optional[str] = None
    topic: str
    variables: Optional[str] = None
    source: str
    update_frequency: str
    access_type: str
    license: str
    quality_status: str
    completeness_score: float
    freshness_score: float
    coverage_score: float
    reliability_score: float
    data_status: str
    sample_records: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# GIS
class GISLayerOut(BaseModel):
    id: str
    name: str
    layer_type: str
    category: str
    state: Optional[str] = None
    district: Optional[str] = None
    description: Optional[str] = None
    attribution: str
    style_config: Optional[str] = None
    is_synthetic: bool
    class Config:
        from_attributes = True

class GISFeatureOut(BaseModel):
    id: str
    layer_id: str
    feature_name: str
    state: Optional[str] = None
    district: Optional[str] = None
    geometry_geojson: str
    properties_json: Optional[str] = None
    class Config:
        from_attributes = True

# Indicator
class DistrictIndicatorOut(BaseModel):
    id: str
    state: str
    district: str
    year: int
    built_up_area_sqkm: float
    agricultural_area_sqkm: float
    forest_area_sqkm: float
    water_area_sqkm: float
    total_area_sqkm: float
    infrastructure_index: float
    population: int
    climate_risk_score: float
    land_pressure_score: float
    dispute_index: float
    is_synthetic: bool
    class Config:
        from_attributes = True

# Scenarios
class ScenarioRunRequest(BaseModel):
    title: str = "Urban Infrastructure Expansion Simulation"
    state: str = "Uttar Pradesh"
    district: str = "Lucknow"
    baseline_year: int = 2024
    target_year: int = 2030
    infra_expansion_pct_a: float = 10.0
    infra_expansion_pct_b: float = 20.0
    land_use_pressure_pct: float = 15.0
    urban_growth_pct: float = 20.0
    climate_risk_level: str = "Medium" # Low, Medium, High

class ScenarioResultItem(BaseModel):
    indicator_name: str
    baseline_val: float
    scenario_a_val: float
    scenario_b_val: float
    unit: str
    pct_change_a: float
    pct_change_b: float
    risk_level: str
    interpretation: str

class ScenarioResponse(BaseModel):
    id: str
    title: str
    state: str
    district: str
    baseline_year: int
    target_year: int
    parameters: Dict[str, Any]
    results: List[ScenarioResultItem]
    assumptions: List[str]
    limitations: List[str]
    methodology: str
    data_sources: List[str]
    disclaimer: str

# Evidence Graph
class EvidenceGraphNode(BaseModel):
    id: str
    node_type: str
    label: str
    subtitle: Optional[str] = None
    description: Optional[str] = None
    source_ref: Optional[str] = None
    entity_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

class EvidenceGraphEdge(BaseModel):
    id: str
    source: str
    target: str
    relationship_type: str
    strength: float = 1.0
    description: Optional[str] = None

class EvidenceGraphResponse(BaseModel):
    nodes: List[EvidenceGraphNode]
    edges: List[EvidenceGraphEdge]

# AI Research / RAG
class ResearchQueryRequest(BaseModel):
    query: str
    state: Optional[str] = None
    district: Optional[str] = None
    topic: Optional[str] = None
    year_from: Optional[int] = None
    year_to: Optional[int] = None

class EvidenceSourceCitation(BaseModel):
    id: str
    title: str
    document_type: str
    publisher: str
    year: int
    geographic_scope: str
    relevance_score: float
    snippet: str
    source_url: Optional[str] = None
    data_status: str

class ResearchQueryResponse(BaseModel):
    query: str
    answer: str
    key_findings: List[str]
    citations: List[EvidenceSourceCitation]
    confidence: str # High, Medium, Low
    methodology: str
    limitations: str
    spatial_context: Dict[str, Any]
    recommended_scenarios: List[str]
    disclaimer: str

# Policy Brief
class PolicyBriefRequest(BaseModel):
    scenario_id: Optional[str] = None
    query: Optional[str] = None
    district: str = "Lucknow"
    state: str = "Uttar Pradesh"
    target_year: int = 2030

class PolicyBriefResponse(BaseModel):
    id: str
    title: str
    created_at: str
    executive_summary: str
    policy_question: str
    current_evidence: List[str]
    relevant_research: List[Dict[str, Any]]
    dataset_summary: List[Dict[str, Any]]
    gis_findings: Dict[str, Any]
    scenario_analysis: Dict[str, Any]
    potential_risks: List[str]
    possible_interventions: List[str]
    assumptions: List[str]
    limitations: List[str]
    sources: List[str]
    printable_html: str

# Research Project
class ProjectCreate(BaseModel):
    title: str
    objective: str
    lead_researcher: str
    organization: str
    geography: str
    description: Optional[str] = None
    status: str = "Active"

# Land Acquisition
class LandAcquisitionOut(BaseModel):
    id: str
    project_name: str
    state: str
    district: str
    required_area_ha: float
    acquired_area_ha: float
    progress_pct: float
    compensation_disbursed_cr: float
    total_budget_cr: float
    affected_families: int
    rehabilitated_families: int
    delay_risk: str
    status: str
    last_updated: str
    class Config:
        from_attributes = True

# Dashboard Summary
class DashboardSummary(BaseModel):
    total_documents: int
    total_datasets: int
    total_gis_layers: int
    total_projects: int
    active_scenarios_count: int
    states_covered: int
    districts_covered: int
    evidence_nodes_count: int
