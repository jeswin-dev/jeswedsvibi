"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type IntroState = {
  /** True once the envelope has been opened. */
  opened: boolean;
  open: () => void;
};

/** Defaults to opened so anything rendered outside the provider still animates. */
const IntroContext = createContext<IntroState>({ opened: true, open: () => {} });

export function IntroProvider({ children }: { children: ReactNode }) {
  // Deliberately not persisted. The invitation is a single page, so remembering
  // this would only ever skip the seal on a refresh, which is the one case where
  // a guest is most likely showing it to someone else.
  const [opened, setOpened] = useState(false);

  const open = useCallback(() => setOpened(true), []);
  const value = useMemo(() => ({ opened, open }), [opened, open]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
