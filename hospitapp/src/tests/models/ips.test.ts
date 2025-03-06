import { Ips } from '@/models/ips';
import { Eps } from '@/models/eps';
import { Specialty } from '@/models/specialty';
import { ObjectId } from 'mongodb';
import { IpsResponse } from '@/models/ips.interface';

describe('IPS Class', () => {
  const _VALID_IPS_DATA = {
    _id: new ObjectId(),
    name: 'Hospital Example',
    department: 'ANTIOQUIA',
    town: 'LA ESTRELLA',
    address: 'Test address',
    phone: '5446546',
    email: 'hospital@example.com',
    location: {
      type: 'Point',
      coordinates: [-75.546, 6.66] as [number, number],
    },
    level: 1,
  };

  it('should create an IPS instance with valid data', () => {
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level
    );

    expect(_IPS).toBeInstanceOf(Ips);
    expect(_IPS.get_id()).toEqual(_VALID_IPS_DATA._id);
    expect(_IPS.get_name()).toEqual(_VALID_IPS_DATA.name);
    expect(_IPS.get_department()).toEqual(_VALID_IPS_DATA.department);
    expect(_IPS.get_town()).toEqual(_VALID_IPS_DATA.town);
    expect(_IPS.get_address()).toEqual(_VALID_IPS_DATA.address);
    expect(_IPS.get_phone()).toEqual(_VALID_IPS_DATA.phone);
    expect(_IPS.get_email()).toEqual(_VALID_IPS_DATA.email);
    expect(_IPS.get_location()).toEqual(_VALID_IPS_DATA.location);
    expect(_IPS.get_level()).toEqual(_VALID_IPS_DATA.level);
  });

  it('should validate an IPS instance with valid data', () => {
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level
    );

    expect(() => _IPS.validate()).not.toThrow();
  });

  it('should throw an error when validating an IPS instance with missing required fields', () => {
    const _INVALID_IPS_DATA = { ..._VALID_IPS_DATA, name: '' }; // Missing name
    const _IPS = new Ips(
      _INVALID_IPS_DATA._id,
      _INVALID_IPS_DATA.name,
      _INVALID_IPS_DATA.department,
      _INVALID_IPS_DATA.town,
      _INVALID_IPS_DATA.address,
      _INVALID_IPS_DATA.location,
      _INVALID_IPS_DATA.phone,
      _INVALID_IPS_DATA.email,
      _INVALID_IPS_DATA.level
    );

    expect(() => _IPS.validate()).toThrow('Missing required fields');
  });

  it('should throw an error when validating an IPS instance with invalid location coordinates', () => {
    const _INVALID_IPS_DATA = {
      ..._VALID_IPS_DATA,
      location: { type: 'Point', coordinates: [] as unknown as [number, number] },
    };

    // Create the IPS instance
    const _IPS = new Ips(
      _INVALID_IPS_DATA._id,
      _INVALID_IPS_DATA.name,
      _INVALID_IPS_DATA.department,
      _INVALID_IPS_DATA.town,
      _INVALID_IPS_DATA.address,
      _INVALID_IPS_DATA.location,
      _INVALID_IPS_DATA.phone,
      _INVALID_IPS_DATA.email,
      _INVALID_IPS_DATA.level
    );

    // Validate the IPS instance and expect an error
    expect(() => _IPS.validate()).toThrow('Invalid location coordinates');
  });


  it('should throw an error when validating an IPS instance with invalid location type', () => {
    const _INVALID_IPS_DATA = {
      ..._VALID_IPS_DATA,
      location: { type: 'Test', coordinates: [-75.546, 6.66] as [number, number] }, // Invalid type
    };
    const _IPS = new Ips(
      _INVALID_IPS_DATA._id,
      _INVALID_IPS_DATA.name,
      _INVALID_IPS_DATA.department,
      _INVALID_IPS_DATA.town,
      _INVALID_IPS_DATA.address,
      _INVALID_IPS_DATA.location,
      _INVALID_IPS_DATA.phone,
      _INVALID_IPS_DATA.email,
      _INVALID_IPS_DATA.level
    );

    expect(() => _IPS.validate()).toThrow('Invalid location type');
  });

  it('should convert an IPS instance to a plain object', () => {
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level
    );

    const _IPS_OBJECT = _IPS.to_object();

    expect(_IPS_OBJECT).toEqual({
      _id: _VALID_IPS_DATA._id,
      name: _VALID_IPS_DATA.name,
      department: _VALID_IPS_DATA.department,
      town: _VALID_IPS_DATA.town,
      address: _VALID_IPS_DATA.address,
      phone: _VALID_IPS_DATA.phone,
      email: _VALID_IPS_DATA.email,
      location: _VALID_IPS_DATA.location,
      level: _VALID_IPS_DATA.level,
      distance: undefined, // Optional field
      // eps: undefined // Optional field
    });
  });

  it('should include the distance field in the plain object if provided', () => {
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level,
      1234.56 // Distance
    );

    const _IPS_OBJECT = _IPS.to_object();

    expect(_IPS_OBJECT).toEqual({
      _id: _VALID_IPS_DATA._id,
      name: _VALID_IPS_DATA.name,
      department: _VALID_IPS_DATA.department,
      town: _VALID_IPS_DATA.town,
      address: _VALID_IPS_DATA.address,
      phone: _VALID_IPS_DATA.phone,
      email: _VALID_IPS_DATA.email,
      location: _VALID_IPS_DATA.location,
      level: _VALID_IPS_DATA.level,
      distance: 1234.56, // Included distance
    });
  });

  it('should include the EPS field in the plain object if provided', () => {
    const _EPS = new Eps(new ObjectId(), 'EPS Example', "546546", "546546546", "email@example.com");
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level,
      undefined, // Distance
      [_EPS] // EPS
    );

    const _IPS_OBJECT = _IPS.to_object();

    expect(_IPS_OBJECT).toEqual({
      _id: _VALID_IPS_DATA._id,
      name: _VALID_IPS_DATA.name,
      department: _VALID_IPS_DATA.department,
      town: _VALID_IPS_DATA.town,
      address: _VALID_IPS_DATA.address,
      phone: _VALID_IPS_DATA.phone,
      email: _VALID_IPS_DATA.email,
      location: _VALID_IPS_DATA.location,
      level: _VALID_IPS_DATA.level,
      distance: undefined, // Optional field
      eps: [_EPS.to_object()] // Included EPS
    });
  });

  it('should include the specialties field in the plain object if provided', () => {
    const _SPECIALTY = new Specialty(new ObjectId(), 'Specialty Example');
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level,
      undefined, // Distance
      undefined, // EPS
      [_SPECIALTY] // Specialty
    );

    const _IPS_OBJECT = _IPS.to_object();

    expect(_IPS_OBJECT).toEqual({
      _id: _VALID_IPS_DATA._id,
      name: _VALID_IPS_DATA.name,
      department: _VALID_IPS_DATA.department,
      town: _VALID_IPS_DATA.town,
      address: _VALID_IPS_DATA.address,
      phone: _VALID_IPS_DATA.phone,
      email: _VALID_IPS_DATA.email,
      location: _VALID_IPS_DATA.location,
      level: _VALID_IPS_DATA.level,
      specialties: [_SPECIALTY.to_object()] // Included Specialty
    });

  });

  describe('to_response()', () => {
    let doc: IpsResponse;
    const _IPS = new Ips(
      _VALID_IPS_DATA._id,
      _VALID_IPS_DATA.name,
      _VALID_IPS_DATA.department,
      _VALID_IPS_DATA.town,
      _VALID_IPS_DATA.address,
      _VALID_IPS_DATA.location,
      _VALID_IPS_DATA.phone,
      _VALID_IPS_DATA.email,
      _VALID_IPS_DATA.level
    );

    it('should return proper EPSDocument structure', () => {
      doc = _IPS.to_response();

      expect(doc).toEqual({
        _id: _VALID_IPS_DATA._id.toHexString(),
        name: _VALID_IPS_DATA.name,
        department: _VALID_IPS_DATA.department,
        town: _VALID_IPS_DATA.town,
        address: _VALID_IPS_DATA.address,
        phone: _VALID_IPS_DATA.phone,
        email: _VALID_IPS_DATA.email,
        location: _VALID_IPS_DATA.location,
        level: _VALID_IPS_DATA.level,
        distance: undefined, // Optional field
        // eps: undefined // Optional field
      });
    });

    it('should maintain data integrity', () => {
      doc = _IPS.to_response();
      expect(doc._id).toBe(_VALID_IPS_DATA._id.toHexString());
      expect(doc.name).toBe(_VALID_IPS_DATA.name);
    });
  });
});