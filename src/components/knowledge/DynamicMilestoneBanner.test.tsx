import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DynamicMilestoneBanner } from './DynamicMilestoneBanner';
import { OfficialCalendar } from './OfficialCalendar';
import { ProgramSchedulesOverview } from './ProgramSchedulesOverview';

describe('DynamicMilestoneBanner & ProgramSchedulesOverview', () => {
  it('renders BXM math milestones with Costa Rica timezone note and links', () => {
    render(
      <DynamicMilestoneBanner
        programId="bxm"
        convocatoriaId="2026-c2"
        subjectFilter="Matemáticas"
      />
    );

    expect(screen.getByText(/Hitos y Fechas Oficiales MEP/)).toBeInTheDocument();
    expect(screen.getByText(/Matrícula/)).toBeInTheDocument();
    expect(screen.getByText(/Sedes/)).toBeInTheDocument();
    expect(screen.getByText(/Examen Matemáticas/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Aviso DGEC/i })).toHaveAttribute('href', expect.stringContaining('pdf'));
  });

  it('renders multiprogram schedule overview comparing programs', () => {
    render(<ProgramSchedulesOverview />);

    expect(screen.getByText(/Cronograma.*Pruebas y Matrícula/)).toBeInTheDocument();
    expect(screen.getByText(/Bachillerato por Madurez Suficiente/)).toBeInTheDocument();
    expect(screen.getByText(/Educación Diversificada a Distancia/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /III Ciclo/ })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /I y II Ciclo/ })).toBeInTheDocument();
  });
});


it('filters calendar cards by event type and resets filters', () => {
  render(<OfficialCalendar initialProgram="bxm" initialConvocatoria="2026-c2" />);
  fireEvent.change(screen.getByLabelText('Tipo de evento'), { target: { value: 'exam' } });
  expect(screen.queryByRole('heading', { name: /Inscripción ·/ })).not.toBeInTheDocument();
  expect(screen.getAllByRole('heading', { name: /Aplicación de pruebas/ })).toHaveLength(3);
  fireEvent.click(screen.getByRole('button', { name: 'Restablecer filtros' }));
  expect(screen.getByLabelText('Programa')).toHaveValue('');
  expect(screen.getAllByRole('heading', { name: /Inscripción ·/ }).length).toBeGreaterThan(0);
});

it('opens schedule details in place and returns to the program overview', () => {
  render(<ProgramSchedulesOverview />);
  fireEvent.click(screen.getByRole('button', { name: 'Explorar fechas · BXM' }));
  expect(screen.getByLabelText('Programa')).toHaveValue('bxm');
  fireEvent.click(screen.getByRole('button', { name: '← Comparar programas' }));
  expect(screen.getByRole('button', { name: 'Explorar fechas · EDAD' })).toBeInTheDocument();
});

it('supports switching between grid and timeline view and filtering by program pills', () => {
  render(<OfficialCalendar initialConvocatoria="2026-c2" />);

  // View mode toggle
  const timelineBtn = screen.getByRole('button', { name: 'Cronograma' });
  fireEvent.click(timelineBtn);
  expect(timelineBtn).toHaveAttribute('aria-pressed', 'true');

  const gridBtn = screen.getByRole('button', { name: 'Cuadrícula' });
  fireEvent.click(gridBtn);
  expect(gridBtn).toHaveAttribute('aria-pressed', 'true');

  // Program quick pill
  fireEvent.click(screen.getByRole('button', { name: 'Bachillerato por Madurez' }));
  expect(screen.getByLabelText('Programa')).toHaveValue('bxm');

  // Unselect / All pill
  fireEvent.click(screen.getByRole('button', { name: 'Todos' }));
  expect(screen.getByLabelText('Programa')).toHaveValue('');
});
