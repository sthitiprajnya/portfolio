import { describe, expect, it } from 'vitest';
import { sitePath } from './sitePath';

describe('sitePath', () => {
  it('prefixes root-relative public asset paths with the repository base path', () => {
    expect(sitePath('/images/profile.jpg')).toBe('/portfolio/images/profile.jpg');
  });

  it('accepts paths without a leading slash', () => {
    expect(sitePath('resume/cv.pdf')).toBe('/portfolio/resume/cv.pdf');
  });

  it('does not duplicate an existing repository prefix', () => {
    expect(sitePath('/portfolio/images/profile.jpg')).toBe('/portfolio/images/profile.jpg');
  });
});
