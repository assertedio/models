import { expect } from 'chai';

import { DEPENDENCIES_VERSIONS, Routine, ROUTINE_VISIBILITY } from '../../src/models';

const curDate = new Date('2018-01-01T00:00:00.000Z');

describe('routine unit tests', () => {
  it('full create', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      interval: {
        unit: 'hr' as any,
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports' as any,
      },
      timeoutSec: 10,
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    };

    const routine = new Routine(params);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      dependencies: 'v1',
      visibility: ROUTINE_VISIBILITY.PRIVATE,
      interval: {
        unit: 'hr',
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
      timeoutSec: 10,
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    };

    expect(routine).to.eql(expected);
  });

  it('full create - w public', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      visibility: ROUTINE_VISIBILITY.PROTECTED,
      interval: {
        unit: 'hr' as any,
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports' as any,
      },
      timeoutSec: 10,
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    };

    const routine = new Routine(params);

    const expected = {
      id: 'something',
      projectId: 'project-id',
      name: '',
      description: '',
      dependencies: 'v1',
      visibility: ROUTINE_VISIBILITY.PROTECTED,
      interval: {
        unit: 'hr',
        value: 10,
      },
      mocha: {
        files: ['**/specific.asrtd.js', 'other.js'],
        ignore: ['!foo', '!scratch.js'],
        bail: true,
        ui: 'exports',
      },
      timeoutSec: 10,
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    };

    expect(routine).to.eql(expected);
  });

  it('throw if missing id', () => {
    const params = {
      name: 'something',
      projectId: 'project-id',
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    } as any;

    const throws = () => new Routine(params);

    expect(throws).to.throw('id must be a string');
  });

  it('throw if interval is not integer', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'hr',
        value: 1.23,
      },
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    } as any;

    const throws = () => new Routine(params);

    expect(throws).to.throw('interval.value must be an integer number');
  });

  it('throw if interval is less than 1', () => {
    const params = {
      id: 'something',
      projectId: 'project-id',
      interval: {
        unit: 'hr',
        value: 0,
      },
      createdAt: curDate,
      updatedAt: curDate,
      hasPackage: false,
      enabled: false,
    } as any;

    const throws = () => new Routine(params);

    expect(throws).to.throw('interval.value must not be less than 1');
  });
});
