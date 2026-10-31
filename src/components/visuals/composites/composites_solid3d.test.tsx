import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Solid3D } from './Solid3D';
import { VisualRenderer } from '../VisualRenderer';

describe('Solid3D Composite Component', () => {
  it('renders a sphere with planar cross section and reference box', () => {
    const { container } = render(
      <Solid3D
        shape="sphere"
        parameters={{ radius: 75, distance: 38 }}
        showCrossSection={true}
        crossSectionHatched={true}
        labels={{ sphereCenter: 'M', planeCenter: 'O', planeLeft: 'P', planeRight: 'N' }}
        referenceBox={{
          title: 'P — O — N',
          lines: ['M: centro de la esfera', 'O: centro de la sección plana'],
        }}
      />
    );

    expect(container.querySelector('.solid-sphere')).toBeTruthy();
    expect(container.querySelector('.cross-section-plane')).toBeTruthy();
    expect(container.querySelector('.solid-reference-box')).toBeTruthy();
    expect(container.textContent).toContain('M');
    expect(container.textContent).toContain('O');
    expect(container.textContent).toContain('P — O — N');
  });

  it('renders a cylinder with axial cross section and diameter lines', () => {
    const { container } = render(
      <Solid3D
        shape="cylinder"
        parameters={{ radius: 75, height: 110 }}
        showCrossSection={true}
        crossSectionType="axial"
        crossSectionHatched={true}
        labels={{ topLeft: 'A', topCenter: 'B', topRight: 'C', bottomLeft: 'D', bottomCenter: 'E', bottomRight: 'F' }}
      />
    );

    expect(container.querySelector('.solid-cylinder')).toBeTruthy();
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('B');
    expect(container.textContent).toContain('F');
  });

  it('renders a cone with parallel cut section and vertex labels', () => {
    const { container } = render(
      <Solid3D
        shape="cone"
        parameters={{ radius: 75, height: 125, cutHeightFraction: 0.5 }}
        showCrossSection={true}
        crossSectionType="parallel"
        labels={{ apex: 'B', baseCenter: 'D', baseLeft: 'A', baseRight: 'C', cutCenter: 'H' }}
      />
    );

    expect(container.querySelector('.solid-cone')).toBeTruthy();
    expect(container.querySelector('.cone-cross-section')).toBeTruthy();
    expect(container.textContent).toContain('B');
    expect(container.textContent).toContain('D');
    expect(container.textContent).toContain('H');
  });

  it('renders a frustum (truncated cone) with axial trapezoid section', () => {
    const { container } = render(
      <Solid3D
        shape="frustum"
        parameters={{ topRadius: 40, bottomRadius: 80, height: 120 }}
        showCrossSection={true}
        crossSectionHatched={true}
        labels={{ topCenter: 'D', topRight: 'A', bottomCenter: 'C', bottomRight: 'B' }}
      />
    );

    expect(container.querySelector('.solid-frustum')).toBeTruthy();
    expect(container.textContent).toContain('D');
    expect(container.textContent).toContain('A');
    expect(container.textContent).toContain('C');
    expect(container.textContent).toContain('B');
  });

  it('renders a rectangular prism / cube with dashed hidden lines and shaded base', () => {
    const { container } = render(
      <Solid3D
        shape="prism"
        parameters={{ boxWidth: 100, boxHeight: 70, boxDepth: 50 }}
        showCrossSection={true}
        crossSectionHatched={true}
        labels={{ width: 'l = 10', height: 'h = 4', depth: 'a = 6' }}
      />
    );

    expect(container.querySelector('.solid-prism')).toBeTruthy();
    expect(container.textContent).toContain('l = 10');
    expect(container.textContent).toContain('h = 4');
  });

  it('integrates seamlessly with VisualRenderer via type "solid_3d"', () => {
    const spec = {
      type: 'solid_3d',
      shape: 'sphere',
      parameters: { radius: 70 },
      labels: { sphereCenter: 'S' },
    };

    const { container } = render(<VisualRenderer spec={spec} alt="Esfera 3D" />);
    expect(container.querySelector('.solid-3d-container')).toBeTruthy();
    expect(container.querySelector('.solid-sphere')).toBeTruthy();
    expect(container.textContent).toContain('S');
  });
});
