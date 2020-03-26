import { expect } from 'chai';
import { DateTime } from 'luxon';

import { RUN_STATUS, RUN_TYPE, RunRecord } from '../../src/models/runRecord';
import { Run } from '../../src/requests/run';

describe('runRecord unit tests', () => {
  it('create from run', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const runRequest = Run.create(
      {
        projectId: 'project-id',
        routineId: 'routine-id',
        package: 'pack-age',
        mocha: {
          files: ['foo.js'],
        } as any,
        timeoutMs: 100,
      },
      curDate
    );

    const result = RunRecord.create(runRequest, RUN_TYPE.MANUAL, curDate);

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
});
