import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TestShell } from './TestShell';
import { PracticeConfig } from '../../types';

describe('TestShell', () => {
  it('renders question position indicator and timer', async () => {
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 5,
      enableTimer: true,
      timerDurationMinutes: 15,
    };

    render(<TestShell config={config} onFinishTest={vi.fn()} />);

    expect(await screen.findByText(/Pregunta 1 de 5/)).toBeInTheDocument();
  });
});
