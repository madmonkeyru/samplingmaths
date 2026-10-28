import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  it('renders application title and login button when user is logged out', () => {
    render(
      <Header currentUser={null} onUserChanged={vi.fn()} onNavigateHome={vi.fn()} />
    );

    expect(screen.getByText('MEP‑EA‑01')).toBeInTheDocument();
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('renders user name when logged in', () => {
    render(
      <Header
        currentUser={{ id: '1', name: 'Estudiante Prueba', email: 'test@mep.cr' }}
        onUserChanged={vi.fn()}
        onNavigateHome={vi.fn()}
      />
    );

    expect(screen.getByText('Estudiante Prueba')).toBeInTheDocument();
  });
});
