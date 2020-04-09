import { expect } from 'chai';
import { DateTime } from 'luxon';

import { CompletedRunRecord, RUN_STATUS, RunRecord } from '../../src/models/runRecord';
import { RUN_TIMEOUT_TYPE, TEST_EVENT_TYPES, TestResultInterface } from '../../src/requests';
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
      errors: null,
      runId: runRequest.id,
      type: RUN_TYPE.MANUAL,
      events: null,
      stats: null,
      console: null,
      failType: null,
      timeoutType: null,
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
      timeoutType: null,
      errors: null,
      stats: {
        duration: null,
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
          type: 'suite' as TEST_EVENT_TYPES,
          data: {
            fullTitle: 'suite 1 nested describe 2',
            title: 'nested describe 2',
            duration: null,
            error: null,
            file: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
          },
          stats: {
            duration: null,
            end: undefined,
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
      updatedAt: curDate,
      completedAt: null,
    };

    const result = new RunRecord(params);

    const expected = {
      id: 'rs-run-id',
      projectId: 'project-id',
      runId: 'rn-run-id',
      routineId: 'routine-id',
      errors: null,
      events: [
        {
          type: 'suite',
          data: {
            fullTitle: 'suite 1 nested describe 2',
            title: 'nested describe 2',
            result: null,
            error: null,
            duration: null,
            root: false,
            file: null,
            fullTitlePath: [],
            id: null,
            timedOut: false,
          },
          stats: {
            end: undefined,
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
      stats: {
        end: undefined,
        duration: null,
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
      timeoutType: null,
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
      timeoutType: null,
      events: [
        {
          type: 'test' as TEST_EVENT_TYPES,
          data: {
            duration: null,
            error: {
              diff: 'some-diff',
            },
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
        {
          type: 'end' as TEST_EVENT_TYPES,
          data: {
            duration: null,
            error: {
              diff: 'some-other-diff',
            },
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
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
      errors: [
        {
          code: undefined,
          message: undefined,
          stack: null,
          diff: 'some-diff',
        },
        {
          code: undefined,
          message: undefined,
          stack: null,
          diff: 'some-other-diff',
        },
      ],
      events: [
        {
          type: 'test',
          data: {
            duration: null,
            error: {
              code: undefined,
              message: undefined,
              stack: null,
              diff: 'some-diff',
            },
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
        {
          type: 'end',
          data: {
            duration: null,
            error: {
              code: undefined,
              message: undefined,
              stack: null,
              diff: 'some-other-diff',
            },
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'failed',
      failType: 'test',
      timeoutType: null,
    };
    expect(patch).to.eql(expected);
  });

  it('gets patch from ended and passed test result', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          type: 'end' as TEST_EVENT_TYPES,
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      createdAt: curDate,
    };

    const patch = RunRecord.getPatchFromResult(testResult);

    const expected = {
      console: null,
      runDurationMs: 0,
      testDurationMs: 75,
      timeoutType: null,
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
      errors: null,
      events: [
        {
          type: 'end',
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'passed',
      failType: null,
    };
    expect(expected).to.eql(patch);
  });

  it('gets patch from explicit timed out run', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      timeoutType: RUN_TIMEOUT_TYPE.EXEC,
      events: [
        {
          type: 'end' as TEST_EVENT_TYPES,
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      createdAt: curDate,
    };

    const patch = RunRecord.getPatchFromResult(testResult);

    const expected = {
      console: null,
      runDurationMs: 0,
      testDurationMs: 75,
      timeoutType: RUN_TIMEOUT_TYPE.EXEC,
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
      errors: null,
      events: [
        {
          type: 'end',
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'failed',
      failType: 'timeout',
    };
    expect(expected).to.eql(patch);
  });

  it('gets patch from implicit timed out run', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          type: 'start' as TEST_EVENT_TYPES,
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      createdAt: curDate,
    };

    const patch = RunRecord.getPatchFromResult(testResult);

    const expected = {
      console: null,
      runDurationMs: 0,
      testDurationMs: 75,
      timeoutType: RUN_TIMEOUT_TYPE.UNKNOWN,
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
      errors: null,
      events: [
        {
          type: 'start',
          data: {
            duration: null,
            error: null,
            file: null,
            fullTitle: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: null,
          },
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
          timestamp: curDate,
          elapsedMs: 75,
        },
      ],
      completedAt: curDate,
      status: 'failed',
      failType: 'timeout',
    };
    expect(expected).to.eql(patch);
  });
});

describe('completed runRecord', () => {
  it('create completedRunRecord with from complete runRecord', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
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
      errors: null,
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      events: [
        {
          type: 'suite' as TEST_EVENT_TYPES,
          data: {
            fullTitle: 'suite 1 nested describe 2',
            duration: null,
            error: null,
            file: null,
            fullTitlePath: [],
            id: null,
            result: null,
            root: false,
            timedOut: false,
            title: 'nested describe 2',
          },
          stats: {
            duration: null,
            end: undefined,
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
      completedAt: curDate,
      createdAt: curDate,
      updatedAt: curDate,
    };

    const result = new CompletedRunRecord(params);

    const expected = {
      id: 'rs-run-id',
      projectId: 'project-id',
      runId: 'rn-run-id',
      routineId: 'routine-id',
      errors: null,
      stats: {
        end: undefined,
        duration: null,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      status: 'passed',
      failType: null,
      timeoutType: null,
      completedAt: curDate,
    };

    expect(result).to.eql(expected);
  });

  it('create completedRunRecord with string dates', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
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
      errors: null,
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

    const result = new CompletedRunRecord(params);

    const expected = {
      id: 'rs-run-id',
      projectId: 'project-id',
      runId: 'rn-run-id',
      routineId: 'routine-id',
      errors: null,
      stats: {
        end: undefined,
        duration: null,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      status: 'passed',
      failType: null,
      timeoutType: null,
      completedAt: curDate,
    };

    expect(result).to.eql(expected);
  });

  it('accept badly failed run as complete', () => {
    const params = {
      id: 'rs-ck8izosze008lrgfd2bsmhbrb',
      projectId: 'p-WQmmjAF2P',
      runId: 'rn-ck8izosze008lrgfd2bsmhbrb',
      routineId: 'rt-ck8fzymvl0000lcfd63kafqi4',
      errors: null,
      events: null,
      stats: null,
      runDurationMs: 3635,
      testDurationMs: null,
      type: 'scheduled',
      console:
        "error: Error: Command failed: ./node_modules/mocha/bin/mocha --exit --reporter mocha-ldjson --reporter-options outputPath=/tmp/result.ldjson,overallTimeoutMs=2000 --color=false --ui=bdd --bail=false /tmp/asserted-rn-ck8izosze008lrgfd2bsmhbrb-tPl5KE/**/*.asrtd.js; echo 'Done'\n\n    at ChildProcess.exithandler (child_process.js:294:12)\n    at ChildProcess.emit (events.js:198:13)\n    at ChildProcess.EventEmitter.emit (domain.js:466:23)\n    at maybeClose (internal/child_process.js:982:16)\n    at Process.ChildProcess._handle.onexit (internal/child_process.js:259:5)",
      status: 'failed',
      failType: 'error',
      timeoutType: null,
      createdAt: '2020-04-02T16:44:34.926Z',
      updatedAt: '2020-04-02T16:44:41.116Z',
      completedAt: '2020-04-02T16:44:36.462Z',
    };

    const result = new CompletedRunRecord(params as any);

    const expected = {
      id: 'rs-ck8izosze008lrgfd2bsmhbrb',
      projectId: 'p-WQmmjAF2P',
      runId: 'rn-ck8izosze008lrgfd2bsmhbrb',
      routineId: 'rt-ck8fzymvl0000lcfd63kafqi4',
      errors: null,
      stats: null,
      runDurationMs: 3635,
      testDurationMs: null,
      type: 'scheduled',
      console:
        "error: Error: Command failed: ./node_modules/mocha/bin/mocha --exit --reporter mocha-ldjson --reporter-options outputPath=/tmp/result.ldjson,overallTimeoutMs=2000 --color=false --ui=bdd --bail=false /tmp/asserted-rn-ck8izosze008lrgfd2bsmhbrb-tPl5KE/**/*.asrtd.js; echo 'Done'\n\n    at ChildProcess.exithandler (child_process.js:294:12)\n    at ChildProcess.emit (events.js:198:13)\n    at ChildProcess.EventEmitter.emit (domain.js:466:23)\n    at maybeClose (internal/child_process.js:982:16)\n    at Process.ChildProcess._handle.onexit (internal/child_process.js:259:5)",
      status: 'failed',
      failType: 'error',
      timeoutType: null,
      completedAt: new Date('2020-04-02T16:44:36.462Z'),
    };

    expect(result).to.eql(expected);
  });
});
