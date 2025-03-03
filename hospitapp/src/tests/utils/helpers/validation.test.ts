import { is_type_array } from  "@/utils/helpers/validation";

describe('is_type_array', () => {
  // Test valid arrays with different types
  describe('should return true for valid arrays', () => {
    test('string array without length check', () => {
      expect(is_type_array(['a', 'b'], 'string')).toBe(true);
      expect(is_type_array([''], 'string')).toBe(true);
    });

    test('number array with matching length', () => {
      expect(is_type_array([1, 2, 3], 'number', 3)).toBe(true);
      expect(is_type_array([0, -1.5], 'number', 2)).toBe(true);
    });

    test('boolean array', () => {
      expect(is_type_array([true, false], 'boolean')).toBe(true);
      expect(is_type_array([false], 'boolean', 1)).toBe(true);
    });

    test('object array (typeof null edge case)', () => {
      expect(is_type_array([{}, null], 'object')).toBe(true);
    });

    test('empty array without length check', () => {
      expect(is_type_array([], 'string')).toBe(true);
    });
  });

  // Test invalid arrays
  describe('should return false for invalid arrays', () => {
    test('mixed type arrays', () => {
      expect(is_type_array(['a', 1], 'string')).toBe(false);
      expect(is_type_array([1, '2'], 'number')).toBe(false);
    });

    test('correct type but wrong length', () => {
      expect(is_type_array([1, 2, 3], 'number', 2)).toBe(false);
      expect(is_type_array(['a'], 'string', 3)).toBe(false);
    });

    test('empty array with length requirement', () => {
      expect(is_type_array([], 'number', 0)).toBe(true);
      expect(is_type_array([], 'number', 1)).toBe(false);
    });

    test('null/undefined values', () => {
      expect(is_type_array([null], 'object')).toBe(true);
      expect(is_type_array([undefined], 'undefined')).toBe(true);
      expect(is_type_array([null], 'undefined')).toBe(false);
    });
  });

  // Test edge cases
  describe('edge cases', () => {
    test('NaN values in number arrays', () => {
      expect(is_type_array([NaN, 5], 'number')).toBe(true);
      expect(is_type_array([NaN, '5'], 'number')).toBe(false);
    });

    test('sparse arrays', () => {
      const _SPARSE = new Array(3);
      expect(is_type_array(_SPARSE, 'undefined')).toBe(true);
      expect(is_type_array(_SPARSE, 'object')).toBe(true);
      expect(is_type_array(_SPARSE, 'number')).toBe(true);
      expect(is_type_array(_SPARSE, 'null')).toBe(true);
    });
  });
});