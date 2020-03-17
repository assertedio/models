import { expect } from 'chai';
import { DateTime } from 'luxon';

import { TestResult } from '../../src/requests';

describe('testResult unit tests', () => {
  it('construct', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      events: [
        {
          type: 'suite',
          data: {
            total: 1,
            title: 'nested describe 2',
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            stats: { suites: 3, tests: 5, passes: 3, pending: 0, failures: 2, start: '2020-03-16T01:33:23.753Z' },
          },
          timestamp: '2020-03-16T01:33:23.826Z',
          timeMs: 73,
        },
      ],
      createdAt: curDate,
    };

    const testResult = new TestResult(params);

    const expected = {
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      events: [
        {
          type: 'suite',
          data: {
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            duration: undefined,
            err: undefined,
            result: undefined,
            stats: {
              duration: undefined,
              end: undefined,
              suites: 3,
              tests: 5,
              passes: 3,
              pending: 0,
              failures: 2,
              start: new Date('2020-03-16T01:33:23.753Z'),
            },
            title: 'nested describe 2',
            total: 1,
          },
          timestamp: new Date('2020-03-16T01:33:23.826Z'),
          timeMs: 73,
        },
      ],
      createdAt: curDate,
    };

    expect(testResult).to.eql(expected);
  });

  it('create', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const params = {
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      events: [
        {
          type: 'suite',
          data: {
            total: 1,
            title: 'nested describe 2',
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            stats: { suites: 3, tests: 5, passes: 3, pending: 0, failures: 2, start: '2020-03-16T01:33:23.753Z' },
          },
          timestamp: '2020-03-16T01:33:23.826Z',
          timeMs: 73,
        },
      ],
      createdAt: curDate,
    };

    const testResult = TestResult.create(params, curDate);

    const expected = {
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      events: [
        {
          type: 'suite',
          data: {
            fullTitle: 'suite 1 nested describe 2',
            root: false,
            duration: undefined,
            err: undefined,
            result: undefined,
            stats: {
              duration: undefined,
              end: undefined,
              suites: 3,
              tests: 5,
              passes: 3,
              pending: 0,
              failures: 2,
              start: new Date('2020-03-16T01:33:23.753Z'),
            },
            title: 'nested describe 2',
            total: 1,
          },
          timestamp: new Date('2020-03-16T01:33:23.826Z'),
          timeMs: 73,
        },
      ],
      createdAt: curDate,
    };

    expect(testResult).to.eql(expected);
  });
});
