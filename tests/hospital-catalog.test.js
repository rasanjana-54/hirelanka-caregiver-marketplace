import assert from 'node:assert/strict';
import test from 'node:test';
import { OPENSTREETMAP_HOSPITALS } from '../src/data/openStreetMapHospitals.js';

test('OpenStreetMap hospital catalog contains complete, deduplicated Sri Lankan entries', () => {
  assert.equal(OPENSTREETMAP_HOSPITALS.length, 371);
  assert.equal(new Set(OPENSTREETMAP_HOSPITALS.map(hospital => hospital.id)).size, OPENSTREETMAP_HOSPITALS.length);
  assert.equal(new Set(OPENSTREETMAP_HOSPITALS.map(hospital => hospital.name.toLowerCase())).size, OPENSTREETMAP_HOSPITALS.length);
  assert.equal(new Set(OPENSTREETMAP_HOSPITALS.map(hospital => hospital.district)).size, 25);

  for (const hospital of OPENSTREETMAP_HOSPITALS) {
    assert.ok(hospital.name.trim());
    assert.ok(hospital.location.trim());
    assert.ok(hospital.osmId);
    assert.ok(hospital.latitude >= 5.5 && hospital.latitude <= 10.5);
    assert.ok(hospital.longitude >= 79 && hospital.longitude <= 82.5);
    assert.ok(['government', 'private', 'unknown'].includes(hospital.hospitalType));
  }
});
