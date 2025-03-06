import { ObjectId } from 'mongodb';
import { Specialty } from '@/models/specialty';

describe('Specialty Model', () => {
  const _TEST_ID = new ObjectId();
  const _TEST_NAME = 'Pediatrics';
  const _TEST_SCHEDULE = '09:00-17:00';

  let specialty: Specialty;

  beforeEach(() => {
    specialty = new Specialty(
      _TEST_ID,
      _TEST_NAME,
      _TEST_SCHEDULE
    );
  });

  describe('Constructor', () => {
    it('should initialize with provided values', () => {
      expect(specialty.get_id()).toEqual(_TEST_ID);
      expect(specialty.get_name()).toBe(_TEST_NAME);
      expect(specialty.get_schedule_monday()).toBe(_TEST_SCHEDULE);
    });

    it('should generate new ObjectId when not provided', () => {
      const _NEW_SPECIALTY = new Specialty(undefined, 'New Specialty');
      expect(_NEW_SPECIALTY.get_id()).toBeInstanceOf(ObjectId);
    });
  });

  describe('Validation', () => {
    it('should validate with required fields', () => {
      expect(() => specialty.validate()).not.toThrow();
    });

    it('should throw error when name is missing', () => {
      const _INVALID_SPECIALTY = new Specialty(undefined, '', _TEST_SCHEDULE);
      expect(() => _INVALID_SPECIALTY.validate()).toThrow('Missing required fields');
    });
  });

  describe('Setters and Getters', () => {
    it('should update and retrieve all schedule days', () => {
      specialty.set_schedule_tuesday('10:00-18:00');
      specialty.set_schedule_wednesday('08:00-16:00');
      
      expect(specialty.get_schedule_tuesday()).toBe('10:00-18:00');
      expect(specialty.get_schedule_wednesday()).toBe('08:00-16:00');
    });

    it('should validate when updating name', () => {
      expect(() => specialty.set_name('Updated Name')).not.toThrow();
      
      expect(() => specialty.set_name('')).toThrow('Missing required fields');
    });
  });

  describe('Serialization', () => {
    it('should convert to document correctly', () => {
      const _DOC = specialty.to_object();
      
      expect(_DOC).toEqual({
        _id: _TEST_ID,
        name: _TEST_NAME,
        schedule_monday: _TEST_SCHEDULE,
        schedule_tuesday: undefined,
        schedule_wednesday: undefined,
        schedule_thursday: undefined,
        schedule_friday: undefined,
        schedule_saturday: undefined,
        schedule_sunday: undefined
      });
    });

    it('should serialize to JSON string', () => {
      const _STR = specialty.to_string();
      const _PARSED = JSON.parse(_STR);
      
      expect(_PARSED).toEqual({
        _id: _TEST_ID.toHexString(),
        name: _TEST_NAME,
        schedule_monday: _TEST_SCHEDULE
      });
    });
  });

  describe('Partial Schedule Handling', () => {
    it('should handle undefined schedule days', () => {
      const _MINIMAL_SPECIALTY = new Specialty(undefined, 'Minimal Specialty');
      
      expect(_MINIMAL_SPECIALTY.get_schedule_thursday()).toBeUndefined();
      expect(_MINIMAL_SPECIALTY.to_object().schedule_friday).toBeUndefined();
    });
  });
});