"use client";

import React, { useState } from "react";
import {
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  X,
  Compass,
  Layers,
  Sliders,
  Share2,
  FileText,
  Activity,
  ShieldCheck
} from "lucide-react";

interface DemoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: string) => void;
}

const DEMO_STEPS = [
  {
    step: 1,
    tab: "dashboard",
    title: "Step 1: Executive Dashboard & Authentication",
    description: "Welcome to BHUMI-INTEL. You are logged in as Dr. Rajeshwar Sharma (POLICYMAKER, NITI Aayog / MoRD Policy Cell). Review high-level indicators across 5 states and 20 target districts.",
    actionText: "Proceed to Ask AI Research Assistant",
    nextTab: "research"
  },
  {
    step: 2,
    tab: "research",
    title: "Step 2: Ask the Core Policy Question",
    description: "Submit the primary research inquiry: 'What evidence exists about land-use change and infrastructure development in Lucknow?' The system retrieves peer-reviewed monographs and government reports with 100% traceable citations.",
    actionText: "Inspect Retrieved Citations & GIS Context",
    nextTab: "research"
  },
  {
    step: 3,
    tab: "gis",
    title: "Step 3: Multi-Layer Spatial GIS Exploration",
    description: "Switch to the GIS Explorer. Select Lucknow (Uttar Pradesh). Toggle between Sentinel-2 Land-Use, 500m Expressway Corridor Buffers, and Climate Watershed Runoff layers to visually evaluate agricultural conversion zones.",
    actionText: "Move to Policy Scenario Simulator",
    nextTab: "simulator"
  },
  {
    step: 4,
    tab: "simulator",
    title: "Step 4: Transparent Policy Scenario Simulation",
    description: "Test an active scenario: Urban Infrastructure Expansion. Compare Baseline (2024) vs Scenario A (+10%) vs Scenario B (+20% corridor density). Notice how agricultural exposure drops by 101.7 sq km while runoff risks elevate.",
    actionText: "Trace Lineage in Evidence Graph",
    nextTab: "graph"
  },
  {
    step: 5,
    tab: "graph",
    title: "Step 5: Visual Evidence Graph Lineage",
    description: "Inspect the complete evidence chain: Policy Mandate &rarr; Research Study &rarr; NRSC Dataset &rarr; GIS Buffer &rarr; Pressure Indicator &rarr; Simulation Model &rarr; Decision Outcome. Every link is clickable and verifiable.",
    actionText: "Generate Evidence-Based Policy Brief",
    nextTab: "brief"
  },
  {
    step: 6,
    tab: "brief",
    title: "Step 6: Automated 12-Section Policy Brief",
    description: "Generate the standardized executive briefing paper containing Executive Summary, Baseline Evidence, Comparative Projections, Risks, Recommended Interventions (TDR & 500m green belt), Assumptions, and Citations. Ready for Print or PDF export.",
    actionText: "Complete Demo & Return to Dashboard",
    nextTab: "dashboard"
  }
];

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = DEMO_STEPS[currentStepIdx];

  const handleNext = () => {
    onNavigateTab(currentStep.nextTab);
    if (currentStepIdx < DEMO_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevStep = DEMO_STEPS[currentStepIdx - 1];
      onNavigateTab(prevStep.tab);
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full bg-slate-900 border-2 border-emerald-500 rounded-xl shadow-2xl p-5 text-white animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <PlayCircle className="w-5 h-5 text-emerald-400" />
          <span className="font-bold text-sm tracking-tight">5-Minute Judge Demo Guide</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded border border-emerald-500/30">
            {currentStep.step} / {DEMO_STEPS.length}
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="py-3 space-y-2">
        <h4 className="text-sm font-bold text-emerald-300">{currentStep.title}</h4>
        <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
      </div>

      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={currentStepIdx === 0}
          className="text-xs text-slate-400 hover:text-white disabled:opacity-30 flex items-center space-x-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <button
          onClick={handleNext}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center space-x-1.5 transition shadow-sm"
        >
          <span>{currentStep.actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
