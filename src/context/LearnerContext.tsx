import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { User, Attempt, TestSession } from '../types';
import { storageService } from '../services/storageService';
import { accessService } from '../services/accessService';
import type { UserTier } from '../types/learningDomain';

export interface LearnerContextValue {
  learner: User | null;
  learnerId: string;
  isAnonymous: boolean;
  tier: UserTier;
  profiles: User[];
  attempts: Attempt[];
  activeSession: TestSession | null;
  selectProfile: (user: User | null) => void;
  createProfile: (name: string) => User;
  refreshState: () => void;
  saveAttempt: (attempt: Attempt) => void;
  deleteAttempt: (id: string) => void;
  clearAttempts: () => void;
}

const LearnerContext = createContext<LearnerContextValue | null>(null);

export const LearnerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [learner, setLearner] = useState<User | null>(() => storageService.getCurrentUser());
  const [profiles, setProfiles] = useState<User[]>(() => storageService.getProfiles());
  const [attempts, setAttempts] = useState<Attempt[]>(() => storageService.getAttempts());
  const [tier, setTier] = useState<UserTier>(() => accessService.getTier());
  const [activeSession, setActiveSession] = useState<TestSession | null>(() =>
    storageService.getActiveSession(learner?.id || 'guest')
  );

  const refreshState = useCallback(() => {
    const current = storageService.getCurrentUser();
    setLearner(current);
    setProfiles(storageService.getProfiles());
    setAttempts(storageService.getAttempts());
    setActiveSession(storageService.getActiveSession(current?.id || 'guest'));
    setTier(accessService.getTier());
  }, []);

  useEffect(() => {
    const unsubscribeAccess = accessService.subscribe((newTier) => {
      setTier(newTier);
    });

    const handleStorage = (e: StorageEvent) => {
      if (!e.key || e.key.startsWith('mep_ea_') || e.key.startsWith('bxm-')) {
        refreshState();
      }
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      unsubscribeAccess();
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshState]);

  const selectProfile = useCallback((user: User | null) => {
    storageService.setCurrentUser(user);
    setLearner(user);
    setProfiles(storageService.getProfiles());
    setActiveSession(storageService.getActiveSession(user?.id || 'guest'));
  }, []);

  const createProfile = useCallback((name: string): User => {
    const newUser: User = {
      id: 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      email: '',
    };
    storageService.setCurrentUser(newUser);
    setLearner(newUser);
    setProfiles(storageService.getProfiles());
    setActiveSession(storageService.getActiveSession(newUser.id));
    return newUser;
  }, []);

  const handleSaveAttempt = useCallback((attempt: Attempt) => {
    storageService.saveAttempt(attempt);
    setAttempts(storageService.getAttempts());
  }, []);

  const handleDeleteAttempt = useCallback((id: string) => {
    storageService.deleteAttempt(id);
    setAttempts(storageService.getAttempts());
  }, []);

  const handleClearAttempts = useCallback(() => {
    storageService.clearAttempts();
    setAttempts([]);
  }, []);

  const value = useMemo<LearnerContextValue>(() => ({
    learner,
    learnerId: learner?.id || 'guest',
    isAnonymous: learner === null,
    tier,
    profiles,
    attempts,
    activeSession,
    selectProfile,
    createProfile,
    refreshState,
    saveAttempt: handleSaveAttempt,
    deleteAttempt: handleDeleteAttempt,
    clearAttempts: handleClearAttempts,
  }), [
    learner,
    tier,
    profiles,
    attempts,
    activeSession,
    selectProfile,
    createProfile,
    refreshState,
    handleSaveAttempt,
    handleDeleteAttempt,
    handleClearAttempts,
  ]);

  return <LearnerContext.Provider value={value}>{children}</LearnerContext.Provider>;
};

export function useLearner(): LearnerContextValue {
  const context = useContext(LearnerContext);
  if (!context) {
    throw new Error('useLearner must be used within a LearnerProvider');
  }
  return context;
}
