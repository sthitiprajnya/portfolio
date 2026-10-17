import { describe, expect, it } from 'vitest';
import { createFrameGate } from './canvasFrame';

describe('createFrameGate', () => {
  it('allows the first frame, then limits drawing to the requested rate', () => {
    const shouldDraw = createFrameGate(30);

    expect(shouldDraw(0)).toBe(true);
    expect(shouldDraw(16)).toBe(false);
    expect(shouldDraw(34)).toBe(true);
    expect(shouldDraw(50)).toBe(false);
    expect(shouldDraw(68)).toBe(true);
  });

  it('keeps separate canvas loops independent', () => {
    const matrixRain = createFrameGate(24);
    const networkLines = createFrameGate(24);

    expect(matrixRain(0)).toBe(true);
    expect(networkLines(0)).toBe(true);
    expect(matrixRain(20)).toBe(false);
    expect(networkLines(42)).toBe(true);
    expect(matrixRain(42)).toBe(true);
  });

  it('rejects an invalid frame-rate budget', () => {
    expect(() => createFrameGate(0)).toThrow(RangeError);
  });
});
