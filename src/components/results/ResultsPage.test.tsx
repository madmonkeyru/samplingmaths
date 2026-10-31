import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ResultsPage } from './ResultsPage';
import { TestSession } from '../../types';

describe('ResultsPage', () => {
  it('renders session summary score and retry buttons', () => {
    const mockSession: TestSession = {
      sessionId: 'sess-1',
      userId: 'u1',
      config: {
        mode: 'simulation',
        itemCount: 1,
        enableTimer: false,
        timerDurationMinutes: 30,
      },
      itemIds: [1],
      currentResponseIndex: 0,
      responses: {
        1: { itemId: 1, selectedOption: 'B', isCorrect: true },
      },
      flaggedItems: {},
      startTime: new Date().toISOString(),
      elapsedSeconds: 60,
      isCompleted: true,
    };

    render(
      <ResultsPage
        session={mockSession}
        onRetry={vi.fn()}
        onNewTest={vi.fn()}
        onGoHome={vi.fn()}
      />
    );

    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('1 Correctas')).toBeInTheDocument();
  });

  it('renders performance trend graph when multiple attempts exist', () => {
    // Pre-populate storage with an earlier attempt
    localStorage.setItem(
      'mep_ea_attempts',
      JSON.stringify([
        {
          id: 'prev-1',
          userId: 'u1',
          timestamp: new Date().toISOString(),
          mode: 'simulation',
          scopeText: 'Simulación Completa (60 ítems)',
          scorePercentage: 75,
          correctCount: 45,
          totalItems: 60,
          durationSeconds: 3600,
          responses: {},
        },
      ])
    );

    const mockSession: TestSession = {
      sessionId: 'sess-2',
      userId: 'u1',
      config: {
        mode: 'simulation',
        itemCount: 1,
        enableTimer: false,
        timerDurationMinutes: 30,
      },
      itemIds: [1],
      currentResponseIndex: 0,
      responses: {
        1: { itemId: 1, selectedOption: 'B', isCorrect: true },
      },
      flaggedItems: {},
      startTime: new Date().toISOString(),
      elapsedSeconds: 60,
      isCompleted: true,
    };

    render(
      <ResultsPage
        session={mockSession}
        onRetry={vi.fn()}
        onNewTest={vi.fn()}
        onGoHome={vi.fn()}
      />
    );

    expect(screen.getByText('Tendencia de Desempeño')).toBeInTheDocument();
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText('#2')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('supports global question navigator view and switching to single question detail view', async () => {
    const { fireEvent } = await import('@testing-library/react');

    const mockSession: TestSession = {
      sessionId: 'sess-nav',
      userId: 'u1',
      config: {
        mode: 'simulation',
        itemCount: 2,
        enableTimer: false,
        timerDurationMinutes: 30,
      },
      itemIds: [1, 2],
      currentResponseIndex: 0,
      responses: {
        1: { itemId: 1, selectedOption: 'B', isCorrect: true },
        2: { itemId: 2, selectedOption: 'A', isCorrect: false },
      },
      flaggedItems: {},
      startTime: new Date().toISOString(),
      elapsedSeconds: 120,
      isCompleted: true,
    };

    render(
      <ResultsPage
        session={mockSession}
        onRetry={vi.fn()}
        onNewTest={vi.fn()}
        onGoHome={vi.fn()}
      />
    );

    // Global view shows Question Navigator
    expect(screen.getByText('Navegador de Preguntas')).toBeInTheDocument();
    const btnQ1 = screen.getByRole('button', { name: /^1$/ });
    expect(btnQ1).toBeInTheDocument();

    // Click on Question 1 to enter Detail View
    fireEvent.click(btnQ1);

    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Volver a la vista general/i })).toBeInTheDocument();

    // Navigate to Question 2 via Siguiente
    const nextBtn = screen.getByRole('button', { name: /Siguiente/i });
    fireEvent.click(nextBtn);

    expect(screen.getByText('Pregunta 2 de 2')).toBeInTheDocument();

    // Return to Global View
    const backBtn = screen.getByRole('button', { name: /Volver a la vista general/i });
    fireEvent.click(backBtn);

    expect(screen.getByText('Navegador de Preguntas')).toBeInTheDocument();
  });
});
