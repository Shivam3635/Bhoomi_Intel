"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  Shield,
  Layers,
  FileText,
  Sliders,
  Filter,
  History,
  X,
  ChevronRight,
  FileCheck
} from "lucide-react";
import { api } from "@/lib/api";
import { ResearchAnswer, EvidenceCitation } from "@/lib/types";

interface ResearchAssistantViewProps {
  onNavigate: (tab: string) => void;
  initialQuery?: string;
}

export const ResearchAssistantView: React.FC<ResearchAssistantViewProps> = ({
  onNavigate,
  initialQuery,
}) => {
  const [query, setQuery] = useState(
    initialQuery || "What evidence exists about land-use change and infrastructure development in Lucknow?"
  );
  const [stateFilter, setStateFilter] = useState("Uttar Pradesh");
  const [districtFilter, setDistrictFilter] = useState("Lucknow");
  const [topicFilter, setTopicFilter] = useState("Land-Use Change");
  const [docTypeFilter, setDocTypeFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<string>("");
  const [answerData, setAnswerData] = useState<ResearchAnswer | null>(null);
  const [selectedCitation, setSelectedCitation] = useState<EvidenceCitation | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const queryHistory = [
    "What evidence exists about land-use change and infrastructure development in Lucknow?",
    "How does linear transport infrastructure affect peri-urban agricultural topsoil?",
    "What empirical evidence exists regarding digital land records (DILRMP) and dispute reduction?",
    "Show evidence on urban expansion and climate vulnerability in Maharashtra watershed zones."
  ];

  const handleSearch = async (overrideQuery?: string) => {
    const q = overrideQuery || query;
    if (!q.trim()) return;

    setLoading(true);
    setAnswerData(null);
    setSelectedCitation(null);

    // Progressive loading states
    setLoadingStage("Understanding question & identifying spatial entities...");
    await new Promise((r) => setTimeout(r, 350));
    setLoadingStage("Retrieving indexed peer-reviewed studies and government reports...");
    await new Promise((r) => setTimeout(r, 400));
    setLoadingStage("Checking GIS corridor telemetry & cross-referencing datasets...");
    await new Promise((r) => setTimeout(r, 350));
    setLoadingStage("Synthesizing traceable findings with source attribution...");

    try {
      const res = await api.queryResearch(q, stateFilter, districtFilter, topicFilter);
      setAnswerData(res);
      if (res.citations && res.citations.length > 0) {
        setSelectedCitation(res.citations[0]);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
      setLoadingStage("");
    }
  };

  // Run on mount if initial query was provided
  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    } else {
      handleSearch();
    }
  }, [initialQuery]);

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            Research & Evidence Intelligence
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Discover peer-reviewed literature, government circulars, and verified spatial datasets.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>100% Traceable to Verified Publications</span>
        </div>
      </div>

      {/* Main 3-Column Research Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: Query Input, Filters & History (3 cols) */}
        <div className="lg:col-span-3 space-y-5">
          
          {/* Query Box */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              Search Inquiry
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about land-use change, acquisition delays, watershed risk..."
                className="w-full text-xs text-slate-800 dark:text-slate-100 p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white dark:focus:bg-slate-900 transition"
              />
            </div>

            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 shadow-xs transition"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? "Searching Evidence..." : "Search Evidence"}</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
                <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Filters</span>
              </span>
              <button
                onClick={() => {
                  setStateFilter("All");
                  setDistrictFilter("All");
                  setTopicFilter("All");
                  setDocTypeFilter("All");
                }}
                className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline"
              >
                Reset
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Topic</label>
                <select
                  value={topicFilter}
                  onChange={(e) => setTopicFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1.5"
                >
                  <option value="All">All Topics</option>
                  <option value="Land-Use Change">Land-Use Change</option>
                  <option value="Digital Land Records">Digital Land Records</option>
                  <option value="Climate Risk">Climate Risk</option>
                  <option value="Land Acquisition">Land Acquisition</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">State</label>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1.5"
                >
                  <option value="All">All States</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Odisha">Odisha</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">District</label>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1.5"
                >
                  <option value="All">All Districts</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Pune">Pune</option>
                  <option value="Bengaluru Rural">Bengaluru Rural</option>
                  <option value="Bhopal">Bhopal</option>
                  <option value="Khordha">Khordha</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5">Document Type</label>
                <select
                  value={docTypeFilter}
                  onChange={(e) => setDocTypeFilter(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2 py-1.5"
                >
                  <option value="All">All Types</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Government Report">Government Report</option>
                  <option value="Legal Document">Legal Document</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quick Query History / Suggestions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Suggested Inquiries
            </span>
            <div className="space-y-1.5">
              {queryHistory.map((item, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(item);
                    handleSearch(item);
                  }}
                  className="w-full text-left text-[11px] text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded transition line-clamp-2"
                >
                  &bull; {item}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* CENTER COLUMN: AI Synthesis & Key Findings (5 or 6 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Active Loading Skeleton */}
          {loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 shadow-xs text-center space-y-4 animate-pulse">
              <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Processing Knowledge Graph</p>
                <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono">{loadingStage}</p>
              </div>
            </div>
          )}

          {/* Answer Card */}
          {answerData && !loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs space-y-5">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h2 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                    Evidence Synthesis
                  </h2>
                </div>
                <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold px-2 py-0.5 rounded font-mono">
                  {answerData.confidence}
                </span>
              </div>

              {/* Core Answer */}
              <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed space-y-3">
                <p className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-normal">
                  {answerData.answer}
                </p>
              </div>

              {/* Key Findings List */}
              <div className="space-y-2">
                <h3 className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Key Empirical Findings:
                </h3>
                <ul className="space-y-2 text-xs">
                  {answerData.key_findings.map((finding, idx) => (
                    <li
                      key={idx}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-start space-x-2.5 leading-relaxed"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Spatial Context Bar */}
              {answerData.spatial_context?.district && (
                <div className="bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-xl p-3.5 text-xs text-blue-900 dark:text-blue-200 flex items-center justify-between">
                  <div>
                    <span className="font-semibold block text-[11px] text-blue-800 dark:text-blue-300 uppercase">Spatial Context:</span>
                    <span className="text-xs">
                      {answerData.spatial_context.district} ({answerData.spatial_context.state}) • Built-up: {answerData.spatial_context.built_up_area_sqkm} sq km • Agri: {answerData.spatial_context.agricultural_area_sqkm} sq km
                    </span>
                  </div>
                  <button
                    onClick={() => onNavigate("gis")}
                    className="text-blue-700 dark:text-blue-400 font-bold hover:underline flex items-center space-x-1 flex-shrink-0 ml-2"
                  >
                    <span>View Map</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Downstream Action Triggers */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-slate-400 font-medium mr-1">Next steps:</span>
                <button
                  onClick={() => onNavigate("gis")}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition"
                >
                  <Layers className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Explore GIS</span>
                </button>
                <button
                  onClick={() => onNavigate("simulator")}
                  className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition"
                >
                  <Sliders className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  <span>2. Simulate Policy</span>
                </button>
                <button
                  onClick={() => onNavigate("brief")}
                  className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 transition shadow-xs"
                >
                  <FileText className="w-3 h-3 text-blue-400 dark:text-white" />
                  <span>3. Generate Brief</span>
                </button>
              </div>

            </div>
          )}

          {/* Empty / Initial State */}
          {!answerData && !loading && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Ready for Research Query</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Type an inquiry in the search box or select one of the suggested policy questions to retrieve evidence.
              </p>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Evidence & Citations List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Evidence Sources ({answerData?.citations.length || 0})
              </span>
              <span className="text-[10px] text-slate-400">Click to inspect</span>
            </div>

            {/* Citations List */}
            {answerData?.citations && answerData.citations.length > 0 ? (
              <div className="space-y-2">
                {answerData.citations.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCitation(c);
                      setDrawerOpen(true);
                    }}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      selectedCitation?.id === c.id
                        ? "border-blue-600 dark:border-blue-500 bg-blue-50/40 dark:bg-blue-950/40"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-900 dark:text-slate-100 truncate">{c.title}</span>
                      <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.2 rounded font-semibold flex-shrink-0">
                        {c.document_type.replace(" Document", "")}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {c.snippet}
                    </p>

                    <div className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
                      <span className="truncate">{c.publisher} • {c.year}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{c.data_status}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                No citations retrieved yet.
              </div>
            )}
          </div>

          {/* Explainable AI Box */}
          {answerData && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs text-xs space-y-2.5">
              <div className="flex items-center space-x-1.5 text-slate-800 dark:text-slate-200 font-bold text-[11px] uppercase tracking-wider pb-1 border-b border-slate-100 dark:border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Explainable AI & Provenance</span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                <p>
                  <strong>Method: </strong>{answerData.methodology}
                </p>
                <p className="text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-2 rounded border border-amber-200 dark:border-amber-800 mt-2">
                  <strong>Limitations: </strong>{answerData.limitations}
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Slide-over Evidence Metadata Drawer */}
      {drawerOpen && selectedCitation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto space-y-4 animate-in slide-in-from-right duration-200 text-xs border-l border-slate-200 dark:border-slate-800">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  {selectedCitation.document_type}
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {selectedCitation.title}
                </h3>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Publisher:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCitation.publisher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Publication Year:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCitation.year}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Geographic Scope:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedCitation.geographic_scope}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Validation Status:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">{selectedCitation.data_status}</span>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Excerpted Evidence Snippet:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3 rounded border border-slate-200 dark:border-slate-700 text-justify">
                {selectedCitation.snippet}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setDrawerOpen(false)}
                className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-xs font-medium"
              >
                Close Drawer
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
