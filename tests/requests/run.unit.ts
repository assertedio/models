import { expect } from 'chai';
import { omit } from 'lodash';
import { DateTime } from 'luxon';

import { DEPENDENCIES_VERSIONS } from '../../src/models';
import { Run } from '../../src/requests/run';

describe('run unit tests', () => {
  it('create', () => {
    const params = {
      package: 'pack-age',
      timeoutMs: 100,
      type: 'manual' as any,
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['foo.js'],
      } as any,
    };

    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const run = Run.create(params, curDate);

    const expected = {
      package: 'pack-age',
      timeoutMs: 100,
      type: 'manual',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['foo.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
        parallel: false,
      },
      createdAt: curDate,
    };
    expect(omit(run, 'id')).to.eql(expected);
  });

  it('create with string date', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      id: 'foo-id',
      package: 'pack-age',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      timeoutMs: 100,
      type: 'manual' as any,
      mocha: {
        files: ['foo.js'],
      } as any,
      createdAt: curDate.toISOString(),
    };

    const run = new Run(params as any);

    const expected = {
      package: 'pack-age',
      timeoutMs: 100,
      type: 'manual',
      dependencies: DEPENDENCIES_VERSIONS.V1,
      mocha: {
        files: ['foo.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
        parallel: false,
      },
      createdAt: curDate,
    };
    expect(omit(run, 'id')).to.eql(expected);
  });
});
