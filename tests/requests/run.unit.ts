import { expect } from 'chai';
import { omit } from 'lodash';
import { DateTime } from 'luxon';

import { Run } from '../../src/requests/run';

describe('run unit tests', () => {
  it('create', () => {
    const params = {
      projectId: 'project-id',
      routineId: 'routine-id',
      package: 'pack-age',
      timeoutMs: 100,
      mocha: {
        files: ['foo.js'],
      } as any,
    };

    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const run = Run.create(params, curDate);

    const expected = {
      projectId: 'project-id',
      routineId: 'routine-id',
      package: 'pack-age',
      timeoutMs: 100,
      mocha: {
        files: ['foo.js'],
        ignore: [],
        bail: false,
        ui: 'bdd',
      },
      createdAt: curDate,
    };
    expect(omit(run, 'id')).to.eql(expected);
  });
});
