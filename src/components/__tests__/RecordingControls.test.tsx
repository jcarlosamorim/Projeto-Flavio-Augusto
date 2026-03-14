import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecordingControls } from '../RecordingControls';
import { ProductInfo } from '../../types';

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

describe('RecordingControls', () => {
  const product: ProductInfo = {
    name: 'CRM Enterprise',
    description: 'Best CRM solution',
    price: '499.00',
  };

  const defaultProps = { connectionState: 'idle' as const, isSpeaking: false, isMicDenied: false, product };

  it('should render the idle state when not connected', () => {
    render(<RecordingControls {...defaultProps} />);

    expect(screen.getByText('Pronto para Começar?')).toBeInTheDocument();
    expect(screen.getByText(/Clique no botão acima/)).toBeInTheDocument();
  });

  it('should render the active listening state', () => {
    render(<RecordingControls {...defaultProps} connectionState="active" />);

    expect(screen.getByText('Simulação Ativa')).toBeInTheDocument();
    expect(screen.getByText(/Fale naturalmente com o cliente/)).toBeInTheDocument();
    expect(screen.getByText('IA Ouvindo')).toBeInTheDocument();
  });

  it('should render the speaking state when IA is responding', () => {
    render(<RecordingControls {...defaultProps} connectionState="active" isSpeaking={true} />);

    expect(screen.getByText('Simulação Ativa')).toBeInTheDocument();
    expect(screen.getByText(/A IA está respondendo/)).toBeInTheDocument();
    expect(screen.getByText('IA Falando...')).toBeInTheDocument();
  });

  it('should render the connecting state', () => {
    render(<RecordingControls {...defaultProps} connectionState="connecting" />);

    expect(screen.getByText('Conectando...')).toBeInTheDocument();
    expect(screen.getByText(/Estabelecendo conexão/)).toBeInTheDocument();
  });

  it('should render the error state', () => {
    render(<RecordingControls {...defaultProps} connectionState="error" />);

    expect(screen.getByText('Erro na conexão')).toBeInTheDocument();
    expect(screen.getByText(/Não foi possível conectar/)).toBeInTheDocument();
  });

  it('should render mic denied state with instructions', () => {
    render(<RecordingControls {...defaultProps} connectionState="error" isMicDenied={true} />);

    expect(screen.getByText('Microfone Necessário')).toBeInTheDocument();
    expect(screen.getByText('Microfone Bloqueado')).toBeInTheDocument();
    expect(screen.getByText(/acesso ao microfone foi negado/)).toBeInTheDocument();
  });

  it('should display the product name and price', () => {
    render(<RecordingControls {...defaultProps} />);

    expect(screen.getByText('CRM Enterprise')).toBeInTheDocument();
    expect(screen.getByText('R$ 499.00')).toBeInTheDocument();
  });

  it('should have accessible aside landmark', () => {
    const { container } = render(<RecordingControls {...defaultProps} />);

    const aside = container.querySelector('aside');
    expect(aside).toBeInTheDocument();
    expect(aside).toHaveAttribute('aria-label', 'Controles de gravação');
  });

  it('should announce status changes with aria-live', () => {
    render(<RecordingControls {...defaultProps} connectionState="active" />);

    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
});
