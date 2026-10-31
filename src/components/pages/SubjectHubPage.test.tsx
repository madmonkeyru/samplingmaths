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
    expect(screen.getByText('Inicio')).toBeInTheDocument();
    expect(screen.getByText('Matemáticas')).toBeInTheDocument();

    // Click Home breadcrumb
    fireEvent.click(screen.getByText('Inicio'));
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
    'renders only the hub skeleton when %s is active',
    async (programId) => {
      await dataService.setProgram(programId);

      render(
        <LandingPage
          currentUser={null}
          onStartSimulation={vi.fn()}
          onStartPractice={vi.fn()}
        />
      );

      const skeleton = document.querySelector<HTMLElement>(
        '[aria-label="Hub curricular en preparación"]'
      );
      expect(skeleton).not.toBeNull();
      expect(skeleton?.querySelector('.animate-pulse')).not.toBeNull();
      expect(skeleton?.querySelector('button')).toBeNull();
      expect(skeleton?.textContent?.trim()).toBe('');
    }
  );
});
