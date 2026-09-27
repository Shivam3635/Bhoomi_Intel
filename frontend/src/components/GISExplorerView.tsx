"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Layers,
  MapPin,
  Sliders,
  CheckSquare,
  Square,
  Info,
  ArrowRight,
  ShieldCheck,
  ChevronDown
} from "lucide-react";
import { api } from "@/lib/api";

const GISMap = dynamic(() => import("./GISMap").then((mod) => mod.GISMap), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[580px] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 text-xs">
      Loading interactive spatial engine...
    </div>
  ),
});

const DISTRICT_COORDS: Record<string, { center: [number, number]; state: string }> = {
  "Lucknow": { center: [26.8467, 80.9462], state: "Uttar Pradesh" },
  "Varanasi": { center: [25.3176, 82.9739], state: "Uttar Pradesh" },
  "Kanpur": { center: [26.4499, 80.3319], state: "Uttar Pradesh" },
  "Prayagraj": { center: [25.4358, 81.8463], state: "Uttar Pradesh" },
  "Pune": { center: [18.5204, 73.8567], state: "Maharashtra" },
  "Nagpur": { center: [21.1458, 79.0882], state: "Maharashtra" },
  "Thane": { center: [19.2183, 72.9781], state: "Maharashtra" },
  "Nashik": { center: [19.9975, 73.7898], state: "Maharashtra" },
  "Bengaluru Rural": { center: [13.2291, 77.5815], state: "Karnataka" },
  "Mysuru": { center: [12.2958, 76.6394], state: "Karnataka" },
  "Bhopal": { center: [23.2599, 77.4126], state: "Madhya Pradesh" },
  "Indore": { center: [22.7196, 75.8577], state: "Madhya Pradesh" },
  "Khordha": { center: [20.1809, 85.6212], state: "Odisha" },
  "Cuttack": { center: [20.4625, 85.8828], state: "Odisha" },
};

interface GISExplorerViewProps {
  onNavigate: (tab: string) => void;
  selectedDistrict?: string;
  selectedState?: string;
}

export const GISExplorerView: React.FC<GISExplorerViewProps> = ({
  onNavigate,
  selectedDistrict: propDistrict = "Lucknow",
  selectedState: propState = "Uttar Pradesh",
}) => {
  const [district, setDistrict] = useState(propDistrict);
  const [state, setState] = useState(propState);
  const [spatialProfile, setSpatialProfile] = useState<any>(null);

  const [activeLayers, setActiveLayers] = useState({
    land_use: true,
    infrastructure: true,
    climate_vulnerability: true,
    research_hotspot: true,
  });

  const toggleLayer = (layerKey: keyof typeof activeLayers) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.getDistrictProfile(state, district);
        setSpatialProfile(res);
      } catch (e) {
        console.warn("Spatial profile fallback:", e);
      }
    }
    loadProfile();
  }, [state, district]);

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    if (DISTRICT_COORDS[d]) {
      setState(DISTRICT_COORDS[d].state);
    }
  };

  const currentCoords = DISTRICT_COORDS[district]?.center || [26.8467, 80.9462];

  return (
    <div className="space-y-5">
      
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            GIS Spatial Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive multi-criteria spatial layer visualization across target districts.
          </p>
        </div>

        {/* State / District Pickers & Direct CTA */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={state}
            onChange={(e) => {
              const s = e.target.value;
              setState(s);
              const firstD = Object.keys(DISTRICT_COORDS).find((k) => DISTRICT_COORDS[k].state === s);
              if (firstD) setDistrict(firstD);
            }}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200"
          >
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Odisha">Odisha</option>
          </select>

          <select
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            className="bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 dark:text-slate-200"
          >
            {Object.keys(DISTRICT_COORDS)
              .filter((d) => DISTRICT_COORDS[d].state === state)
              .map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>

          <button
            onClick={() => onNavigate("simulator")}
            className="bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center space-x-1 shadow-xs transition ml-2"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400 dark:text-white" />
            <span>Simulate Scenarios</span>
          </button>
        </div>
      </div>

      {/* Map-First Layout: Left Controls (2.5 cols) + Center Map (7 cols) + Right Insight (2.5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* LEFT SIDEBAR: Layer Toggles & Legend (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Layer Toggles */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Spatial Layers
            </span>

            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => toggleLayer("land_use")}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                  activeLayers.land_use
                    ? "bg-red-50/60 dark:bg-red-950/40 border-red-200 dark:border-red-900/60 text-red-950 dark:text-red-300 font-medium"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <span>Land-Use (LULC)</span>
                </div>
                {activeLayers.land_use ? <CheckSquare className="w-3.5 h-3.5 text-red-600 dark:text-red-400" /> : <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
              </button>

              <button
                onClick={() => toggleLayer("infrastructure")}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                  activeLayers.infrastructure
                    ? "bg-blue-50/60 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60 text-blue-950 dark:text-blue-300 font-medium"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                  <span>Expressway Corridors</span>
                </div>
                {activeLayers.infrastructure ? <CheckSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
              </button>

              <button
                onClick={() => toggleLayer("climate_vulnerability")}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                  activeLayers.climate_vulnerability
                    ? "bg-amber-50/60 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60 text-amber-950 dark:text-amber-300 font-medium"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Climate Runoff Zones</span>
                </div>
                {activeLayers.climate_vulnerability ? <CheckSquare className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> : <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
              </button>

              <button
                onClick={() => toggleLayer("research_hotspot")}
                className={`w-full flex items-center justify-between p-2 rounded-lg border transition ${
                  activeLayers.research_hotspot
                    ? "bg-purple-50/60 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900/60 text-purple-950 dark:text-purple-300 font-medium"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600 dark:bg-purple-400" />
                  <span>Research Field Points</span>
                </div>
                {activeLayers.research_hotspot ? <CheckSquare className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> : <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />}
              </button>
            </div>
          </div>

          {/* Clean Legend */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-2 text-xs">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider block">
              Legend
            </span>
            <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span>Built-Up Infill</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Agricultural Farmland</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span>Expressway Alignment</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Runoff Vulnerability</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <strong>Spatial Note:</strong> Aligned with Bhuvan WMS & DILRMP cadastral reference standards.
          </div>
        </div>

        {/* CENTER: Map-First Canvas (6 or 7 cols) */}
        <div className="lg:col-span-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
            <GISMap
              center={currentCoords}
              zoom={11}
              district={district}
              state={state}
              activeLayers={activeLayers}
            />
          </div>
        </div>

        {/* RIGHT SIDEBAR: Contextual Insight Panel (3 cols) */}
        <div className="lg:col-span-3 space-y-4">
          {spatialProfile ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5 text-xs">
              <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  District Profile
                </span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {district}, {state}
                </h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Built-Up Area:</span>
                  <span className="font-bold text-blue-700 dark:text-blue-400">{spatialProfile.built_up_area_sqkm} sq km</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Farmland:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">{spatialProfile.agricultural_area_sqkm} sq km</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Infra Index:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{spatialProfile.infrastructure_index} / 100</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Climate Risk:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">{spatialProfile.climate_risk_score} / 100</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 dark:bg-slate-800/60 rounded border border-slate-100 dark:border-slate-800">
                  <span className="text-slate-500 dark:text-slate-400">Dispute Friction:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{spatialProfile.dispute_index} / 100</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => onNavigate("simulator")}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-xs flex items-center justify-center space-x-1.5 transition shadow-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Policy Impact</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 text-center text-slate-400 text-xs">
              Loading spatial telemetry...
            </div>
          )}

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs text-xs space-y-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
              Quick Downstream
            </span>
            <button
              onClick={() => onNavigate("graph")}
              className="w-full text-left text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 text-xs flex items-center justify-between p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <span>View In Evidence Graph</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button
              onClick={() => onNavigate("brief")}
              className="w-full text-left text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-400 text-xs flex items-center justify-between p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              <span>Generate Policy Brief</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
