# BHUMI-INTEL
### Evidence Intelligence for Land Governance
*“From fragmented land data to traceable policy insight.”*

**Ministry of Rural Development** • **Department of Land Resources (DoLR)**  
**Smart India Hackathon** | Category: **Software** | Theme: **Smart Automation**

---

## 1. Project Overview & Problem Statement
India possesses vast quantities of land-governance information spread across research papers, government reports, legal court dockets, cadastral maps, and satellite remote-sensing datasets.

The major problem is **not a lack of data**. The critical problem is that this information is fragmented, siloed, and extremely difficult to discover, connect, analyze, and convert into actionable evidence for land-governance policy formulation.

**BHUMI-INTEL** is designed as an **Evidence Intelligence Layer** for land governance:
- It does **not** replace existing systems (such as DILRMP, NDAP, Bhuvan, SVAMITVA, or NAKSHA).
- Instead, it conceptually connects existing resources into a continuous decision pipeline:

```
Data ➔ Research ➔ Evidence ➔ GIS Context ➔ Analytics ➔ Policy Scenario ➔ Decision Support ➔ Policy Brief
```

---

## 2. Product Principles & Ethical AI
1. **AI is a Decision-Support Assistant, Not an Autonomous Policymaker**: The platform never pretends that AI determines statutory policy.
2. **100% Traceability & Provenance**: Every insight connects back to source documents, publication dates, publishers, geographic scope, methodology, and limitations.
3. **Explicit Labeling**: The system clearly distinguishes **Real Research Documents**, **Synthetic Demo Spatial Indicators**, and **Modelled Scenario Outputs**.

---

## 3. High-Level Architecture

```
                    ┌───────────────────────┐
                    │     Next.js UI        │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │      FastAPI API      │
                    └───────────┬───────────┘
                                │
          ┌─────────────────────┼─────────────────────┐
          │                     │                     │
          ▼                     ▼                     ▼
   Knowledge Engine        GIS Engine          Policy Engine
          │                     │                     │
          ▼                     ▼                     ▼
   Elasticsearch / BM25   PostGIS/Leaflet       Pandas/NumPy
          │                                           │
          ▼                                           ▼
   RAG / AI Layer                              Scenario Models
          │                                           │
          └──────────────────┬────────────────────────┘
                             ▼
                      Evidence Graph
                             │
                             ▼
                  Policy Brief Generator
```

---

## 4. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React, Leaflet, Recharts.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy v2.
- **Data Science**: NumPy, Pandas, Scikit-learn.
- **Database & Spatial**: SQLite (local zero-dependency fallback) / PostgreSQL with PostGIS extension.
- **Search Architecture**: Elasticsearch DSL adapter with automated in-memory weighted BM25/hybrid fallback.
- **AI / RAG**: Multi-stage semantic retrieval, evidence synthesis, explainable AI ("Why this answer?"), deterministic fallback for 100% hackathon reliability.
- **Security & RBAC**: JWT Bearer authentication with HMAC-SHA256 hashing.
- **Containerization**: Docker, Docker Compose.

---

## 5. Quick Start & Setup Instructions

### Option A: Local Execution (Native Python & Node.js)

#### 1. Backend Setup:
```bash
# In project root:
cd backend

# Create and activate virtual environment
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run backend (auto-seeds database on first launch)
python main.py
# Server runs on http://localhost:8000
# OpenAPI Swagger docs available at http://localhost:8000/docs
```

#### 2. Frontend Setup:
```bash
# In a new terminal:
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
# Web application available at http://localhost:3000
```

---

### Option B: Docker Container Execution
```bash
# In project root:
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend API & OpenAPI Docs: `http://localhost:8000/docs`

---

## 6. Pre-Seeded Demo Accounts (RBAC)

Password for all demo accounts: `demo123`

| Role | Email | Organization | Permissions |
|---|---|---|---|
| **POLICYMAKER** | `policymaker@example.com` | NITI Aayog / MoRD Policy Cell | Run scenarios, generate briefs, view dashboards |
| **RESEARCHER** | `researcher@example.com` | National Institute of Rural Development | Upload research, create projects, view evidence |
| **ADMIN** | `admin@example.com` | Dept. of Land Resources (DoLR) | Manage datasets, view audit trails |
| **GOVERNMENT_OFFICIAL** | `official@example.com` | Revenue Department, Govt of UP | Access spatial telemetry, monitor projects |
| **PUBLIC_USER** | `public@example.com` | Public Research Consortium | Search research papers, view public dashboards |

*Note: You can switch roles instantaneously in the top-right corner of the UI navbar.*

---

## 7. The 5-Minute End-to-End Demo Journey

1. **Login & Dashboard**: Open `http://localhost:3000`. Authenticate as `policymaker@example.com`. Review national trends and KPI cards.
2. **AI Research Assistant**: Click *AI Research*. Submit query: *"What evidence exists about land-use change and infrastructure development in Lucknow?"*
3. **Trace Provenance**: Observe the multi-stage pipeline: *Understanding question &rarr; Finding evidence &rarr; Checking GIS context &rarr; Preparing answer*. Inspect citations and explainability (*"Why this answer?"*).
4. **GIS Explorer**: Switch to *GIS Explorer*. Select **Lucknow (Uttar Pradesh)**. Toggle **Land-Use (LULC)**, **Expressway Corridors**, and **Climate Runoff Zones**.
5. **Policy Scenario Simulator**: Open *Policy Simulator*. Under *Urban Infrastructure Expansion*, compare Baseline vs. Scenario A (+10%) vs. Scenario B (+20%). Notice how agricultural exposure drops by 101.7 sq km.
6. **Evidence Graph**: Inspect the visual graph showing: `Policy Mandate ➔ Research Study ➔ NRSC Dataset ➔ GIS Buffer ➔ Exposure Indicator ➔ Simulation Model ➔ Policy Brief Outcome`.
7. **Policy Brief Generator**: Click *Generate Evidence-Based Policy Brief*. Review the 12-section standardized document with executive summary, empirical risks, and interventions. Click *Print / Save as PDF*.

---

## 8. Automated Smoke Test Suite
To verify the entire backend API suite:
```bash
cd backend
python test_smoke.py
```
Outputs: `ALL 9 SMOKE TESTS PASSED SUCCESSFULLY!`

---

## 9. Synthetic Data Disclaimer
Spatial indicator telemetry (e.g. built-up sq km, dispute indices) across the 5 states and 20 districts is synthetic demo data calibrated to official NRSC, Bhuvan, and DILRMP benchmarks. It is intended strictly for demonstration of the Evidence Intelligence architecture and must not be cited as official statistics.
