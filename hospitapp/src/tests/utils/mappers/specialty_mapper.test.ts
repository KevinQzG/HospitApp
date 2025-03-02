import { ObjectId } from 'mongodb';
import { SpecialtyDocument } from '@/models/specialty.interface';
import { Specialty } from '@/models/specialty';
import { SpecialtyMapper } from '@/utils/mappers/specialty_mapper';

describe('SpecialtyMapper', () => {
  const _FULL_DOC: SpecialtyDocument = {
    _id: new ObjectId(),
    name: 'Cardiology',
    schedule_monday: '08:00-18:00',
    schedule_tuesday: '08:00-18:00',
    schedule_wednesday: '08:00-18:00',
    schedule_thursday: '08:00-18:00',
    schedule_friday: '08:00-18:00',
    schedule_saturday: '09:00-13:00',
    schedule_sunday: undefined
  };

  const _MINIMAL_DOC: SpecialtyDocument = {
    _id: new ObjectId(),
    name: 'Emergency Care'
  };

  let specialty: Specialty;
  let doc: SpecialtyDocument;

  it('should map complete document to domain', () => {
    specialty = SpecialtyMapper.to_domain(_FULL_DOC);
    
    expect(specialty.getId()).toEqual(_FULL_DOC._id);
    expect(specialty.getName()).toBe(_FULL_DOC.name);
    expect(specialty.getScheduleMonday()).toBe(_FULL_DOC.schedule_monday);
    expect(specialty.getScheduleSunday()).toBeUndefined();
  });

  it('should map minimal document to domain', () => {
    specialty = SpecialtyMapper.to_domain(_MINIMAL_DOC);
    
    expect(specialty.getId()).toEqual(_MINIMAL_DOC._id);
    expect(specialty.getName()).toBe(_MINIMAL_DOC.name);
    expect(specialty.getScheduleMonday()).toBeUndefined();
  });

  it('should map complete domain to document', () => {
    specialty = new Specialty(
      _FULL_DOC._id,
      _FULL_DOC.name,
      _FULL_DOC.schedule_monday,
      _FULL_DOC.schedule_tuesday,
      _FULL_DOC.schedule_wednesday,
      _FULL_DOC.schedule_thursday,
      _FULL_DOC.schedule_friday,
      _FULL_DOC.schedule_saturday
    );

    doc = SpecialtyMapper.to_document(specialty);
    
    expect(doc).toEqual({
      ..._FULL_DOC,
      schedule_sunday: undefined
    });
  });

  it('should handle undefined schedule fields in domain to document', () => {
    specialty = new Specialty(_MINIMAL_DOC._id, _MINIMAL_DOC.name);
    doc = SpecialtyMapper.to_document(specialty);
    
    expect(doc).toEqual(_MINIMAL_DOC);
  });

  it('should maintain data integrity in bidirectional mapping', () => {
    const _ORIGINAL_DOC = _FULL_DOC;
    const _DOMAIN = SpecialtyMapper.to_domain(_ORIGINAL_DOC);
    const _NEW_DOC = SpecialtyMapper.to_document(_DOMAIN);
    
    expect(_NEW_DOC).toEqual(_ORIGINAL_DOC);
  });
});