import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { App } from './App';
import { ThemeProvider } from './context/ThemeContext';
import { dataService } from './services/dataService';

afterEach(async () => {
  cleanup();
  localStorage.clear();
  window.history.replaceState(null, '', '/');
  await dataService.setProgram('bxm', undefined, '2026-c2');
});

function mount(hash = '#/') {
  window.history.replaceState(null, '', hash);
  render(<ThemeProvider><App /></ThemeProvider>);
}

describe('application curriculum flows', () => {
  it.each(dataService.getPrograms())('navigates entry → programs → $id → subject → program', async program => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Ver Planes y Programas' }));
    await screen.findByRole('heading', { name: 'Programas de Educación Abierta' });
    fireEvent.click(screen.getByRole('button', { name: new RegExp(program.name.replace(/[()]/g, '\\$&')) }));
    await screen.findByRole('heading', { name: 'Elige una asignatura' });
    const subjects = screen.getByRole('region', { name: 'Asignaturas del programa' });
    expect(within(subjects).getAllByRole('button')).toHaveLength(program.subjects.length);
    fireEvent.click(within(subjects).getByRole('button', { name: /Español/ }));
    await screen.findByRole('heading', { name: `Español · ${program.name}` });
    expect(window.location.hash).toContain(`/programas/${program.id}/espanol`);
    expect(dataService.getCurrentSubjectId()).toBe('espanol');
    expect(dataService.getAllItems()).toEqual([]);
    expect(screen.getByRole('button', { name: 'Iniciar práctica · Próximamente' })).toBeDisabled();
    fireEvent.click(screen.getByRole('tab', { name: 'Recursos' }));
    expect(screen.getByRole('heading', { name: 'Recursos en preparación' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ver asignaturas del programa' }));
    await screen.findByRole('heading', { name: 'Elige una asignatura' });
  });

  it('restores a direct EDAD route, changes its context, and clears the module when switching to CICO', async () => {
    mount('#/programas/edad/matematicas?nivel=EDAD_2&convocatoria=2026-c1');
    await screen.findByRole('heading', { name: 'Matemáticas · EDAD' });
    expect(screen.getByLabelText('Nivel o parte')).toHaveValue('EDAD_2');
    fireEvent.change(screen.getByLabelText('Nivel o parte'), { target: { value: 'EDAD_1' } });
    await waitFor(() => expect(dataService.getCurrentSubprogramId()).toBe('EDAD_1'));
    await screen.findByRole('heading', { name: 'Matemáticas · EDAD' });
    fireEvent.click(screen.getByTitle('Cambiar programa oficial MEP'));
    fireEvent.click(screen.getByRole('button', { name: /I y II Ciclo CICO/ }));
    await screen.findByRole('heading', { name: 'Matemáticas · I y II Ciclo CICO' });
    expect(screen.queryByLabelText('Nivel o parte')).not.toBeInTheDocument();
    expect(dataService.getCurrentSubprogramId()).toBeUndefined();
    expect(screen.getByLabelText('Convocatoria de referencia')).toHaveValue('2026-c1');
    expect(screen.getByText('Calculadora prohibida')).toBeInTheDocument();
  });

  it('keeps BXM practice functional and previews an unpublished convocatoria', async () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Ingresar al Hub BXM' }));
    await screen.findByRole('button', { name: 'Iniciar Simulación' });
    expect(dataService.getAllItems().length).toBeGreaterThan(0);
    fireEvent.change(screen.getByLabelText('Convocatoria de referencia'), { target: { value: '2026-c1' } });
    await screen.findByRole('heading', { name: 'Banco de preguntas en preparación' });
    expect(screen.getByRole('button', { name: 'Iniciar simulación · Próximamente' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Practicar Matemáticas BXM' }));
    await screen.findByRole('button', { name: 'Iniciar Simulación' });
    expect(dataService.getCurrentConvocatoriaId()).toBe('2026-c2');
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar Simulación' }));
    await screen.findByText('Pregunta 1 de 60');
    expect(screen.queryByTitle('Cambiar programa oficial MEP')).not.toBeInTheDocument();
    fireEvent.click(screen.getByText('Finalizar'));
    fireEvent.click(screen.getByText('Sí, entregar'));
    await screen.findByText('Reintentar');
    fireEvent.click(screen.getByText('Reintentar'));
    await screen.findByText('Pregunta 1 de 60');
    fireEvent.click(screen.getByText('Finalizar'));
    fireEvent.click(screen.getByText('Sí, entregar'));
    await screen.findByText('Nueva Práctica');
    fireEvent.click(screen.getByText('Nueva Práctica'));
    await screen.findByRole('button', { name: 'Iniciar Simulación' });
  });
});

