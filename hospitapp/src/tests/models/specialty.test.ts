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
      expect(specialty.getId()).toEqual(_TEST_ID);
      expect(specialty.getName()).toBe(_TEST_NAME);
      expect(specialty.getScheduleMonday()).toBe(_TEST_SCHEDULE);
    });

    it('should generate new ObjectId when not provided', () => {
      const _NEW_SPECIALTY = new Specialty(undefined, 'New Specialty');
      expect(_NEW_SPECIALTY.getId()).toBeInstanceOf(ObjectId);
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
      specialty.setScheduleTuesday('10:00-18:00');
      specialty.setScheduleWednesday('08:00-16:00');
      
      expect(specialty.getScheduleTuesday()).toBe('10:00-18:00');
      expect(specialty.getScheduleWednesday()).toBe('08:00-16:00');
    });

    it('should validate when updating name', () => {
      expect(() => specialty.setName('Updated Name')).not.toThrow();
      
      expect(() => specialty.setName('')).toThrow('Missing required fields');
    });
  });

  describe('Serialization', () => {
    it('should convert to document correctly', () => {
      const _DOC = specialty.toObject();
      
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
      const _STR = specialty.toString();
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
      
      expect(_MINIMAL_SPECIALTY.getScheduleThursday()).toBeUndefined();
      expect(_MINIMAL_SPECIALTY.toObject().schedule_friday).toBeUndefined();
    });
  });
});