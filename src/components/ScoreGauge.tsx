import React from "react";
import { RepoScores } from "../types";

interface ScoreGaugeProps {
  scores: RepoScores;
}

export default function ScoreGauge({ scores }: ScoreGaugeProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-400 stroke-emerald-400";
    if (score >= 70) return "text-amber-400 stroke-amber-400";
    return "text-rose-400 stroke-rose-400";
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 70) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excelente";
    if (score >= 80) return "Muy Bueno";
    if (score >= 70) return "Aceptable";
    return "Necesita Mejoras";
  };

  // SVG parameters
  const size = 180;
  const strokeWidth = 14;
  const center = size / 2;
  const radius = center - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scores.overall / 100) * circumference;

  return (
    <div id="score-gauge-container" className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 shadow-xl">
      {/* Circle Gauge */}
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            className="stroke-zinc-800"
            fill="transparent"
            strokeWidth={strokeWidth}
            r={radius}
            cx={center}
            cy={center}
          />
          {/* Progress circle */}
          <circle
            className={`transition-all duration-1000 ease-out ${getScoreColor(scores.overall)}`}
            fill="transparent"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            r={radius}
            cx={center}
            cy={center}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-5xl font-extrabold tracking-tight text-white">{scores.overall}</span>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest mt-1">Puntos</span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="flex-1 w-full space-y-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-lg font-bold text-white tracking-tight">Evaluación General</h3>
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${getScoreBg(scores.overall)}`}>
              {getScoreLabel(scores.overall)}
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Puntuación ponderada en base a la arquitectura, modernidad de librerías, cobertura de pruebas y legibilidad.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Dependencias */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">Dependencias</span>
              <span className={scores.dependencies >= 80 ? "text-emerald-400" : scores.dependencies >= 70 ? "text-amber-400" : "text-rose-400"}>{scores.dependencies}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${scores.dependencies >= 85 ? "bg-emerald-500" : scores.dependencies >= 70 ? "bg-amber-500" : "bg-rose-500"}`} 
                style={{ width: `${scores.dependencies}%` }}
              />
            </div>
          </div>

          {/* Legibilidad */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">Legibilidad</span>
              <span className={scores.legibility >= 80 ? "text-emerald-400" : scores.legibility >= 70 ? "text-amber-400" : "text-rose-400"}>{scores.legibility}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${scores.legibility >= 85 ? "bg-emerald-500" : scores.legibility >= 70 ? "bg-amber-500" : "bg-rose-500"}`} 
                style={{ width: `${scores.legibility}%` }}
              />
            </div>
          </div>

          {/* Pruebas */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">Pruebas (Tests)</span>
              <span className={scores.tests >= 80 ? "text-emerald-400" : scores.tests >= 70 ? "text-amber-400" : "text-rose-400"}>{scores.tests}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${scores.tests >= 85 ? "bg-emerald-500" : scores.tests >= 70 ? "bg-amber-500" : "bg-rose-500"}`} 
                style={{ width: `${scores.tests}%` }}
              />
            </div>
          </div>

          {/* Confiabilidad */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-zinc-300">Confiabilidad</span>
              <span className={scores.reliability >= 80 ? "text-emerald-400" : scores.reliability >= 70 ? "text-amber-400" : "text-rose-400"}>{scores.reliability}%</span>
            </div>
            <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${scores.reliability >= 85 ? "bg-emerald-500" : scores.reliability >= 70 ? "bg-amber-500" : "bg-rose-500"}`} 
                style={{ width: `${scores.reliability}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
