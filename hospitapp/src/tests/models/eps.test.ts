import { ObjectId } from 'mongodb';
import { Eps } from '@/models/eps';
import { EpsDocument, EpsResponse } from '@/models/eps.interface';

describe('EPS Class', () => {
  const _TEST_EPS_NAME = 'Test EPS';
  const _TEST_EPS_ID = new ObjectId();
  const _TEST_EPS_PHONE = '1234567';
  const _TEST_EPS_FAX = '7654321';
  const _TEST_EPS_EMAILS = 'example@gmail'
  let eps: Eps;

  beforeEach(() => {
    eps = new Eps(_TEST_EPS_ID, _TEST_EPS_NAME, _TEST_EPS_PHONE, _TEST_EPS_FAX, _TEST_EPS_EMAILS);
  });

  describe('Constructor', () => {
    it('should create instance with provided values', () => {
      expect(eps.get_id()).toEqual(_TEST_EPS_ID);
      expect(eps.get_name()).toBe(_TEST_EPS_NAME);
    });

    it('should generate new ObjectId when not provided', () => {
      const _NEW_EPS = new Eps(undefined, _TEST_EPS_NAME, _TEST_EPS_PHONE, _TEST_EPS_FAX, _TEST_EPS_EMAILS);
      expect(_NEW_EPS.get_id()).toBeInstanceOf(ObjectId);
    });
  });

  describe('Validation', () => {
    it('should validate successfully with valid data', () => {
      expect(() => eps.validate()).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const _INVALID_EPS = new Eps(undefined, '', _TEST_EPS_PHONE, _TEST_EPS_FAX, _TEST_EPS_EMAILS);
      expect(() => _INVALID_EPS.validate()).toThrow('Missing required fields');
    });
  });

  describe('toObject()', () => {
    let doc: EpsDocument;
    
    it('should return proper EPSDocument structure', () => {
      doc = eps.to_object();
      
      expect(doc).toEqual({
        _id: _TEST_EPS_ID,
        name: _TEST_EPS_NAME,
        '01_8000_phone': _TEST_EPS_PHONE,
        fax: _TEST_EPS_FAX,
        emails: _TEST_EPS_EMAILS
      });
    });

    it('should maintain data integrity', () => {
      doc = eps.to_object();
      expect(doc._id.equals(_TEST_EPS_ID)).toBe(true);
      expect(doc.name).toBe(_TEST_EPS_NAME);
    });
  });

  describe('Getters', () => {
    it('should return correct ID', () => {
      expect(eps.get_id().equals(_TEST_EPS_ID)).toBe(true);
    });

    it('should return correct name', () => {
      expect(eps.get_name()).toBe(_TEST_EPS_NAME);
    });
  });

  describe('Setters', () => {
    const _NEW_NAME = 'Updated EPS Name';

    it('should update name correctly', () => {
      eps.set_name(_NEW_NAME);
      expect(eps.get_name()).toBe(_NEW_NAME);
    });

    it('should validate after name update', () => {
      eps.set_name(_NEW_NAME);
      expect(() => eps.validate()).not.toThrow();
    });

    it('should throw error when setting invalid name', () => {
      expect(() => eps.set_name('')).toThrow('Missing required fields');
    });
  });

  describe('toString()', () => {
    let str;
    it('should return valid JSON string', () => {
      str = eps.to_string();
      const _PARSED = JSON.parse(str);
      
      expect(_PARSED).toEqual({
        _id: _TEST_EPS_ID.toHexString(),
        name: _TEST_EPS_NAME,
        '01_8000_phone': _TEST_EPS_PHONE,
        fax: _TEST_EPS_FAX,
        emails: _TEST_EPS_EMAILS
      });
    });

    it('should maintain data consistency', () => {
      str = eps.to_string();
      expect(str).toBe(JSON.stringify(eps.to_object()));
    });
  });

  describe('to_response()', () => {
    let doc: EpsResponse;
    
    it('should return proper EPSDocument structure', () => {
      doc = eps.to_response();
      
      expect(doc).toEqual({
        _id: _TEST_EPS_ID.toHexString(),
        name: _TEST_EPS_NAME,
        '01_8000_phone': _TEST_EPS_PHONE,
        fax: _TEST_EPS_FAX,
        emails: _TEST_EPS_EMAILS
      });
    });

    it('should maintain data integrity', () => {
      doc = eps.to_response();
      expect(doc._id).toBe(_TEST_EPS_ID.toHexString());
      expect(doc.name).toBe(_TEST_EPS_NAME);
    });
  });
});