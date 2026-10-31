import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LandingPage, SubjectHubPage } from './LandingPage';
import { dataService } from '../../services/dataService';

describe('SubjectHubPage', () => {
  it('renders breadcrumbs, quick stats, and allows switching to integrated resources view', async () => {
    await dataService.setProgram('bxm');
    const onStartSimulation = vi.fn();
    const onStartPractice = vi.fn();
    const onNavigateHome = vi.fn();

    render(
      <SubjectHubPage
        currentUser={null}
        onNavigateHome={onNavigateHome}
        onStartSimulation={onStartSimulation}
        onStartPractice={onStartPractice}
      />
    );

    // Breadcrumbs
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();

    // Click Home breadcrumb
    fireEvent.click(screen.getByRole('button', { name: /Inicio/i }));
    expect(onNavigateHome).toHaveBeenCalledTimes(1);

    // Quick stats banner
    expect(screen.getByText('Dashboard de Preparación')).toBeInTheDocument();

    // Switch section tab to Especificaciones & Recursos
    const resourcesTab = screen.getByRole('button', {
      name: /Especificaciones & Recursos/i,
    });
    fireEvent.click(resourcesTab);

    // Subtabs in Resources view
    expect(screen.getByRole('button', { name: /Tabla de Especificaciones/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Diccionario de Términos/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Fórmulas KaTeX/i })).toBeInTheDocument();
  });

  it('renders non-MVP notice when a non-bxm program like I&II Ciclo is active', async () => {
    await dataService.setProgram('cico');
    const onSwitchToBxm = vi.fn();

    render(
      <LandingPage
        currentUser={null}
        onStartSimulation={vi.fn()}
        onStartPractice={vi.fn()}
        onSwitchToBxm={onSwitchToBxm}
      />
    );

    expect(
      screen.getByText(/Programa en Fase de Preparación — I y II Ciclo/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Calculadora Prohibida/i)).toBeInTheDocument();

    const switchBtn = screen.getByRole('button', {
      name: /Ir a Matemáticas BXM \(MVP\)/i,
    });
    expect(switchBtn).toBeInTheDocument();
    fireEvent.click(switchBtn);
    expect(onSwitchToBxm).toHaveBeenCalledTimes(1);

    // Reset back to bxm
    await dataService.setProgram('bxm');
  });
});
