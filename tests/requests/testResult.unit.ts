import { expect } from 'chai';
import { DateTime } from 'luxon';

import { RUNNERS, TestResult } from '../../src/requests';

describe('testResult unit tests', () => {
  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'run-id',
      summary: {
        failures: [
          {
            actual: 'something',
            expected: 'not-something',
            message: 'it broke yo',
            stack: 'big stacks',
            title: 'some-title',
          },
        ],
        runner: RUNNERS.MOCHA,
        stats: {
          duration: 100,
          failures: 1,
          passes: 1,
          pending: 0,
          suites: 2,
          tests: 2,
        },
      },
      createdAt: curDate,
    };

    const testResult = new TestResult(params);

    expect(testResult).to.eql(params);
  });
});
