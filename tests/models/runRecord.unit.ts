import { expect } from 'chai';
import { DateTime } from 'luxon';

import { RUN_STATUS, RunRecord } from '../../src/models/runRecord';
import { TestResultInterface } from '../../src/requests';
import { Run, RUN_TYPE } from '../../src/requests/run';

describe('runRecord unit tests', () => {
  it('create from run', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const runRequest = Run.create(
      {
        package: 'pack-age',
        type: 'manual' as any,
        mocha: {
          files: ['foo.js'],
        } as any,
        timeoutMs: 100,
      },
      curDate
    );

    const result = RunRecord.create(runRequest, 'project-id', 'routine-id', curDate);

    const expected = {
      id: runRequest.id.replace('rn-', 'rs-'),
      status: RUN_STATUS.CREATED,
      routineId: 'routine-id',
      projectId: 'project-id',
      runId: runRequest.id,
      type: RUN_TYPE.MANUAL,
      events: null,
      stats: null,
      console: null,
      failType: null,
      testDurationMs: null,
      runDurationMs: null,
      completedAt: null,
      createdAt: curDate,
      updatedAt: curDate,
    };
    expect(result).to.eql(expected);
  });

  it('create full version', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const params = {
      id: 'rs-run-id',
      status: RUN_STATUS.CREATED,
      projectId: 'project-id',
      routineId: 'routine-id',
      runId: 'rn-run-id',
      type: RUN_TYPE.MANUAL,
      runDurationMs: 0,
      testDurationMs: 0,
      console: null,
      failType: null,
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
      updatedAt: curDate,
      completedAt: null,
    };

    const result = new RunRecord(params);

    const expected = {
      id: 'rs-run-id',
      projectId: 'project-id',
      runId: 'rn-run-id',
      routineId: 'routine-id',
      events: [
        {
          type: 'suite',
          data: {
            fullTitle: 'suite 1 nested describe 2',
            result: undefined,
            err: undefined,
            duration: undefined,
            root: false,
            stats: {
              end: undefined,
              duration: undefined,
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
      stats: {
        end: undefined,
        duration: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: new Date('2020-03-16T01:33:23.753Z'),
      },
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      status: 'created',
      failType: null,
      createdAt: curDate,
      updatedAt: curDate,
      completedAt: null,
    };

    expect(result).to.eql(expected);
  });

  it('gets patch from ended and failed test result', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      events: [
        {
          type: 'end',
          data: {
            stats: {
              suites: 4,
              tests: 7,
              passes: 5,
              pending: 0,
              failures: 2,
              start: curDate,
              end: curDate,
              duration: 75,
            },
            total: 10,
          },
          timestamp: curDate,
          timeMs: 75,
        },
      ],
      createdAt: curDate,
    };

    const patch = RunRecord.getPatchFromResult(testResult);

    const expected = {
      console: null,
      runDurationMs: 0,
      testDurationMs: 75,
      stats: {
        suites: 4,
        tests: 7,
        passes: 5,
        pending: 0,
        failures: 2,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      events: [
        {
          type: 'end',
          data: {
            stats: {
              suites: 4,
              tests: 7,
              passes: 5,
              pending: 0,
              failures: 2,
              start: curDate,
              end: curDate,
              duration: 75,
            },
            total: 10,
          },
          timestamp: curDate,
          timeMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'failed',
      failType: 'test',
    };
    expect(expected).to.eql(patch);
  });

  it('gets patch from ended and passed test result', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      events: [
        {
          type: 'end',
          data: {
            stats: {
              suites: 4,
              tests: 7,
              passes: 5,
              pending: 0,
              failures: 0,
              start: curDate,
              end: curDate,
              duration: 75,
            },
            total: 10,
          },
          timestamp: curDate,
          timeMs: 75,
        },
      ],
      createdAt: curDate,
    };

    const patch = RunRecord.getPatchFromResult(testResult);

    const expected = {
      console: null,
      runDurationMs: 0,
      testDurationMs: 75,
      stats: {
        suites: 4,
        tests: 7,
        passes: 5,
        pending: 0,
        failures: 0,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      events: [
        {
          type: 'end',
          data: {
            stats: {
              suites: 4,
              tests: 7,
              passes: 5,
              pending: 0,
              failures: 0,
              start: curDate,
              end: curDate,
              duration: 75,
            },
            total: 10,
          },
          timestamp: curDate,
          timeMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'passed',
      failType: null,
    };
    expect(expected).to.eql(patch);
  });
});
