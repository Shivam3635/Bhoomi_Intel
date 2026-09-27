"use client";

import React, { useState, useEffect } from "react";
import {
  Database,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldCheck,
  BarChart2,
  Sliders
} from "lucide-react";
import { api } from "@/lib/api";
import { DatasetItem } from "@/lib/types";

interface DataCatalogViewProps {
  onNavigate: (tab: string) => void;
}

export const DataCatalogView: React.FC<DataCatalogViewProps> = ({ onNavigate }) => {
  const [datasets, setDatasets] = useState<DatasetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");

  useEffect(() => {
    async function loadDatasets() {
      try {
        const ds = await api.getDatasets(selectedTopic);
        setDatasets(ds);
      } catch (e) {
        console.warn("Datasets load fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDatasets();
  }, [selectedTopic]);

  const filteredDatasets = datasets.filter((d) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.name.toLowerCase().includes(term) ||
      d.publisher.toLowerCase().includes(term) ||
      (d.variables && d.variables.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Land Governance Data Catalog (Module 8)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Harmonized Spatial & Administrative Datasets
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Discover validated satellite land-use layers, DILRMP cadastral telemetry, and climate risk indices calibrated for multi-policy simulation.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search datasets by variable or title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="w-full sm:w-64">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All Topics</option>
              <option value="Land-Use Change">Land-Use Change</option>
              <option value="Digital Land Records">Digital Land Records</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Climate Risk">Climate Risk</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDatasets.map((ds) => (
          <div
            key={ds.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                  {ds.topic}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  {ds.update_frequency} Updates
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                  {ds.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed">
                  {ds.description}
                </p>
              </div>

              {/* Data Quality Bar */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Data Quality Score:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{ds.completeness_score}% Quality Index</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${ds.completeness_score}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 pt-0.5">
                  <span>Coverage: {ds.coverage_score}%</span>
                  <span>Freshness: {ds.freshness_score}%</span>
                  <span>Reliability: {ds.reliability_score}%</span>
                </div>
              </div>

              {/* Metadata Details */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400 pt-1">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Publisher:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ds.publisher}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Geography:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ds.geography}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">License / Access:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{ds.access_type}</span>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Source Status:</span>
                  <span className="text-amber-700 dark:text-amber-400 font-semibold">{ds.data_status}</span>
                </div>
              </div>

              {ds.variables && (
                <div className="text-[11px] bg-slate-50 dark:bg-slate-800/60 p-2 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Variables: </span>
                  <code className="text-blue-700 dark:text-blue-400 font-mono text-[10px]">{ds.variables}</code>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                onClick={() => onNavigate("gis")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Inspect in GIS Map</span>
              </button>

              <button
                onClick={() => onNavigate("simulator")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition shadow-sm"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Use in Analysis</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
