import { expect } from 'chai';
import fs from 'fs-extra';
import { omit } from 'lodash';
import { DateTime } from 'luxon';
import path from 'path';

import { DEPENDENCIES_VERSIONS } from '../../src/models';
import { CompletedRunRecord, RUN_STATUS, RunRecord } from '../../src/models/runRecord';
import { RUN_TIMEOUT_TYPE, TEST_EVENT_TYPES, TestResult, TestResultInterface } from '../../src/requests';
import { Run, RUN_TYPE } from '../../src/requests/run';

const RESOURCE_PATH = path.join(__dirname, '../resources/models/runRecord');

describe('runRecord unit tests', () => {
  it('create from run', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();
    const runRequest = Run.create(
      {
        package: 'pack-age',
        type: 'manual' as any,
        dependencies: DEPENDENCIES_VERSIONS.V1,
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
      results: null,
      stats: null,
      error: null,
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
      error: null,
      failType: null,
      timeoutType: null,
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        incomplete: 0,
        pending: 0,
        failures: 2,
        start: new Date('2020-03-16T01:33:23.753Z'),
      },
      results: [],
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
      results: [],
      stats: {
        end: undefined,
        duration: null,
        suites: 3,
        tests: 5,
        passes: 3,
        pending: 0,
        failures: 2,
        incomplete: 0,
        start: new Date('2020-03-16T01:33:23.753Z'),
      },
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      error: null,
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
      error: null,
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          data: {
            type: 'test' as TEST_EVENT_TYPES,
            id: 'foo-id',
            duration: null,
            error: {
              diff: 'some-diff',
            },
            file: null,
            fullTitle: 'full title',
            fullTitlePath: [],
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
            incomplete: 0,
            failures: 2,
            start: curDate,
            end: curDate,
            duration: 75,
          },
          timestamp: curDate,
          elapsedMs: 75,
        },
        {
          data: {
            type: 'end' as TEST_EVENT_TYPES,
            duration: null,
            error: {
              diff: 'some-other-diff',
            },
            file: null,
            fullTitle: 'full title',
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
            incomplete: 0,
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
        tests: 8,
        passes: 5,
        pending: 0,
        failures: 2,
        incomplete: 1,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      results: [
        {
          id: 'foo-id',
          type: 'test',
          duration: null,
          error: {
            code: undefined,
            fullTitle: undefined,
            message: undefined,
            stack: null,
            diff: 'some-diff',
          },
          file: null,
          fullTitle: 'full title',
          fullTitlePath: [],
          result: 'incomplete',
          root: false,
          timedOut: false,
          title: null,
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
      error: null,
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          data: {
            type: 'end' as TEST_EVENT_TYPES,
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
            incomplete: 0,
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
        incomplete: 0,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      results: [],
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
      error: null,
      type: 'manual' as any,
      timeoutType: RUN_TIMEOUT_TYPE.EXEC,
      events: [
        {
          data: {
            type: 'end' as TEST_EVENT_TYPES,
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
            incomplete: 0,
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
        incomplete: 0,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      results: [],
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
      error: null,
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          data: {
            type: 'start' as TEST_EVENT_TYPES,
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
            incomplete: 0,
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
        incomplete: 0,
        failures: 0,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      results: [],
      completedAt: curDate,
      status: 'failed',
      failType: 'timeout',
    };
    expect(expected).to.eql(patch);
  });

  it('gets patch with error', () => {
    const curDate = DateTime.fromISO('2018-01-01T00:00:00.000Z').toJSDate();

    const testResult: TestResultInterface = {
      runId: 'run-id',
      runDurationMs: 0,
      console: null,
      error: 'something bad happened',
      type: 'manual' as any,
      timeoutType: null,
      events: [
        {
          data: {
            type: 'start' as TEST_EVENT_TYPES,
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
            incomplete: 0,
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
      error: 'something bad happened',
      stats: {
        suites: 4,
        tests: 7,
        passes: 5,
        pending: 0,
        incomplete: 0,
        failures: 0,
        start: curDate,
        end: curDate,
        duration: 75,
      },
      results: [],
      completedAt: curDate,
      status: 'failed',
      failType: 'error',
    };
    expect(expected).to.eql(patch);
  });

  it('get patch for incomplete run', async () => {
    const testResult: TestResultInterface = await fs.readJson(path.join(RESOURCE_PATH, 'reporterTimeoutResult.json'));

    const patch = RunRecord.getPatchFromResult(testResult);
    expect(JSON.parse(JSON.stringify(omit(patch, 'console')))).to.eql({
      results: [
        {
          id: 'cka405akt00022hs6243c3mcx',
          type: 'test',
          duration: null,
          title: 'testy',
          fullTitle: 'timeout test -> testy',
          fullTitlePath: ['timeout test', 'testy'],
          result: 'incomplete',
          root: false,
          file: '/timeoutPackage/timeout.asrtd.js',
          error: {
            message: 'Routine timeout reached',
          },
          timedOut: false,
        },
      ],
      stats: {
        suites: 1,
        tests: 1,
        passes: 0,
        pending: 0,
        failures: 0,
        incomplete: 1,
        start: '2020-05-12T14:20:16.942Z',
        duration: null,
      },
      runDurationMs: 1763,
      testDurationMs: 31,
      completedAt: '2020-05-12T14:20:16.277Z',
      timeoutType: 'reporter',
      status: 'failed',
      failType: 'timeout',
    });
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
      error: null,
      failType: null,
      timeoutType: null,
      results: [],
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        incomplete: 0,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      events: [
        {
          data: {
            type: 'suite' as TEST_EVENT_TYPES,
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
            incomplete: 0,
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
      stats: {
        end: undefined,
        duration: null,
        suites: 3,
        tests: 5,
        passes: 3,
        incomplete: 0,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      results: [],
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      error: null,
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
      error: null,
      results: [],
      stats: {
        duration: null,
        end: undefined,
        suites: 3,
        tests: 5,
        passes: 3,
        incomplete: 0,
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

      stats: {
        end: undefined,
        duration: null,
        suites: 3,
        tests: 5,
        passes: 3,
        incomplete: 0,
        pending: 0,
        failures: 2,
        start: curDate,
      },
      results: [],
      runDurationMs: 0,
      testDurationMs: 0,
      type: 'manual',
      console: null,
      error: null,
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
      // eslint-disable-next-line no-secrets/no-secrets
      runId: 'rn-ck8izosze008lrgfd2bsmhbrb',
      routineId: 'rt-ck8fzymvl0000lcfd63kafqi4',

      events: null,
      stats: null,
      runDurationMs: 3635,
      testDurationMs: null,
      type: 'scheduled',
      console:
        // eslint-disable-next-line no-secrets/no-secrets
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
      // eslint-disable-next-line no-secrets/no-secrets
      runId: 'rn-ck8izosze008lrgfd2bsmhbrb',
      routineId: 'rt-ck8fzymvl0000lcfd63kafqi4',
      error: null,
      stats: null,
      runDurationMs: 3635,
      testDurationMs: null,
      type: 'scheduled',
      results: [],
      console:
        // eslint-disable-next-line no-secrets/no-secrets
        "error: Error: Command failed: ./node_modules/mocha/bin/mocha --exit --reporter mocha-ldjson --reporter-options outputPath=/tmp/result.ldjson,overallTimeoutMs=2000 --color=false --ui=bdd --bail=false /tmp/asserted-rn-ck8izosze008lrgfd2bsmhbrb-tPl5KE/**/*.asrtd.js; echo 'Done'\n\n    at ChildProcess.exithandler (child_process.js:294:12)\n    at ChildProcess.emit (events.js:198:13)\n    at ChildProcess.EventEmitter.emit (domain.js:466:23)\n    at maybeClose (internal/child_process.js:982:16)\n    at Process.ChildProcess._handle.onexit (internal/child_process.js:259:5)",
      status: 'failed',
      failType: 'error',
      timeoutType: null,
      completedAt: new Date('2020-04-02T16:44:36.462Z'),
    };

    expect(result).to.eql(expected);
  });

  it('extract test data from events - passing', async () => {
    const testResult = new TestResult(await fs.readJson(path.join(RESOURCE_PATH, 'passingTestResult.json')));
    const data = RunRecord.getResults(testResult.events, null);
    expect(JSON.parse(JSON.stringify(data))).to.eql(await fs.readJson(path.join(RESOURCE_PATH, 'passingTestData.json')));
  });

  it('extract test data from events - reporter timeout', async () => {
    const testResult = new TestResult(await fs.readJson(path.join(RESOURCE_PATH, 'reporterTimeoutResult.json')));
    const data = RunRecord.getResults(testResult.events, RUN_TIMEOUT_TYPE.REPORTER);
    expect(JSON.parse(JSON.stringify(data))).to.eql(await fs.readJson(path.join(RESOURCE_PATH, 'reporterTimeoutData.json')));
  });

  it('extract test data from events - internal timeout', async () => {
    const testResult = new TestResult(await fs.readJson(path.join(RESOURCE_PATH, 'internalTimeoutResult.json')));
    const data = RunRecord.getResults(testResult.events, null);
    expect(JSON.parse(JSON.stringify(data))).to.eql(await fs.readJson(path.join(RESOURCE_PATH, 'internalTimeoutData.json')));
  });
});
