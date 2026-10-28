import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  TableComponent,
  BoxPlotComponent,
  DistributionCurveComponent,
  VennDiagramComponent,
} from './StatisticsComposites';

describe('Statistics Composite Components', () => {
  it('renders TableComponent with headers and data rows', () => {
    render(
      <TableComponent
        headers={['Distancia (km)', 'Frecuencia']}
        rows={[
          ['0 - 5', 12],
          ['5 - 10', 18],
        ]}
      />
    );

    expect(screen.getByText(/Distancia/)).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('renders BoxPlotComponent SVG and box element', () => {
    const { container } = render(
      <BoxPlotComponent
        min={10}
        q1={20}
        median={30}
        q3={40}
        max={50}
      />
    );

    expect(container.querySelector('svg')).toBeInTheDocument();
    expect(container.querySelector('rect')).toBeInTheDocument();
  });

  it('renders DistributionCurveComponent path', () => {
    const { container } = render(<DistributionCurveComponent skew="negative" />);
    expect(container.querySelector('path')).toBeInTheDocument();
  });

  it('renders VennDiagramComponent with set labels', () => {
    render(
      <VennDiagramComponent
        sets={[{ label: 'Música' }, { label: 'Pintura' }, { label: 'Ballet' }]}
      />
    );

    expect(screen.getByText('Música')).toBeInTheDocument();
    expect(screen.getByText('Pintura')).toBeInTheDocument();
    expect(screen.getByText('Ballet')).toBeInTheDocument();
  });
});
