import { ObjectId } from 'mongodb';
import { EPSDocument } from '@/models/eps.interface';
import { EPS } from '@/models/eps';
import { EPSMapper } from '@/utils/mappers/eps_mapper';

describe('EPSMapper', () => {
  const _SAMPLE_DOC: EPSDocument = {
    _id: new ObjectId(),
    name: 'Test EPS'
  };

  const _AUTO_GENERATED_DOC: EPSDocument = {
    _id: new ObjectId(),
    name: 'Auto-generated EPS'
  };

  let eps: EPS;
  let doc: EPSDocument;

  it('should correctly map document to domain with full data', () => {
    eps = EPSMapper.to_domain(_SAMPLE_DOC);
    
    expect(eps.getId()).toEqual(_SAMPLE_DOC._id);
    expect(eps.getName()).toBe(_SAMPLE_DOC.name);
  });

  it('should handle auto-generated ID in document to domain mapping', () => {
    eps = EPSMapper.to_domain(_AUTO_GENERATED_DOC);
    
    expect(eps.getId()).toBeInstanceOf(ObjectId);
    expect(eps.getName()).toBe(_AUTO_GENERATED_DOC.name);
  });

  it('should correctly map domain to document with provided ID', () => {
    eps = new EPS(_SAMPLE_DOC._id, _SAMPLE_DOC.name);
    doc = EPSMapper.to_document(eps);
    
    expect(doc).toEqual(_SAMPLE_DOC);
    expect(doc._id.equals(_SAMPLE_DOC._id)).toBe(true);
  });

  it('should handle auto-generated ID in domain to document mapping', () => {
    eps = new EPS(undefined, 'New EPS');
    doc = EPSMapper.to_document(eps);
    
    expect(doc._id).toBeInstanceOf(ObjectId);
    expect(doc.name).toBe('New EPS');
  });

  it('should maintain data integrity in both directions', () => {
    // Document -> Domain
    const _DOMAIN_EPS = EPSMapper.to_domain(_SAMPLE_DOC);
    
    // Domain -> Document
    const _NEW_DOC = EPSMapper.to_document(_DOMAIN_EPS);
    
    expect(_NEW_DOC).toEqual(_SAMPLE_DOC);
  });
});