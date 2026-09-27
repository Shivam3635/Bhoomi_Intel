"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  FileCheck,
  Search,
  CheckCircle2,
  Calendar,
  Lock,
  Layers,
  Database
} from "lucide-react";
import { api } from "@/lib/api";

interface AuditLogViewProps {
  onNavigate: (tab: string) => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ onNavigate }) => {
  const [logs, setLogs] = useState<any[]>([]);
  const [aiProvenance, setAiProvenance] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"logs" | "ai">("logs");

  useEffect(() => {
    async function loadAudit() {
      try {
        const [auditRes, provRes] = await Promise.all([
          api.getAuditLogs(),
          api.getAIProvenance(),
        ]);
        setLogs(auditRes);
        setAiProvenance(provRes);
      } catch (e) {
        console.warn("Audit logs load fallback:", e);
      }
    }
    loadAudit();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
            <Shield className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
            <span>Audit & Evidence Provenance (Module 12)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Immutable Audit Trail & Model Provenance Ledger
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Every user action, document ingestion, scenario execution, and AI synthesis is logged with cryptographic timestamps and source citations to preserve administrative trust.
          </p>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex space-x-2 border-b border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setActiveTab("logs")}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition ${
              activeTab === "logs"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            System Audit Logs ({logs.length})
          </button>
          <button
            onClick={() => setActiveTab("ai")}
            className={`pb-2 px-3 text-xs font-medium border-b-2 transition ${
              activeTab === "ai"
                ? "border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            AI Query Provenance Records ({aiProvenance.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeTab === "logs" ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                  <th className="py-2.5 px-3">Timestamp (UTC)</th>
                  <th className="py-2.5 px-3">User Email</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Resource Type</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 text-[11px] whitespace-nowrap">
                      {log.timestamp ? log.timestamp.replace("T", " ").substring(0, 19) : "2024-09-27"}
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{log.user_email}</td>
                    <td className="py-2.5 px-3">
                      <span className="bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-[10px] font-bold">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">{log.resource_type}</td>
                    <td className="py-2.5 px-3 text-slate-700 dark:text-slate-300 font-sans text-xs">
                      {log.details?.description || JSON.stringify(log.details)}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[10px] flex items-center">
                        <CheckCircle2 className="w-3 h-3 mr-0.5" /> Logged
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {aiProvenance.map((q) => (
            <div
              key={q.id}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">&ldquo;{q.query_text}&rdquo;</span>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded">
                  {q.confidence} Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Methodology:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{q.methodology}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Primary Evidence Citation:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{q.provenance?.primary_source || "Peer-Reviewed Literature"}</span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block text-[10px]">User Account:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{q.user_id}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Limitations Note:</strong> {q.limitations}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
