# BHUMI-INTEL System Architecture Specification

## 1. Architectural Philosophy: The Evidence Intelligence Layer

Traditional government portals operate as **Data Repositories** (e.g. providing raw PDF circulars or static map viewports). In contrast, BHUMI-INTEL is an **Intelligence Layer** designed to bridge data silos through continuous semantic linkage:

```
[Raw Cadastral RoR / Satellite Rasters / Court Dockets]
                           │
                           ▼
          [BHUMI-INTEL Source Adapters]
      ├── DILRMP Adapter (Cadastral Geo-referencing)
      ├── Bhuvan WMS Adapter (Satellite LULC)
      ├── NDAP Adapter (Socio-Economic Series)
      └── India Code Adapter (Statutory Legal Frameworks)
                           │
                           ▼
             [Harmonized Knowledge Engine]
     ├── Semantic Hybrid Search (Elasticsearch / BM25)
     ├── Evidence Graph Engine (Node & Edge Lineage)
     └── RAG Synthesis Engine (Citation Grounding)
                           │
                           ▼
            [Policy Modeling & Decision Core]
     ├── Spatial Overlay & Buffer Engine (GIS)
     ├── Transparent Multi-Policy Simulator (NumPy/Pandas)
     └── 12-Section Policy Brief Generator (HTML/Print/PDF)
```

---

## 2. Core Subsystems

### 2.1 Knowledge Engine & Hybrid Search
- **Document Chunking & Vectorization**: Ingests PDFs, reports, and case studies into semantic chunks.
- **Search Engine**: Implements an elastic adapter. If an Elasticsearch node is active at `:9200`, it submits BM25 multi-field matching with keyword boosting (`title^3`, `tags^2`, `content_text`). If Elasticsearch is offline (hackathon local environment), it transitions seamlessly to an in-memory weighted token-matching search engine with metadata filtering.

### 2.2 Explainable RAG Research Assistant
- Implements strict prompt and template contracts:
  - **No Fabrication Rule**: Never hallucinates citations or external numbers.
  - **Confidence Evaluation**: Scores evidence based on peer-reviewed status and sample size.
  - **Explainable AI Metadata**: Always returns *"Why this answer?"*, model assumptions, methodology, and limitations.

### 2.3 Transparent Policy Simulator
- Avoids black-box opaque machine learning.
- Uses multivariate linear elasticity formulas calibrated against historical peri-urban conversion rates:
  - Built-up area expansion = $B_0 \times (1 + \Delta_{\text{infra}} \times 1.0)$
  - Agricultural displacement = $A_0 - (B_{\text{new}} - B_0) \times 0.85$
  - Runoff exposure = $P_0 \times 0.08 \times (1 + \Delta_{\text{infra}} \times 1.2 \times M_{\text{climate}})$
  - Infrastructure accessibility index = $\min(100, I_0 \times (1 + \Delta_{\text{infra}} \times 0.95))$

### 2.4 Evidence Graph
- Graph structure stored in relational format (`evidence_nodes`, `evidence_edges`) with typed nodes:
  - `POLICY` &rarr; `RESEARCH` &rarr; `DATASET` &rarr; `GIS` &rarr; `INDICATOR` &rarr; `SCENARIO` &rarr; `OUTCOME`
- Allows users to inspect any node's upstream causal origins and downstream consequences.

---

## 3. Security, RBAC & Audit Trails
- **JWT Authentication**: Tokens signed using project HMAC secret with 24-hour expiration.
- **Role-Based Access Control**:
  - `ADMIN`: User management, dataset uploads, system configuration.
  - `POLICYMAKER`: Scenario runs, decision briefs, comparative indicators.
  - `RESEARCHER`: Study creation, dataset inspection, notes.
  - `GOVERNMENT_OFFICIAL`: Geospatial monitoring, acquisition telemetry.
  - `PUBLIC_USER`: Open search and summary dashboard view.
- **Audit Logging**: Every login, search query, scenario run, and document generation creates an immutable audit record with timestamps, user emails, and IP telemetry.
