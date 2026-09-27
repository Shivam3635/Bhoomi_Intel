# BHUMI-INTEL API Specification

All endpoints are prefixed with `/api` and documented dynamically at `/docs` via OpenAPI Swagger.

## 1. Authentication & RBAC
- `POST /api/auth/login`
  - Body: `{"email": "policymaker@example.com", "password": "demo123"}`
  - Returns: JWT Bearer token, role, full name, organization.
- `GET /api/auth/me`
  - Returns current user profile.
- `GET /api/auth/users`
  - Returns all registered user profiles.

## 2. Documents (Land Governance Knowledge Hub)
- `GET /api/documents`
  - Query params: `topic`, `document_type`, `state`, `year`, `skip`, `limit`.
- `GET /api/documents/{id}`
  - Returns specific document and metadata.
- `POST /api/documents`
  - Uploads research paper or policy document with chunking.

## 3. Search & Discovery
- `GET /api/search`
  - Query params: `q`, `state`, `district`, `topic`, `document_type`, `year_from`, `year_to`.
  - Full-text and metadata filtered retrieval.

## 4. AI Research Assistant (RAG)
- `POST /api/research/query`
  - Body: `{"query": "...", "state": "Uttar Pradesh", "district": "Lucknow"}`
  - Returns: Evidence synthesis, key findings, citations array with provenance, confidence score, methodology, limitations, and spatial context.

## 5. Policy Scenario Simulator
- `POST /api/scenarios/run`
  - Body:
    ```json
    {
      "state": "Uttar Pradesh",
      "district": "Lucknow",
      "infra_expansion_pct_a": 10.0,
      "infra_expansion_pct_b": 20.0,
      "land_use_pressure_pct": 15.0,
      "urban_growth_pct": 20.0,
      "climate_risk_level": "Medium"
    }
    ```
  - Returns: Baseline vs. Scenario A vs. Scenario B indicators, percentage changes, risk assessments, assumptions, and limitations.
- `GET /api/scenarios`
  - List of past scenarios.
- `GET /api/scenarios/{id}`
  - Detailed view of a past simulation run.

## 6. GIS Explorer
- `GET /api/gis/layers`
  - List of active spatial layers.
- `GET /api/gis/features`
  - Returns GeoJSON `FeatureCollection` filtered by `layer_type`, `state`, `district`.
- `GET /api/gis/profile`
  - Query params: `state`, `district`. Returns complete spatial telemetry profile.

## 7. Policy Brief Generator
- `POST /api/policy-brief/generate`
  - Body: `{"district": "Lucknow", "state": "Uttar Pradesh", "target_year": 2030, "query": "..."}`
  - Returns: 12-section structured briefing paper with formatted printable HTML.
- `POST /api/policy-brief/print-view`
  - Returns raw clean HTML for direct browser print dialog.

## 8. Data Catalog
- `GET /api/datasets`
  - List of datasets with data quality metrics (completeness, freshness, coverage, reliability).
- `GET /api/datasets/{id}`
  - Specific dataset metadata and sample records.

## 9. Evidence Graph
- `GET /api/evidence-graph`
  - Returns graph nodes and directed edges connecting Policy &rarr; Research &rarr; Dataset &rarr; GIS &rarr; Indicator &rarr; Scenario &rarr; Outcome.

## 10. Research Workspace
- `GET /api/projects`
  - List of active collaborative research projects.
- `POST /api/projects`
  - Create a new research project.

## 11. Audit & Provenance
- `GET /api/audit-logs`
  - System audit trails.
- `GET /api/audit-logs/ai-provenance`
  - Query synthesis audit logs with citation references.
