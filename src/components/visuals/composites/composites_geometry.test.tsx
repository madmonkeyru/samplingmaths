import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CartesianPlane } from './CartesianPlane';
import { FunctionPlot, MultiViewGrid } from './FunctionsComposites';

describe('Geometry and Functions Composites', () => {
  it('renders CartesianPlane with circle child', () => {
    const { container } = render(
      <CartesianPlane
        domain={{ x: [-5, 5], y: [-5, 5] }}
        children={[{ type: 'circle', center: [0, 0], radius: 3, label: 'c' }]}
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('circle')).toBeInTheDocument();
  });

  it('renders FunctionPlot quadratic curve', () => {
    const { container } = render(
      <FunctionPlot form="quadratic" params={{ a: 1, b: 0, c: -4 }} />
    );

    expect(container.querySelector('path')).toBeInTheDocument();
  });

  it('renders MultiViewGrid with view labels', () => {
    render(
      <MultiViewGrid
        layout={{ rows: 1, cols: 2 }}
        views={[
          { label: 'Opción A', visual: {} },
          { label: 'Opción B', visual: {} },
        ]}
      />
    );

    expect(screen.getByText('Opción A')).toBeInTheDocument();
    expect(screen.getByText('Opción B')).toBeInTheDocument();
  });
});
