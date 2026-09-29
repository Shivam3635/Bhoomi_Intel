import { NextRequest, NextResponse } from "next/server";
import {
  MOCK_USERS,
  MOCK_DOCUMENTS,
  MOCK_DATASETS,
  MOCK_GIS_LAYERS,
  MOCK_DISTRICT_PROFILES,
  MOCK_ACQUISITION_PROJECTS,
  MOCK_EVIDENCE_GRAPH,
  MOCK_ECOSYSTEM_SOURCES,
  MOCK_AUDIT_LOGS,
  MOCK_AI_PROVENANCE,
  calculateScenario,
  generatePolicyBrief,
  searchResearch,
} from "@/lib/mockData";

export async function GET(request: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const path = route.join("/");
  const { searchParams } = new URL(request.url);

  // Dashboard
  if (path === "dashboard/summary") {
    return NextResponse.json({
      total_research_papers: 6,
      total_government_reports: 4,
      total_datasets: 4,
      active_gis_layers: 4,
      policy_simulations_run: 24,
      active_users: 5,
      states_covered: ["Uttar Pradesh", "Maharashtra", "Odisha", "Tamil Nadu"],
      peer_reviewed_count: 6,
      open_datasets_count: 4,
      scenarios_calculated: 24,
    });
  }

  if (path === "dashboard/trends") {
    return NextResponse.json([
      { year: 2020, built_up_sqkm: 510, agricultural_sqkm: 3620, disputes_count: 410 },
      { year: 2021, built_up_sqkm: 532, agricultural_sqkm: 3580, disputes_count: 395 },
      { year: 2022, built_up_sqkm: 558, agricultural_sqkm: 3530, disputes_count: 370 },
      { year: 2023, built_up_sqkm: 588, agricultural_sqkm: 3470, disputes_count: 340 },
      { year: 2024, built_up_sqkm: 624, agricultural_sqkm: 3410, disputes_count: 312 },
    ]);
  }

  // Documents
  if (path === "documents") {
    const topic = searchParams.get("topic");
    const docType = searchParams.get("document_type");
    const state = searchParams.get("state");

    let docs = [...MOCK_DOCUMENTS];
    if (topic && topic !== "All") docs = docs.filter((d) => d.topic === topic);
    if (docType && docType !== "All") docs = docs.filter((d) => d.document_type === docType);
    if (state && state !== "All") docs = docs.filter((d) => d.state === state);
    return NextResponse.json(docs);
  }

  if (path.startsWith("documents/")) {
    const id = path.replace("documents/", "");
    const doc = MOCK_DOCUMENTS.find((d) => d.id === id) || MOCK_DOCUMENTS[0];
    return NextResponse.json(doc);
  }

  // Datasets
  if (path === "datasets") {
    const topic = searchParams.get("topic");
    const state = searchParams.get("state");

    let ds = [...MOCK_DATASETS];
    if (topic && topic !== "All") ds = ds.filter((d) => d.topic === topic);
    if (state && state !== "All") ds = ds.filter((d) => d.state === state || d.state === "All India");
    return NextResponse.json(ds);
  }

  // GIS
  if (path === "gis/layers") {
    return NextResponse.json(MOCK_GIS_LAYERS);
  }

  if (path === "gis/features") {
    const district = searchParams.get("district") || "Lucknow";
    const coords = (MOCK_DISTRICT_PROFILES[district] || MOCK_DISTRICT_PROFILES["Lucknow"]).center;
    return NextResponse.json({
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: `${district} Built-Up Infill`, type: "BUILT_UP", density: "High" },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [coords[1] - 0.05, coords[0] - 0.04],
                [coords[1] + 0.05, coords[0] - 0.04],
                [coords[1] + 0.06, coords[0] + 0.04],
                [coords[1] - 0.04, coords[0] + 0.05],
                [coords[1] - 0.05, coords[0] - 0.04],
              ],
            ],
          },
        },
      ],
    });
  }

  if (path === "gis/profile") {
    const district = searchParams.get("district") || "Lucknow";
    const profile = MOCK_DISTRICT_PROFILES[district] || MOCK_DISTRICT_PROFILES["Lucknow"];
    return NextResponse.json(profile);
  }

  // Scenarios
  if (path === "scenarios") {
    return NextResponse.json([
      calculateScenario({ district: "Lucknow", state: "Uttar Pradesh", infra_expansion_pct_a: 10, infra_expansion_pct_b: 20 }),
      calculateScenario({ district: "Pune", state: "Maharashtra", infra_expansion_pct_a: 15, infra_expansion_pct_b: 25 }),
    ]);
  }

  // Evidence Graph
  if (path === "evidence-graph") {
    return NextResponse.json(MOCK_EVIDENCE_GRAPH);
  }

  // Projects
  if (path === "projects") {
    return NextResponse.json([
      {
        id: "proj-1",
        title: "Lucknow Peri-Urban Farmland Preservation Study",
        description: "Evaluating agricultural topsoil preservation along the Outer Ring Road and Purvanchal corridor interchanges.",
        state: "Uttar Pradesh",
        district: "Lucknow",
        status: "ACTIVE",
        created_at: "2024-03-01T10:00:00Z",
        updated_at: "2024-03-20T15:30:00Z",
      },
      {
        id: "proj-2",
        title: "Western Ghats Eco-Buffer & Slope Zoning Policy",
        description: "Assessing runoff vulnerability and master plan zoning bylaws in Pune peri-urban watershed zones.",
        state: "Maharashtra",
        district: "Pune",
        status: "ACTIVE",
        created_at: "2024-02-15T09:00:00Z",
        updated_at: "2024-03-18T11:20:00Z",
      },
    ]);
  }

  // Land Acquisition
  if (path === "acquisition/projects") {
    return NextResponse.json(MOCK_ACQUISITION_PROJECTS);
  }

  // Ecosystem
  if (path === "ecosystem/sources") {
    return NextResponse.json(MOCK_ECOSYSTEM_SOURCES);
  }

  // Audit Logs
  if (path === "audit-logs") {
    return NextResponse.json(MOCK_AUDIT_LOGS);
  }

  if (path === "audit-logs/ai-provenance") {
    return NextResponse.json(MOCK_AI_PROVENANCE);
  }

  // Auth
  if (path === "auth/me") {
    return NextResponse.json(MOCK_USERS[0]);
  }

  if (path === "auth/users") {
    return NextResponse.json(MOCK_USERS);
  }

  return NextResponse.json({ message: `BHUMI-INTEL API endpoint /${path} ready` });
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ route: string[] }> }) {
  const { route } = await params;
  const path = route.join("/");

  let body: any = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  // Research Query / RAG
  if (path === "research/query") {
    const answer = searchResearch(body.query || "", body.state, body.district, body.topic);
    return NextResponse.json(answer);
  }

  // Scenario Simulation
  if (path === "scenarios/run") {
    const result = calculateScenario(body);
    return NextResponse.json(result);
  }

  // Policy Brief Generator
  if (path === "policy-brief/generate") {
    const brief = generatePolicyBrief(body);
    return NextResponse.json(brief);
  }

  // Projects
  if (path === "projects") {
    const newProj = {
      id: `proj-${Date.now()}`,
      title: body.title || "Untitled Land Research Project",
      description: body.description || "",
      state: body.state || "Uttar Pradesh",
      district: body.district || "Lucknow",
      status: "ACTIVE",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    return NextResponse.json(newProj);
  }

  // Auth login
  if (path === "auth/login") {
    const user = MOCK_USERS.find((u) => u.email === body.email) || MOCK_USERS[0];
    return NextResponse.json({
      access_token: "mock-jwt-token-demo",
      token_type: "bearer",
      user,
    });
  }

  return NextResponse.json({ success: true, path, data: body });
}
