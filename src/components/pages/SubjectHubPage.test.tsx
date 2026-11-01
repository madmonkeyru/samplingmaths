import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { LandingPage, SubjectHubPage } from './LandingPage';
import { dataService } from '../../services/dataService';

afterEach(async () => {
  cleanup();
  await dataService.setProgram('bxm', undefined, '2026-c2');
});

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
    expect(screen.getByText('Programas')).toBeInTheDocument();
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();

    // Click Home breadcrumb
    fireEvent.click(screen.getByText('Bachillerato por Madurez Suficiente (BXM)'));
    expect(onNavigateHome).toHaveBeenCalledTimes(1);

    // Quick stats banner
    expect(screen.getByText('Matemáticas BXM (Convocatoria 02-2026)')).toBeInTheDocument();

    // Switch section tab to Especificaciones & Recursos
    fireEvent.click(screen.getByText('Especificaciones & Recursos'));

    // Subtabs in Resources view
    expect(screen.getByText('Temario')).toBeInTheDocument();
    expect(screen.getByText('Diccionario de Términos')).toBeInTheDocument();
    expect(screen.getByText('Fórmulas')).toBeInTheDocument();
  });

  it.each(['cico', 'iii_ciclo', 'edad'])(
    'renders usable subject structure when %s is active',
    async (programId) => {
      await dataService.setProgram(programId);

      render(
        <LandingPage
          currentUser={null}
          onStartSimulation={vi.fn()}
          onStartPractice={vi.fn()}
        />
      );

      expect(screen.getByRole('heading', { name: /Matemáticas/ })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: 'Recursos' })).toBeInTheDocument();
      fireEvent.click(screen.getByRole('tab', { name: 'Recursos' }));
      expect(screen.getByText('Recursos en preparación')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Ver asignaturas del programa' })).toBeInTheDocument();
      expect(document.querySelector('.animate-pulse')).toBeNull();
    }
  );
});
