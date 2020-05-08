import { expect } from 'chai';
import { DateTime } from 'luxon';

import { BucketStats, BucketStatsConstructorInterface, CompletedRunRecord, RUN_STATUS } from '../../src/models';
import { Bucket, BUCKET_SIZE } from '../../src/models/bucket';
import { RUN_TYPE } from '../../src/requests';

describe('bucket unit test', () => {
  it('get start - 5 min', () => {
    expect(Bucket.getStart(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:03:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:06:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:05:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:55:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T01:00:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T01:00:00.000Z');
  });

  it('get start - hour', () => {
    expect(Bucket.getStart(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:03:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:46:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T01:01:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T01:00:00.000Z');
  });

  it('get start - 6 hour', () => {
    expect(Bucket.getStart(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T00:03:03.010Z').toJSDate()).toISO()).to.eql('2018-01-01T00:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T07:06:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T06:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T11:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T06:00:00.000Z');
    expect(Bucket.getStart(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T19:10:03.001Z').toJSDate()).toISO()).to.eql('2018-01-01T18:00:00.000Z');
  });

  it('get end - 5 min', () => {
    expect(Bucket.getEnd(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:03:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:04:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:06:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:09:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T00:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.MIN_5, DateTime.fromISO('2018-01-01T01:00:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T01:04:59.999Z');
  });

  it('get end - hour', () => {
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:03:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:46:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T00:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T00:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR, DateTime.fromISO('2018-01-01T01:05:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T01:59:59.999Z');
  });

  it('get end - 6 hour', () => {
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T00:03:03.010Z').toJSDate()).toISO()).to.eql('2018-01-01T05:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T07:06:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T11:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T11:59:03.000Z').toJSDate()).toISO()).to.eql('2018-01-01T11:59:59.999Z');
    expect(Bucket.getEnd(BUCKET_SIZE.HOUR_6, DateTime.fromISO('2018-01-01T19:10:03.001Z').toJSDate()).toISO()).to.eql('2018-01-01T23:59:59.999Z');
  });

  it('create empty bucket stats', () => {
    const params: BucketStatsConstructorInterface = {
      failures: 0,
      passes: 0,
    };

    const bucketStats = new BucketStats(params);
    expect(bucketStats).to.eql({ ...params, total: 0, availability: 0 });
  });

  it('create bucket', () => {
    const params = {
      id: 'rs-run-id',
      status: RUN_STATUS.PASSED,
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'rn-run-id',
      type: RUN_TYPE.MANUAL,
      runDurationMs: 0,
      testDurationMs: 0,
      console: null,
      failType: null,
      timeoutType: null,
      error: null,
      results: [],
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: '2018-01-01T00:00:00.000Z',
      },
      completedAt: '2018-01-01T00:00:00.000Z',
    };

    const completedRecord = new CompletedRunRecord(params);

    const bucket = Bucket.create(completedRecord, BUCKET_SIZE.MIN_5);

    expect(bucket).to.eql({
      id: 'bk-1S4POA',
      size: 'min5',
      projectId: 'project-id',
      routineId: 'routine-id',
      tests: {
        availability: 0.6,
        failures: 2,
        passes: 3,
        total: 5,
      },
      runs: {
        availability: 1,
        failures: 0,
        passes: 1,
        total: 1,
      },
      start: new Date('2018-01-01T00:00:00.000Z'),
      end: new Date('2018-01-01T00:04:59.999Z'),
    });
  });
});
