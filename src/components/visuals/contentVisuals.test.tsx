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
