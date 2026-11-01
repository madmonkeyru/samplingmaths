import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { WelcomePage } from './WelcomePage';

describe('WelcomePage', () => {
  it('renders hero banner, quick MVP access, program cards, and regulations', () => {
    const onSelectProgram = vi.fn();
    const onEnterMvpMath = vi.fn();

    render(
      <WelcomePage
        onSelectProgram={onSelectProgram}
        onEnterMvpMath={onEnterMvpMath}
      />
    );

    // Hero title
    expect(
      screen.getByText('MEP Educación Abierta — Simulador & Práctica')
    ).toBeInTheDocument();

    // Prominent quick entry card for MVP
    expect(
      screen.getByText('Matemáticas BXM (Convocatoria 02-2026)')
    ).toBeInTheDocument();

    const enterMvpButton = screen.getByRole('button', {
      name: /Entrar al Hub de Matemáticas/i,
    });
    expect(enterMvpButton).toBeInTheDocument();
    fireEvent.click(enterMvpButton);
    expect(onEnterMvpMath).toHaveBeenCalledTimes(1);

    // Programs overview
    expect(screen.getByText('Programas de Educación Abierta')).toBeInTheDocument();
    expect(screen.getAllByText(/Bachillerato por Madurez Suficiente/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Bachillerato a distancia/i)).toBeInTheDocument();

    // Informational regulations banner
    expect(
      screen.getByText('Estructura y reglas de referencia curricular')
    ).toBeInTheDocument();
    expect(screen.getByText('Notas de Aprobación')).toBeInTheDocument();
    expect(screen.getByText('Directriz de Calculadoras')).toBeInTheDocument();
  });

  it('triggers onSelectProgram when a program card is clicked', () => {
    const onSelectProgram = vi.fn();
    const onEnterMvpMath = vi.fn();

    render(
      <WelcomePage
        onSelectProgram={onSelectProgram}
        onEnterMvpMath={onEnterMvpMath}
      />
    );

    const edadCard = screen.getByText(/Bachillerato a distancia/i).closest('div[role="button"]');
    expect(edadCard).toBeInTheDocument();

    if (edadCard) {
      fireEvent.click(edadCard);
      expect(onSelectProgram).toHaveBeenCalledWith('edad');
    }
  });
});
