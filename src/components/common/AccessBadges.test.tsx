import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ContentBadge } from './ContentBadge';
import { AccessBadge } from './AccessBadge';
import { accessService } from '../../services/accessService';

describe('ContentBadge and AccessBadge', () => {
  beforeEach(() => {
    accessService.setTier('free');
  });

  it('renders official, authored, and learner provenance correctly', () => {
    const { rerender } = render(<ContentBadge provenance="official" />);
    expect(screen.getByText('MEP · Oficial')).toBeInTheDocument();

    rerender(<ContentBadge provenance="authored" />);
    expect(screen.getByText('MEP-EA · Formativo')).toBeInTheDocument();

    rerender(<ContentBadge provenance="learner-generated" />);
    expect(screen.getByText('Tu registro privado')).toBeInTheDocument();
  });

  it('renders PRO badge for gated capabilities on free tier and Included on Pro tier', () => {
    const { rerender } = render(<AccessBadge capability="extended_authored_practice" />);
    expect(screen.getByText('PRO')).toBeInTheDocument();

    accessService.setTier('premium');
    rerender(<AccessBadge capability="extended_authored_practice" />);
    expect(screen.getByText('Incluido')).toBeInTheDocument();
  });
});
