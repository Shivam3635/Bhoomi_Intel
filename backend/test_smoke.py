from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root_endpoint():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["platform"] == "BHUMI-INTEL"
    assert "Evidence Intelligence" in data["tagline"]

def test_auth_login():
    res = client.post("/api/auth/login", json={
        "email": "policymaker@example.com",
        "password": "demo123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["role"] == "POLICYMAKER"

def test_search_documents():
    res = client.get("/api/search?q=expressway&state=Uttar Pradesh")
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) > 0

def test_ai_research_rag_query():
    res = client.post("/api/research/query", json={
        "query": "What evidence exists about land-use change and infrastructure development?",
        "state": "Uttar Pradesh",
        "district": "Lucknow"
    })
    assert res.status_code == 200
    data = res.json()
    assert "answer" in data
    assert len(data["citations"]) > 0
    assert data["confidence"] in ["High (Multi-Source Corroborated)", "High", "Medium"]
    assert "disclaimer" in data

def test_gis_layers_and_profile():
    layers_res = client.get("/api/gis/layers")
    assert layers_res.status_code == 200
    assert len(layers_res.json()) >= 4

    profile_res = client.get("/api/gis/profile?state=Uttar Pradesh&district=Lucknow")
    assert profile_res.status_code == 200
    profile = profile_res.json()
    assert profile["district"] == "Lucknow"
    assert "built_up_area_sqkm" in profile

def test_policy_scenario_simulation():
    res = client.post("/api/scenarios/run", json={
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "infra_expansion_pct_a": 10.0,
        "infra_expansion_pct_b": 20.0,
        "land_use_pressure_pct": 15.0,
        "urban_growth_pct": 20.0,
        "climate_risk_level": "Medium"
    })
    assert res.status_code == 200
    data = res.json()
    assert "results" in data
    assert len(data["results"]) >= 5
    assert "assumptions" in data
    assert "limitations" in data

def test_evidence_graph():
    res = client.get("/api/evidence-graph")
    assert res.status_code == 200
    data = res.json()
    assert "nodes" in data
    assert "edges" in data
    assert len(data["nodes"]) >= 7

def test_policy_brief_generator():
    res = client.post("/api/policy-brief/generate", json={
        "district": "Lucknow",
        "state": "Uttar Pradesh",
        "target_year": 2030
    })
    assert res.status_code == 200
    data = res.json()
    assert "executive_summary" in data
    assert "policy_question" in data
    assert "potential_risks" in data
    assert "possible_interventions" in data
    assert "printable_html" in data
    assert "PB-" in data["id"]

def test_audit_logs():
    res = client.get("/api/audit-logs")
    assert res.status_code == 200
    assert len(res.json()) > 0

if __name__ == "__main__":
    test_root_endpoint()
    test_auth_login()
    test_search_documents()
    test_ai_research_rag_query()
    test_gis_layers_and_profile()
    test_policy_scenario_simulation()
    test_evidence_graph()
    test_policy_brief_generator()
    test_audit_logs()
    print("ALL 9 SMOKE TESTS PASSED SUCCESSFULLY!")
