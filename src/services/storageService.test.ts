import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from './storageService';
import { Attempt, User } from '../types';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('manages current user in localStorage', () => {
    expect(storageService.getCurrentUser()).toBeNull();
    const user: User = { id: 'u1', name: 'Estudiante Test', email: 'test@mep.cr' };
    storageService.setCurrentUser(user);
    expect(storageService.getCurrentUser()).toEqual(user);
    storageService.setCurrentUser(null);
    expect(storageService.getCurrentUser()).toBeNull();
  });

  it('saves and retrieves attempt history', () => {
    expect(storageService.getAttempts()).toEqual([]);
    const attempt: Attempt = {
      id: 'att-1',
      userId: 'u1',
      timestamp: new Date().toISOString(),
      mode: 'simulation',
      scopeText: 'Simulación Completa (60 ítems)',
      scorePercentage: 85,
      correctCount: 51,
      totalItems: 60,
      durationSeconds: 5400,
      responses: {},
    };
    storageService.saveAttempt(attempt);
    const saved = storageService.getAttempts();
    expect(saved.length).toBe(1);
    expect(saved[0].id).toBe('att-1');
  });

  it('calculates performance level with green-to-red color gradient', () => {
    expect(storageService.calculatePerformanceLevel([]).color).toBe('#9ca3af');

    const highAttempt: Attempt = {
      id: 'att-1',
      userId: 'u1',
      timestamp: new Date().toISOString(),
      mode: 'simulation',
      scopeText: 'Simulación',
      scorePercentage: 100,
      correctCount: 60,
      totalItems: 60,
      durationSeconds: 3000,
      responses: {},
    };

    const lowAttempt: Attempt = {
      ...highAttempt,
      id: 'att-2',
      scorePercentage: 0,
      correctCount: 0,
    };

    const greenPerf = storageService.calculatePerformanceLevel([highAttempt]);
    expect(greenPerf.color).toContain('hsl(120');

    const redPerf = storageService.calculatePerformanceLevel([lowAttempt]);
    expect(redPerf.color).toContain('hsl(0');
  });
});
