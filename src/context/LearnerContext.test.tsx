import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LearnerProvider, useLearner } from './LearnerContext';
import { storageService } from '../services/storageService';

describe('LearnerContext', () => {
  beforeEach(() => {
    localStorage.clear();
    storageService.setCurrentUser(null);
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <LearnerProvider>{children}</LearnerProvider>
  );

  it('provides anonymous learner by default', () => {
    const { result } = renderHook(() => useLearner(), { wrapper });
    expect(result.current.isAnonymous).toBe(true);
    expect(result.current.learner).toBeNull();
    expect(result.current.learnerId).toBe('guest');
  });

  it('allows creating and switching profiles', () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.createProfile('María');
    });

    expect(result.current.isAnonymous).toBe(false);
    expect(result.current.learner?.name).toBe('María');
    expect(result.current.profiles.length).toBe(1);

    act(() => {
      result.current.selectProfile(null);
    });

    expect(result.current.isAnonymous).toBe(true);
  });

  it('manages attempts consistently', () => {
    const { result } = renderHook(() => useLearner(), { wrapper });

    act(() => {
      result.current.saveAttempt({
        id: 'att_1',
        userId: 'guest',
        timestamp: new Date().toISOString(),
        mode: 'diagnostic',
        programId: 'bxm',
        subjectId: 'matematicas',
        convocatoriaId: '2026-c2',
        scopeText: 'Diagnóstico BXM',
        scorePercentage: 80,
        correctCount: 16,
        totalItems: 20,
        durationSeconds: 600,
        responses: {},
      });
    });

    expect(result.current.attempts.length).toBe(1);
    expect(result.current.attempts[0].id).toBe('att_1');

    act(() => {
      result.current.deleteAttempt('att_1');
    });

    expect(result.current.attempts.length).toBe(0);
  });
});
