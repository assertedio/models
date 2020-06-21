import { expect } from 'chai';
import { DateTime } from 'luxon';
import { BuildResult } from '../../src/requests';

describe('build result unit tests', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2020-01-01T00:00:00.000Z').toJSDate();
    expect(BuildResult.create({ id: 'foo', console: 'string console', buildDurationMs: 100 }, curDate)).to.eql({
      id: 'foo',
      console: 'string console',
      buildDurationMs: 100,
      createdAt: curDate,
    });
  });
});
