import { User, Attempt, TestSession } from '../types';

const STORAGE_KEYS = {
  USER: 'mep_ea_user',
  ATTEMPTS: 'mep_ea_attempts',
  ACTIVE_SESSION: 'mep_ea_active_session',
};

class StorageService {
  // User Management
  public getCurrentUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }

  // Attempt History
  public getAttempts(): Attempt[] {
    const data = localStorage.getItem(STORAGE_KEYS.ATTEMPTS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  public saveAttempt(attempt: Attempt): void {
    const attempts = this.getAttempts();
    attempts.unshift(attempt); // newest first
    localStorage.setItem(STORAGE_KEYS.ATTEMPTS, JSON.stringify(attempts));
  }

  public clearAttempts(): void {
    localStorage.removeItem(STORAGE_KEYS.ATTEMPTS);
  }

  // Active Session Auto-save (NFR-R-01)
  public getActiveSession(): TestSession | null {
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  public saveActiveSession(session: TestSession): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(session));
  }

  public clearActiveSession(): void {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }

  // Performance calculation: Green (100%) to Red (0%)
  public calculatePerformanceLevel(attempts: Attempt[]): {
    scoreAverage: number;
    color: string; // hsl or hex
    description: string;
  } {
    if (attempts.length === 0) {
      return {
        scoreAverage: 0,
        color: '#9ca3af', // gray
        description: 'Sin intentos registrados',
      };
    }

    const recent = attempts.slice(0, 5); // last 5 attempts
    const avg = recent.reduce((sum, a) => sum + a.scorePercentage, 0) / recent.length;

    // Map 0 -> Hue 0 (Red), 100 -> Hue 120 (Green)
    const hue = Math.round((avg / 100) * 120);
    const color = `hsl(${hue}, 85%, 42%)`;

    let description = 'Excelente';
    if (avg < 60) description = 'Necesita práctica';
    else if (avg < 75) description = 'En progreso';
    else if (avg < 90) description = 'Bueno';

    return {
      scoreAverage: Math.round(avg),
      color,
      description,
    };
  }
}

export const storageService = new StorageService();
