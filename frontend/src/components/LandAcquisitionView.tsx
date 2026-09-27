"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  TrendingUp,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";
import { LandAcquisitionItem } from "@/lib/types";

interface LandAcquisitionViewProps {
  onNavigate: (tab: string) => void;
}

export const LandAcquisitionView: React.FC<LandAcquisitionViewProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<LandAcquisitionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await api.getAcquisitionProjects();
        setProjects(res);
      } catch (e) {
        console.warn("Acquisition fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Land Acquisition Intelligence Extension</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Linear Infrastructure Acquisition & Fair Compensation Tracking
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Monitoring RFCTLARR 2013 acquisition progress, direct compensation disbursement, rehabilitated family records, and litigation delay risks across expressway and rail corridors.
          </p>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
            Active Corridor Land Acquisition Projects
          </h2>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            RFCTLARR 2013 Compliance Status
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                <th className="py-2.5 px-3">Corridor Project</th>
                <th className="py-2.5 px-3">State & District</th>
                <th className="py-2.5 px-3">Required Area</th>
                <th className="py-2.5 px-3">Progress</th>
                <th className="py-2.5 px-3">Compensation Disbursed</th>
                <th className="py-2.5 px-3">Affected Families</th>
                <th className="py-2.5 px-3">Delay Risk</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="py-3 px-3 font-semibold text-slate-900 dark:text-slate-100">{p.project_name}</td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{p.district}, {p.state}</td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">{p.acquired_area_ha} / {p.required_area_ha} ha</td>
                  <td className="py-3 px-3">
                    <div className="w-28 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-slate-700 dark:text-slate-300">
                        <span>{p.progress_pct}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-blue-600 h-full rounded-full"
                          style={{ width: `${p.progress_pct}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-emerald-700 dark:text-emerald-400 font-medium">
                    INR {p.compensation_disbursed_cr} Cr <span className="text-[10px] text-slate-400">/ {p.total_budget_cr} Cr</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300">
                    {p.rehabilitated_families} / {p.affected_families}
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      p.delay_risk === 'High'
                        ? 'bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300'
                        : p.delay_risk === 'Medium'
                        ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                        : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                    }`}>
                      {p.delay_risk} Risk
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{p.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-600 dark:text-slate-300">
          <span>
            <strong>Extension Note:</strong> Land acquisition monitoring connects directly with cadastral ULPIN titles to minimize Section 24(2) court stays.
          </span>
          <button
            onClick={() => onNavigate("simulator")}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Simulate Corridor Scenario &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
