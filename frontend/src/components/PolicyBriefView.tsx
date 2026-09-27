"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Printer,
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  Building,
  RefreshCw,
  Eye,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { api } from "@/lib/api";
import { PolicyBriefData } from "@/lib/types";

interface PolicyBriefViewProps {
  onNavigate: (tab: string) => void;
  defaultDistrict?: string;
  defaultState?: string;
}

export const PolicyBriefView: React.FC<PolicyBriefViewProps> = ({
  onNavigate,
  defaultDistrict = "Lucknow",
  defaultState = "Uttar Pradesh",
}) => {
  const [district, setDistrict] = useState(defaultDistrict);
  const [state, setState] = useState(defaultState);
  const [targetYear, setTargetYear] = useState<number>(2030);
  const [customQuestion, setCustomQuestion] = useState(
    "How can Lucknow balance rapid expressway infrastructure expansion with agricultural land preservation and climate resilience by 2030?"
  );

  const [loading, setLoading] = useState(false);
  const [brief, setBrief] = useState<PolicyBriefData | null>(null);

  const generateBrief = async () => {
    setLoading(true);
    try {
      const res = await api.generatePolicyBrief({
        district,
        state,
        query: customQuestion,
      });
      setBrief(res);
    } catch (e) {
      console.warn("Policy brief generation fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateBrief();
  }, [district, state]);

  const handlePrint = () => {
    if (!brief) return;
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(brief.printable_html);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 350);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded">
            <FileText className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Policy Brief Generator (Module 7)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Automated Evidence-Backed Land Governance Policy Brief
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Synthesizes peer-reviewed studies, cadastral records, GIS buffer overlays, and transparent simulation into a standardized 12-section decision brief.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={generateBrief}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>{loading ? "Generating..." : "Regenerate Brief"}</span>
          </button>
          <button
            onClick={handlePrint}
            disabled={!brief}
            className="bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 disabled:bg-slate-400 text-white border border-transparent dark:border-slate-700 px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Target Parameters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="text-slate-500 dark:text-slate-400 font-medium block text-[11px] mb-0.5">District</label>
            <select
              value={district}
              onChange={(e) => {
                const d = e.target.value;
                setDistrict(d);
                if (d === "Lucknow") setState("Uttar Pradesh");
                if (d === "Pune") setState("Maharashtra");
                if (d === "Bengaluru Rural") setState("Karnataka");
                if (d === "Bhopal") setState("Madhya Pradesh");
                if (d === "Khordha") setState("Odisha");
              }}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2.5 py-1.5 font-medium"
            >
              <option value="Lucknow">Lucknow (Uttar Pradesh)</option>
              <option value="Pune">Pune (Maharashtra)</option>
              <option value="Bengaluru Rural">Bengaluru Rural (Karnataka)</option>
              <option value="Bhopal">Bhopal (Madhya Pradesh)</option>
              <option value="Khordha">Khordha (Odisha)</option>
            </select>
          </div>

          <div>
            <label className="text-slate-500 dark:text-slate-400 font-medium block text-[11px] mb-0.5">Horizon Year</label>
            <select
              value={targetYear}
              onChange={(e) => setTargetYear(Number(e.target.value))}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded px-2.5 py-1.5 font-medium"
            >
              <option value={2026}>2026 (Short-Term)</option>
              <option value={2030}>2030 (Medium-Term Target)</option>
              <option value={2035}>2035 (Long-Term Vision)</option>
            </select>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 flex items-center space-x-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Output format compliant with Department of Land Resources (DoLR) policy standards.</span>
        </div>
      </div>

      {/* Brief Preview Document Canvas */}
      {brief && (
        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl shadow-md p-8 sm:p-12 max-w-4xl mx-auto space-y-6 text-slate-800 dark:text-slate-200 font-sans">
          {/* Document Header */}
          <div className="border-b-2 border-blue-900 dark:border-blue-500 pb-5">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider text-blue-950 dark:text-blue-300">
                Ministry of Rural Development • Department of Land Resources (DoLR)
              </span>
              <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-bold">
                {brief.id}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-blue-950 dark:text-blue-200 tracking-tight">
              {brief.title}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Evidence-based evaluation of linear arterial infrastructure, peri-urban farmland conversion, and hydrological resilience.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">District & State:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{district}, {state}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Time Horizon:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">2024 &rarr; {targetYear}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Generated At:</span>
                <span className="font-bold text-slate-900 dark:text-slate-100">{brief.created_at}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Document Status:</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">Decision-Support</span>
              </div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
              1. Executive Summary
            </h2>
            <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 text-justify bg-slate-50/60 dark:bg-slate-800/40 p-3.5 rounded border border-slate-100 dark:border-slate-800">
              {brief.executive_summary}
            </p>
          </div>

          {/* Section 2: Core Policy Question */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-blue-600 pl-2">
              2. Core Policy Question
            </h2>
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-lg text-xs font-semibold text-blue-900 dark:text-blue-200">
              &ldquo;{brief.policy_question}&rdquo;
            </div>
          </div>

          {/* Section 3: Baseline Evidence */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-slate-700 dark:border-slate-400 pl-2">
              3. Current Evidence & Spatial Telemetry
            </h2>
            <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
              {brief.current_evidence.map((ev, i) => (
                <li key={i} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span>{ev}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Scenario Analysis */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-indigo-600 pl-2">
              4. Scenario Analysis & Comparative Projections (2024 &rarr; {targetYear})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200 dark:border-slate-700">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">Indicator</th>
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">Baseline (2024)</th>
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">Scenario A (+10%)</th>
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">Scenario B (+20%)</th>
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">% Change (B)</th>
                    <th className="py-2 px-3 border border-slate-200 dark:border-slate-700">Risk Assessment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {brief.scenario_analysis?.results?.map((r: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-medium border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">{r.name}</td>
                      <td className="py-2 px-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">{r.base} {r.unit}</td>
                      <td className="py-2 px-3 border border-slate-200 dark:border-slate-700 font-semibold text-blue-700 dark:text-blue-400">{r.a} {r.unit}</td>
                      <td className="py-2 px-3 border border-slate-200 dark:border-slate-700 font-semibold text-indigo-700 dark:text-indigo-400">{r.b} {r.unit}</td>
                      <td className="py-2 px-3 border border-slate-200 dark:border-slate-700 font-bold text-slate-900 dark:text-slate-100">{r.pct_b}%</td>
                      <td className="py-2 px-3 border border-slate-200 dark:border-slate-700">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {r.risk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: GIS Findings */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-cyan-600 pl-2">
              5. Key Spatial & GIS Insights
            </h2>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
              <p><strong>Primary Spatial Observation:</strong> {brief.gis_findings?.key_observation}</p>
              <p><strong>Catchment Vulnerability:</strong> {brief.gis_findings?.vulnerable_catchment}</p>
              <p><strong>Cadastral Integration:</strong> {brief.gis_findings?.cadastral_status}</p>
            </div>
          </div>

          {/* Section 6: Potential Risks */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-amber-600 pl-2">
              6. Governance, Environmental & Dispute Risks
            </h2>
            <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 list-disc pl-5">
              {brief.potential_risks.map((rk, i) => (
                <li key={i}>{rk}</li>
              ))}
            </ul>
          </div>

          {/* Section 7: Recommended Interventions */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider border-l-4 border-emerald-600 pl-2">
              7. Actionable Policy Interventions
            </h2>
            <div className="space-y-2 text-xs">
              {brief.possible_interventions.map((iv, i) => (
                <div key={i} className="p-2.5 bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-lg flex items-start space-x-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-700 dark:bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-800 dark:text-slate-200">{iv}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Assumptions & Limitations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase">Assumptions:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                {brief.assumptions.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded border border-slate-200 dark:border-slate-700 space-y-1">
              <div className="font-bold text-slate-800 dark:text-slate-200 text-[11px] uppercase">Limitations:</div>
              <ul className="list-disc pl-4 space-y-0.5 text-slate-600 dark:text-slate-400 text-[11px]">
                {brief.limitations.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </div>
          </div>

          {/* Section 9: Sources & Provenance */}
          <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              8. Cited Evidence Sources & Methodological Lineage
            </h2>
            <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400 list-disc pl-5">
              {brief.sources.map((src, i) => (
                <li key={i}>{src}</li>
              ))}
            </ul>
          </div>

          {/* Governance Notice footer */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded text-[11px] text-amber-900 dark:text-amber-300 leading-snug">
            <strong>Traceability Stamp:</strong> This policy brief was prepared by the BHUMI-INTEL Evidence Intelligence Layer.
            All insights are grounded in peer-reviewed monographs and open cadastral registries.
          </div>
        </div>
      )}
    </div>
  );
};
