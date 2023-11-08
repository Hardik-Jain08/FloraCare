export const onFontReady = (fn: () => void) => {
  try {
    document.fonts.ready.then<void, void>(
      () => fn(),
      () => {}
    );
  } catch (e) {
    // silently fail, runs the provided function
    fn();
  }
};
