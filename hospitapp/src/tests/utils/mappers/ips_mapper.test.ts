import { ObjectId } from 'mongodb';
import { IpsDocument } from '@/models/ips.interface';
import { Ips } from '@/models/ips';
import { IpsMapper } from '@/utils/mappers/ips_mapper';

describe('IpsMapper', () => {
  const _SAMPLE_DOC: IpsDocument = {
    _id: new ObjectId(),
    name: 'Test IPS',
    department: 'Test Department',
    town: 'Test Town',
    address: 'Test Address',
    phone: '123456789',
    email: 'test@example.com',
    location: {
      type: 'Point',
      coordinates: [-75.6, 6.1]
    },
    level: 2,
    distance: 1500
  };

  const _PARTIAL_DOC: IpsDocument = {
    _id: new ObjectId(),
    name: 'Partial IPS',
    department: 'Partial Department',
    town: 'Partial Town',
    address: 'Partial Address',
    location: {
      type: 'Point',
      coordinates: [-75.7, 6.2]
    }
  };
  let ips, doc;

  it('should correctly map document to domain with full data', () => {
    ips = IpsMapper.from_document_to_domain(_SAMPLE_DOC);
    
    expect(ips.get_id()).toEqual(_SAMPLE_DOC._id);
    expect(ips.get_name()).toBe(_SAMPLE_DOC.name);
    expect(ips.get_phone()).toBe(_SAMPLE_DOC.phone);
    expect(ips.get_location().coordinates).toEqual(_SAMPLE_DOC.location.coordinates);
    expect(ips.get_distance()).toBe(_SAMPLE_DOC.distance);
  });

  it('should handle missing optional fields in document', () => {
    ips = IpsMapper.from_document_to_domain(_PARTIAL_DOC);
    
    expect(ips.get_phone()).toBeUndefined();
    expect(ips.get_email()).toBeUndefined();
    expect(ips.get_level()).toBeUndefined();
    expect(ips.get_distance()).toBeUndefined();
    expect(ips.get_eps()).toBeUndefined();
    expect(ips.get_specialties()).toBeUndefined();
  });

  it('should correctly map domain to document', () => {
    ips = new Ips(
      _SAMPLE_DOC._id,
      _SAMPLE_DOC.name,
      _SAMPLE_DOC.department,
      _SAMPLE_DOC.town,
      _SAMPLE_DOC.address,
      _SAMPLE_DOC.location,
      _SAMPLE_DOC.phone,
      _SAMPLE_DOC.email,
      _SAMPLE_DOC.level,
      _SAMPLE_DOC.distance
    );

    doc = IpsMapper.from_domain_to_document(ips);
    
    expect(doc).toMatchObject(_SAMPLE_DOC);
    expect(doc.phone).toBe(_SAMPLE_DOC.phone);
    expect(doc.level).toBe(_SAMPLE_DOC.level);
  });

  it('should exclude undefined values in domain to document mapping', () => {
    ips = new Ips(
      _PARTIAL_DOC._id,
      _PARTIAL_DOC.name,
      _PARTIAL_DOC.department,
      _PARTIAL_DOC.town,
      _PARTIAL_DOC.address,
      _PARTIAL_DOC.location
    );

    doc = IpsMapper.from_domain_to_document(ips);
    
    expect(doc.phone).toBeUndefined();
    expect(doc.email).toBeUndefined();
    expect(doc.level).toBeUndefined();
    expect(doc.distance).toBeUndefined();
    expect(doc.eps).toBeUndefined();
    expect(doc.specialties).toBeUndefined();
  });
});