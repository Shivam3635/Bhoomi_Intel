from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.data.seed_data import seed_database
from app.api import (
    auth, documents, search, research, scenarios,
    gis, indicators, policy_brief, datasets,
    projects, dashboard, audit, ecosystem, acquisition, evidence_graph
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure tables exist and seed demo data
    print("[BHUMI-INTEL] Initializing database and verifying demo data...")
    seed_database()
    yield
    # Shutdown
    print("[BHUMI-INTEL] Shutting down.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Evidence Intelligence Layer for Land Governance — Ministry of Rural Development, Department of Land Resources (DoLR)",
    version=settings.PROJECT_VERSION,
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(search.router, prefix=settings.API_V1_STR)
app.include_router(research.router, prefix=settings.API_V1_STR)
app.include_router(scenarios.router, prefix=settings.API_V1_STR)
app.include_router(gis.router, prefix=settings.API_V1_STR)
app.include_router(indicators.router, prefix=settings.API_V1_STR)
app.include_router(policy_brief.router, prefix=settings.API_V1_STR)
app.include_router(datasets.router, prefix=settings.API_V1_STR)
app.include_router(projects.router, prefix=settings.API_V1_STR)
app.include_router(dashboard.router, prefix=settings.API_V1_STR)
app.include_router(audit.router, prefix=settings.API_V1_STR)
app.include_router(ecosystem.router, prefix=settings.API_V1_STR)
app.include_router(acquisition.router, prefix=settings.API_V1_STR)
app.include_router(evidence_graph.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "tagline": "Evidence Intelligence for Land Governance",
        "department": "Ministry of Rural Development, Department of Land Resources (DoLR)",
        "docs_url": "/docs",
        "api_v1": settings.API_V1_STR,
        "mode": "Prototype / Hackathon Demo Mode (Synthetic & Research Benchmark Data)",
        "disclaimer": "AI is a decision-support assistant. Evidence is traceable to source records."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
