import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';
import { ThemeProvider } from '../../context/ThemeContext';

describe('Header', () => {
  it('renders application title with prototype name and login button when user is logged out (Public Header)', () => {
    render(
      <ThemeProvider>
        <Header currentUser={null} onUserChanged={vi.fn()} onNavigateHome={vi.fn()} currentView="landing" />
      </ThemeProvider>
    );

    expect(screen.getByText('MEP-EA-01')).toBeInTheDocument();
    expect(screen.getByText('PROTOTIPO')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    // Program dropdown should not be present on landing view
    expect(screen.queryByTitle('Cambiar programa oficial MEP')).not.toBeInTheDocument();
  });

  it('renders user name and logout button when logged in (Private Header)', () => {
    render(
      <ThemeProvider>
        <Header
          currentUser={{ id: '1', name: 'Estudiante Prueba', email: 'test@mep.cr' }}
          onUserChanged={vi.fn()}
          onNavigateHome={vi.fn()}
          currentView="hub"
        />
      </ThemeProvider>
    );

    expect(screen.getByText('Estudiante Prueba')).toBeInTheDocument();
    expect(screen.getByLabelText('Cerrar sesión')).toBeInTheDocument();
    expect(screen.queryByText('Iniciar sesión')).not.toBeInTheDocument();
    // Program dropdown should be visible on hub view
    expect(screen.getByTitle('Cambiar programa oficial MEP')).toBeInTheDocument();
  });
});
