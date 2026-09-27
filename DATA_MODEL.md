# BHUMI-INTEL Data Model Specification

## 1. Relational Entities (PostgreSQL / SQLite Compatible)

### 1.1 `users`
- `id` (VARCHAR 36, PK, UUID)
- `email` (VARCHAR 255, Unique, Index)
- `full_name` (VARCHAR 255)
- `hashed_password` (VARCHAR 255)
- `role` (VARCHAR 50: ADMIN | POLICYMAKER | RESEARCHER | GOVERNMENT_OFFICIAL | PUBLIC_USER)
- `organization` (VARCHAR 255)
- `is_active` (BOOLEAN)
- `created_at` (TIMESTAMP)

### 1.2 `documents`
- `id` (VARCHAR 36, PK, UUID)
- `title` (VARCHAR 500, Index)
- `description` (TEXT)
- `source` (VARCHAR 255)
- `publisher` (VARCHAR 255)
- `document_type` (VARCHAR 100: Research Paper | Government Report | Policy Document | Legal Document | Case Study)
- `topic` (VARCHAR 100, Index)
- `state` (VARCHAR 100, Nullable, Index)
- `district` (VARCHAR 100, Nullable, Index)
- `year` (INTEGER, Index)
- `tags` (VARCHAR 500)
- `geographic_coverage` (VARCHAR 255)
- `data_status` (VARCHAR 50)
- `methodology` (TEXT)
- `content_text` (TEXT)
- `is_synthetic` (BOOLEAN)
- `created_at` (TIMESTAMP)

### 1.3 `datasets`
- `id` (VARCHAR 36, PK, UUID)
- `name` (VARCHAR 255, Index)
- `description` (TEXT)
- `publisher` (VARCHAR 255)
- `year` (INTEGER)
- `geography` (VARCHAR 255)
- `state` (VARCHAR 100, Nullable)
- `topic` (VARCHAR 100)
- `variables` (TEXT)
- `source` (VARCHAR 255)
- `update_frequency` (VARCHAR 100)
- `access_type` (VARCHAR 100)
- `license` (VARCHAR 100)
- `quality_status` (VARCHAR 50)
- `completeness_score` (FLOAT)
- `freshness_score` (FLOAT)
- `coverage_score` (FLOAT)
- `reliability_score` (FLOAT)
- `data_status` (VARCHAR 50)
- `sample_records` (TEXT, JSON)

### 1.4 `district_indicators`
- `id` (VARCHAR 36, PK, UUID)
- `state` (VARCHAR 100, Index)
- `district` (VARCHAR 100, Index)
- `year` (INTEGER, Index)
- `built_up_area_sqkm` (FLOAT)
- `agricultural_area_sqkm` (FLOAT)
- `forest_area_sqkm` (FLOAT)
- `water_area_sqkm` (FLOAT)
- `total_area_sqkm` (FLOAT)
- `infrastructure_index` (FLOAT, 0-100)
- `population` (INTEGER)
- `climate_risk_score` (FLOAT, 0-100)
- `land_pressure_score` (FLOAT, 0-100)
- `dispute_index` (FLOAT, 0-100)
- `is_synthetic` (BOOLEAN)

### 1.5 `scenarios` & `scenario_results`
- `scenarios`: `id`, `title`, `description`, `state`, `district`, `baseline_year`, `target_year`, `parameters_json`, `created_by`, `created_at`.
- `scenario_results`: `id`, `scenario_id` (FK), `indicator_name`, `baseline_val`, `scenario_a_val`, `scenario_b_val`, `unit`, `pct_change_a`, `pct_change_b`, `risk_level`, `details_json`.

### 1.6 `evidence_nodes` & `evidence_edges`
- `evidence_nodes`: `id`, `node_type` (POLICY | RESEARCH | DATASET | GIS | INDICATOR | SCENARIO | OUTCOME), `label`, `subtitle`, `description`, `source_ref`, `metadata_json`.
- `evidence_edges`: `id`, `source`, `target`, `relationship_type`, `strength`, `description`.

### 1.7 `audit_logs` & `ai_queries`
- `audit_logs`: `id`, `user_email`, `action`, `resource_type`, `resource_id`, `details_json`, `ip_address`, `timestamp`.
- `ai_queries`: `id`, `user_id`, `query_text`, `answer_text`, `confidence`, `methodology`, `limitations`, `provenance_json`, `retrieved_doc_ids`, `created_at`.
