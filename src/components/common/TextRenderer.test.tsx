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

  it('renders bare equations embedded in question text', () => {
    const { container } = render(
      <TextRenderer content="La circunferencia está dada por (x − 2)^2 + (y − 1)^2 = 9." />,
    );
    expect(container.querySelector('.katex')).not.toBeNull();
    expect(container.querySelector('.katex .mrel')).not.toBeNull();
    expect(container.querySelector('.katex .msupsub')).not.toBeNull();
    expect(container.textContent).toContain('La circunferencia está dada por');
  });

  it('renders equations with nested parentheses', () => {
    const { container } = render(<TextRenderer content="Centro h = -4: (x - (-4))^2 = 36." />);
    expect(container.querySelector('.katex .mrel')).not.toBeNull();
    expect(container.querySelector('.katex .msupsub')).not.toBeNull();
  });

  it('does not render hyphenated prose as math', () => {
    const { container } = render(<TextRenderer content="Texto claro y bien organizado." />);
    expect(container.querySelector('.katex')).toBeNull();
    expect(container).toHaveTextContent('Texto claro y bien organizado.');
  });

  it('renders parenthesized text containing inline math expressions cleanly', () => {
    const { container } = render(
      <TextRenderer content="Carlos obtuvo una nota de 85 en Matemáticas (media $\bar{x} = 75$, desviación estándar $s = 5$)." />
    );
    expect(container.textContent).toContain('media');
    expect(container.textContent).toContain('desviación estándar');
    expect(container.querySelectorAll('.katex').length).toBe(2);
  });
});
