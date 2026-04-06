'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import apiClient from '../api/client';
import { useAuth } from './AuthContext';

export interface HouseholdMember {
  id: string;
  role: 'view' | 'edit' | 'admin';
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface Household {
  id: string;
  name: string;
  createdAt: string;
  members: HouseholdMember[];
}

interface HouseholdContextType {
  households: Household[];
  currentHousehold: Household | null;
  currentRole: 'view' | 'edit' | 'admin' | null;
  isLoading: boolean;
  setCurrentHousehold: (household: Household | null) => void;
  refreshHouseholds: () => Promise<void>;
  createHousehold: (name: string) => Promise<Household>;
}

const HouseholdContext = createContext<HouseholdContextType | undefined>(
  undefined
);

const HOUSEHOLD_STORAGE_KEY = 'famly-current-household';

export function HouseholdProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, token } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [currentHousehold, setCurrentHouseholdState] = useState<Household | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const fetchHouseholds = useCallback(async () => {
    if (!isAuthenticated || !token) {
      setHouseholds([]);
      setCurrentHouseholdState(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiClient.get('/households');
      const fetchedHouseholds = response.data;
      setHouseholds(fetchedHouseholds);

      // Restore saved household or select first one
      const savedHouseholdId = localStorage.getItem(HOUSEHOLD_STORAGE_KEY);
      const savedHousehold = fetchedHouseholds.find(
        (h: Household) => h.id === savedHouseholdId
      );

      if (savedHousehold) {
        setCurrentHouseholdState(savedHousehold);
      } else if (fetchedHouseholds.length > 0) {
        setCurrentHouseholdState(fetchedHouseholds[0]);
        localStorage.setItem(HOUSEHOLD_STORAGE_KEY, fetchedHouseholds[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch households:', error);
      setHouseholds([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    fetchHouseholds();
  }, [fetchHouseholds]);

  const setCurrentHousehold = useCallback((household: Household | null) => {
    setCurrentHouseholdState(household);
    if (household) {
      localStorage.setItem(HOUSEHOLD_STORAGE_KEY, household.id);
    } else {
      localStorage.removeItem(HOUSEHOLD_STORAGE_KEY);
    }
  }, []);

  const refreshHouseholds = useCallback(async () => {
    await fetchHouseholds();
  }, [fetchHouseholds]);

  const createHousehold = useCallback(async (name: string) => {
    const response = await apiClient.post('/households', { name });
    const newHousehold = response.data;
    setHouseholds((prev) => [...prev, newHousehold]);
    setCurrentHousehold(newHousehold);
    return newHousehold;
  }, [setCurrentHousehold]);

  const currentRole = useMemo(() => {
    if (!currentHousehold || !user) return null;
    const membership = currentHousehold.members.find(
      (m) => m.user.id === user.id
    );
    return membership?.role || null;
  }, [currentHousehold, user]);

  const value = useMemo(
    () => ({
      households,
      currentHousehold,
      currentRole,
      isLoading,
      setCurrentHousehold,
      refreshHouseholds,
      createHousehold,
    }),
    [
      households,
      currentHousehold,
      currentRole,
      isLoading,
      setCurrentHousehold,
      refreshHouseholds,
      createHousehold,
    ]
  );

  return (
    <HouseholdContext.Provider value={value}>
      {children}
    </HouseholdContext.Provider>
  );
}

export function useHousehold() {
  const context = useContext(HouseholdContext);
  if (context === undefined) {
    throw new Error('useHousehold must be used within a HouseholdProvider');
  }
  return context;
}
