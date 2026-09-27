"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Compass,
  Layers,
  Sliders,
  Briefcase,
  Home,
  MoreHorizontal,
  Share2,
  FileText,
  BookOpen,
  Database,
  Shield,
  Network,
  ChevronDown,
  UserCheck,
  CheckCircle2,
  Info,
  Sun,
  Moon
} from "lucide-react";
import { UserProfile } from "@/lib/types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DEMO_ROLES: UserProfile[] = [
  { id: "1", email: "policymaker@example.com", full_name: "Dr. Rajeshwar Sharma", role: "POLICYMAKER", organization: "NITI Aayog / MoRD Policy Cell" },
  { id: "2", email: "researcher@example.com", full_name: "Prof. Ananya Sen", role: "RESEARCHER", organization: "National Institute of Rural Development" },
  { id: "3", email: "admin@example.com", full_name: "System Administrator", role: "ADMIN", organization: "Department of Land Resources (DoLR)" },
  { id: "4", email: "official@example.com", full_name: "S. K. Verma, IAS", role: "GOVERNMENT_OFFICIAL", organization: "Revenue Department, Govt of UP" },
  { id: "5", email: "public@example.com", full_name: "Citizen User", role: "PUBLIC_USER", organization: "Public Research Consortium" },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  isDarkMode,
  toggleDarkMode,
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [demoTooltipOpen, setDemoTooltipOpen] = useState(false);

  const moreRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setMoreDropdownOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(event.target as Node)) {
        setRoleDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 5 Primary Navigation Items
  const primaryNav = [
    { id: "dashboard", label: "Home", icon: Home },
    { id: "research", label: "Research", icon: Compass },
    { id: "gis", label: "GIS Explorer", icon: Layers },
    { id: "simulator", label: "Policy Lab", icon: Sliders },
    { id: "workspace", label: "Workspace", icon: Briefcase },
  ];

  // Secondary Tools (Organized neatly inside More)
  const secondaryNav = [
    { id: "graph", label: "Evidence Graph", icon: Share2, desc: "Visual causal lineage from policy to outcome" },
    { id: "brief", label: "Policy Brief", icon: FileText, desc: "Automated 12-section decision papers" },
    { id: "knowledge", label: "Knowledge Hub", icon: BookOpen, desc: "Searchable research and policy document repository" },
    { id: "datasets", label: "Data Catalog", icon: Database, desc: "Harmonized satellite & cadastral datasets" },
    { id: "acquisition", label: "Land Acquisition", icon: Shield, desc: "RFCTLARR 2013 corridor progress tracking" },
    { id: "audit", label: "Audit & Provenance", icon: CheckCircle2, desc: "Model citations & cryptographic audit logs" },
    { id: "ecosystem", label: "External Ecosystem", icon: Network, desc: "DILRMP, Bhuvan & SVAMITVA adapters" },
  ];

  const isSecondaryActive = secondaryNav.some((item) => item.id === activeTab);

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 text-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* LEFT: Clean Brand Identity */}
        <div
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center space-x-3 cursor-pointer group select-none flex-shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-xs group-hover:bg-blue-500 transition">
            <Layers className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
              <span>BHUMI-INTEL</span>
            </div>
            <p className="text-[11px] text-slate-400 font-normal leading-none -mt-0.5 hidden sm:block">
              Evidence Intelligence for Land Governance
            </p>
          </div>
        </div>

        {/* CENTER: 5 Primary Items + More Dropdown */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? "bg-slate-800 text-white shadow-xs font-semibold"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {/* Contextual "More" Dropdown */}
          <div className="relative" ref={moreRef}>
            <button
              onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                isSecondaryActive || moreDropdownOpen
                  ? "bg-slate-800 text-white font-semibold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <span>More</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {moreDropdownOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  Specialized Modules
                </div>
                {secondaryNav.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMoreDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 flex items-start space-x-2.5 hover:bg-slate-800/80 transition ${
                        isActive ? "bg-slate-800 text-blue-300 font-medium" : "text-slate-200"
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`} />
                      <div>
                        <div className="font-medium text-slate-100">{item.label}</div>
                        <div className="text-[10px] text-slate-400 leading-tight">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* RIGHT: Dark Mode Toggle + Subtle Demo Mode + User Role */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={toggleDarkMode}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition cursor-pointer flex items-center justify-center"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300 transition" />
            )}
          </button>

          {/* Subtle Demo Badge with Tooltip */}
          <div className="relative hidden xs:block">
            <button
              onClick={() => setDemoTooltipOpen(!demoTooltipOpen)}
              onMouseEnter={() => setDemoTooltipOpen(true)}
              onMouseLeave={() => setDemoTooltipOpen(false)}
              className="inline-flex items-center space-x-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 text-slate-300 px-2 py-1 rounded text-[11px] font-medium transition cursor-help"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Demo Mode</span>
              <Info className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {demoTooltipOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-[11px] text-slate-300 shadow-xl z-50">
                <p className="font-semibold text-slate-100">Prototype Environment</p>
                <p className="mt-1 text-slate-400 leading-relaxed">
                  Demonstrates evidence intelligence using verified literature combined with calibrated prototype synthetic spatial data.
                </p>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative" ref={roleRef}>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 px-2.5 py-1 rounded-md text-xs transition"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
                {currentUser.full_name[0]}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-[11px] font-medium leading-none text-slate-200">{currentUser.full_name.split(" ")[0]}</div>
                <div className="text-[10px] text-emerald-400 font-mono leading-none mt-0.5">{currentUser.role}</div>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 ml-0.5" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700/80 rounded-xl shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-1.5 border-b border-slate-800 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona (RBAC Simulation)
                </div>
                {DEMO_ROLES.map((r) => (
                  <button
                    key={r.email}
                    onClick={() => {
                      setCurrentUser(r);
                      setRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-start space-x-2 hover:bg-slate-800 transition ${
                      currentUser.email === r.email ? "bg-slate-800/80 text-blue-300 font-medium" : "text-slate-200"
                    }`}
                  >
                    <UserCheck className={`w-3.5 h-3.5 mt-0.5 ${currentUser.email === r.email ? "text-blue-400" : "text-slate-500"}`} />
                    <div>
                      <div className="font-medium text-slate-100">{r.full_name}</div>
                      <div className="text-[10px] text-emerald-400 font-mono">{r.role}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[190px]">{r.organization}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 flex justify-around items-center h-14 px-2 text-[10px]">
        {primaryNav.slice(0, 4).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                isActive ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
        <button
          onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
          className={`flex flex-col items-center justify-center flex-1 py-1 ${
            isSecondaryActive || moreDropdownOpen ? "text-blue-400 font-semibold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <MoreHorizontal className="w-4 h-4 mb-0.5" />
          <span>More</span>
        </button>
      </div>
    </header>
  );
};
