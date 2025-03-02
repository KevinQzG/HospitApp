import { ObjectId } from 'mongodb';
import { IPSDocument } from '@/models/ips.interface';
import { IPS } from '@/models/ips';
import { IpsMapper } from '@/utils/mappers/ips_mapper';

describe('IpsMapper', () => {
  const _SAMPLE_DOC: IPSDocument = {
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

  const _PARTIAL_DOC: IPSDocument = {
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
    ips = IpsMapper.to_domain(_SAMPLE_DOC);
    
    expect(ips.getId()).toEqual(_SAMPLE_DOC._id);
    expect(ips.getName()).toBe(_SAMPLE_DOC.name);
    expect(ips.getPhone()).toBe(_SAMPLE_DOC.phone);
    expect(ips.getLocation().coordinates).toEqual(_SAMPLE_DOC.location.coordinates);
    expect(ips.getDistance()).toBe(_SAMPLE_DOC.distance);
  });

  it('should handle missing optional fields in document', () => {
    ips = IpsMapper.to_domain(_PARTIAL_DOC);
    
    expect(ips.getPhone()).toBeUndefined();
    expect(ips.getEmail()).toBeUndefined();
    expect(ips.getLevel()).toBeUndefined();
    expect(ips.getDistance()).toBeUndefined();
  });

  it('should correctly map domain to document', () => {
    ips = new IPS(
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

    doc = IpsMapper.to_document(ips);
    
    expect(doc).toMatchObject(_SAMPLE_DOC);
    expect(doc.phone).toBe(_SAMPLE_DOC.phone);
    expect(doc.level).toBe(_SAMPLE_DOC.level);
  });

  it('should exclude undefined values in domain to document mapping', () => {
    ips = new IPS(
      _PARTIAL_DOC._id,
      _PARTIAL_DOC.name,
      _PARTIAL_DOC.department,
      _PARTIAL_DOC.town,
      _PARTIAL_DOC.address,
      _PARTIAL_DOC.location
    );

    doc = IpsMapper.to_document(ips);
    
    expect(doc.phone).toBeUndefined();
    expect(doc.email).toBeUndefined();
    expect(doc.level).toBeUndefined();
    expect(doc.distance).toBeUndefined();
  });
});