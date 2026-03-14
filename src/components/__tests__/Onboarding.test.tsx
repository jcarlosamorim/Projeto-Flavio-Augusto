import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Onboarding } from '../Onboarding';
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

describe('Onboarding', () => {
  let onComplete: ReturnType<typeof vi.fn<(info: ProductInfo) => void>>;

  beforeEach(() => {
    onComplete = vi.fn<(info: ProductInfo) => void>();
  });

  it('should render the onboarding form with all fields', () => {
    render(<Onboarding onComplete={onComplete} />);

    expect(screen.getByText('SalesMaster Onboarding')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: Software de Gestão')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Descreva o que o produto faz/)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ex: 299,00 / mês')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Começar Roleplay/i })).toBeInTheDocument();
  });

  it('should disable the submit button when required fields are empty', () => {
    render(<Onboarding onComplete={onComplete} />);

    const button = screen.getByRole('button', { name: /Começar Roleplay/i });
    expect(button).toBeDisabled();
  });

  it('should enable the submit button when name and description are filled', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={onComplete} />);

    const nameInput = screen.getByPlaceholderText('Ex: Software de Gestão');
    const descInput = screen.getByPlaceholderText(/Descreva o que o produto faz/);

    await user.type(nameInput, 'My Product');
    await user.type(descInput, 'A great product description');

    const button = screen.getByRole('button', { name: /Começar Roleplay/i });
    expect(button).not.toBeDisabled();
  });

  it('should call onComplete with product info when form is submitted', async () => {
    const user = userEvent.setup();
    render(<Onboarding onComplete={onComplete} />);

    const nameInput = screen.getByPlaceholderText('Ex: Software de Gestão');
    const descInput = screen.getByPlaceholderText(/Descreva o que o produto faz/);
    const priceInput = screen.getByPlaceholderText('Ex: 299,00 / mês');

    await user.type(nameInput, 'Test Product');
    await user.type(descInput, 'Product description');
    await user.type(priceInput, '199.00');

    const button = screen.getByRole('button', { name: /Começar Roleplay/i });
    await user.click(button);

    expect(onComplete).toHaveBeenCalledWith({
      name: 'Test Product',
      description: 'Product description',
      price: '199.00',
    });
  });
});
