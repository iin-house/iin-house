import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('handles undefined and null', () => {
    expect(cn('a', undefined, 'b')).toBe('a b');
    expect(cn('a', null, 'b')).toBe('a b');
  });

  it('handles conditional classes via clsx', () => {
    expect(cn('base', true && 'active')).toBe('base active');
    expect(cn('base', false && 'active')).toBe('base');
  });

  it('merges conflicting tailwind classes with twMerge', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });
});
