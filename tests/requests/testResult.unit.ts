import { expect } from 'chai';
import { DateTime } from 'luxon';

import { TEST_EVENT_TYPES, TestResult } from '../../src/requests';

describe('testResult unit tests', () => {
  it('construct', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      events: [
        {
          type: 'suite' as TEST_EVENT_TYPES,
          data: {
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            title: 'nested describe 2',
            duration: null,
            error: null,
            file: null,
            fullTitlePath: [],
            id: null,
            result: null,
            timedOut: false,
          },
          stats: {
            duration: null,
            suites: 3,
            tests: 5,
            passes: 3,
            pending: 0,
            failures: 2,
            start: new Date('2020-03-16T01:33:23.753Z'),
          },
          timestamp: new Date('2020-03-16T01:33:23.826Z'),
          elapsedMs: 73,
        },
      ],
      createdAt: curDate,
    };

    const testResult = new TestResult(params);

    const expected = {
      runId: 'run-id',
      type: 'manual',
      console: null,
      runDurationMs: 0,
      events: [
        {
          type: 'suite',
          data: {
            id: null,
            duration: null,
            title: 'nested describe 2',
            fullTitle: 'suite 1 nested describe 2',
            fullTitlePath: [],
            result: null,
            root: false,
            file: null,
            error: null,
            timedOut: false,
          },
          stats: {
            suites: 3,
            tests: 5,
            passes: 3,
            pending: 0,
            failures: 2,
            start: new Date('2020-03-16T01:33:23.753Z'),
            end: undefined,
            duration: null,
          },
          timestamp: new Date('2020-03-16T01:33:23.826Z'),
          elapsedMs: 73,
        },
      ],
      createdAt: new Date('2018-01-01T00:00:00.000Z'),
    };

    expect(testResult).to.eql(expected);
  });

  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      events: [
        {
          type: 'suite' as TEST_EVENT_TYPES,
          data: {
            total: 1,
            title: 'nested describe 2',
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            duration: null,
            error: null,
            file: null,
            fullTitlePath: [],
            id: null,
            result: null,
            timedOut: false,
          },
          stats: { duration: null, suites: 3, tests: 5, passes: 3, pending: 0, failures: 2, start: '2020-03-16T01:33:23.753Z' },
          timestamp: '2020-03-16T01:33:23.826Z',
          elapsedMs: 73,
        },
      ],
      createdAt: curDate,
    };

    const testResult = TestResult.create(params, curDate);

    const expected = {
      runId: 'run-id',
      type: 'manual',
      console: null,
      runDurationMs: 0,
      events: [
        {
          type: 'suite',
          data: {
            id: null,
            duration: null,
            title: 'nested describe 2',
            fullTitle: 'suite 1 nested describe 2',
            fullTitlePath: [],
            result: null,
            root: false,
            file: null,
            error: null,
            timedOut: false,
          },
          stats: {
            suites: 3,
            tests: 5,
            passes: 3,
            pending: 0,
            failures: 2,
            start: new Date('2020-03-16T01:33:23.753Z'),
            end: undefined,
            duration: null,
          },
          timestamp: new Date('2020-03-16T01:33:23.826Z'),
          elapsedMs: 73,
        },
      ],
      createdAt: new Date('2018-01-01T00:00:00.000Z'),
    };

    expect(testResult).to.eql(expected);
  });
});
