import { ObjectId } from 'mongodb';
import { EPS } from '@/models/eps';
import { EPSDocument } from '@/models/eps.interface';

describe('EPS Class', () => {
  const _TEST_EPS_NAME = 'Test EPS';
  const _TEST_EPS_ID = new ObjectId();
  let eps: EPS;

  beforeEach(() => {
    eps = new EPS(_TEST_EPS_ID, _TEST_EPS_NAME);
  });

  describe('Constructor', () => {
    it('should create instance with provided values', () => {
      expect(eps.getId()).toEqual(_TEST_EPS_ID);
      expect(eps.getName()).toBe(_TEST_EPS_NAME);
    });

    it('should generate new ObjectId when not provided', () => {
      const _NEW_EPS = new EPS(undefined, _TEST_EPS_NAME);
      expect(_NEW_EPS.getId()).toBeInstanceOf(ObjectId);
    });
  });

  describe('Validation', () => {
    it('should validate successfully with valid data', () => {
      expect(() => eps.validate()).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const _INVALID_EPS = new EPS(undefined, '');
      expect(() => _INVALID_EPS.validate()).toThrow('Missing required fields');
    });
  });

  describe('toObject()', () => {
    let doc: EPSDocument;
    
    it('should return proper EPSDocument structure', () => {
      doc = eps.toObject();
      
      expect(doc).toEqual({
        _id: _TEST_EPS_ID,
        name: _TEST_EPS_NAME
      });
    });

    it('should maintain data integrity', () => {
      doc = eps.toObject();
      expect(doc._id.equals(_TEST_EPS_ID)).toBe(true);
      expect(doc.name).toBe(_TEST_EPS_NAME);
    });
  });

  describe('Getters', () => {
    it('should return correct ID', () => {
      expect(eps.getId().equals(_TEST_EPS_ID)).toBe(true);
    });

    it('should return correct name', () => {
      expect(eps.getName()).toBe(_TEST_EPS_NAME);
    });
  });

  describe('Setters', () => {
    const _NEW_NAME = 'Updated EPS Name';

    it('should update name correctly', () => {
      eps.setName(_NEW_NAME);
      expect(eps.getName()).toBe(_NEW_NAME);
    });

    it('should validate after name update', () => {
      eps.setName(_NEW_NAME);
      expect(() => eps.validate()).not.toThrow();
    });

    it('should throw error when setting invalid name', () => {
      expect(() => eps.setName('')).toThrow('Missing required fields');
    });
  });

  describe('toString()', () => {
    let str;
    it('should return valid JSON string', () => {
      str = eps.toString();
      const _PARSED = JSON.parse(str);
      
      expect(_PARSED).toEqual({
        _id: _TEST_EPS_ID.toHexString(),
        name: _TEST_EPS_NAME
      });
    });

    it('should maintain data consistency', () => {
      str = eps.toString();
      expect(str).toBe(JSON.stringify(eps.toObject()));
    });
  });
});