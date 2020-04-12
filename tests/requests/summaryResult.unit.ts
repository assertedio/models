import { expect } from 'chai';

import { RUN_STATUS } from '../../src/models';
import { RUN_TYPE } from '../../src/requests';
import { SummaryResult } from '../../src/requests/summaryResult';
import { TIMELINE_EVENT_STATUS } from '../../src/requests/timelineEvent';

describe('summary result unit tests', () => {
  it('create summary result with text dates', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
      end: '2018-01-01T00:00:00.000Z',
      latestDowntime: {
        start: '2018-01-01T00:00:00.000Z',
        end: '2018-01-01T00:00:00.000Z',
        status: TIMELINE_EVENT_STATUS.UP,
        records: [],
      },
      latestStatus: {
        start: '2018-01-01T00:00:00.000Z',
        end: '2018-01-01T00:00:00.000Z',
        status: TIMELINE_EVENT_STATUS.UP,
        records: [],
      },
      month: {
        start: '2018-01-01T00:00:00.000Z',
        end: '2018-01-01T00:00:00.000Z',
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
      week: {
        start: '2018-01-01T00:00:00.000Z',
        end: '2018-01-01T00:00:00.000Z',
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
      day: {
        start: '2018-01-01T00:00:00.000Z',
        end: '2018-01-01T00:00:00.000Z',
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
      latestRecord: {
        id: 'record-id',
        status: RUN_STATUS.CREATED,
        routineId: 'routine-id',
        projectId: 'project-id',
        errors: null,
        runId: 'run-id',
        type: RUN_TYPE.MANUAL,
        events: null,
        stats: null,
        console: null,
        failType: null,
        timeoutType: null,
        testDurationMs: 0,
        runDurationMs: 0,
        completedAt: '2018-01-01T00:00:00.000Z',
        createdAt: '2018-01-01T00:00:00.000Z',
        updatedAt: '2018-01-01T00:00:00.000Z',
      },
    };

    const summary = new SummaryResult(params);

    const expected = {
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T00:00:00.000Z'),
      latestDowntime: {
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        durationSec: 0,
        status: TIMELINE_EVENT_STATUS.UP,
        records: [],
      },
      latestStatus: {
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        durationSec: 0,
        status: TIMELINE_EVENT_STATUS.UP,
        records: [],
      },
      latestRecord: {
        id: 'record-id',
        status: RUN_STATUS.CREATED,
        routineId: 'routine-id',
        projectId: 'project-id',
        errors: null,
        runId: 'run-id',
        type: RUN_TYPE.MANUAL,
        stats: null,
        console: null,
        failType: null,
        timeoutType: null,
        testDurationMs: 0,
        runDurationMs: 0,
        completedAt: new Date('2018-01-01T00:00:00.000Z'),
      },
      month: {
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
      week: {
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
      day: {
        start: new Date('2018-01-01T00:00:00.000Z'),
        end: new Date('2018-01-01T00:00:00.000Z'),
        runs: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
        tests: {
          availability: 10,
          passes: 1,
          failures: 2,
          total: 3,
        },
      },
    };

    expect(summary).to.eql(expected);
  });
});
