import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ResultsScreen } from '../ResultsScreen';
import { SalesMetrics } from '../../types';

// Mock motion/react to avoid animation issues in tests
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, style, ...rest } = props;
      void initial; void animate; void exit; void transition; void style;
      return <div {...rest}>{children}</div>;
    },
    header: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
      const { initial, animate, exit, transition, ...rest } = props;
      void initial; void animate; void exit; void transition;
      return <header {...rest}>{children}</header>;
    },
    polygon: (props: Record<string, unknown>) => {
      const { initial, animate, exit, transition, style, ...rest } = props;
      void initial; void animate; void exit; void transition; void style;
      return <polygon {...rest} />;
    },
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const sampleMetrics: SalesMetrics = {
  currentStep: 3,
  rapport: 75,
  needsDiscovery: 60,
  valueProposition: 80,
  objectionHandling: 50,
  closingProbability: 65,
  feedback: 'Boa abordagem, continue explorando as necessidades do cliente.',
};

function renderWithRouter(state: { metrics: SalesMetrics } | null) {
  const entries = state
    ? [{ pathname: '/results', state }]
    : [{ pathname: '/results' }];

  return render(
    <MemoryRouter initialEntries={entries}>
      <ResultsScreen />
    </MemoryRouter>,
  );
}

describe('ResultsScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('should redirect to / when no metrics state is provided', () => {
    renderWithRouter(null);
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('should display the results header', () => {
    renderWithRouter({ metrics: sampleMetrics });
    expect(screen.getByText('Resultado da Sessao')).toBeInTheDocument();
  });

  it('should show the reached sales step', () => {
    renderWithRouter({ metrics: sampleMetrics });
    // currentStep 3 = "Proposta de Valor" (0-indexed)
    expect(screen.getByText(/4\. Proposta de Valor/)).toBeInTheDocument();
  });

  it('should display all metric progress bars', () => {
    renderWithRouter({ metrics: sampleMetrics });
    expect(screen.getByText('Rapport')).toBeInTheDocument();
    expect(screen.getByText('Levantamento de Necessidades')).toBeInTheDocument();
    expect(screen.getByText('Proposta de Valor')).toBeInTheDocument();
    expect(screen.getByText('Contorno de Objeções')).toBeInTheDocument();
    expect(screen.getByText('Probabilidade de Fechamento')).toBeInTheDocument();
  });

  it('should display metric percentages', () => {
    renderWithRouter({ metrics: sampleMetrics });
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('60%')).toBeInTheDocument();
    expect(screen.getByText('80%')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('should display the feedback text', () => {
    renderWithRouter({ metrics: sampleMetrics });
    expect(screen.getByText('Boa abordagem, continue explorando as necessidades do cliente.')).toBeInTheDocument();
  });

  it('should show the performance badge', () => {
    renderWithRouter({ metrics: sampleMetrics });
    // Average is (75+60+80+50+65)/5 = 66, which is "Em Desenvolvimento"
    expect(screen.getByText('Em Desenvolvimento')).toBeInTheDocument();
  });

  it('should navigate to /session when "Nova Sessao" is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter({ metrics: sampleMetrics });

    const newSessionBtn = screen.getByRole('button', { name: /Nova Sessao/i });
    await user.click(newSessionBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/session');
  });

  it('should navigate to / when "Voltar ao Inicio" is clicked', async () => {
    const user = userEvent.setup();
    renderWithRouter({ metrics: sampleMetrics });

    const backBtn = screen.getByRole('button', { name: /Voltar ao Inicio/i });
    await user.click(backBtn);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should show "Excelente" badge when average is >= 70', () => {
    const highMetrics: SalesMetrics = {
      currentStep: 5,
      rapport: 90,
      needsDiscovery: 85,
      valueProposition: 80,
      objectionHandling: 75,
      closingProbability: 70,
      feedback: 'Excelente performance!',
    };
    renderWithRouter({ metrics: highMetrics });
    expect(screen.getByText('Excelente')).toBeInTheDocument();
  });

  it('should show "Precisa Melhorar" badge when average is < 40', () => {
    const lowMetrics: SalesMetrics = {
      currentStep: 0,
      rapport: 10,
      needsDiscovery: 20,
      valueProposition: 15,
      objectionHandling: 5,
      closingProbability: 10,
      feedback: 'Precisa praticar mais.',
    };
    renderWithRouter({ metrics: lowMetrics });
    expect(screen.getByText('Precisa Melhorar')).toBeInTheDocument();
  });
});
