"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";

type IntroState = {
  /** True once the envelope has been opened. */
  opened: boolean;
  open: () => void;
  musicRef: RefObject<HTMLAudioElement | null>;
};

const fallbackMusicRef: RefObject<HTMLAudioElement | null> = { current: null };

/** Defaults to opened so anything rendered outside the provider still animates. */
const IntroContext = createContext<IntroState>({
  opened: true,
  open: () => {},
  musicRef: fallbackMusicRef,
});

export function IntroProvider({ children }: { children: ReactNode }) {
  // Deliberately not persisted. The invitation is a single page, so remembering
  // this would only ever skip the seal on a refresh, which is the one case where
  // a guest is most likely showing it to someone else.
  const [opened, setOpened] = useState(false);
  const musicRef = useRef<HTMLAudioElement | null>(null);

  const open = useCallback(() => {
    setOpened(true);
    const audio = musicRef.current;
    if (!audio) return;
    audio.volume = 0.35;
    // Play from the tap itself so iOS still treats it as a user gesture.
    void audio.play().catch(() => {});
  }, []);

  const value = useMemo(() => ({ opened, open, musicRef }), [opened, open]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
