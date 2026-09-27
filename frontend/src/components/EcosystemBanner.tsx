import React from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export const EcosystemBanner: React.FC = () => {
  return (
    <div className="bg-slate-100/80 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 px-4 py-1.5 text-[11px] text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
          <span>Evidence traceable to source publications & cadastral records</span>
        </div>
        <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
          <span>Calibrated prototype demo data</span>
        </div>
      </div>
    </div>
  );
};
