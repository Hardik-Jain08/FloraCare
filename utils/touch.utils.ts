import Point, { RectDef, XY } from "./geometry.utils";

export const detectTouchSupport = () =>
  "ontouchstart" in window ||
  navigator.maxTouchPoints > 0 ||
  Reflect.get(navigator, "msMaxTouchPoints") > 0 ||
  document.documentElement.classList.contains("touch");

export const detectAndWatchForTouchSupport = () => {
  const onDetectingTouch = () => {
    document.documentElement.classList.add("touch");
  };
  if (detectTouchSupport()) {
    onDetectingTouch();
    return () => {};
  }
  window.addEventListener("touchstart", onDetectingTouch, { once: true });
  return () => {
    window.removeEventListener("touchstart", onDetectingTouch);
  };
};

export const isTouchEvent = (e: unknown): e is TouchEvent | React.TouchEvent =>
  "touches" in (e as TouchEvent | React.TouchEvent);

export const getTouchArrayFromEvent = (e: TouchEvent | React.TouchEvent) =>
  Array(e.touches.length)
    .fill(null)
    .map((n, i) => e.touches.item(i))
    .filter(i => i) as Touch[];

export const getAverageXYFromTouchEvent = (e: TouchEvent | React.TouchEvent) =>
  getTouchArrayFromEvent(e).reduce<XY | null>(
    (prev, touch) => ({
      x: prev ? (prev.x + touch.clientX) / 2 : touch.clientX,
      y: prev ? (prev.y + touch.clientY) / 2 : touch.clientY,
    }),
    null
  ) ?? { x: 0, y: 0 };

export const getXYfromMouseEvent = (e: MouseEvent | React.MouseEvent) => ({
  x: e.clientX,
  y: e.clientY,
});

export const getXYFromMouseOrTouchEvent = (
  e: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent
) => (isTouchEvent(e) ? getAverageXYFromTouchEvent(e) : getXYfromMouseEvent(e));

export const getMultiFingerTouchEventRect = (e: TouchEvent): RectDef => {
  const touches = getTouchArrayFromEvent(e);
  const xArray = touches.map(touch => touch.clientX);
  const yArray = touches.map(touch => touch.clientY);
  return {
    left: Math.min(...xArray),
    right: Math.max(...xArray),
    top: Math.min(...yArray),
    bottom: Math.max(...yArray),
  };
};

export const getZoomDeltaFromTouchRects = (curr: RectDef, prev: RectDef) => {
  const currWidth = curr.right - curr.left;
  const currHeight = curr.bottom - curr.top;
  const prevWidth = prev.right - prev.left;
  const prevHeight = prev.bottom - prev.top;
  const xZoomDelta = (currWidth - prevWidth) / prevWidth;
  const yZoomDelta = (currHeight - prevHeight) / prevHeight;
  return (xZoomDelta + yZoomDelta) / 2;
};

export const getPointerXYFromTouchOrMouseEvent = (
  event: MouseEvent | TouchEvent
) => {
  const source = isTouchEvent(event) ? (event.touches.item(0) as Touch) : event;
  return { x: source.clientX, y: source.clientY };
};

export const pointerHasMoved = (
  eventAtStart: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent,
  eventAtEnd: TouchEvent | React.TouchEvent | MouseEvent | React.MouseEvent
) => {
  const isTouch = isTouchEvent(eventAtEnd);
  const xyAtStart = getXYFromMouseOrTouchEvent(eventAtStart);
  const xyAtEnd = getXYFromMouseOrTouchEvent(eventAtEnd);
  const delta = Point.subtract(xyAtEnd, xyAtStart);
  const pointerMovementTolerance = isTouch ? 6 : 0;
  return (
    Math.abs(delta.x) > pointerMovementTolerance ||
    Math.abs(delta.y) > pointerMovementTolerance
  );
};
