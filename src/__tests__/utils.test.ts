import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles undefined and null', () => {
    expect(cn('a', undefined, 'b')).toBe('a b');
    expect(cn('a', null, 'b')).toBe('a b');
    expect(cn('a', false, 'b')).toBe('a b');
  });

  it('handles conditional classes via clsx', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'active')).toBe('base');
  });

  it('merges conflicting tailwind classes with twMerge', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('handles empty input', () => {
    expect(cn()).toBe('');
  });
});
