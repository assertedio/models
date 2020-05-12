import { IsDate, IsEnum, IsInstance, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { isNumber, last } from 'lodash';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { Run, RUN_TYPE, RunInterface } from '../requests/run';
import {
  TEST_EVENT_TYPES,
  TEST_RESULT_STATUS,
  TestData,
  TestDataInterface,
  TestErrorInterface,
  TestEvent,
  TestEventInterface,
  TestStats,
  TestStatsConstructorInterface,
  TestStatsInterface,
} from '../requests/testEvent';
import { RUN_TIMEOUT_TYPE, TestResultInterface } from '../requests/testResult';
import { enumError, toDate } from '../utils';
import { ValidatedBase } from '../validatedBase';

export enum RUN_STATUS {
  CREATED = 'created',
  FAILED = 'failed',
  PASSED = 'passed',
}

export enum RUN_FAIL_TYPE {
  TIMEOUT = 'timeout',
  TEST = 'test',
  ERROR = 'error',
}

interface CreateRunRecordInterface {
  projectId: string;
  runId: string;
  routineId: string;
}

export interface RunRecordInterface extends CreateRunRecordInterface {
  id: string;
  stats: TestStatsInterface | null;
  runDurationMs: number | null;
  testDurationMs: number | null;
  type: RUN_TYPE;
  results: TestDataInterface[] | null;
  status: RUN_STATUS;
  failType: RUN_FAIL_TYPE | null;
  timeoutType: RUN_TIMEOUT_TYPE | null;
  console: string | null;
  error: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

const CONSTANTS = {
  ID_PREFIX: 'rs-',
  INCLUDED_EVENT_TYPES: [
    TEST_EVENT_TYPES.EVENT_HOOK_BEGIN,
    TEST_EVENT_TYPES.EVENT_HOOK_END,
    TEST_EVENT_TYPES.EVENT_TEST_BEGIN,
    TEST_EVENT_TYPES.EVENT_TEST_PASS,
    TEST_EVENT_TYPES.EVENT_TEST_FAIL,
    TEST_EVENT_TYPES.EVENT_TEST_PENDING,
  ],
  TEST_CASE_EVENT_TYPES: [TEST_EVENT_TYPES.EVENT_TEST_BEGIN, TEST_EVENT_TYPES.EVENT_TEST_PASS, TEST_EVENT_TYPES.EVENT_TEST_FAIL],
};

/**
 * @class
 */
export class RunRecord extends ValidatedBase implements RunRecordInterface {
  /**
   * @param {RunRecordInterface} params
   * @param {boolean} validate
   */
  constructor(params: RunRecordInterface, validate = true) {
    super();

    this.id = params.id;
    this.projectId = params.projectId;
    this.runId = params.runId;
    this.routineId = params.routineId;
    this.results = params.results ? params.results.map((result) => new TestData(result, false)) : null;
    this.stats = params.stats ? new TestStats(params.stats, false) : null;
    this.runDurationMs = params.runDurationMs;
    this.testDurationMs = params.testDurationMs;
    this.type = params.type;
    this.console = params.console;
    this.error = params.error || null;
    this.status = params.status;
    this.failType = params.failType;
    this.timeoutType = params.timeoutType || null;
    this.createdAt = toDate(params.createdAt);
    this.updatedAt = toDate(params.updatedAt);
    this.completedAt = params.completedAt ? toDate(params.completedAt) : null;

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsString()
  readonly projectId: string;

  @IsString()
  readonly runId: string;

  @IsString()
  readonly routineId: string;

  @IsEnum(RUN_TYPE, { message: enumError(RUN_TYPE) })
  readonly type: RUN_TYPE;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsInstance(TestData, { each: true })
  results: TestDataInterface[] | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(TestStats)
  stats: TestStatsInterface | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  runDurationMs: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  testDurationMs: number | null;

  @IsOptional()
  @IsString()
  console: string | null;

  @IsOptional()
  @IsString()
  error: string | null;

  @IsEnum(RUN_STATUS, { message: enumError(RUN_STATUS) })
  status: RUN_STATUS;

  @IsOptional()
  @IsEnum(RUN_FAIL_TYPE, { message: enumError(RUN_FAIL_TYPE) })
  failType: RUN_FAIL_TYPE | null;

  @IsOptional()
  @IsEnum(RUN_TIMEOUT_TYPE, { message: enumError(RUN_TIMEOUT_TYPE) })
  timeoutType: RUN_TIMEOUT_TYPE | null;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  completedAt: Date | null;

  /**
   * Generate ID for model
   *
   * @param {string} runId
   * @returns {string}
   */
  static generateId(runId: string): string {
    return `${CONSTANTS.ID_PREFIX}${runId.replace(Run.CONSTANTS.ID_PREFIX, '')}`;
  }

  /**
   * Create model instance
   *
   * @param {Run} runRequest
   * @param {string} projectId
   * @param {string} routineId
   * @param {Date} curDate
   * @returns {RunRecord}
   */
  static create(runRequest: RunInterface, projectId: string, routineId: string, curDate = DateTime.utc().toJSDate()): RunRecord {
    return new RunRecord({
      projectId,
      runId: runRequest.id,
      type: runRequest.type,
      routineId,
      results: null,
      stats: null,
      console: null,
      error: null,
      failType: null,
      timeoutType: null,
      status: RUN_STATUS.CREATED,
      id: RunRecord.generateId(runRequest.id),
      runDurationMs: null,
      testDurationMs: null,
      createdAt: curDate,
      updatedAt: curDate,
      completedAt: null,
    });
  }

  /**
   * Insert an error message for incomplete records that don't have an error
   *
   * @param {TestDataInterface} testData
   * @param {RUN_TIMEOUT_TYPE | null} timeoutType
   * @returns {TestErrorInterface | null}
   */
  static getIncompleteError(testData: TestDataInterface, timeoutType: RUN_TIMEOUT_TYPE | null): TestErrorInterface | null {
    if (testData.result !== TEST_RESULT_STATUS.INCOMPLETE || testData.error) return testData.error;

    switch (timeoutType) {
      case RUN_TIMEOUT_TYPE.REPORTER: {
        return { message: 'Routine timeout reached' };
      }
      case RUN_TIMEOUT_TYPE.EXEC: {
        return { message: 'Execution timeout reached' };
      }
      case RUN_TIMEOUT_TYPE.JOB: {
        return { message: 'Timeout waiting for job to complete' };
      }
      default: {
        return { message: 'Test is incomplete for unknown reasons' };
      }
    }
  }

  /**
   * - Assume that all IDs come in pairs (start and end of event)
   * - Data and timestamp from the second are used if found
   * - If there is no second event, that will indicate an incomplete event, visible by the missing duration
   *
   * @param {TestEventInterface[]} events
   * @param {RUN_TIMEOUT_TYPE | null} timeoutType
   * @returns {TestDataInterface[]}
   */
  static getResults(events: TestEventInterface[] = [], timeoutType: RUN_TIMEOUT_TYPE | null): TestDataInterface[] {
    const dataMap = events
      .map((event) => {
        if (!(event instanceof TestEvent)) return new TestEvent(event);
        return event;
      })
      .reduce((result, event) => {
        if (!CONSTANTS.INCLUDED_EVENT_TYPES.includes(event.data.type)) return result;

        // Ignore root events, they are empty and not useful
        const { id, root } = event.data;
        if (!id || root) return result;

        // Only mark test cases as "incomplete" if they never have a result
        const data = CONSTANTS.TEST_CASE_EVENT_TYPES.includes(event.data.type)
          ? { ...event.data, result: event.data.result || TEST_RESULT_STATUS.INCOMPLETE }
          : event.data;

        if (!result[id]) {
          result[id] = {
            timestamp: event.timestamp,
            data,
          };
        } else {
          result[id].data = data;
          result[id].timestamp = event.timestamp;
        }

        return result;
      }, {} as { [k: string]: { timestamp: Date; data: TestDataInterface } });

    const sortedData = Object.values(dataMap).sort(
      ({ timestamp: firstTime }, { timestamp: secondTime }) => firstTime.valueOf() - secondTime.valueOf()
    );
    return sortedData
      .map(({ data }) => data)
      .map((data) => ({
        ...data,
        error: RunRecord.getIncompleteError(data, timeoutType),
      }));
  }

  /**
   * Get patch from test result
   *
   * @param {TestResultInterface} testResult
   * @returns {Partial<RunRecord>}
   */
  static getPatchFromResult(testResult: TestResultInterface): Partial<RunRecord> {
    const patch = {} as {
      status: RUN_STATUS;
      failType: RUN_FAIL_TYPE | null;
      timeoutType: RUN_TIMEOUT_TYPE | null;
      console: string | null;
      error: string | null;
      results: TestDataInterface[];
      stats: TestStatsInterface | null;
      runDurationMs: number;
      testDurationMs: number | null;
      completedAt: Date;
    };

    const lastEvent = last(testResult.events || []);

    patch.results = RunRecord.getResults(testResult.events || [], testResult.timeoutType);

    const incompleteCount = patch.results.filter(({ result }) => result === TEST_RESULT_STATUS.INCOMPLETE).length;

    const stats =
      incompleteCount > 0
        ? { ...lastEvent?.stats, tests: (lastEvent?.stats?.tests || 0) + incompleteCount, incomplete: incompleteCount }
        : lastEvent?.stats;

    patch.stats = stats ? new TestStats(stats as TestStatsConstructorInterface) : null;

    patch.console = testResult.console;
    patch.runDurationMs = testResult.runDurationMs;
    patch.testDurationMs = lastEvent?.elapsedMs || null;
    patch.completedAt = testResult.createdAt;
    patch.timeoutType = testResult.timeoutType || null;

    if (testResult.error) {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.ERROR;
      patch.error = testResult.error;
    } else if (lastEvent?.data.type !== TEST_EVENT_TYPES.EVENT_RUN_END || !!patch.timeoutType) {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.TIMEOUT;
      patch.timeoutType = testResult.timeoutType || RUN_TIMEOUT_TYPE.UNKNOWN;
    } else if (testResult.events.length === 0) {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.ERROR;
    } else if (patch.stats?.failures && patch.stats?.failures > 0) {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.TEST;
    } else {
      patch.status = RUN_STATUS.PASSED;
      patch.failType = null;
    }

    return patch;
  }

  /**
   * Get data to be pushed to the db
   *
   * @param {DeepPartial<RunRecord>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<RunRecord>): object {
    return instance;
  }

  /**
   * Stringify object
   *
   * @param {RunRecord} instance
   * @returns {string}
   */
  static stringifyForCache(instance: RunRecord): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   *
   * @param {object} object
   * @returns {RunRecord}
   */
  static fromJson(object): RunRecord {
    const { createdAt, updatedAt, completedAt, ...rest } = object;
    return new RunRecord({
      ...rest,
      createdAt: DateTime.fromISO(createdAt).toJSDate(),
      updatedAt: DateTime.fromISO(updatedAt).toJSDate(),
      completedAt: completedAt ? DateTime.fromISO(completedAt).toJSDate() : null,
    });
  }

  /**
   * Parse from cache
   *
   * @param {string} stringified
   * @returns {RunRecord}
   */
  static parseFromCache(stringified: string): RunRecord {
    return RunRecord.fromJson(JSON.parse(stringified));
  }
}

export interface CompletedRunRecordInterface
  extends Omit<RunRecordInterface, 'updatedAt' | 'createdAt' | 'completedAt' | 'results' | 'runDurationMs'> {
  completedAt: Date;
  runDurationMs: number;
  results: TestDataInterface[];
}

export interface CompletedRunRecordConstructorInterface extends Omit<CompletedRunRecordInterface, 'completedAt' | 'stats'> {
  completedAt: Date | string;
  stats: TestStatsInterface | TestStatsConstructorInterface | null;
}

export const isCompletedRun = (
  record: RunRecordInterface | CompletedRunRecordConstructorInterface
): record is CompletedRunRecordConstructorInterface => {
  return !!record.completedAt;
};

/**
 * @class
 */
export class CompletedRunRecord extends ValidatedBase implements CompletedRunRecordInterface {
  /**
   * @param {CompletedRunRecordInterface | RunRecordInterface} params
   * @param {boolean} validate
   */
  constructor(params: CompletedRunRecordConstructorInterface | RunRecordInterface, validate = true) {
    super();

    if (!isNumber(params.runDurationMs) || !params.completedAt) {
      if (!isNumber(params.runDurationMs)) {
        // eslint-disable-next-line no-console
        console.error('Missing runDurationMs');
      }

      if (!params.completedAt) {
        // eslint-disable-next-line no-console
        console.error('Missing completedAt');
      }

      // eslint-disable-next-line no-console
      console.log(`Incomplete runRecord: ${JSON.stringify(params)}`);
      throw new Error('Incomplete runRecord passed as completed');
    }

    this.id = params.id;
    this.projectId = params.projectId;
    this.runId = params.runId;
    this.routineId = params.routineId;
    this.stats = params.stats ? new TestStats(params.stats, false) : null;
    this.runDurationMs = params.runDurationMs;
    this.testDurationMs = params.testDurationMs;
    this.type = params.type;
    this.console = params.console;
    this.error = params.error || null;
    this.status = params.status;
    this.failType = params.failType;
    this.timeoutType = params.timeoutType || null;
    this.completedAt = toDate(params.completedAt);
    this.results = params.results ? params.results.map((result) => new TestData(result, false)) : [];

    if (validate) {
      this.validate();
    }
  }

  @IsString()
  readonly id: string;

  @IsString()
  readonly projectId: string;

  @IsString()
  readonly runId: string;

  @IsString()
  readonly routineId: string;

  @IsEnum(RUN_TYPE, { message: enumError(RUN_TYPE) })
  readonly type: RUN_TYPE;

  @ValidateNested()
  @IsInstance(TestData, { each: true })
  readonly results: TestDataInterface[];

  // Need to allow this to be optional in case user pushes no files or something
  @IsOptional()
  @ValidateNested()
  @IsInstance(TestStats)
  readonly stats: TestStatsInterface | null;

  @IsInt()
  @Min(0)
  readonly runDurationMs: number;

  // Need to allow this to be optional in case user pushes no files or something
  @IsOptional()
  @IsInt()
  @Min(0)
  readonly testDurationMs: number | null;

  @IsOptional()
  @IsString()
  readonly console: string | null;

  @IsOptional()
  @IsString()
  readonly error: string | null;

  @IsEnum(RUN_STATUS, { message: enumError(RUN_STATUS) })
  readonly status: RUN_STATUS;

  @IsOptional()
  @IsEnum(RUN_FAIL_TYPE, { message: enumError(RUN_FAIL_TYPE) })
  readonly failType: RUN_FAIL_TYPE | null;

  @IsOptional()
  @IsEnum(RUN_TIMEOUT_TYPE, { message: enumError(RUN_TIMEOUT_TYPE) })
  timeoutType: RUN_TIMEOUT_TYPE | null;

  @IsDate()
  readonly completedAt: Date;
}
