import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TestShell } from './TestShell';
import { PracticeConfig } from '../../types';
import { ThemeProvider } from '../../context/ThemeContext';

import { fireEvent } from '@testing-library/react';

describe('TestShell', () => {
  it('renders question position indicator and timer', async () => {
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 5,
      enableTimer: true,
      timerDurationMinutes: 15,
    };

    render(
      <ThemeProvider>
        <TestShell config={config} onFinishTest={vi.fn()} />
      </ThemeProvider>
    );

    expect(await screen.findByText(/Pregunta 1 de 5/)).toBeInTheDocument();
  });

  it('handles keyboard shortcuts for option selection and navigation', async () => {
    const config: PracticeConfig = {
      mode: 'simulation',
      itemCount: 5,
      enableTimer: false,
      timerDurationMinutes: 15,
    };

    render(
      <ThemeProvider>
        <TestShell config={config} onFinishTest={vi.fn()} />
      </ThemeProvider>
    );

    expect(await screen.findByText(/Pregunta 1 de 5/)).toBeInTheDocument();

    // Select option A via key 'a'
    fireEvent.keyDown(window, { key: 'a' });

    // Navigate to next question via ArrowRight key
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(await screen.findByText(/Pregunta 2 de 5/)).toBeInTheDocument();

    // Toggle flag via key 'f'
    fireEvent.keyDown(window, { key: 'f' });
    expect(screen.getByText(/Marcada \[F\]/)).toBeInTheDocument();
  });

  it('opens formula modal and practice mode feedback', async () => {
    const config: PracticeConfig = {
      mode: 'area',
      area: 'geometry',
      itemCount: 5,
      enableTimer: false,
      timerDurationMinutes: 15,
    };

    render(
      <ThemeProvider>
        <TestShell config={config} onFinishTest={vi.fn()} />
      </ThemeProvider>
    );

    // Open formulas modal
    const formulaBtn = await screen.findByTitle('Ver fórmulas del examen');
    fireEvent.click(formulaBtn);
    expect(screen.getByText('Simbología y Fórmulas del Examen (BXM)')).toBeInTheDocument();

    // Close formulas modal
    fireEvent.click(screen.getByText('Cerrar Fórmulas'));
    expect(screen.queryByText('Simbología y Fórmulas del Examen (BXM)')).not.toBeInTheDocument();

    // Select option A
    fireEvent.click(screen.getByTitle(/Presiona A/));

    // Verify explanation button appears
    const verifyBtn = screen.getByText('Verificar respuesta y ver explicación');
    expect(verifyBtn).toBeInTheDocument();
    fireEvent.click(verifyBtn);

    expect(screen.getByText(/Respuesta/)).toBeInTheDocument();
  });
});
