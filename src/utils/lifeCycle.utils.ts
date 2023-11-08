import React, { useEffect } from "react";

export function useOnMount(fn: React.EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(fn, []);
}
