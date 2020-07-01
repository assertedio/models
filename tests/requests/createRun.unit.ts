import { expect } from 'chai';

import { DEPENDENCIES_VERSIONS } from '../../src/models';
import { CreateRun } from '../../src/requests';

describe('createRun unit tests', () => {
  it('minimal create', () => {
    const params = {
      package: 'compressed-content',
      dependencies: DEPENDENCIES_VERSIONS.V1,
    };

    const createRun = new CreateRun(params);

    const expected = {
      package: 'compressed-content',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['**/*.asrtd.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
        parallel: false,
      },
    };

    expect(createRun).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      package: 'compressed-content',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['something.js', 'something-else.js'],
        ignore: ['athing.js'],
        bail: true,
        ui: 'require',
      },
    };

    const createRun = new CreateRun(params as any);

    const expected = {
      package: 'compressed-content',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['something.js', 'something-else.js'],
        ignore: ['athing.js'],
        bail: true,
        ui: 'require',
        parallel: false,
      },
    };

    expect(createRun).to.eql(expected);
  });

  it('reject with missing package', () => {
    expect(() => new CreateRun({ routineId: 'routine-id', dependencies: DEPENDENCIES_VERSIONS.V1 } as any)).to.throw('package must be a string');
  });

  it('reject with bad files', () => {
    const params = {
      package: 'compressed-content',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      routineId: 'routine-id',
      mocha: {
        files: {},
      },
    };

    expect(() => new CreateRun(params as any)).to.throw('mocha.each value in files must be a string');
  });
});
