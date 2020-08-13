import { expect } from 'chai';

import { RoutinePackagePatched } from '../../src/requests/routinePackagePatched';

describe('routine package patch unit tests', () => {
  it('create', () => {
    const packagePatch = new RoutinePackagePatched({
      routineId: 'foo',
      error: 'something bad',
    });

    expect(packagePatch).to.eql({
      routineId: 'foo',
      error: 'something bad',
    });
  });

  it('create with empty error', () => {
    const packagePatch = new RoutinePackagePatched({
      routineId: 'foo',
      error: null,
    });

    expect(packagePatch).to.eql({
      routineId: 'foo',
      error: null,
    });
  });
});
