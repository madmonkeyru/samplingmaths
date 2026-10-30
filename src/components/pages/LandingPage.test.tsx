import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage } from './LandingPage';

describe('LandingPage', () => {
  it('renders combined mode widget with segmented control toggle and stacked performance/history widget', () => {
    const onStartSimulation = vi.fn();
    const onStartPractice = vi.fn();

    render(
      <LandingPage
        currentUser={null}
        onStartSimulation={onStartSimulation}
        onStartPractice={onStartPractice}
      />
    );

    // Header title
    expect(screen.getByText('Practicas y Simulaciones de Matemáticas BXM 2026 Convocatoria #2')).toBeInTheDocument();

    // Segmented tab buttons
    expect(screen.getByRole('button', { name: /^Simulación$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Por Área$/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Por Tema$/i })).toBeInTheDocument();

    // Stacked Widget elements
    expect(screen.getByText('Rendimiento')).toBeInTheDocument();
    expect(screen.getByText('Historial Reciente')).toBeInTheDocument();

    // Default active tab is simulation
    const startButton = screen.getByRole('button', { name: /Iniciar Simulación/i });
    expect(startButton).toBeInTheDocument();

    fireEvent.click(startButton);
    expect(onStartSimulation).toHaveBeenCalledTimes(1);

    // Switch tab to Por Área
    const areaTab = screen.getByRole('button', { name: /^Por Área$/i });
    fireEvent.click(areaTab);

    expect(screen.getByRole('button', { name: /Configurar Práctica por Área/i })).toBeInTheDocument();
  });
});
