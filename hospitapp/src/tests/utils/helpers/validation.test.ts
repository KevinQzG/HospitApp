import { IS_TYPE_ARRAY } from  "@/utils/helpers/validation";

describe('IS_TYPE_ARRAY', () => {
  // Test valid arrays with different types
  describe('should return true for valid arrays', () => {
    test('string array without length check', () => {
      expect(IS_TYPE_ARRAY(['a', 'b'], 'string')).toBe(true);
      expect(IS_TYPE_ARRAY([''], 'string')).toBe(true);
    });

    test('number array with matching length', () => {
      expect(IS_TYPE_ARRAY([1, 2, 3], 'number', 3)).toBe(true);
      expect(IS_TYPE_ARRAY([0, -1.5], 'number', 2)).toBe(true);
    });

    test('boolean array', () => {
      expect(IS_TYPE_ARRAY([true, false], 'boolean')).toBe(true);
      expect(IS_TYPE_ARRAY([false], 'boolean', 1)).toBe(true);
    });

    test('object array (typeof null edge case)', () => {
      expect(IS_TYPE_ARRAY([{}, null], 'object')).toBe(true);
    });

    test('empty array without length check', () => {
      expect(IS_TYPE_ARRAY([], 'string')).toBe(true);
    });
  });

  // Test invalid arrays
  describe('should return false for invalid arrays', () => {
    test('mixed type arrays', () => {
      expect(IS_TYPE_ARRAY(['a', 1], 'string')).toBe(false);
      expect(IS_TYPE_ARRAY([1, '2'], 'number')).toBe(false);
    });

    test('correct type but wrong length', () => {
      expect(IS_TYPE_ARRAY([1, 2, 3], 'number', 2)).toBe(false);
      expect(IS_TYPE_ARRAY(['a'], 'string', 3)).toBe(false);
    });

    test('empty array with length requirement', () => {
      expect(IS_TYPE_ARRAY([], 'number', 0)).toBe(true);
      expect(IS_TYPE_ARRAY([], 'number', 1)).toBe(false);
    });

    test('null/undefined values', () => {
      expect(IS_TYPE_ARRAY([null], 'object')).toBe(true);
      expect(IS_TYPE_ARRAY([undefined], 'undefined')).toBe(true);
      expect(IS_TYPE_ARRAY([null], 'undefined')).toBe(false);
    });
  });

  // Test edge cases
  describe('edge cases', () => {
    test('NaN values in number arrays', () => {
      expect(IS_TYPE_ARRAY([NaN, 5], 'number')).toBe(true);
      expect(IS_TYPE_ARRAY([NaN, '5'], 'number')).toBe(false);
    });

    test('sparse arrays', () => {
      const SPARSE = new Array(3);
      expect(IS_TYPE_ARRAY(SPARSE, 'undefined')).toBe(true);
      expect(IS_TYPE_ARRAY(SPARSE, 'object')).toBe(true);
      expect(IS_TYPE_ARRAY(SPARSE, 'number')).toBe(true);
      expect(IS_TYPE_ARRAY(SPARSE, 'null')).toBe(true);
    });
  });
});