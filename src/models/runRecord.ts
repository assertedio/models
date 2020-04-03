import { IsDate, IsEnum, IsInstance, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { isNumber, last } from 'lodash';
import { DateTime } from 'luxon';
import { DeepPartial } from 'ts-essentials';

import { Run, RUN_TYPE, RunInterface } from '../requests/run';
import {
  Stats,
  StatsConstructorInterface,
  StatsInterface,
  TestError,
  TestErrorInterface,
  TestEvent,
  TestEventInterface,
} from '../requests/testEvent';
import { TestResultInterface } from '../requests/testResult';
import { toDate } from '../utils';
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
  events: TestEventInterface[] | null;
  stats: StatsInterface | null;
  runDurationMs: number | null;
  testDurationMs: number | null;
  type: RUN_TYPE;
  errors: TestErrorInterface[] | null;
  status: RUN_STATUS;
  failType: RUN_FAIL_TYPE | null;
  console: string | null;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

const CONSTANTS = {
  ID_PREFIX: 'rs-',
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
    this.errors = params.errors ? params.errors.map((error) => new TestError(error, false)) : null;
    this.events = params.events ? params.events.map((event) => new TestEvent(event, false)) : null;
    this.stats = params.stats ? new Stats(params.stats, false) : null;
    this.runDurationMs = params.runDurationMs;
    this.testDurationMs = params.testDurationMs;
    this.type = params.type;
    this.console = params.console;
    this.status = params.status;
    this.failType = params.failType;
    this.createdAt = params.createdAt;
    this.updatedAt = params.updatedAt;
    this.completedAt = params.completedAt || null;

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

  @IsEnum(RUN_TYPE)
  readonly type: RUN_TYPE;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsInstance(TestError, { each: true })
  errors: TestErrorInterface[] | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsInstance(TestEvent, { each: true })
  events: TestEventInterface[] | null;

  @IsOptional()
  @ValidateNested()
  @IsInstance(Stats)
  stats: StatsInterface | null;

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

  @IsEnum(RUN_STATUS)
  status: RUN_STATUS;

  @IsOptional()
  @IsEnum(RUN_FAIL_TYPE)
  failType: RUN_FAIL_TYPE | null;

  @IsDate()
  readonly createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsOptional()
  @IsDate()
  completedAt: Date | null;

  /**
   * Generate ID for model
   * @param {string} runId
   * @returns {string}
   */
  static generateId(runId: string): string {
    return `${CONSTANTS.ID_PREFIX}${runId.replace(Run.CONSTANTS.ID_PREFIX, '')}`;
  }

  /**
   * Create model instance
   * @param {Run} runRequest
   * @param {string} projectId
   * @param {string} routineId
   * @param {Date} curDate
   * @returns {Result}
   */
  static create(runRequest: RunInterface, projectId: string, routineId: string, curDate = DateTime.utc().toJSDate()): RunRecord {
    return new RunRecord({
      projectId,
      runId: runRequest.id,
      type: runRequest.type,
      routineId,
      errors: null,
      events: null,
      stats: null,
      console: null,
      failType: null,
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
   * Get patch from test result
   * @param {TestResultInterface} testResult
   * @returns {Partial<RunRecord>}
   */
  static getPatchFromResult(testResult: TestResultInterface): Partial<RunRecord> {
    const patch = {} as {
      status: RUN_STATUS;
      failType: RUN_FAIL_TYPE | null;
      console: string | null;
      errors: TestErrorInterface[] | null;
      events: TestEventInterface[] | null;
      stats: StatsInterface | null;
      runDurationMs: number;
      testDurationMs: number | null;
      completedAt: Date;
    };

    const lastEvent = last(testResult.events || []);

    patch.errors = (testResult.events || [])
      .filter((event) => !!event.data?.err)
      .map((event) => new TestError({ ...event.data?.err, fullTitle: event.data?.fullTitle } as TestErrorInterface));
    patch.errors = patch.errors.length > 0 ? patch.errors : null;

    patch.console = testResult.console;
    patch.runDurationMs = testResult.runDurationMs;
    patch.testDurationMs = lastEvent?.timeMs || null;
    patch.stats = lastEvent?.data?.stats || null;
    patch.events = testResult.events || null;
    patch.completedAt = testResult.createdAt;

    if (testResult.events.length === 0) {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.ERROR;
      // EVENT_RUN_END in mocha
    } else if (lastEvent?.type !== 'end') {
      patch.status = RUN_STATUS.FAILED;
      patch.failType = RUN_FAIL_TYPE.TIMEOUT;
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
   * @param {DeepPartial<Result>} instance
   * @returns {object}
   */
  static forDb(instance: DeepPartial<RunRecord>): object {
    return instance;
  }

  /**
   * Stringify object
   * @param {Result} instance
   * @returns {string}
   */
  static stringifyForCache(instance: RunRecord): string {
    return JSON.stringify(instance);
  }

  /**
   * Convert from JSON to instance
   * @param {object} object
   * @returns {Result}
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
   * @param {string} stringified
   * @returns {Result}
   */
  static parseFromCache(stringified: string): RunRecord {
    return RunRecord.fromJson(JSON.parse(stringified));
  }
}

export interface CompletedRunRecordInterface
  extends Omit<RunRecordInterface, 'updatedAt' | 'createdAt' | 'completedAt' | 'events' | 'testDurationMs' | 'runDurationMs' | 'stats'> {
  completedAt: Date;
  stats: StatsInterface;
  runDurationMs: number;
  testDurationMs: number;
}

export interface CompletedRunRecordConstructorInterface extends Omit<CompletedRunRecordInterface, 'completedAt' | 'stats'> {
  completedAt: Date | string;
  stats: StatsInterface | StatsConstructorInterface;
}

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

    if (!isNumber(params.runDurationMs) || !isNumber(params.testDurationMs) || !params.stats || !params.completedAt) {
      // eslint-disable-next-line no-console
      console.log(`Incomplete runRecord: ${JSON.stringify(params)}`);
      throw new Error('Incomplete runRecord passed as completed');
    }

    this.id = params.id;
    this.projectId = params.projectId;
    this.runId = params.runId;
    this.routineId = params.routineId;
    this.errors = params.errors ? params.errors.map((error) => new TestError(error, false)) : null;
    this.stats = new Stats(params.stats, false);
    this.runDurationMs = params.runDurationMs;
    this.testDurationMs = params.testDurationMs;
    this.type = params.type;
    this.console = params.console;
    this.status = params.status;
    this.failType = params.failType;
    this.completedAt = toDate(params.completedAt);

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

  @IsEnum(RUN_TYPE)
  readonly type: RUN_TYPE;

  @IsOptional()
  @ValidateNested({ each: true })
  @IsInstance(TestError, { each: true })
  readonly errors: TestErrorInterface[] | null;

  @ValidateNested()
  @IsInstance(Stats)
  readonly stats: StatsInterface;

  @IsInt()
  @Min(0)
  readonly runDurationMs: number;

  @IsInt()
  @Min(0)
  readonly testDurationMs: number;

  @IsOptional()
  @IsString()
  readonly console: string | null;

  @IsEnum(RUN_STATUS)
  readonly status: RUN_STATUS;

  @IsOptional()
  @IsEnum(RUN_FAIL_TYPE)
  readonly failType: RUN_FAIL_TYPE | null;

  @IsDate()
  readonly completedAt: Date;
}
