export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: "ADMIN" | "POLICYMAKER" | "RESEARCHER" | "GOVERNMENT_OFFICIAL" | "PUBLIC_USER";
  organization: string;
}

export interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  source: string;
  publisher: string;
  document_type: string;
  topic: string;
  state?: string;
  district?: string;
  year: number;
  publication_date?: string;
  tags?: string;
  geographic_coverage?: string;
  data_type?: string;
  source_url?: string;
  data_status: string;
  methodology?: string;
  license?: string;
  content_text: string;
  is_synthetic: boolean;
  created_at: string;
}

export interface EvidenceCitation {
  id: string;
  title: string;
  document_type: string;
  publisher: string;
  year: number;
  geographic_scope: string;
  relevance_score: number;
  snippet: string;
  source_url?: string;
  data_status: string;
}

export interface ResearchAnswer {
  query: string;
  answer: string;
  key_findings: string[];
  citations: EvidenceCitation[];
  confidence: string;
  methodology: string;
  limitations: string;
  spatial_context: Record<string, any>;
  recommended_scenarios: string[];
  disclaimer: string;
}

export interface ScenarioResultItem {
  indicator_name: string;
  baseline_val: number;
  scenario_a_val: number;
  scenario_b_val: number;
  unit: string;
  pct_change_a: number;
  pct_change_b: number;
  risk_level: string;
  interpretation: string;
}

export interface ScenarioResponse {
  id: string;
  title: string;
  state: string;
  district: string;
  baseline_year: number;
  target_year: number;
  parameters: Record<string, any>;
  results: ScenarioResultItem[];
  assumptions: string[];
  limitations: string[];
  methodology: string;
  data_sources: string[];
  disclaimer: string;
}

export interface EvidenceNodeData {
  id: string;
  node_type: string;
  label: string;
  subtitle?: string;
  description?: string;
  source_ref?: string;
  entity_id?: string;
  metadata?: Record<string, any>;
}

export interface EvidenceEdgeData {
  id: string;
  source: string;
  target: string;
  relationship_type: string;
  strength: number;
  description?: string;
}

export interface DatasetItem {
  id: string;
  name: string;
  description?: string;
  publisher: string;
  year: number;
  geography: string;
  state?: string;
  topic: string;
  variables?: string;
  source: string;
  update_frequency: string;
  access_type: string;
  license: string;
  quality_status: string;
  completeness_score: number;
  freshness_score: number;
  coverage_score: number;
  reliability_score: number;
  data_status: string;
  sample_records?: string;
}

export interface GISLayerItem {
  id: string;
  name: string;
  layer_type: string;
  category: string;
  description?: string;
  attribution: string;
  is_synthetic: boolean;
  features_count: number;
}

export interface LandAcquisitionItem {
  id: string;
  project_name: string;
  state: string;
  district: string;
  required_area_ha: number;
  acquired_area_ha: number;
  progress_pct: number;
  compensation_disbursed_cr: number;
  total_budget_cr: number;
  affected_families: number;
  rehabilitated_families: number;
  delay_risk: string;
  status: string;
  last_updated: string;
}

export interface PolicyBriefData {
  id: string;
  title: string;
  created_at: string;
  executive_summary: string;
  policy_question: string;
  current_evidence: string[];
  relevant_research: Array<{ title: string; publisher: string; year: number; finding: string }>;
  dataset_summary: Array<{ name: string; publisher: string; variables: string; quality: string }>;
  gis_findings: Record<string, any>;
  scenario_analysis: Record<string, any>;
  potential_risks: string[];
  possible_interventions: string[];
  assumptions: string[];
  limitations: string[];
  sources: string[];
  printable_html: string;
}
