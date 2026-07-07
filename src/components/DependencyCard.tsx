import React from "react";
import { DependencyAnalysis } from "../types";
import { CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from "lucide-react";

interface DependencyCardProps {
  analysis: DependencyAnalysis;
}

export default function DependencyCard({ analysis }: DependencyCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Óptimo
          </span>
        );
      case "good":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Bueno
          </span>
        );
      case "warning":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" /> Advertencia
          </span>
        );
      case "critical":
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <AlertCircle className="w-3.5 h-3.5" /> Crítico
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-zinc-500/10 text-zinc-400 border border-zinc-500/20">
            <HelpCircle className="w-3.5 h-3.5" /> Desconocido
          </span>
        );
    }
  };

  const getStatusBorder = (status: string) => {
    switch (status) {
      case "excellent": return "border-emerald-500/20";
      case "good": return "border-blue-500/20";
      case "warning": return "border-amber-500/20";
      case "critical": return "border-rose-500/20";
      default: return "border-zinc-800";
    }
  };

  return (
    <div id="dependency-card" className="space-y-6">
      {/* Header status panel */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-zinc-950/40 rounded-xl border ${getStatusBorder(analysis.status)}`}>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Estado de Dependencias</h4>
          <p className="text-zinc-200 text-sm">{analysis.details}</p>
        </div>
        <div className="shrink-0">
          {getStatusBadge(analysis.status)}
        </div>
      </div>

      {/* Dependencies List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-white uppercase tracking-wider">Análisis de Paquetes Clave</h4>
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="min-w-full divide-y divide-zinc-800 text-left">
            <thead className="bg-zinc-950/60 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-4">Paquete / Librería</th>
                <th className="p-4">Versión Detectada</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Recomendación / Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-sm text-zinc-300">
              {analysis.items && analysis.items.length > 0 ? (
                analysis.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-zinc-900/30 transition-colors">
                    <td className="p-4 font-mono font-medium text-white">{item.name}</td>
                    <td className="p-4 font-mono text-zinc-400">{item.version || "N/D"}</td>
                    <td className="p-4">{getStatusBadge(item.status)}</td>
                    <td className="p-4 text-zinc-300">{item.recommendation}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-zinc-500">
                    No se han cargado dependencias clave.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
