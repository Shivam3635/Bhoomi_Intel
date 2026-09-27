"use client";

import React, { useState } from "react";
import {
  Compass,
  Layers,
  Sliders,
  Search,
  ArrowRight,
  BookOpen,
  MapPin,
  TrendingUp,
  FileText,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  PlayCircle
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

interface DashboardViewProps {
  onNavigate: (tab: string, initialQuery?: string) => void;
  onStartDemoFlow: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onStartDemoFlow }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate("research", searchQuery.trim());
    } else {
      onNavigate("research");
    }
  };

  const sampleChips = [
    "Land-use change around infrastructure corridors",
    "Land acquisition delay factors under RFCTLARR",
    "Climate vulnerability and peri-urban watershed planning",
    "Digital land records (DILRMP) and dispute reduction"
  ];

  // Featured Land Insight data (One clear, meaningful chart)
  const featuredTrendData = [
    { year: 2020, "Built-Up Area": 510, "Agricultural Farmland": 3620 },
    { year: 2021, "Built-Up Area": 532, "Agricultural Farmland": 3580 },
    { year: 2022, "Built-Up Area": 558, "Agricultural Farmland": 3530 },
    { year: 2023, "Built-Up Area": 588, "Agricultural Farmland": 3470 },
    { year: 2024, "Built-Up Area": 624, "Agricultural Farmland": 3410 },
  ];

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. HERO SECTION & AI RESEARCH ENTRY POINT */}
      <section className="pt-6 pb-2 text-center max-w-3xl mx-auto space-y-6">
        
        {/* Subtle Eyebrow */}
        <div className="inline-flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-800">
          <span>LAND GOVERNANCE</span>
          <span>•</span>
          <span>EVIDENCE</span>
          <span>•</span>
          <span>POLICY</span>
        </div>

        {/* Headline & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Turn land data into <span className="text-blue-600 dark:text-blue-400">policy insight.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            Discover research, connect geospatial evidence and explore transparent policy scenarios in one workspace.
          </p>
        </div>

        {/* Primary AI Research Input Box */}
        <div className="pt-2 text-left">
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 focus-within:border-blue-600 dark:focus-within:border-blue-500 rounded-2xl shadow-sm p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 transition"
          >
            <div className="flex items-center flex-1 pl-3 pr-2 py-1">
              <Search className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to understand about land governance?"
                className="w-full text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-1.5 shadow-xs transition flex-shrink-0"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Suggested Question Chips */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs">
            <span className="text-slate-400 text-[11px] mr-1">Suggested:</span>
            {sampleChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setSearchQuery(chip);
                  onNavigate("research", chip);
                }}
                className="text-[11px] bg-slate-100 dark:bg-slate-850 hover:bg-blue-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-800 transition"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Supporting Primary / Secondary Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button
            onClick={() => onNavigate("research")}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white px-4 py-2.5 rounded-lg flex items-center space-x-2 transition shadow-xs"
          >
            <Compass className="w-4 h-4 text-blue-400 dark:text-white" />
            <span>Ask a Research Question</span>
          </button>
          <button
            onClick={() => onNavigate("gis")}
            className="bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 px-4 py-2.5 rounded-lg flex items-center space-x-2 transition shadow-xs"
          >
            <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Explore GIS</span>
          </button>
          <button
            onClick={() => onNavigate("graph")}
            className="text-slate-600 dark:text-slate-400 hover:text-blue-700 dark:hover:text-blue-400 flex items-center space-x-1 transition ml-2 py-2"
          >
            <span>Explore Evidence Graph</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2. SUBTLE METRIC ROW (Option B - Not giant KPI cards) */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[12px] text-slate-500 dark:text-slate-400 font-medium flex flex-wrap items-center justify-center gap-3">
          <span>6 Peer-Reviewed Sources</span>
          <span>•</span>
          <span>4 Open Datasets</span>
          <span>•</span>
          <span>5 GIS Layers</span>
          <span>•</span>
          <span>20 Prototype Districts</span>
          <span>•</span>
          <button
            onClick={onStartDemoFlow}
            className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline flex items-center space-x-1"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Launch 5-Minute Tour</span>
          </button>
        </div>
      </section>

      {/* 3. QUICK ACTIONS (3 Clean, Spacious Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Quick Actions
          </h2>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Core Decision Journey</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Research */}
          <div
            onClick={() => onNavigate("research")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 rounded-xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  Research Intelligence
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Search indexed papers, government circulars and datasets with citation grounding.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-blue-600 dark:text-blue-400">
              <span>Find papers & policies</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: GIS Explorer */}
          <div
            onClick={() => onNavigate("gis")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 rounded-xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                  GIS Explorer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Inspect multi-temporal land cover, infrastructure corridor buffers and flood runoff zones.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
              <span>Explore land indicators</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Policy Lab */}
          <div
            onClick={() => onNavigate("simulator")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-400 dark:hover:border-purple-600 rounded-xl p-5 shadow-xs hover:shadow-md transition cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
                <Sliders className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition">
                  Policy Lab
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Test infrastructure expansion scenarios against baseline farmland and climate exposure.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-medium text-purple-600 dark:text-purple-400">
              <span>Test policy scenarios</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. RECENT / RECOMMENDED EVIDENCE (Max 3 Clean Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Recent & Recommended Evidence
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">Peer-reviewed studies and verified official reports</p>
          </div>
          <button
            onClick={() => onNavigate("knowledge")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>View all evidence</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate("research", "Impact of Expressway Corridors on Peri-Urban Agricultural Land-Use Dynamics")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                  Research Paper
                </span>
                <span className="text-[11px] text-slate-400 font-mono">2024</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                Impact of Expressway Corridors on Peri-Urban Farmland in Uttar Pradesh
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                Empirical assessment along Purvanchal & Lucknow expressways showing a 14.8% built-up expansion diverting 1,840 ha of double-cropped soil.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span className="truncate">NIUA & IIM Lucknow</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Verified</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate("knowledge")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
                  Government Report
                </span>
                <span className="text-[11px] text-slate-400 font-mono">2023</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                Digital Cadastral Modernization & Dispute Mitigation under DILRMP
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                Official DoLR audit demonstrating a 41% reduction in boundary demarcation litigation through spatial Record of Rights integration.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span className="truncate">Dept. of Land Resources</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Official Public</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate("knowledge")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 rounded-xl p-5 shadow-xs transition cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                  Legal Analysis
                </span>
                <span className="text-[11px] text-slate-400 font-mono">2022</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug">
                Fair Compensation & Linear Acquisition Lessons under RFCTLARR
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                Empirical study of 34 national infrastructure projects analyzing Social Impact Assessment (SIA) bottlenecks and compensation delays.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex justify-between items-center">
              <span className="truncate">National Law Review</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">Peer-Reviewed</span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FEATURED LAND INSIGHT (ONE Meaningful Visual Insight) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
              Featured Land Insight
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Peri-Urban Built-Up Pressure vs. Agricultural Topsoil
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
              Sentinel-2 & Bhuvan multi-temporal data reveals a steady 22.3% built-up expansion across target prototype districts over the last 5 years.
            </p>
          </div>
          <button
            onClick={() => onNavigate("gis")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1 flex-shrink-0"
          >
            <span>Inspect in GIS Explorer</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Single clean line chart */}
        <div className="h-64 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={featuredTrendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#fff", borderRadius: "8px", fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Line
                type="monotone"
                dataKey="Built-Up Area"
                stroke="#3b82f6"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Agricultural Farmland"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 6. RECENT WORKSPACE ACTIVITY (Subtle, Compact List) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Collaborative Projects
          </h2>
          <button
            onClick={() => onNavigate("workspace")}
            className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Open Workspace &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div
            onClick={() => onNavigate("workspace")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                State-wide Farmland Preservation & Peri-Urban Green Belts Strategy
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Lead: Prof. Ananya Sen • Geography: Uttar Pradesh & Maharashtra
              </p>
            </div>
            <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold px-2 py-0.5 rounded ml-3 flex-shrink-0">
              Active
            </span>
          </div>

          <div
            onClick={() => onNavigate("workspace")}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-slate-300 dark:hover:border-slate-700 transition cursor-pointer"
          >
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                SVAMITVA Property Card Economic Impact & Rural Mortgage Uptake
              </h4>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                Lead: Dr. Rajeshwar Sharma • Geography: Karnataka & Madhya Pradesh
              </p>
            </div>
            <span className="text-[10px] bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold px-2 py-0.5 rounded ml-3 flex-shrink-0">
              Under Review
            </span>
          </div>
        </div>
      </section>

    </div>
  );
};
