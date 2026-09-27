"use client";

import React, { useEffect, useRef } from "react";
import L from "leaflet";

interface GISMapProps {
  center: [number, number];
  zoom: number;
  district: string;
  state: string;
  activeLayers: {
    land_use: boolean;
    infrastructure: boolean;
    climate_vulnerability: boolean;
    research_hotspot: boolean;
  };
}

export const GISMap: React.FC<GISMapProps> = ({
  center,
  zoom,
  district,
  state,
  activeLayers,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Fix default Leaflet icon paths
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      // Initialize map
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      // OpenStreetMap basemap tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | BHUMI-INTEL Spatial Core',
        maxZoom: 18,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView(center, zoom);
    }

    // Render spatial demo layers dynamically based on state
    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();

      const [lat, lon] = center;

      // 1. District Polygon Boundary
      const boundaryCoords: [number, number][] = [
        [lat - 0.22, lon - 0.22],
        [lat + 0.22, lon - 0.20],
        [lat + 0.24, lon + 0.18],
        [lat - 0.18, lon + 0.24],
        [lat - 0.22, lon - 0.22],
      ];
      const boundaryPoly = L.polygon(boundaryCoords, {
        color: "#1e3a8a",
        weight: 2.5,
        fillColor: "#3b82f6",
        fillOpacity: 0.08,
        dashArray: "4, 4",
      });
      boundaryPoly.bindPopup(`
        <div style="font-size: 12px; line-height: 1.4;">
          <strong style="color: #1e3a8a;">${district} District Boundary</strong><br/>
          <span>State: ${state}</span><br/>
          <span style="color: #64748b; font-size: 11px;">Status: Prototype / Synthetic Boundary</span>
        </div>
      `);
      layerGroupRef.current.addLayer(boundaryPoly);

      // 2. Land-Use / LULC Layer
      if (activeLayers.land_use) {
        // Built-up zone (orange/red)
        const builtUpPoly = L.polygon(
          [
            [lat - 0.08, lon - 0.08],
            [lat + 0.08, lon - 0.06],
            [lat + 0.09, lon + 0.08],
            [lat - 0.07, lon + 0.07],
          ],
          {
            color: "#dc2626",
            weight: 1.5,
            fillColor: "#ef4444",
            fillOpacity: 0.35,
          }
        ).bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #dc2626;">High-Density Built-Up Zone</strong><br/>
            <span>Classification: Urban Core & Commercial Infill</span><br/>
            <span>Land Pressure: High (82/100)</span>
          </div>
        `);
        layerGroupRef.current.addLayer(builtUpPoly);

        // Agricultural perimeter (green)
        const agriPoly = L.polygon(
          [
            [lat + 0.09, lon - 0.20],
            [lat + 0.21, lon - 0.15],
            [lat + 0.22, lon + 0.15],
            [lat + 0.10, lon + 0.08],
          ],
          {
            color: "#059669",
            weight: 1.5,
            fillColor: "#10b981",
            fillOpacity: 0.3,
          }
        ).bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #059669;">Prime Agricultural Farmland</strong><br/>
            <span>Classification: Double-Cropped Irrigated</span><br/>
            <span>Status: Sensitive to Corridor Diversion</span>
          </div>
        `);
        layerGroupRef.current.addLayer(agriPoly);
      }

      // 3. Infrastructure & Expressways (Blue line & corridor buffer)
      if (activeLayers.infrastructure) {
        const expresswayCoords: [number, number][] = [
          [lat - 0.25, lon - 0.18],
          [lat - 0.10, lon - 0.05],
          [lat + 0.05, lon + 0.08],
          [lat + 0.25, lon + 0.22],
        ];
        const expresswayLine = L.polyline(expresswayCoords, {
          color: "#2563eb",
          weight: 4,
          opacity: 0.9,
        }).bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #2563eb;">Arterial Expressway & Logistics Corridor</strong><br/>
            <span>Right-of-Way Buffer: 500m Protected Zone Recommended</span><br/>
            <span>Land Diversion Rate: +14.8% since 2018</span>
          </div>
        `);
        layerGroupRef.current.addLayer(expresswayLine);

        // Corridor Interchanges Markers
        const marker1 = L.circleMarker([lat - 0.10, lon - 0.05], {
          radius: 6,
          fillColor: "#3b82f6",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 1,
        }).bindPopup(`<strong>Interchange Node A</strong><br/>Logistics Park Zone`);
        layerGroupRef.current.addLayer(marker1);
      }

      // 4. Climate Vulnerability Layer (Amber/Teal runoff zone)
      if (activeLayers.climate_vulnerability) {
        const runoffZone = L.polygon(
          [
            [lat - 0.18, lon + 0.02],
            [lat - 0.10, lon + 0.12],
            [lat - 0.02, lon + 0.20],
            [lat - 0.12, lon + 0.18],
          ],
          {
            color: "#d97706",
            weight: 1.5,
            fillColor: "#f59e0b",
            fillOpacity: 0.35,
          }
        ).bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #d97706;">Hydrological Catchment & Flood Runoff Zone</strong><br/>
            <span>Runoff Vulnerability: Elevated (68/100)</span><br/>
            <span>Loss of Unpaved Percolation Area: 18.2%</span>
          </div>
        `);
        layerGroupRef.current.addLayer(runoffZone);
      }

      // 5. Research Hotspot Marker (Purple pin)
      if (activeLayers.research_hotspot) {
        const researchMarker = L.circleMarker([lat + 0.02, lon + 0.03], {
          radius: 8,
          fillColor: "#8b5cf6",
          color: "#ffffff",
          weight: 2,
          fillOpacity: 0.95,
        }).bindPopup(`
          <div style="font-size: 12px;">
            <strong style="color: #6d28d9;">Empirical Study Hotspot: IIM Lucknow & NIUA (2024)</strong><br/>
            <span>Title: Peri-Urban Agricultural Dynamics</span><br/>
            <span>Ground-truth surveyed cadastral plots: 140</span>
          </div>
        `);
        layerGroupRef.current.addLayer(researchMarker);
      }
    }
  }, [center, zoom, district, state, activeLayers]);

  return (
    <div className="relative w-full h-[520px] rounded-lg overflow-hidden border border-slate-300">
      <div ref={mapContainerRef} className="w-full h-full" />
      {/* Synthetic Data Stamp */}
      <div className="absolute bottom-2 left-2 z-[400] bg-slate-900/80 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded border border-slate-700 pointer-events-none">
        Prototype / Synthetic Spatial Data • For Demonstration
      </div>
    </div>
  );
};
