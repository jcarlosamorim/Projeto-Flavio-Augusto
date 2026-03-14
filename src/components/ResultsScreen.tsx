import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trophy, RotateCcw, Home, Target } from 'lucide-react';
import { SalesMetrics, SALES_STEPS } from '../types';
import { Card, CardBody, ProgressBar, Button, Badge } from './ui';
import { RadarChart } from './RadarChart';

interface LocationState {
  metrics: SalesMetrics;
}

const METRIC_LABELS: { key: keyof Pick<SalesMetrics, 'rapport' | 'needsDiscovery' | 'valueProposition' | 'objectionHandling' | 'closingProbability'>; label: string }[] = [
  { key: 'rapport', label: 'Rapport' },
  { key: 'needsDiscovery', label: 'Levantamento de Necessidades' },
  { key: 'valueProposition', label: 'Proposta de Valor' },
  { key: 'objectionHandling', label: 'Contorno de Objeções' },
  { key: 'closingProbability', label: 'Probabilidade de Fechamento' },
];

function getPerformanceLevel(avg: number): { label: string; variant: 'success' | 'warning' | 'danger' } {
  if (avg >= 70) return { label: 'Excelente', variant: 'success' };
  if (avg >= 40) return { label: 'Em Desenvolvimento', variant: 'warning' };
  return { label: 'Precisa Melhorar', variant: 'danger' };
}

export function ResultsScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const hasMetrics = !!state?.metrics;

  useEffect(() => {
    if (!hasMetrics) {
      navigate('/', { replace: true });
    }
  }, [hasMetrics, navigate]);

  if (!hasMetrics) {
    return null;
  }

  const { metrics } = state;
  const avg = Math.round(
    (metrics.rapport + metrics.needsDiscovery + metrics.valueProposition + metrics.objectionHandling + metrics.closingProbability) / 5
  );
  const performance = getPerformanceLevel(avg);
  const reachedStep = SALES_STEPS[metrics.currentStep] ?? SALES_STEPS[0];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 pt-8"
        >
          <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Trophy className="text-zinc-950 w-9 h-9" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Resultado da Sessao</h1>
          <div className="flex items-center justify-center gap-3">
            <Badge variant={performance.variant}>{performance.label}</Badge>
            <span className="text-zinc-500 text-sm">Media geral: {avg}%</span>
          </div>
        </motion.header>

        {/* Step reached */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardBody className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
                <Target className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">Passo Alcancado</p>
                <p className="text-lg font-bold text-zinc-100">
                  {metrics.currentStep + 1}. {reachedStep}
                  <span className="text-zinc-500 text-sm font-normal ml-2">de {SALES_STEPS.length} passos</span>
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Metrics breakdown */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardBody className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Detalhamento de Metricas</h2>
              {METRIC_LABELS.map(({ key, label }) => (
                <ProgressBar key={key} label={label} value={metrics[key]} showPercentage />
              ))}
            </CardBody>
          </Card>
        </motion.div>

        {/* Radar-style visual */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardBody>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-6">Visao Geral</h2>
              <div className="flex justify-center">
                <RadarChart metrics={metrics} />
              </div>
            </CardBody>
          </Card>
        </motion.div>

        {/* Feedback */}
        {metrics.feedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardBody>
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Feedback Final</h2>
                <p className="text-sm text-zinc-300 leading-relaxed italic">{metrics.feedback}</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 pb-12"
        >
          <Button variant="primary" size="lg" className="flex-1 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2" onClick={() => navigate('/session')}>
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Nova Sessao
          </Button>
          <Button variant="secondary" size="lg" className="flex-1 focus-visible:outline-2 focus-visible:outline-emerald-500 focus-visible:outline-offset-2" onClick={() => navigate('/')}>
            <Home className="w-4 h-4" aria-hidden="true" />
            Voltar ao Inicio
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
