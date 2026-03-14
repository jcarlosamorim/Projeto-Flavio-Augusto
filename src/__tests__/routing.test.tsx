import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock motion/react
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

// Mock useGeminiLive to avoid real API calls
vi.mock('../hooks/useGeminiLive', () => ({
  useGeminiLive: () => ({
    connectionState: 'idle' as const,
    isSpeaking: false,
    error: null,
    metrics: {
      currentStep: 0,
      rapport: 0,
      needsDiscovery: 0,
      valueProposition: 0,
      objectionHandling: 0,
      closingProbability: 0,
      feedback: '',
    },
    connect: vi.fn(),
    disconnect: vi.fn(),
    resetMetrics: vi.fn(),
    clearError: vi.fn(),
  }),
}));

function renderWithRoute(route: string, state?: Record<string, unknown>) {
  const entries = state
    ? [{ pathname: route, state }]
    : [route];

  return render(
    <MemoryRouter initialEntries={entries}>
      <App />
    </MemoryRouter>,
  );
}

describe('Routing', () => {
  it('should render Onboarding at /', () => {
    renderWithRoute('/');
    expect(screen.getByText('SalesMaster Onboarding')).toBeInTheDocument();
  });

  it('should render SessionView at /session (shows Onboarding when no product)', () => {
    renderWithRoute('/session');
    // SessionView without a product shows Onboarding
    expect(screen.getByText('SalesMaster Onboarding')).toBeInTheDocument();
  });

  it('should render ResultsScreen at /results when metrics state is provided', () => {
    const metrics = {
      currentStep: 2,
      rapport: 50,
      needsDiscovery: 40,
      valueProposition: 60,
      objectionHandling: 30,
      closingProbability: 45,
      feedback: 'Bom progresso.',
    };
    renderWithRoute('/results', { metrics });
    expect(screen.getByText('Resultado da Sessao')).toBeInTheDocument();
  });

  it('should redirect from /results to / when no metrics state', async () => {
    renderWithRoute('/results');
    // useEffect triggers navigate, which redirects to / showing Onboarding
    await waitFor(() => {
      expect(screen.getByText('SalesMaster Onboarding')).toBeInTheDocument();
    });
  });
});
