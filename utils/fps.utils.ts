export const createFpsScheduler = (maxFps = 60) => {
  const fpsInterval = 1000 / maxFps;
  let then = window.performance.now();
  let elapsed = 0;
  let stopped = false;
  return (callback: () => void) => {
    function animate(now: number) {
      if (stopped) return;
      requestAnimationFrame(animate);
      elapsed = now - then;
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        callback();
      }
    }
    requestAnimationFrame(animate);
    return function dispose() {
      stopped = true;
    };
  };
};
