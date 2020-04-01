import { expect } from 'chai';
import { DateTime } from 'luxon';

import { BUCKET_SIZE, BucketStats, SummaryStats, TimelineStats } from '../../src/requests/stats';

const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

describe('stats request unit tests', () => {
  it('timeline stats minimal create', () => {
    const params = {
      routineId: null,
    };

    const timelineRequest = new TimelineStats(params, true, curDate);

    const expected = {
      ...params,
      start: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
      end: curDate,
    };
    expect(timelineRequest).to.eql(expected);
  });

  it('timeline stats full create', () => {
    const params = {
      routineId: null,
      start: DateTime.fromJSDate(curDate).minus({ week: 4 }).toJSDate(),
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };

    const timelineRequest = new TimelineStats(params, true, curDate);

    const expected = {
      ...params,
      start: DateTime.fromJSDate(curDate).minus({ week: 4 }).toJSDate(),
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };
    expect(timelineRequest).to.eql(expected);
  });

  it('summary stats minimal create', () => {
    const params = {
      routineId: null,
    };

    const summaryRequest = new SummaryStats(params, true, curDate);

    const expected = {
      ...params,
      end: curDate,
    };
    expect(summaryRequest).to.eql(expected);
  });

  it('summary stats full create', () => {
    const params = {
      routineId: null,
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };

    const summaryRequest = new SummaryStats(params, true, curDate);

    const expected = {
      ...params,
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };
    expect(summaryRequest).to.eql(expected);
  });

  it('bucket stats minimal create', () => {
    const params = {
      routineId: null,
    };

    const bucketRequest = new BucketStats(params, true, curDate);

    const expected = {
      ...params,
      bucketSize: BUCKET_SIZE.HOUR,
      start: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
      end: curDate,
    };
    expect(bucketRequest).to.eql(expected);
  });

  it('bucket stats full create', () => {
    const params = {
      routineId: null,
      bucketSize: BUCKET_SIZE.MONTH,
      start: DateTime.fromJSDate(curDate).minus({ week: 4 }).toJSDate(),
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };

    const bucketRequest = new BucketStats(params, true, curDate);

    const expected = {
      ...params,
      bucketSize: BUCKET_SIZE.MONTH,
      start: DateTime.fromJSDate(curDate).minus({ week: 4 }).toJSDate(),
      end: DateTime.fromJSDate(curDate).minus({ week: 1 }).toJSDate(),
    };
    expect(bucketRequest).to.eql(expected);
  });
});
