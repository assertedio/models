import { expect } from 'chai';

import { INTERVAL_UNITS } from '../../src/models';
import { CreateRoutine } from '../../src/requests';

describe('createRoutine unit tests', () => {
  it('minimal create', () => {
    const params = { projectId: 'foo-id' };

    const createRoutine = new CreateRoutine(params);

    const expected = {
      name: '',
      projectId: 'foo-id',
      description: '',
      interval: undefined,
      mocha: undefined,
    };

    expect(createRoutine).to.eql(expected);
  });

  it('full create', () => {
    const params = {
      name: 'foo',
      projectId: 'foo-id',
      description: 'bar',
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        ui: 'require',
        bail: true,
      },
      interval: {
        unit: INTERVAL_UNITS.DAY,
        value: 10,
      },
    };

    const createRoutine = new CreateRoutine(params as any);

    const expected = {
      name: 'foo',
      projectId: 'foo-id',
      description: 'bar',
      interval: {
        unit: 'day',
        value: 10,
      },
      mocha: {
        files: ['bar.js'],
        ignore: ['foo.js'],
        bail: true,
        ui: 'require',
      },
    };

    expect(createRoutine).to.eql(expected);
  });
});
