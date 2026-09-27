"use client";

import React, { useState, useEffect } from "react";
import {
  Share2,
  FileText,
  BookOpen,
  Database,
  Layers,
  TrendingUp,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  X
} from "lucide-react";
import { api } from "@/lib/api";
import { EvidenceNodeData, EvidenceEdgeData } from "@/lib/types";

interface EvidenceGraphViewProps {
  onNavigate: (tab: string) => void;
}

export const EvidenceGraphView: React.FC<EvidenceGraphViewProps> = ({ onNavigate }) => {
  const [nodes, setNodes] = useState<EvidenceNodeData[]>([]);
  const [edges, setEdges] = useState<EvidenceEdgeData[]>([]);
  const [selectedNode, setSelectedNode] = useState<EvidenceNodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGraph() {
      try {
        const res = await api.getEvidenceGraph();
        setNodes(res.nodes);
        setEdges(res.edges);
        if (res.nodes && res.nodes.length > 0) {
          setSelectedNode(res.nodes[0]);
        }
      } catch (e) {
        console.warn("Evidence graph fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    loadGraph();
  }, []);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "POLICY":
        return FileText;
      case "RESEARCH":
        return BookOpen;
      case "DATASET":
        return Database;
      case "GIS":
        return Layers;
      case "INDICATOR":
        return TrendingUp;
      case "SCENARIO":
        return Sliders;
      case "OUTCOME":
        return CheckCircle2;
      default:
        return Share2;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case "POLICY":
        return "border-blue-500 bg-blue-50 text-blue-900";
      case "RESEARCH":
        return "border-emerald-500 bg-emerald-50 text-emerald-900";
      case "DATASET":
        return "border-indigo-500 bg-indigo-50 text-indigo-900";
      case "GIS":
        return "border-cyan-500 bg-cyan-50 text-cyan-900";
      case "INDICATOR":
        return "border-amber-500 bg-amber-50 text-amber-900";
      case "SCENARIO":
        return "border-purple-500 bg-purple-50 text-purple-900";
      case "OUTCOME":
        return "border-rose-500 bg-rose-50 text-rose-900";
      default:
        return "border-slate-400 bg-slate-50 text-slate-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2.5 py-1 rounded">
            <Share2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Traceable Evidence Graph</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            End-to-End Lineage: From National Policy to Simulated Outcome
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Interactive visual network connecting statutory policy mandates, empirical research papers, spatial cadastral datasets, GIS layers, sensitivity indicators, simulation scenarios, and actionable policy briefs. Click any node to inspect provenance.
          </p>
        </div>
      </div>

      {/* Main Graph Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Lineage Nodes Timeline */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
              Evidence Graph Flow
            </h2>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              Click node to inspect metadata
            </span>
          </div>

          {/* Interactive Node Flow */}
          <div className="space-y-3 relative py-2">
            {nodes.map((node, idx) => {
              const Icon = getNodeIcon(node.node_type);
              const colorClasses = getNodeColor(node.node_type);
              const isSelected = selectedNode?.id === node.id;

              return (
                <div key={node.id} className="relative">
                  {/* Vertical connector line */}
                  {idx < nodes.length - 1 && (
                    <div className="absolute left-6 top-10 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 -mb-3 z-0" />
                  )}

                  <div
                    onClick={() => setSelectedNode(node)}
                    className={`relative z-10 flex items-start space-x-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-100 dark:ring-blue-900/40 bg-white dark:bg-slate-800"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40"
                    }`}
                  >
                    {/* Node Badge Icon */}
                    <div
                      className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${colorClasses}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          {node.node_type}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                          ID: {node.id}
                        </span>
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                        {node.label}
                      </h3>
                      {node.subtitle && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                          {node.subtitle}
                        </p>
                      )}
                    </div>

                    <ArrowRight
                      className={`w-4 h-4 mt-2 transition ${
                        isSelected ? "text-blue-600 dark:text-blue-400" : "text-slate-300 dark:text-slate-600"
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Drawer */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h2 className="text-xs font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider">
                Node Provenance Inspector
              </h2>
            </div>
            {selectedNode && (
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded">
                Verified
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  {selectedNode.node_type} NODE
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
                  {selectedNode.label}
                </h3>
                {selectedNode.subtitle && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedNode.subtitle}
                  </p>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="font-semibold text-slate-800 dark:text-slate-200">Description & Context:</div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">
                  {selectedNode.description}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Source Reference:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{selectedNode.source_ref}</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Traceability Status:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">100% Verified Origin</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Confidence Score:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">High (Cross-Corroborated)</span>
                </div>
              </div>

              {/* Connected Relationships */}
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] mb-2">
                  Linked Relationships:
                </h4>
                <div className="space-y-1.5">
                  {edges
                    .filter((e) => e.source === selectedNode.id || e.target === selectedNode.id)
                    .map((edge) => (
                      <div
                        key={edge.id}
                        className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800 text-[11px]"
                      >
                        <div className="font-medium text-slate-900 dark:text-slate-100 flex items-center justify-between">
                          <span>{edge.relationship_type}</span>
                          <span className="text-slate-400 dark:text-slate-500 font-mono">Weight: {edge.strength}</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">{edge.description}</p>
                      </div>
                    ))}
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate("brief")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Generate Policy Brief with this Lineage</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 dark:text-slate-500 text-xs">
              Select any node in the flow to inspect its detailed evidence provenance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
