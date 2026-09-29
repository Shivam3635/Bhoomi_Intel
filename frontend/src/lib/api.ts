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
} from "./mockData";

// Defaults to relative /api on Vercel, or custom backend URL if specified
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  // Normalize URL
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = API_BASE_URL.startsWith("http")
    ? `${API_BASE_URL}${cleanEndpoint}`
    : `${API_BASE_URL}${cleanEndpoint}`;

  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `API request failed with status ${res.status}`);
    }

    return await res.json();
  } catch (error: any) {
    console.warn(`[fetchApi] Network request failed for ${cleanEndpoint}, activating resilient client fallback.`);
    return handleClientFallback<T>(cleanEndpoint, options);
  }
}

// Client-side fallback handler ensures 100% demo availability offline or on serverless
function handleClientFallback<T>(endpoint: string, options?: RequestInit): T {
  const method = (options?.method || "GET").toUpperCase();
  let body: any = {};
  if (options?.body) {
    try {
      body = JSON.parse(options.body as string);
    } catch {
      body = {};
    }
  }

  // Auth
  if (endpoint.startsWith("/auth/login")) {
    const user = MOCK_USERS.find((u) => u.email === body.email) || MOCK_USERS[0];
    return { access_token: "demo-jwt-token", token_type: "bearer", user } as unknown as T;
  }
  if (endpoint.startsWith("/auth/me")) {
    return MOCK_USERS[0] as unknown as T;
  }
  if (endpoint.startsWith("/auth/users")) {
    return MOCK_USERS as unknown as T;
  }

  // Dashboard
  if (endpoint.startsWith("/dashboard/summary")) {
    return {
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
    } as unknown as T;
  }

  if (endpoint.startsWith("/dashboard/trends")) {
    return [
      { year: 2020, built_up_sqkm: 510, agricultural_sqkm: 3620, disputes_count: 410 },
      { year: 2021, built_up_sqkm: 532, agricultural_sqkm: 3580, disputes_count: 395 },
      { year: 2022, built_up_sqkm: 558, agricultural_sqkm: 3530, disputes_count: 370 },
      { year: 2023, built_up_sqkm: 588, agricultural_sqkm: 3470, disputes_count: 340 },
      { year: 2024, built_up_sqkm: 624, agricultural_sqkm: 3410, disputes_count: 312 },
    ] as unknown as T;
  }

  // Research / RAG
  if (endpoint.startsWith("/research/query")) {
    return searchResearch(body.query || "", body.state, body.district, body.topic) as unknown as T;
  }

  // Documents
  if (endpoint.startsWith("/documents")) {
    const urlObj = new URL(`http://localhost${endpoint}`);
    const id = urlObj.pathname.replace("/documents/", "").replace("/documents", "");
    if (id) {
      const doc = MOCK_DOCUMENTS.find((d) => d.id === id) || MOCK_DOCUMENTS[0];
      return doc as unknown as T;
    }

    const topic = urlObj.searchParams.get("topic");
    const docType = urlObj.searchParams.get("document_type");
    const state = urlObj.searchParams.get("state");

    let docs = [...MOCK_DOCUMENTS];
    if (topic && topic !== "All") docs = docs.filter((d) => d.topic === topic);
    if (docType && docType !== "All") docs = docs.filter((d) => d.document_type === docType);
    if (state && state !== "All") docs = docs.filter((d) => d.state === state);
    return docs as unknown as T;
  }

  // Datasets
  if (endpoint.startsWith("/datasets")) {
    return MOCK_DATASETS as unknown as T;
  }

  // GIS
  if (endpoint.startsWith("/gis/layers")) {
    return MOCK_GIS_LAYERS as unknown as T;
  }

  if (endpoint.startsWith("/gis/features")) {
    const urlObj = new URL(`http://localhost${endpoint}`);
    const district = urlObj.searchParams.get("district") || "Lucknow";
    const coords = (MOCK_DISTRICT_PROFILES[district] || MOCK_DISTRICT_PROFILES["Lucknow"]).center;
    return {
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
    } as unknown as T;
  }

  if (endpoint.startsWith("/gis/profile")) {
    const urlObj = new URL(`http://localhost${endpoint}`);
    const district = urlObj.searchParams.get("district") || "Lucknow";
    return (MOCK_DISTRICT_PROFILES[district] || MOCK_DISTRICT_PROFILES["Lucknow"]) as unknown as T;
  }

  // Scenarios
  if (endpoint.startsWith("/scenarios/run")) {
    return calculateScenario(body) as unknown as T;
  }
  if (endpoint.startsWith("/scenarios")) {
    return [
      calculateScenario({ district: "Lucknow", state: "Uttar Pradesh", infra_expansion_pct_a: 10, infra_expansion_pct_b: 20 }),
      calculateScenario({ district: "Pune", state: "Maharashtra", infra_expansion_pct_a: 15, infra_expansion_pct_b: 25 }),
    ] as unknown as T;
  }

  // Evidence Graph
  if (endpoint.startsWith("/evidence-graph")) {
    return MOCK_EVIDENCE_GRAPH as unknown as T;
  }

  // Policy Brief
  if (endpoint.startsWith("/policy-brief/generate")) {
    return generatePolicyBrief(body) as unknown as T;
  }

  // Projects
  if (endpoint.startsWith("/projects")) {
    if (method === "POST") {
      return {
        id: `proj-${Date.now()}`,
        title: body.title || "Untitled Project",
        description: body.description || "",
        state: body.state || "Uttar Pradesh",
        district: body.district || "Lucknow",
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as unknown as T;
    }
    return [
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
    ] as unknown as T;
  }

  // Land Acquisition
  if (endpoint.startsWith("/acquisition/projects")) {
    return MOCK_ACQUISITION_PROJECTS as unknown as T;
  }

  // Ecosystem
  if (endpoint.startsWith("/ecosystem/sources")) {
    return MOCK_ECOSYSTEM_SOURCES as unknown as T;
  }

  // Audit Logs
  if (endpoint.startsWith("/audit-logs/ai-provenance")) {
    return MOCK_AI_PROVENANCE as unknown as T;
  }
  if (endpoint.startsWith("/audit-logs")) {
    return MOCK_AUDIT_LOGS as unknown as T;
  }

  return {} as unknown as T;
}

export const api = {
  // Auth
  login: (email: string, password: string = "demo123") =>
    fetchApi<any>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => fetchApi<any>("/auth/me"),
  getUsers: () => fetchApi<any[]>("/auth/users"),

  // Dashboard
  getDashboardSummary: () => fetchApi<any>("/dashboard/summary"),
  getDashboardTrends: () => fetchApi<any>("/dashboard/trends"),

  // Research / RAG
  queryResearch: (query: string, state?: string, district?: string, topic?: string) =>
    fetchApi<any>("/research/query", {
      method: "POST",
      body: JSON.stringify({ query, state, district, topic }),
    }),

  // Documents / Knowledge Hub
  getDocuments: (topic?: string, document_type?: string, state?: string) => {
    const params = new URLSearchParams();
    if (topic && topic !== "All") params.append("topic", topic);
    if (document_type && document_type !== "All") params.append("document_type", document_type);
    if (state && state !== "All") params.append("state", state);
    return fetchApi<any[]>(`/documents?${params.toString()}`);
  },
  getDocument: (id: string) => fetchApi<any>(`/documents/${id}`),

  // Datasets
  getDatasets: (topic?: string, state?: string) => {
    const params = new URLSearchParams();
    if (topic && topic !== "All") params.append("topic", topic);
    if (state && state !== "All") params.append("state", state);
    return fetchApi<any[]>(`/datasets?${params.toString()}`);
  },

  // GIS
  getGISLayers: () => fetchApi<any[]>("/gis/layers"),
  getGISFeatures: (layer_type?: string, state?: string, district?: string) => {
    const params = new URLSearchParams();
    if (layer_type && layer_type !== "All") params.append("layer_type", layer_type);
    if (state && state !== "All") params.append("state", state);
    if (district && district !== "All") params.append("district", district);
    return fetchApi<any>(`/gis/features?${params.toString()}`);
  },
  getDistrictProfile: (state: string, district: string) =>
    fetchApi<any>(`/gis/profile?state=${encodeURIComponent(state)}&district=${encodeURIComponent(district)}`),

  // Scenarios
  runScenario: (params: {
    district: string;
    state: string;
    infra_expansion_pct_a: number;
    infra_expansion_pct_b: number;
    land_use_pressure_pct: number;
    urban_growth_pct: number;
    climate_risk_level: string;
  }) =>
    fetchApi<any>("/scenarios/run", {
      method: "POST",
      body: JSON.stringify(params),
    }),
  getScenarios: () => fetchApi<any[]>("/scenarios"),

  // Evidence Graph
  getEvidenceGraph: () => fetchApi<any>("/evidence-graph"),

  // Policy Brief
  generatePolicyBrief: (params: { district: string; state: string; query?: string; scenario_id?: string }) =>
    fetchApi<any>("/policy-brief/generate", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // Projects
  getProjects: () => fetchApi<any[]>("/projects"),
  createProject: (data: any) =>
    fetchApi<any>("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Land Acquisition
  getAcquisitionProjects: () => fetchApi<any[]>("/acquisition/projects"),

  // Ecosystem
  getEcosystemSources: () => fetchApi<any[]>("/ecosystem/sources"),

  // Audit Logs
  getAuditLogs: () => fetchApi<any[]>("/audit-logs"),
  getAIProvenance: () => fetchApi<any[]>("/audit-logs/ai-provenance"),
};
