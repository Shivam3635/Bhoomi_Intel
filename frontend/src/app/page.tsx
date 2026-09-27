"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { EcosystemBanner } from "@/components/EcosystemBanner";
import { DashboardView } from "@/components/DashboardView";
import { ResearchAssistantView } from "@/components/ResearchAssistantView";
import { GISExplorerView } from "@/components/GISExplorerView";
import { PolicySimulatorView } from "@/components/PolicySimulatorView";
import { EvidenceGraphView } from "@/components/EvidenceGraphView";
import { PolicyBriefView } from "@/components/PolicyBriefView";
import { KnowledgeHubView } from "@/components/KnowledgeHubView";
import { DataCatalogView } from "@/components/DataCatalogView";
import { WorkspaceView } from "@/components/WorkspaceView";
import { LandAcquisitionView } from "@/components/LandAcquisitionView";
import { EcosystemView } from "@/components/EcosystemView";
import { AuditLogView } from "@/components/AuditLogView";
import { DemoWalkthroughModal } from "@/components/DemoWalkthroughModal";
import { UserProfile } from "@/lib/types";

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [researchQuery, setResearchQuery] = useState<string | undefined>(undefined);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "1",
    email: "policymaker@example.com",
    full_name: "Dr. Rajeshwar Sharma",
    role: "POLICYMAKER",
    organization: "NITI Aayog / MoRD Policy Cell",
  });

  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Initialize theme on client mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("bhumi_theme");
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("bhumi_theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("bhumi_theme", "light");
      }
      return next;
    });
  };

  const handleNavigate = (tab: string, initialQuery?: string) => {
    if (initialQuery) {
      setResearchQuery(initialQuery);
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-100 transition-colors duration-200">
      {/* Redesigned 64px Header with Dark Mode Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => handleNavigate(tab)}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
      />

      {/* Subtle Trust & Provenance Bar */}
      <EcosystemBanner />

      {/* Main Responsive Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigate={handleNavigate}
            onStartDemoFlow={() => setDemoModalOpen(true)}
          />
        )}

        {activeTab === "research" && (
          <ResearchAssistantView
            onNavigate={handleNavigate}
            initialQuery={researchQuery}
          />
        )}

        {activeTab === "gis" && (
          <GISExplorerView onNavigate={handleNavigate} />
        )}

        {activeTab === "simulator" && (
          <PolicySimulatorView onNavigate={handleNavigate} />
        )}

        {activeTab === "graph" && (
          <EvidenceGraphView onNavigate={handleNavigate} />
        )}

        {activeTab === "brief" && (
          <PolicyBriefView onNavigate={handleNavigate} />
        )}

        {activeTab === "knowledge" && (
          <KnowledgeHubView onNavigate={handleNavigate} />
        )}

        {activeTab === "datasets" && (
          <DataCatalogView onNavigate={handleNavigate} />
        )}

        {activeTab === "workspace" && (
          <WorkspaceView onNavigate={handleNavigate} />
        )}

        {activeTab === "acquisition" && (
          <LandAcquisitionView onNavigate={handleNavigate} />
        )}

        {activeTab === "ecosystem" && (
          <EcosystemView onNavigate={handleNavigate} />
        )}

        {activeTab === "audit" && (
          <AuditLogView onNavigate={handleNavigate} />
        )}
      </main>

      {/* Interactive 5-Minute Tour Guide Modal */}
      <DemoWalkthroughModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onNavigateTab={(tab) => handleNavigate(tab)}
      />

      {/* Clean, Professional Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 mt-auto mb-14 md:mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="font-semibold text-slate-200">
              BHUMI-INTEL — Evidence Intelligence for Land Governance
            </div>
            <p className="text-[11px] text-slate-400">
              Ministry of Rural Development • Department of Land Resources (DoLR) | Smart India Hackathon
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <span>Traceable AI Decision-Support Layer</span>
            <span>•</span>
            <span>Open Geospatial (OGC) Standards</span>
            <span>•</span>
            <button
              onClick={() => handleNavigate("audit")}
              className="text-slate-300 hover:text-white underline"
            >
              System Audit
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
