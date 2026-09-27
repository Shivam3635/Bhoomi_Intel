import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="RESEARCHER", nullable=False) # ADMIN, POLICYMAKER, RESEARCHER, GOVERNMENT_OFFICIAL, PUBLIC_USER
    organization = Column(String(255), default="Department of Land Resources")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Document(Base):
    __tablename__ = "documents"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=True)
    source = Column(String(255), nullable=False)
    publisher = Column(String(255), nullable=False)
    document_type = Column(String(100), nullable=False) # Research Paper, Government Report, Policy Document, Legal Document, Case Study
    topic = Column(String(100), nullable=False, index=True) # Land-Use Change, Infrastructure, Urban Expansion, Climate Risk, Land Acquisition, Watershed
    state = Column(String(100), nullable=True, index=True)
    district = Column(String(100), nullable=True, index=True)
    year = Column(Integer, nullable=False, index=True)
    publication_date = Column(String(50), nullable=True)
    tags = Column(String(500), nullable=True) # comma-separated
    geographic_coverage = Column(String(255), default="District / State Level")
    data_type = Column(String(50), default="Text / Spatial")
    source_url = Column(String(500), nullable=True)
    data_status = Column(String(50), default="Verified") # Verified, Prototype / Demo Data, Official Public
    methodology = Column(Text, nullable=True)
    license = Column(String(100), default="Open Government Data License / Creative Commons")
    content_text = Column(Text, nullable=False)
    is_synthetic = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    document_id = Column(String(36), ForeignKey("documents.id", ondelete="CASCADE"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chunk_text = Column(Text, nullable=False)
    embedding_json = Column(Text, nullable=True)
    document = relationship("Document", back_populates="chunks")

class Dataset(Base):
    __tablename__ = "datasets"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=True)
    publisher = Column(String(255), nullable=False)
    year = Column(Integer, nullable=False)
    geography = Column(String(255), default="National / District Level")
    state = Column(String(100), nullable=True)
    topic = Column(String(100), nullable=False)
    variables = Column(Text, nullable=True) # comma separated or JSON string
    source = Column(String(255), nullable=False)
    update_frequency = Column(String(100), default="Annual")
    access_type = Column(String(100), default="Open Public")
    license = Column(String(100), default="OGD India")
    quality_status = Column(String(50), default="High")
    completeness_score = Column(Float, default=90.0)
    freshness_score = Column(Float, default=85.0)
    coverage_score = Column(Float, default=92.0)
    reliability_score = Column(Float, default=88.0)
    data_status = Column(String(50), default="Prototype / Synthetic Demo Dataset")
    sample_records = Column(Text, nullable=True) # JSON format records
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class GISLayer(Base):
    __tablename__ = "gis_layers"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    layer_type = Column(String(100), nullable=False) # boundary, land_use, infrastructure, climate_vulnerability, research_hotspot, acquisition
    category = Column(String(100), default="Land Governance")
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    description = Column(Text, nullable=True)
    attribution = Column(String(255), default="BHUMI-INTEL Spatial Core / Survey Data Mock")
    style_config = Column(Text, nullable=True) # JSON color, opacity, etc
    is_synthetic = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    features = relationship("GISFeature", back_populates="layer", cascade="all, delete-orphan")

class GISFeature(Base):
    __tablename__ = "gis_features"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    layer_id = Column(String(36), ForeignKey("gis_layers.id", ondelete="CASCADE"), nullable=False)
    feature_name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    geometry_geojson = Column(Text, nullable=False) # GeoJSON string geometry
    properties_json = Column(Text, nullable=True) # JSON properties
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    layer = relationship("GISLayer", back_populates="features")

class DistrictIndicator(Base):
    __tablename__ = "district_indicators"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    state = Column(String(100), nullable=False, index=True)
    district = Column(String(100), nullable=False, index=True)
    year = Column(Integer, nullable=False, index=True)
    built_up_area_sqkm = Column(Float, nullable=False)
    agricultural_area_sqkm = Column(Float, nullable=False)
    forest_area_sqkm = Column(Float, nullable=False)
    water_area_sqkm = Column(Float, nullable=False)
    total_area_sqkm = Column(Float, nullable=False)
    infrastructure_index = Column(Float, default=50.0) # 0 - 100
    population = Column(Integer, default=1000000)
    climate_risk_score = Column(Float, default=45.0) # 0 - 100
    land_pressure_score = Column(Float, default=55.0) # 0 - 100
    dispute_index = Column(Float, default=30.0) # 0 - 100
    is_synthetic = Column(Boolean, default=True)

class Scenario(Base):
    __tablename__ = "scenarios"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    baseline_year = Column(Integer, default=2024)
    target_year = Column(Integer, default=2030)
    parameters_json = Column(Text, nullable=False) # e.g. {"infra_expansion_pct": 10, "land_pressure_pct": 15, "urban_growth_pct": 20, "climate_risk": "Medium"}
    created_by = Column(String(255), default="policymaker@example.com")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    results = relationship("ScenarioResult", back_populates="scenario", cascade="all, delete-orphan")

class ScenarioResult(Base):
    __tablename__ = "scenario_results"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    scenario_id = Column(String(36), ForeignKey("scenarios.id", ondelete="CASCADE"), nullable=False)
    indicator_name = Column(String(100), nullable=False)
    baseline_val = Column(Float, nullable=False)
    scenario_a_val = Column(Float, nullable=False)
    scenario_b_val = Column(Float, nullable=False)
    unit = Column(String(50), default="sq km")
    pct_change_a = Column(Float, nullable=False)
    pct_change_b = Column(Float, nullable=False)
    risk_level = Column(String(50), default="Moderate")
    details_json = Column(Text, nullable=True)
    scenario = relationship("Scenario", back_populates="results")

class EvidenceNode(Base):
    __tablename__ = "evidence_nodes"
    id = Column(String(100), primary_key=True)
    node_type = Column(String(50), nullable=False) # POLICY, RESEARCH, DATASET, GIS, INDICATOR, SCENARIO, OUTCOME
    label = Column(String(255), nullable=False)
    subtitle = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    source_ref = Column(String(255), nullable=True)
    entity_id = Column(String(100), nullable=True)
    metadata_json = Column(Text, nullable=True)

class EvidenceEdge(Base):
    __tablename__ = "evidence_edges"
    id = Column(String(100), primary_key=True)
    source = Column(String(100), nullable=False)
    target = Column(String(100), nullable=False)
    relationship_type = Column(String(100), nullable=False)
    strength = Column(Float, default=1.0)
    description = Column(String(255), nullable=True)

class ResearchProject(Base):
    __tablename__ = "research_projects"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    objective = Column(Text, nullable=False)
    lead_researcher = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    geography = Column(String(255), default="National / District Level")
    status = Column(String(50), default="Active") # Active, Under Review, Published, Draft
    description = Column(Text, nullable=True)
    collaborators = Column(String(500), default="DoLR GIS Wing, NITI Aayog Fellow, ICAR Team")
    findings_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AIQueryLog(Base):
    __tablename__ = "ai_queries"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(255), nullable=True)
    query_text = Column(Text, nullable=False)
    answer_text = Column(Text, nullable=False)
    confidence = Column(String(50), default="High")
    methodology = Column(String(255), default="Semantic hybrid retrieval + Evidence synthesis")
    limitations = Column(Text, nullable=True)
    provenance_json = Column(Text, nullable=True)
    retrieved_doc_ids = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_email = Column(String(255), nullable=False)
    action = Column(String(100), nullable=False) # LOGIN, SEARCH, SCENARIO_RUN, BRIEF_GENERATED, DOCUMENT_UPLOAD, AUDIT_INSPECT
    resource_type = Column(String(100), nullable=False)
    resource_id = Column(String(255), nullable=True)
    details_json = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class LandAcquisitionProject(Base):
    __tablename__ = "land_acquisition_projects"
    id = Column(String(36), primary_key=True, default=gen_uuid)
    project_name = Column(String(255), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    required_area_ha = Column(Float, nullable=False)
    acquired_area_ha = Column(Float, nullable=False)
    progress_pct = Column(Float, nullable=False)
    compensation_disbursed_cr = Column(Float, nullable=False)
    total_budget_cr = Column(Float, nullable=False)
    affected_families = Column(Integer, nullable=False)
    rehabilitated_families = Column(Integer, nullable=False)
    delay_risk = Column(String(50), default="Low") # Low, Medium, High
    status = Column(String(50), default="In Progress")
    last_updated = Column(String(50), default="2024-Q3")
