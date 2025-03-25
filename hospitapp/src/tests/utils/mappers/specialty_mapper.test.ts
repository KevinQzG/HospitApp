import { ObjectId } from 'mongodb';
import { SpecialtyDocument } from '@/models/specialty.interface';
import { Specialty } from '@/models/specialty';
import { SpecialtyMapper } from '@/utils/mappers/specialty_mapper';

describe('SpecialtyMapper', () => {
  const FULL_DOC: SpecialtyDocument = {
    _id: new ObjectId(),
    name: 'Cardiology',
    "schedule_monday": '08:00-18:00',
    "schedule_tuesday": '08:00-18:00',
    "schedule_wednesday": '08:00-18:00',
    "schedule_thursday": '08:00-18:00',
    "schedule_friday": '08:00-18:00',
    "schedule_saturday": '09:00-13:00',
    "schedule_sunday": undefined
  };

  const MINIMAL_DOC: SpecialtyDocument = {
    _id: new ObjectId(),
    name: 'Emergency Care'
  };

  let specialty: Specialty;
  let doc: SpecialtyDocument;

  it('should map complete document to domain', () => {
    specialty = SpecialtyMapper.fromDocumentToDomain(FULL_DOC);
    
    expect(specialty.getId()).toEqual(FULL_DOC._id);
    expect(specialty.getName()).toBe(FULL_DOC.name);
    expect(specialty.getScheduleMonday()).toBe(FULL_DOC.schedule_monday);
    expect(specialty.getScheduleSunday()).toBeUndefined();
  });

  it('should map minimal document to domain', () => {
    specialty = SpecialtyMapper.fromDocumentToDomain(MINIMAL_DOC);
    
    expect(specialty.getId()).toEqual(MINIMAL_DOC._id);
    expect(specialty.getName()).toBe(MINIMAL_DOC.name);
    expect(specialty.getScheduleMonday()).toBeUndefined();
  });

  it('should map complete domain to document', () => {
    specialty = new Specialty(
      FULL_DOC._id,
      FULL_DOC.name,
      FULL_DOC.schedule_monday,
      FULL_DOC.schedule_tuesday,
      FULL_DOC.schedule_wednesday,
      FULL_DOC.schedule_thursday,
      FULL_DOC.schedule_friday,
      FULL_DOC.schedule_saturday
    );

    doc = SpecialtyMapper.fromDomainToDocument(specialty);
    
    expect(doc).toEqual({
      ...FULL_DOC,
      "schedule_sunday": undefined
    });
  });

  it('should handle undefined schedule fields in domain to document', () => {
    specialty = new Specialty(MINIMAL_DOC._id, MINIMAL_DOC.name);
    doc = SpecialtyMapper.fromDomainToDocument(specialty);
    
    expect(doc).toEqual(MINIMAL_DOC);
  });

  it('should maintain data integrity in bidirectional mapping', () => {
    const ORIGINAL_DOC = FULL_DOC;
    const DOMAIN = SpecialtyMapper.fromDocumentToDomain(ORIGINAL_DOC);
    const NEW_DOC = SpecialtyMapper.fromDomainToDocument(DOMAIN);
    
    expect(NEW_DOC).toEqual(ORIGINAL_DOC);
  });
});