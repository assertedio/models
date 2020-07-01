import { expect } from 'chai';

import { DEPENDENCIES_VERSIONS, INTERVAL_UNITS } from '../../src/models';
import { CreateRoutine } from '../../src/requests';

describe('createRoutine unit tests', () => {
  it('minimal create', () => {
    const params = { projectId: 'foo-id' };

    const createRoutine = new CreateRoutine(params);

    const expected = {
      name: undefined,
      projectId: 'foo-id',
      description: undefined,
      interval: undefined,
      mocha: undefined,
      timeoutSec: undefined,
      dependencies: undefined,
    };

    expect(createRoutine).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      name: 'foo',
      projectId: 'foo-id',
      description: 'bar',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
        parallel: false,
      },
      interval: {
        unit: INTERVAL_UNITS.DAY,
        value: 10,
      },
      timeoutSec: 10,
    };

    const createRoutine = new CreateRoutine(params);

    const expected = {
      name: 'foo',
      projectId: 'foo-id',
      description: 'bar',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      interval: {
        unit: 'day',
        value: 10,
      },
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        bail: true,
        ui: 'require',
        parallel: false,
      },
      timeoutSec: 10,
    };

    expect(createRoutine).to.eql(expected);
  });

  it('fail on invalid interval', () => {
    const params = {
      name: 'foo',
      projectId: 'foo-id',
      description: 'bar',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require' as any,
        bail: true,
        parallel: false,
      },
      interval: {
        unit: INTERVAL_UNITS.DAY,
        value: '1',
      },
      timeoutSec: 10,
    };

    expect(() => new CreateRoutine(params as any)).to.throw('value');
  });
});
