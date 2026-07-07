import React, { useState } from "react";
import { CodeIssue } from "../types";
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, Copy, Check } from "lucide-react";

interface IssuesCardProps {
  issues: CodeIssue[];
}

export default function IssuesCard({ issues }: IssuesCardProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Severidad Alta
          </span>
        );
      case "medium":
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Severidad Media
          </span>
        );
      case "low":
        default:
        return (
          <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            <Info className="w-3.5 h-3.5" /> Severidad Baja
          </span>
        );
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const getSeverityBorder = (severity: string, isExpanded: boolean) => {
    if (!isExpanded) return "border-zinc-800 hover:border-zinc-700";
    switch (severity) {
      case "high": return "border-rose-500/30 bg-rose-500/5";
      case "medium": return "border-amber-500/30 bg-amber-500/5";
      default: return "border-zinc-700 bg-zinc-900/30";
    }
  };

  return (
    <div id="issues-card" className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Errores y Advertencias Encontrados</h4>
        <span className="text-xs text-zinc-400 font-medium">Se encontraron {issues ? issues.length : 0} problemas recomendados</span>
      </div>

      <div className="space-y-3">
        {issues && issues.length > 0 ? (
          issues.map((issue, idx) => {
            const isExpanded = expandedIdx === idx;
            return (
              <div 
                key={idx} 
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${getSeverityBorder(issue.severity, isExpanded)}`}
              >
                {/* Header / Clickable area */}
                <button
                  onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                  className="w-full text-left p-4 flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getSeverityBadge(issue.severity)}
                      {issue.file && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-zinc-850 text-zinc-300 border border-zinc-800">
                          {issue.file}
                        </span>
                      )}
                    </div>
                    <h5 className="text-base font-bold text-white">{issue.title}</h5>
                  </div>
                  <div className="shrink-0 text-zinc-400 hover:text-white p-1">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </button>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-zinc-800/60 pt-3 space-y-4">
                    <div className="space-y-1.5">
                      <h6 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Descripción del problema</h6>
                      <p className="text-sm text-zinc-200 leading-relaxed">{issue.description}</p>
                    </div>

                    {issue.fix && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h6 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                            Propuesta de Solución Recomendada
                          </h6>
                          <button
                            onClick={() => handleCopy(issue.fix || "", idx)}
                            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors bg-zinc-800/80 hover:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-700"
                          >
                            {copiedIdx === idx ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" /> Copiado!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copiar Código
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 rounded-lg bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre leading-5 max-h-96">
                          <code>{issue.fix}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center bg-zinc-900/20 border border-zinc-850 rounded-xl space-y-2">
            <Check className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="font-bold text-white">¡No se encontraron fallos críticos!</h5>
            <p className="text-sm text-zinc-400">El código cumple con todos los estándares básicos de confiabilidad y configuración.</p>
          </div>
        )}
      </div>
    </div>
  );
}
