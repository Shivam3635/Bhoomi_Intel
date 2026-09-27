"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Users,
  PlusCircle,
  CheckCircle2,
  FileText,
  Sliders,
  MapPin,
  Calendar,
  X
} from "lucide-react";
import { api } from "@/lib/api";

interface WorkspaceViewProps {
  onNavigate: (tab: string) => void;
}

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [lead, setLead] = useState("Prof. Ananya Sen");
  const [org, setOrg] = useState("National Institute of Rural Development");
  const [geo, setGeo] = useState("Uttar Pradesh & Maharashtra");
  const [desc, setDesc] = useState("");

  const loadProjects = async () => {
    try {
      const p = await api.getProjects();
      setProjects(p);
    } catch (e) {
      console.warn("Projects fallback:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !objective) return;
    try {
      await api.createProject({
        title,
        objective,
        lead_researcher: lead,
        organization: org,
        geography: geo,
        description: desc,
        status: "Active",
      });
      setModalOpen(false);
      setTitle("");
      setObjective("");
      setDesc("");
      loadProjects();
    } catch (err) {
      console.error("Create project error:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
            <Briefcase className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Collaborative Research Workspace (Module 10)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Active Multi-Agency Land Governance Studies
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Enabling cross-disciplinary teams from DoLR, NITI Aayog, and academic institutions to collaborate on empirical research and policy scenario modeling.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center space-x-1.5 shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                proj.status === 'Active'
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
              }`}>
                {proj.status}
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                {proj.created_at?.split("T")[0] || "2024-Q3"}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                {proj.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                <strong>Objective:</strong> {proj.objective}
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Lead Researcher:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{proj.lead_researcher}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Nodal Body:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{proj.organization}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 dark:text-slate-400">Geographic Scope:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{proj.geography}</span>
              </div>
              <div className="pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                <strong>Collaborators:</strong> {proj.collaborators}
              </div>
            </div>

            {proj.findings_summary && (
              <div className="text-xs bg-emerald-50/50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/60 p-2.5 rounded text-emerald-900 dark:text-emerald-200">
                <strong>Findings Progress:</strong> {proj.findings_summary}
              </div>
            )}

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => onNavigate("research")}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Search Related Papers</span>
              </button>
              <button
                onClick={() => onNavigate("simulator")}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded font-medium flex items-center space-x-1 transition"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Simulate Project Scenarios</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Create Research Project</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. State-wide Peri-Urban Farmland Preservation Strategy"
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Research Objective</label>
                <textarea
                  required
                  rows={2}
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="Describe empirical goals, data sources, and intended policy outcomes..."
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lead Researcher</label>
                  <input
                    type="text"
                    value={lead}
                    onChange={(e) => setLead(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Organization</label>
                  <input
                    type="text"
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Geographic Coverage</label>
                <input
                  type="text"
                  value={geo}
                  onChange={(e) => setGeo(e.target.value)}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded"
                >
                  Save Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
