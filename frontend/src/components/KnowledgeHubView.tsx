"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Filter,
  FileText,
  Tag,
  MapPin,
  Calendar,
  ExternalLink,
  PlusCircle,
  X,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { DocumentItem } from "@/lib/types";

interface KnowledgeHubViewProps {
  onNavigate: (tab: string) => void;
}

export const KnowledgeHubView: React.FC<KnowledgeHubViewProps> = ({ onNavigate }) => {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedState, setSelectedState] = useState("All");

  const [activeDocModal, setActiveDocModal] = useState<DocumentItem | null>(null);

  useEffect(() => {
    async function fetchDocs() {
      try {
        const docs = await api.getDocuments(selectedTopic, selectedType, selectedState);
        setDocuments(docs);
      } catch (e) {
        console.warn("Docs load fallback:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDocs();
  }, [selectedTopic, selectedType, selectedState]);

  const filteredDocs = documents.filter((d) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      d.title.toLowerCase().includes(term) ||
      (d.tags && d.tags.toLowerCase().includes(term)) ||
      d.publisher.toLowerCase().includes(term) ||
      d.content_text.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded">
            <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Land Governance Knowledge Hub (Module 1)</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            Searchable Land Governance Repository
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Cataloging peer-reviewed research papers, official government reports, legal statutes, and empirical case studies across 5 target states with standardized metadata.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search documents by keyword, author, or tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
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
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All Document Types</option>
              <option value="Research Paper">Research Paper</option>
              <option value="Government Report">Government Report</option>
              <option value="Legal Document">Legal Document</option>
              <option value="Case Study">Case Study</option>
            </select>
          </div>

          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-lg focus:ring-2 focus:ring-blue-600 font-medium"
            >
              <option value="All">All States</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Odisha">Odisha</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 transition flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-100 dark:border-blue-900/60">
                  {doc.document_type}
                </span>
                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{doc.year}</span>
              </div>

              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2">
                {doc.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                {doc.content_text}
              </p>

              <div className="space-y-1.5 text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <span className="font-medium text-slate-700 dark:text-slate-300">Publisher:</span>
                  <span className="truncate">{doc.publisher}</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>{doc.district ? `${doc.district}, ` : ""}{doc.state || "National"}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-emerald-700 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{doc.data_status}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 mt-4">
              <button
                onClick={() => setActiveDocModal(doc)}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                View Full Metadata & Text
              </button>
              <button
                onClick={() => onNavigate("research")}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded font-medium transition"
              >
                Ask Assistant &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Document Detail Modal */}
      {activeDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  {activeDocModal.document_type}
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                  {activeDocModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveDocModal(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Publisher:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeDocModal.publisher}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Publication Date / Year:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeDocModal.publication_date || activeDocModal.year}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Geographic Scope:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeDocModal.geographic_coverage}</span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Methodology:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeDocModal.methodology || "Satellite remote sensing + Cadastral registry"}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Full Document Text & Findings:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded border border-slate-200 dark:border-slate-700 text-justify">
                {activeDocModal.content_text}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                License: {activeDocModal.license}
              </span>
              <button
                onClick={() => {
                  setActiveDocModal(null);
                  onNavigate("research");
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-1.5 rounded-lg transition"
              >
                Query in AI Research Assistant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
