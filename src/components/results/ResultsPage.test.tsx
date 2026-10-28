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
});
