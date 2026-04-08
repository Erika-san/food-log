import React, { createContext, useContext } from "react";
import { useAppStore, type AppStore } from "./useAppStore";

const AppContext = createContext<AppStore | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAppStore();
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
};

export function useApp(): AppStore {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
