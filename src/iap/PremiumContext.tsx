import React, { createContext, useContext } from 'react';
import { usePremium as usePremiumState } from './usePremium';

type PremiumContextValue = ReturnType<typeof usePremiumState>;

const PremiumContext = createContext<PremiumContextValue | null>(null);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const value = usePremiumState();
  return <PremiumContext.Provider value={value}>{children}</PremiumContext.Provider>;
};

export const usePremium = (): PremiumContextValue => {
  const ctx = useContext(PremiumContext);
  if (!ctx) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return ctx;
};
