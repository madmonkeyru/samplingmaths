import { describe, it, expect, beforeEach } from 'vitest';
import { accessService } from './accessService';
import { ACCESS_PRESETS } from '../types/access';

describe('accessService', () => {
  beforeEach(() => {
    accessService.setTier('free');
  });

  it('allows public official content for free users', () => {
    expect(accessService.can('official_reference_benchmark')).toBe(true);
    expect(accessService.can('official_specifications_and_resources')).toBe(true);
    expect(accessService.can('initial_diagnostic_and_basic_results')).toBe(true);

    const officialDecision = accessService.evaluateAccess(ACCESS_PRESETS.OFFICIAL_PUBLIC);
    expect(officialDecision.allowed).toBe(true);
  });

  it('evaluates authored sample lessons as allowed on free, but gates extended pack', () => {
    expect(accessService.canAccessLesson(true)).toBe(true);
    expect(accessService.canAccessLesson(false)).toBe(false);

    accessService.setTier('premium');
    expect(accessService.canAccessLesson(false)).toBe(true);
  });

  it('evaluates practice permissions canonically', () => {
    accessService.setTier('free');
    expect(accessService.canAccessPractice('diagnostic')).toBe(true);
    expect(accessService.canAccessPractice('reference')).toBe(true);
    expect(accessService.canAccessPractice('authored')).toBe(false);
    expect(accessService.canAccessPractice('mock')).toBe(false);

    accessService.setTier('premium');
    expect(accessService.canAccessPractice('authored')).toBe(true);
    expect(accessService.canAccessPractice('mock')).toBe(true);
  });

  it('correctly evaluates learner-only classifications against learner context', () => {
    const learnerAccess = accessService.evaluateAccess(ACCESS_PRESETS.LEARNER_PROGRESS, false);
    expect(learnerAccess.allowed).toBe(false);

    const learnerAccessInContext = accessService.evaluateAccess(ACCESS_PRESETS.LEARNER_PROGRESS, true);
    expect(learnerAccessInContext.allowed).toBe(true);
  });
});
