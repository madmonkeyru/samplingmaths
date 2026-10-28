import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('renders mode entry cards for simulation and practice', () => {
    render(
      <LandingPage
        currentUser={null}
        onStartSimulation={vi.fn()}
        onStartPractice={vi.fn()}
      />
    );

    expect(screen.getByText('Prueba de Simulación')).toBeInTheDocument();
    expect(screen.getByText('Práctica por Área')).toBeInTheDocument();
    expect(screen.getByText('Práctica por Tema')).toBeInTheDocument();
  });
});
