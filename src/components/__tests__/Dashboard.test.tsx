import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { SalesMetrics } from '../../types';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...rest } = props;
      void initial; void animate; void exit; void transition;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe('Dashboard', () => {
  const defaultMetrics: SalesMetrics = {
    currentStep: 0,
    rapport: 0,
    needsDiscovery: 0,
    valueProposition: 0,
    objectionHandling: 0,
    closingProbability: 0,
    feedback: '',
  };

  it('should render all 7 sales steps', () => {
    render(<Dashboard metrics={defaultMetrics} />);

    expect(screen.getByText('Preparação')).toBeInTheDocument();
    expect(screen.getByText('Abordagem')).toBeInTheDocument();
    expect(screen.getByText('Levantamento de Necessidades')).toBeInTheDocument();
    // "Proposta de Valor" appears twice (in steps and in metrics label),
    // so we verify at least one is present using getAllByText
    expect(screen.getAllByText('Proposta de Valor').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Negociação')).toBeInTheDocument();
    expect(screen.getByText('Fechamento')).toBeInTheDocument();
    expect(screen.getByText('Pós-Venda')).toBeInTheDocument();
  });

  it('should display closing probability percentage', () => {
    const metrics: SalesMetrics = { ...defaultMetrics, closingProbability: 75 };
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('should display metric labels and values', () => {
    const metrics: SalesMetrics = {
      ...defaultMetrics,
      rapport: 60,
      needsDiscovery: 40,
      valueProposition: 80,
      objectionHandling: 55,
    };
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText('Rapport')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('Levantamento')).toBeInTheDocument();
    expect(screen.getByText('40%')).toBeInTheDocument();
    expect(screen.getByText('Contorno de Objeções')).toBeInTheDocument();
    expect(screen.getByText('55%')).toBeInTheDocument();
  });

  it('should show default feedback message when no feedback is provided', () => {
    render(<Dashboard metrics={defaultMetrics} />);

    expect(screen.getByText('Aguardando interação para gerar insights...')).toBeInTheDocument();
  });

  it('should display custom feedback when provided', () => {
    const metrics: SalesMetrics = { ...defaultMetrics, feedback: 'Boa abordagem inicial!' };
    render(<Dashboard metrics={metrics} />);

    expect(screen.getByText('Boa abordagem inicial!')).toBeInTheDocument();
  });
});
