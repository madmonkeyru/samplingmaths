import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TextRenderer } from './TextRenderer';

describe('TextRenderer', () => {
  it('renders plain text without math', () => {
    render(<TextRenderer content="Texto regular sin matemáticas" />);
    expect(screen.getByText('Texto regular sin matemáticas')).toBeInTheDocument();
  });

  it('renders inline math expressions with KaTeX', () => {
    const { container } = render(<TextRenderer content="Considere la función $f(x) = x^2 + 1$." />);
    expect(screen.getByText(/Considere la función/)).toBeInTheDocument();
    expect(container.querySelector('.katex')).not.toBeNull();
  });

  it('renders block math expressions', () => {
    const { container } = render(<TextRenderer content="Formula: $$\\int_0^1 x dx$$" />);
    expect(container.querySelector('.katex-display')).not.toBeNull();
  });
});
