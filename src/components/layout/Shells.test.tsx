import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PublicShell } from './PublicShell';
import { LearnerShell } from './LearnerShell';
import { LearnerProvider } from '../../context/LearnerContext';
import { ThemeProvider } from '../../context/ThemeContext';
import type { AppRoute } from '../../services/navigation';

describe('PublicShell and LearnerShell architecture', () => {
  const publicRoute: AppRoute = { view: 'landing' };
  const learnerRoute: AppRoute = {
    view: 'learning',
    programId: 'bxm',
    subjectId: 'matematicas',
    convocatoriaId: '2026-c2',
    tab: 'inicio',
  };

  it('renders PublicShell with official public navigation links', () => {
    const onNavigate = vi.fn();
    render(
      <ThemeProvider>
        <LearnerProvider>
          <PublicShell currentRoute={publicRoute} onNavigate={onNavigate}>
            <div>Public Content</div>
          </PublicShell>
        </LearnerProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('Portal Oficial y Recursos')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Programas' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Calendario' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Guía y recursos' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Acerca de / FAQ' })).toBeInTheDocument();
    expect(screen.getByText('Public Content')).toBeInTheDocument();
  });

  it('renders LearnerShell with 4 academic pillars plus Mi progreso', () => {
    const onNavigate = vi.fn();
    render(
      <ThemeProvider>
        <LearnerProvider>
          <LearnerShell currentRoute={learnerRoute} onNavigate={onNavigate}>
            <div>Learner Content</div>
          </LearnerShell>
        </LearnerProvider>
      </ThemeProvider>
    );

    expect(screen.getByText('Espacio de Estudio · Matemáticas BXM')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Inicio' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aprender' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Practicar' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Simular' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mi progreso' })).toBeInTheDocument();
    expect(screen.getByText('Learner Content')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Practicar' }));
    expect(onNavigate).toHaveBeenCalledWith(
      expect.objectContaining({ view: 'learning', tab: 'practice' })
    );
  });
});
