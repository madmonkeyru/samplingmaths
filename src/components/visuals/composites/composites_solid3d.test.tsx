import { describe, it, expect } from 'vitest';
import React from 'react';
import { render } from '@testing-library/react';
import { Solid3D } from './Solid3D';

describe('Solid3D Component', () => {
  it('renders a sphere with parallel cross section and reference box', () => {
    const { container } = render(
      <Solid3D
        shape="sphere"
        parameters={{ radius: 80, distance: 40 }}
        showCrossSection={true}
        labels={{ sphereCenter: 'S', planeCenter: 'O' }}
        referenceBox={{
          lines: ['M - O - R; SO = 4', 'S: centro de la esfera', 'O: centro de la sección plana'],
        }}
        cuttingPlane={{ show: true, label: 'α' }}
      />
    );
    expect(container.querySelector('.solid-sphere')).toBeTruthy();
    expect(container.querySelector('.cross-section-plane')).toBeTruthy();
    expect(container.querySelector('.cutting-plane-alpha')).toBeTruthy();
    expect(container.querySelector('.solid-reference-box')).toBeTruthy();
    expect(container.textContent).toContain('S: centro de la esfera');
  });

  it('renders a cylinder with axial rectangular section', () => {
    const { container } = render(
      <Solid3D
        shape="cylinder"
        crossSectionType="axial"
        showCrossSection={true}
        labels={{ topLeft: 'A', topCenter: 'B', topRight: 'C' }}
      />
    );
    expect(container.querySelector('.solid-cylinder')).toBeTruthy();
    expect(container.querySelector('polygon')).toBeTruthy();
  });

  it('renders a cylinder with oblique elliptical cross section and cutting plane', () => {
    const { container } = render(
      <Solid3D
        shape="cylinder"
        crossSectionType="oblique"
        showCrossSection={true}
        cuttingPlane={{ show: true, label: 'α' }}
        labels={{ topCenter: 'O_1', bottomCenter: 'O_2' }}
      />
    );
    expect(container.querySelector('.solid-cylinder')).toBeTruthy();
    expect(container.querySelector('.cylinder-oblique-section')).toBeTruthy();
    expect(container.querySelector('.cutting-plane-oblique')).toBeTruthy();
  });

  it('renders a cylinder with vertical chord cross section', () => {
    const { container } = render(
      <Solid3D
        shape="cylinder"
        crossSectionType="chord"
        showCrossSection={true}
        crossSectionOffset={40}
      />
    );
    expect(container.querySelector('.solid-cylinder')).toBeTruthy();
    expect(container.querySelector('.cylinder-chord-section')).toBeTruthy();
  });

  it('renders a cone with oblique elliptical cross section', () => {
    const { container } = render(
      <Solid3D
        shape="cone"
        crossSectionType="oblique"
        showCrossSection={true}
        cuttingPlane={{ show: true, label: 'β' }}
        labels={{ apex: 'V', baseCenter: 'O' }}
      />
    );
    expect(container.querySelector('.solid-cone')).toBeTruthy();
    expect(container.querySelector('.cone-oblique-ellipse')).toBeTruthy();
    expect(container.querySelector('.cone-cutting-plane')).toBeTruthy();
  });

  it('renders a cone with parabolic cross section', () => {
    const { container } = render(
      <Solid3D
        shape="cone"
        crossSectionType="parabolic"
        showCrossSection={true}
        cuttingPlane={{ show: true, label: 'α' }}
      />
    );
    expect(container.querySelector('.solid-cone')).toBeTruthy();
    expect(container.querySelector('.cone-cutting-plane')).toBeTruthy();
  });

  it('renders a cone with parallel circle cross section', () => {
    const { container } = render(
      <Solid3D
        shape="cone"
        crossSectionType="parallel"
        showCrossSection={true}
        labels={{ apex: 'B', baseCenter: 'D', cutCenter: 'H' }}
      />
    );
    expect(container.querySelector('.solid-cone')).toBeTruthy();
    expect(container.querySelector('.cone-cross-section')).toBeTruthy();
  });

  it('renders a frustum with axial trapezoid section', () => {
    const { container } = render(
      <Solid3D
        shape="frustum"
        showCrossSection={true}
        labels={{ topCenter: 'D', topRight: 'A', bottomCenter: 'C', bottomRight: 'B' }}
      />
    );
    expect(container.querySelector('.solid-frustum')).toBeTruthy();
    expect(container.querySelector('polygon')).toBeTruthy();
  });

  it('renders a prism / cube with shaded base', () => {
    const { container } = render(
      <Solid3D
        shape="cube"
        showCrossSection={true}
        labels={{ width: '4', height: '4', depth: '4' }}
      />
    );
    expect(container.querySelector('.solid-prism')).toBeTruthy();
  });
});
