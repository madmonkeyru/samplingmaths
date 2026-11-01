import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { EntryLandingPage } from './EntryLandingPage';

describe('EntryLandingPage', () => {
  it('renders simple prototype landing without hero, offering clear validation paths', () => {
    const handleExplore = vi.fn();
    const handleEnterBxm = vi.fn();

    render(
      <EntryLandingPage
        onExplorePrograms={handleExplore}
        onEnterBxmHub={handleEnterBxm}
      />
    );

    expect(screen.getByText(/Preparación y Práctica para los Exámenes/i)).toBeInTheDocument();
    expect(screen.getByText('Matemáticas BXM')).toBeInTheDocument();
    expect(screen.getByText('Explorar Programas MEP')).toBeInTheDocument();

    const enterBxmBtn = screen.getByText('Ingresar al Hub BXM');
    fireEvent.click(enterBxmBtn);
    expect(handleEnterBxm).toHaveBeenCalledTimes(1);

    const exploreBtn = screen.getByText('Ver Planes y Programas');
    fireEvent.click(exploreBtn);
    expect(handleExplore).toHaveBeenCalledTimes(1);
  });
});
