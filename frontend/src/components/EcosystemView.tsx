"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Layers,
  CheckCircle2,
  ExternalLink,
  Code2,
  Server,
  Network,
  ShieldCheck
} from "lucide-react";
import { api } from "@/lib/api";

interface EcosystemViewProps {
  onNavigate: (tab: string) => void;
}

export const EcosystemView: React.FC<EcosystemViewProps> = ({ onNavigate }) => {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    async function loadSources() {
      try {
        const s = await api.getEcosystemSources();
        setSources(s);
      } catch (e) {
        console.warn("Ecosystem sources fallback:", e);
      }
    }
    loadSources();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">
            <Network className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>National Land Governance Ecosystem Architecture</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Source Adapter Interfaces & Conceptual Integrations
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            BHUMI-INTEL does not replace DILRMP, Bhuvan, or SVAMITVA. Instead, it acts as an evidence intelligence layer connecting their disparate outputs via standardized plug-and-play adapter interfaces.
          </p>
        </div>
      </div>

      {/* Architecture Visual Diagram Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-md">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center space-x-2">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span>Extensible Source Adapter Architecture</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold">1. DataProvider Interface</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Abstract base class defining standardized contracts for spatial vector retrieval, tabular indicators, and document extraction.
            </p>
            <div className="text-[10px] text-slate-500 bg-slate-900 p-2 rounded">
              class DataProvider(ABC):<br/>
              &nbsp;&nbsp;def fetch_records()<br/>
              &nbsp;&nbsp;def get_geojson_layers()
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold">2. SyntheticDataProvider</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Currently active in prototype demo mode to guarantee 100% offline hackathon operation without API rate limits or downtime.
            </p>
            <div className="text-[10px] text-emerald-500 bg-slate-900 p-2 rounded">
              status: ACTIVE_DEMO_MODE<br/>
              coverage: 5 states, 20 districts<br/>
              provenance: synthetic_calibrated
            </div>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold">3. Government & Research Adapters</span>
            <p className="text-slate-400 text-[11px] font-sans">
              Production-ready adapters designed to plug into DILRMP cadastral APIs, Bhuvan WMS, NDAP datasets, and India Code legal dockets.
            </p>
            <div className="text-[10px] text-purple-400 bg-slate-900 p-2 rounded">
              interfaces: DILRMP, Bhuvan, NDAP<br/>
              auth: API_Key / OAuth2 Government
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3 hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-base font-bold text-slate-900 dark:text-slate-100">{src.name}</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60">
                  {src.integration_status}
                </span>
              </div>

              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">{src.full_name}</div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{src.description}</p>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded border border-slate-100 dark:border-slate-800 text-[11px] space-y-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Nodal Authority: </span>
                  <span className="text-slate-800 dark:text-slate-200 font-semibold">{src.nodal_body}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Adapter Interface: </span>
                  <code className="text-blue-700 dark:text-blue-400 font-mono text-[10px]">{src.adapter_class}</code>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400">
              <strong>Data Pipeline:</strong> {src.data_flow}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
