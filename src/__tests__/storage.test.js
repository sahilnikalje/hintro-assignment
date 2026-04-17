import { describe, it, expect, beforeEach } from 'vitest';
import { safeGetItem, safeSetItem, safeRemoveItem } from '../utils/storage';

describe('Storage Utilities', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback for missing keys', () => {
    expect(safeGetItem('nonexistent', 'default')).toBe('default');
    expect(safeGetItem('nonexistent')).toBeNull();
  });

  it('stores and retrieves values correctly', () => {
    const data = { tasks: [{ id: 1, title: 'Test' }] };
    safeSetItem('test_key', data);
    expect(safeGetItem('test_key')).toEqual(data);
  });

  it('handles corrupted JSON gracefully', () => {
    localStorage.setItem('corrupt', '{invalid json!!!');
    expect(safeGetItem('corrupt', 'fallback')).toBe('fallback');
  });

  it('removes items safely', () => {
    safeSetItem('to_remove', { value: true });
    expect(safeGetItem('to_remove')).toEqual({ value: true });

    safeRemoveItem('to_remove');
    expect(safeGetItem('to_remove')).toBeNull();
  });

  it('handles empty storage gracefully', () => {
    localStorage.clear();
    expect(safeGetItem('anything', [])).toEqual([]);
  });
});
