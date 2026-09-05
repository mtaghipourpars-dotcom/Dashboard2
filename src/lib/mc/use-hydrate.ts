import { useEffect } from "react";
import { useMcStore } from "./store";

export function useHydrateMc() {
  const hydrate = useMcStore((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
