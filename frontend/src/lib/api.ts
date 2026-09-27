const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
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
    console.warn(`[fetchApi] Error fetching ${endpoint}:`, error.message);
    throw error;
  }
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
