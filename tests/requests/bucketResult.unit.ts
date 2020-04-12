import { expect } from 'chai';

import { BUCKET_SIZE, BucketResult } from '../../src/requests/bucketResult';

describe('bucket result unit tests', () => {
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
