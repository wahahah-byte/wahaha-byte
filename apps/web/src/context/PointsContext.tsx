"use client";

import { createContext, useContext, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";

interface PointsContextValue {
  balance: number | null;
  username: string | null;
  profilePictureUrl: string | null;
  stagedPoints: number;
  unsubmittedPoints: number;
  dailySubmitted: number;
  recurringSubmittedToday: number;
  setBalance: (n: number) => void;
  setUsername: (s: string) => void;
  setProfilePictureUrl: (s: string | null) => void;
  setUnsubmittedPoints: (n: number) => void;
  setDailySubmitted: Dispatch<SetStateAction<number>>;
  setRecurringSubmittedToday: (n: number) => void;
  updateStaged: (delta: number, reset?: boolean) => void;
}

const PointsContext = createContext<PointsContextValue | null>(null);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [stagedPoints, setStagedPoints] = useState(0);
  const [unsubmittedPoints, setUnsubmittedPoints] = useState(0);
  const [dailySubmitted, setDailySubmitted] = useState(0);
  const [recurringSubmittedToday, setRecurringSubmittedToday] = useState(0);

  function updateStaged(delta: number, reset = false) {
    if (reset) setStagedPoints(0);
    else setStagedPoints((p) => p + delta);
  }

  return (
    <PointsContext.Provider value={{
      balance, username, profilePictureUrl, stagedPoints, unsubmittedPoints, dailySubmitted, recurringSubmittedToday,
      setBalance, setUsername, setProfilePictureUrl, setUnsubmittedPoints, setDailySubmitted, setRecurringSubmittedToday, updateStaged,
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error("usePoints must be used within PointsProvider");
  return ctx;
}
