import { useMemo } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, MessageSquare } from 'lucide-react';
import { SalesMetrics, SALES_STEPS } from '../types';

export function Dashboard({ metrics }: { metrics: SalesMetrics }) {
  const metricsGrid = useMemo(() => [
    { label: 'Rapport', value: metrics.rapport },
    { label: 'Levantamento', value: metrics.needsDiscovery },
    { label: 'Proposta de Valor', value: metrics.valueProposition },
    { label: 'Contorno de Objeções', value: metrics.objectionHandling },
  ], [metrics.rapport, metrics.needsDiscovery, metrics.valueProposition, metrics.objectionHandling]);

  const gaugeOffset = useMemo(() => 364 - (364 * metrics.closingProbability) / 100, [metrics.closingProbability]);

  const isEmptyState = metrics.currentStep === 0 && metrics.closingProbability === 0 && metricsGrid.every(m => m.value === 0);

  return (
    <section aria-label="Dashboard de métricas" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Progress Steps */}
      <div className="col-span-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" aria-hidden="true" />
          Metodologia 7 Passos (Flavio Augusto)
        </h2>
        <div className="flex flex-wrap gap-4 justify-between">
          {SALES_STEPS.map((step, idx) => (
            <div key={step} className="flex flex-col items-center gap-2 min-w-[100px]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                metrics.currentStep > idx ? 'bg-emerald-500 text-zinc-950' :
                metrics.currentStep === idx ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500 ring-4 ring-emerald-500/10' :
                'bg-zinc-800 text-zinc-500'
              }`}>
                {idx + 1}
              </div>
              <span className={`text-[10px] font-medium text-center max-w-[80px] ${
                metrics.currentStep === idx ? 'text-emerald-500' : 'text-zinc-500'
              }`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Probability Gauge */}
      <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between ${isEmptyState ? 'opacity-50' : ''}`}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Probabilidade de Fechamento</h2>
        <div className="relative h-32 flex items-center justify-center">
          <svg className="w-32 h-32 transform -rotate-90" role="img" aria-label={`Probabilidade de fechamento: ${metrics.closingProbability}%`}>
            <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-800" />
            <circle
              cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={gaugeOffset}
              className="text-emerald-500 transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center" role="status" aria-live="polite">
            <span className="text-3xl font-bold">{metrics.closingProbability}%</span>
            {isEmptyState && <span className="text-[10px] text-zinc-500 mt-1">Aguardando sessão</span>}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className={`bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 space-y-4 ${isEmptyState ? 'opacity-50' : ''}`}>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Indicadores de Performance</h2>
        {metricsGrid.map(m => (
          <div key={m.label} className="space-y-1">
            <div className="flex justify-between text-[10px] font-medium uppercase tracking-wider">
              <span className="text-zinc-400">{m.label}</span>
              <span className="text-emerald-500" aria-live="polite">{m.value}%</span>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden" role="progressbar" aria-valuenow={m.value} aria-valuemin={0} aria-valuemax={100} aria-label={m.label}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Realtime Feedback */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" aria-hidden="true" />
          Feedback em Tempo Real
        </h2>
        <div className="flex-1 text-sm text-zinc-300 italic leading-relaxed" role="status" aria-live="polite">
          {metrics.feedback || "Aguardando interação para gerar insights..."}
        </div>
      </div>
    </section>
  );
}
