import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VisualRenderer } from './VisualRenderer';
import { GroupVisual } from './GroupVisual';
import set1Json from '../../../content/bxm/matematicas/set_1.json';
import set2Json from '../../../content/bxm/matematicas/set_2.json';
import set3Json from '../../../content/bxm/matematicas/set_3.json';
import set4Json from '../../../content/bxm/matematicas/set_4.json';
import groupsJson from '../../../content/bxm/matematicas/groups.json';
import type { Group } from '../../types';

describe('Content visual spec integration', () => {
  it('renders every per-item visual_spec without falling back', () => {
    const items = [
      ...((set1Json as any).items || []),
      ...((set2Json as any).items || []),
      ...((set3Json as any).items || []),
      ...((set4Json as any).items || []),
    ];
    const withVisuals = items.filter((item: any) => item.visual_spec);

    expect(withVisuals.length).toBeGreaterThan(0);

    for (const item of withVisuals) {
      const { container } = render(
        <VisualRenderer spec={item.visual_spec} itemId={item.id} />
      );

      const hasGraphic =
        container.querySelector('svg') !== null ||
        container.querySelector('table') !== null;

      expect(
        hasGraphic,
        `item ${item.id} (${item.topic}) should render a graphic`
      ).toBe(true);
    }
  });

  it('verifies updated geometry visual specs for items 6, 9, 13, 21, 22, and 23', () => {
    const items = (set1Json as any).items || [];
    const item6 = items.find((i: any) => i.id === 6);
    const item9 = items.find((i: any) => i.id === 9);
    const item13 = items.find((i: any) => i.id === 13);
    const item21 = items.find((i: any) => i.id === 21);
    const item22 = items.find((i: any) => i.id === 22);
    const item23 = items.find((i: any) => i.id === 23);

    // Question 6: option D circle center at (3,2)
    const optD = item6.visual_spec.visual.views.find((v: any) => v.label === 'D');
    const circleD = optD.visual.children.find((c: any) => c.type === 'circle');
    expect(circleD.center).toEqual([3, 2]);

    // Question 9: center at (5,0)
    const circle9 = item9.visual_spec.visual.children.find((c: any) => c.type === 'circle');
    expect(circle9.center).toEqual([5, 0]);
    expect(circle9.radius).toBe(4);

    // Question 13: ramp curve path points
    const path13 = item13.visual_spec.visual.children.find((c: any) => c.type === 'path');
    expect(path13.points).toEqual([[2, 2], [4, 4.8], [6, 5.8], [7, 6]]);

    // Question 21, 22, 23: updated polygon vertices matching g_transformations group visual
    for (const item of [item21, item22, item23]) {
      const polygons = item.visual_spec.visual.children.filter((c: any) => c.type === 'polygon');
      expect(polygons[0].vertices).toEqual([[0, 0], [-2, 0], [-1, 3], [0, 3]]);
      expect(polygons[1].vertices).toEqual([[2, 1], [3, 1], [3, 4], [1, 4]]);
      expect(polygons[2].vertices).toEqual([[4, -1], [5, -1], [5, -4], [3, -4]]);
      expect(polygons[3].vertices).toEqual([[-3, -1], [-2, -1], [-1, -4], [-3, -4]]);
    }

    const groups = (groupsJson as any).groups || [];
    const gTrans = groups.find((g: any) => g.group_id === 'g_transformations');
    const groupPolys = gTrans.visual_spec.visual.children.filter((c: any) => c.type === 'polygon');
    expect(groupPolys[0].vertices).toEqual([[0, 0], [-2, 0], [-1, 3], [0, 3]]);
    expect(groupPolys[1].vertices).toEqual([[2, 1], [3, 1], [3, 4], [1, 4]]);
    expect(groupPolys[2].vertices).toEqual([[4, -1], [5, -1], [5, -4], [3, -4]]);
    expect(groupPolys[3].vertices).toEqual([[-3, -1], [-2, -1], [-1, -4], [-3, -4]]);
  });

  it('renders every group visual_spec without falling back', () => {
    const groups: Group[] = (groupsJson as any).groups || [];
    const withVisuals = groups.filter((g) => g.visual_spec);

    expect(withVisuals.length).toBeGreaterThan(0);

    for (const group of withVisuals) {
      const { container } = render(<GroupVisual group={group} />);

      const hasGraphic =
        container.querySelector('svg') !== null ||
        container.querySelector('table') !== null;

      expect(
        hasGraphic,
        `group ${group.group_id} should render a graphic`
      ).toBe(true);
    }
  });
});
