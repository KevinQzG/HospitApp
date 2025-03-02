import { ObjectId } from 'mongodb';
import { EPSDocument } from '@/models/eps.interface';
import { EPS } from '@/models/eps';
import { EPSMapper } from '@/utils/mappers/eps_mapper';

describe('EPSMapper', () => {
  const _SAMPLE_DOC: EPSDocument = {
    _id: new ObjectId(),
    name: 'Test EPS',
    '01_8000_phone': '1234567',
    fax: '7654321',
    emails: 'example@example.com  , example@example.com'
  };

  const _AUTO_GENERATED_DOC: EPSDocument = {
    _id: new ObjectId(),
    name: 'Auto-generated EPS',
    '01_8000_phone': '1234567',
    fax: '7654321',
    emails: 'eexample@example.com'
  };

  let eps: EPS;
  let doc: EPSDocument;

  it('should correctly map document to domain with full data', () => {
    eps = EPSMapper.to_domain(_SAMPLE_DOC);
    
    expect(eps.getId()).toEqual(_SAMPLE_DOC._id);
    expect(eps.getName()).toBe(_SAMPLE_DOC.name);
    expect(eps.getPhone()).toBe(_SAMPLE_DOC['01_8000_phone']);
    expect(eps.getFax()).toBe(_SAMPLE_DOC.fax);
    expect(eps.getEmails()).toBe(_SAMPLE_DOC.emails);
  });

  it('should handle auto-generated ID in document to domain mapping', () => {
    eps = EPSMapper.to_domain(_AUTO_GENERATED_DOC);
    
    expect(eps.getId()).toBeInstanceOf(ObjectId);
    expect(eps.getName()).toBe(_AUTO_GENERATED_DOC.name);
  });

  it('should correctly map domain to document with provided ID', () => {
    eps = new EPS(_SAMPLE_DOC._id, _SAMPLE_DOC.name, _SAMPLE_DOC['01_8000_phone'], _SAMPLE_DOC.fax, _SAMPLE_DOC.emails);
    doc = EPSMapper.to_document(eps);
    
    expect(doc).toEqual(_SAMPLE_DOC);
    expect(doc._id.equals(_SAMPLE_DOC._id)).toBe(true);
  });

  it('should handle auto-generated ID in domain to document mapping', () => {
    eps = new EPS(undefined, 'New EPS', '1234567', '7654321', 'eexample@example.com');
    doc = EPSMapper.to_document(eps);
    
    expect(doc._id).toBeInstanceOf(ObjectId);
    expect(doc.name).toBe('New EPS');
    expect(doc['01_8000_phone']).toBe('1234567');
    expect(doc.fax).toBe('7654321');
    expect(doc.emails).toBe('eexample@example.com');
  });

  it('should maintain data integrity in both directions', () => {
    // Document -> Domain
    const _DOMAIN_EPS = EPSMapper.to_domain(_SAMPLE_DOC);
    
    // Domain -> Document
    const _NEW_DOC = EPSMapper.to_document(_DOMAIN_EPS);
    
    expect(_NEW_DOC).toEqual(_SAMPLE_DOC);
  });
});