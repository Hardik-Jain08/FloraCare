import { isEqual, uniqWith } from "lodash-es";

export type XY = { x: number; y: number };

export type RectDef = {
  left: number;
  right: number;
  top: number;
  bottom: number;
};

const xs = (ps: XY[]) => ps.map(p => p.x);
const ys = (ps: XY[]) => ps.map(p => p.y);
const digits = (n: number, d: number) => Number(n.toFixed(d));

const zero = { x: 0, y: 0 };
const add = (p1: XY, p2: XY) => ({ x: p1.x + p2.x, y: p1.y + p2.y });
const sum = (...ps: XY[]) => ps.reduce((summed, i) => add(summed, i), zero);
const subtract = (p1: XY, p2: XY) => ({ x: p1.x - p2.x, y: p1.y - p2.y });
const multiply = (p: XY, n: number) => ({ x: p.x * n, y: p.y * n });
const divide = (p: XY, n: number) => ({ x: p.x / n, y: p.y / n });
const round = (p: XY, n = 0) => ({ x: digits(p.x, n), y: digits(p.y, n) });
const ceil = (p: XY) => ({ x: Math.ceil(p.x), y: Math.ceil(p.y) });
const max = (ps: XY[]) =>
  ps.length ? { x: Math.max(...xs(ps)), y: Math.max(...ys(ps)) } : zero;
const min = (ps: XY[]) =>
  ps.length ? { x: Math.min(...xs(ps)), y: Math.min(...ys(ps)) } : zero;
const extents = (ps: XY[]) => ({ min: min(ps), max: max(ps) });
const equal = (p1: XY, p2: XY) => isEqual(p1, p2);
const uniq = (ps: XY[]) => uniqWith(ps, equal);
const invalid = (ps: XY) =>
  ps === undefined || ps.x === undefined || ps.y === undefined;
const presence = (ps: XY) => (invalid(ps) ? zero : ps);

const snap = (n: number, gridN: number) => Math.round(n / gridN) * gridN;
const stretch = (n: number, gridN: number) => snap(n + gridN / 2, gridN);
const stretchToGrid = (p: XY, gridN: number) => ({
  x: stretch(p.x, gridN),
  y: stretch(p.y, gridN),
});
const snapToGrid = (p: XY, gridN: number) => ({
  x: snap(p.x, gridN),
  y: snap(p.y, gridN),
});
const center = ({ left, right, top, bottom }: RectDef) => ({
  x: (right - left) / 2,
  y: (bottom - top) / 2,
});
const includes = (r: RectDef, p: XY) =>
  r.left < p.x && r.right > p.x && r.top < p.y && r.bottom > p.y;

const area = (p1: XY, p2: XY) => Math.abs(p1.x - p2.x) * Math.abs(p1.y - p2.y);

const Point = {
  add,
  divide,
  equal,
  extents,
  max,
  min,
  multiply,
  round,
  ceil,
  snapToGrid,
  stretchToGrid,
  subtract,
  sum,
  uniq,
  invalid,
  presence,
  zero,
};

export const Rect = {
  includes,
  center,
  area,
};

export default Point;
