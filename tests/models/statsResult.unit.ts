import { expect } from 'chai';

import { BUCKET_SIZE, BucketResult, SummaryResult, TIMELINE_EVENT_STATUS, TimelineEvent } from '../../src/models';

describe('stats result unit tests', () => {
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

  it('create timeline event', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
      end: '2018-01-01T00:00:00.000Z',
      status: TIMELINE_EVENT_STATUS.UP,
      records: [],
    };

    const timeline = new TimelineEvent(params);

    const expected = {
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T00:00:00.000Z'),
      durationSec: 0,
      status: TIMELINE_EVENT_STATUS.UP,
      records: [],
    };

    expect(timeline).to.eql(expected);
  });

  it('create bucket result', () => {
    const params = {
      start: '2018-01-01T00:00:00.000Z',
      end: '2018-01-01T00:00:00.000Z',
      bucketSize: BUCKET_SIZE.MONTH,
      buckets: [
        {
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
      ],
      overall: {
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
    };

    const bucket = new BucketResult(params);

    const expected = {
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T00:00:00.000Z'),
      bucketSize: BUCKET_SIZE.MONTH,
      buckets: [
        {
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
      ],
      overall: {
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

    expect(bucket).to.eql(expected);
  });
});
